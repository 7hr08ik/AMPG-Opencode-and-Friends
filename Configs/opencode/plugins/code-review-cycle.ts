import type { Plugin } from "@opencode-ai/plugin"
import { readFile } from "node:fs/promises"
import { isWriteTool } from "./lib/guards.ts"
import { warn } from "./lib/output.ts"

// Commit-message trailer an agent appends once it has reviewed the change.
const TRAILER_PATTERN = /^Code-Review:\s*(reviewed|approved)\s*$/im
// Nudge (warn) toward /code-review once every this many ordinary edits.
const NUDGE_EVERY = 5

// Filepaths matching any of these are treated as security-sensitive and require
// an explicit review before they can be committed (see the trailer below).
const SECURITY_PATH_PATTERNS = [
  /auth/i,
  /login|logout|signin|signup|session/i,
  /password|passwd|credential/i,
  /token|jwt|oauth/i,
  /crypto|encrypt|decrypt|cipher|hashing/i,
  /pay(?:ment)?s?|billing|checkout|invoice|subscription/i,
  /(^|[\/\-_.])user(s)?([\/\-_.]|$)|customer|account|profile|gdpr|pii/i,
]

const isSecuritySensitive = (filePath: string): boolean =>
  SECURITY_PATH_PATTERNS.some((p) => p.test(filePath))

// True when Git merge-conflict markers (<<<<<<< ======= >>>>>>>) are present.
const hasConflictMarkers = (content: string): boolean => {
  const hasStart = /^<{7}( $| )/m.test(content)
  const hasEnd = /^>{7}( $| )/m.test(content)
  const hasSeparator = /^={7}( $| )/m.test(content)
  return hasStart || hasEnd || hasSeparator
}

const extractCommitMessage = (command: string): string => {
  let message = ""
  for (const m of command.matchAll(
    /(-m\s+(?:"([\s\S]*?)"|'([\s\S]*?'|[^\s]*'?))|--message=([\s\S]*?)|-F\s+([\s\S]*?)|-C|-c)\s*/g,
  )) {
    if (m[2]) message += `${m[2]}\n`
    if (m[3]) message += `${m[3]}\n`
    if (m[4]) message += `${m[4]}\n`
    if (m[5]) message += `${m[5]}\n`
  }
  return message.trim()
}

const isShellTool = (tool: string): boolean => tool === "bash" || tool === "shell"
const isCommitCommand = (command: string): boolean => /git\s+commit/.test(command)
const isPushOrPrCommand = (command: string): boolean =>
  /git\s+push|gh\s+pr\s+(merge|create)/.test(command)

/** Per-file review state tracked for the session, used to gate commits. */
interface TrackedFile {
  securitySensitive: boolean
  reviewed: boolean
}

/**
 * CodeReviewCyclePlugin — tracks modified files this session and drives a
 * lightweight review-before-commit workflow.
 *
 * On each write/edit/patch tool *after* the call it:
 *   - Records the file, flagging "security-sensitive" paths (auth, payment, PII,
 *     tokens, encryption, ...). A sensitive edit warns to run /code-review and
 *     add the "Code-Review: reviewed" trailer.
 *   - Every NUDGE_EVERY ordinary edits it nudges toward running /code-review.
 * On `git push`/`gh pr` it reminds about pre-merge requirements; on `git commit`
 * it THROWS if a security-sensitive file lacks the trailer, or if unresolved
 * merge-conflict markers remain.
 *
 * @param ctx  V2 plugin context (used for `warn`).
 * @param options Overrides for the defaults below.
 *   - `NUDGE_EVERY` and `maxStateSize` both apply.
 *   - `extraSecurityPatterns` is reserved but unused today; security file
 *     matching uses the module-level `SECURITY_PATH_PATTERNS` instead.
 */
export const CodeReviewCyclePlugin: Plugin = async (ctx, options) => {
  const modified = new Map<string, TrackedFile>()
  let ordinaryEditsSinceReminder = 0
  const defaults = {
    NUDGE_EVERY: 5,
    extraSecurityPatterns: [] as RegExp[],
    maxStateSize: 500,
  }
  const opts = { ...defaults, ...((options ?? {}) as Partial<typeof defaults>) }

  const track = (filePath: string): TrackedFile => {
    const entry: TrackedFile = {
      securitySensitive: isSecuritySensitive(filePath),
      reviewed: false,
    }
    modified.set(filePath, entry)
    if (modified.size > opts.maxStateSize) {
      const oldest = modified.keys().next().value
      if (oldest) modified.delete(oldest)
    }
    return entry
  }

  return {
    "tool.execute.after": async (input) => {
      const tool = String(input.tool ?? "")
      if (!isWriteTool(tool)) return
      const args = ((input as Record<string, any>).args ?? {}) as Record<string, any>
      const filePath = String(args.filePath ?? args.path ?? "")
      if (!filePath) return

      const entry = track(filePath)
      if (entry.securitySensitive) {
        await warn(
          ctx,
          `[Code Review] Security-sensitive file modified: ${filePath}. ` +
            `Run /code-review before committing, then add the commit message trailer "Code-Review: reviewed".`,
        )
        return
      }

      ordinaryEditsSinceReminder++
      if (ordinaryEditsSinceReminder >= opts.NUDGE_EVERY) {
        ordinaryEditsSinceReminder = 0
        await warn(
          ctx,
          `[Code Review] ${modified.size} file(s) modified this session without a recorded review. Consider running /code-review.`,
        )
      }
    },
    "tool.execute.before": async (input, output) => {
      const tool = String(input.tool ?? "")
      if (!isShellTool(tool)) return
      const args = (output?.args ?? {}) as Record<string, any>
      const command = String(args.command ?? "")

      if (isPushOrPrCommand(command)) {
        if (modified.size > 0) {
          await warn(
            ctx,
            `[Code Review] Reminder: ${modified.size} file(s) modified this session. ` +
              `Pre-merge requirements: CI passing, conflicts resolved, branch up to date, review complete.`,
          )
        }
        return
      }

      if (!isCommitCommand(command)) return

      const message = extractCommitMessage(command)
      const reviewed = TRAILER_PATTERN.test(message)

      const pendingSecurity = [...modified.entries()].filter(
        ([, f]) => f.securitySensitive && !f.reviewed,
      )
      if (pendingSecurity.length > 0 && !reviewed) {
        throw new Error(
          `BLOCKED: Security-sensitive file(s) modified without review: ` +
            `${pendingSecurity.map(([p]) => p).join(", ")}. ` +
            `Run /code-review, then commit with the trailer "Code-Review: reviewed".`,
        )
      }

      if (reviewed) {
        for (const [, f] of modified) {
          if (f.securitySensitive) f.reviewed = true
        }
      }

      const conflicted: string[] = []
      for (const [p] of modified) {
        try {
          const content = await readFile(p, "utf8")
          if (hasConflictMarkers(content)) conflicted.push(p)
        } catch {
          // File deleted/unreadable since modification - nothing to scan.
        }
      }
      if (conflicted.length > 0) {
        throw new Error(
          `BLOCKED: Unresolved merge-conflict markers in: ${conflicted.join(", ")}. ` +
            `Resolve conflicts (remove <<<<<<< ======= >>>>>>> blocks) before committing.`,
        )
      }

      if (!reviewed && modified.size > 0) {
        await warn(
          ctx,
          `[Code Review] Committing ${modified.size} session-modified file(s) without a "Code-Review: reviewed" trailer. Consider running /code-review first.`,
        )
      }
    },
    event: async ({ event }) => {
      if (event.type !== "session.idle") return
      if (modified.size === 0) return
      const security = [...modified.entries()].filter(([, f]) => f.securitySensitive)
      await warn(
        ctx,
        `[Code Review Audit] ${modified.size} file(s) modified this session` +
          (security.length > 0
            ? `, including ${security.length} security-sensitive (${security.map(([p]) => p).join(", ")})`
            : "") +
          `. Run /code-review if not already done.`,
      )
      modified.clear()
      ordinaryEditsSinceReminder = 0
    },
  }
}

// Default export satisfies the V2 PluginSupervisor, which requires a
// default definition with an id and an effect or setup function.
// Tool interception lives in `server` (SDK Hooks shape); setup is a
// no-op because this plugin registers no skills or session hooks.
export default {
  id: "code-review-cycle",
  server: CodeReviewCyclePlugin,
  setup: async () => {},
}
