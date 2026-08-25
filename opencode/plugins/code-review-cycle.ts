import { readFile } from "node:fs/promises"

/**
 * Code Review Cycle Plugin - OpenCode **V1** edition.
 * V2 original: ../plugins/code-review-cycle.ts (keep behavior in sync).
 *
 * Enforces the review policy from instructions/common/code-review.md
 *
 * Mandatory triggers covered:
 * - After writing or modifying code  -> tracked + nudged (warn-only for ordinary code)
 * - Before commit to shared branches -> commit gate below applies to every branch
 *    (branch detection would need subprocesses inside the hook; deferred)
 * - Security-sensitive code changed  -> HARD gate: commits are blocked until the
 *    commit message carries a review trailer
 * - Pre-review: conflicts resolved   -> HARD gate: session-modified files containing
 *    merge-conflict markers block the commit
 * - CI passing / branch up to date   -> NOT enforceable locally; left to real CI.
 *    `gh pr merge` / `git push` get a soft reminder nudge.
 *
 * Acknowledgment signal:
 *   A commit message containing the trailer  Code-Review: reviewed  (or "approved",
 *   case-insensitive) marks pending security-sensitive modifications as reviewed.
 *   Run the /code-review command before adding it.
 *
 * Strictness: hybrid.
 *   - HARD block: security-sensitive paths unreviewed, conflict markers present.
 *   - Soft nudge: ordinary modifications (every Nth edit + at commit time + idle audit).
 *
 * V1 API deltas vs the V2 version (do not "fix" these here):
 * - Registration: named-export async factory returning a Hooks object
 *   (V2 uses `export default Plugin.define({ id, setup })`).
 * - Shell tool id is `bash` (V2 renamed it to `shell`).
 * - File inputs arrive as `args.filePath` (V2 uses `args.path`).
 * - Session-end work rides the `event` hook (`session.idle`); V1 has no
 *   subscribe/dispose API, so no cleanup function is returned.
 * - Warnings go through the TUI toast when a client is available, falling back
 *   to stdout (self-contained; does not depend on ./lib/output.ts).
 */

/** Commit-message trailer that acknowledges a completed review. */
const TRAILER_PATTERN = /Code-Review:\s*(reviewed|approved)\b/i

/** Emit an ordinary-modification reminder after this many unreviewed edits. */
const NUDGE_EVERY = 5

/** Path fragments treated as security-sensitive (hard gate). Edit to taste. */
const SECURITY_PATH_PATTERNS = [
  /auth/i,
  /login|logout|signin|signup|session/i,
  /password|passwd|credential/i,
  /token|jwt|oauth/i,
  /crypto|encrypt|decrypt|cipher|hashing/i,
  /pay(?:ment)?s?|billing|checkout|invoice|subscription/i,
  /(^|[\/\-_.])user(s)?([\/\-_.]|$)|customer|account|profile|gdpr|pii/i,
]

function isSecuritySensitive(filePath) {
  return SECURITY_PATH_PATTERNS.some((p) => p.test(filePath))
}

function hasConflictMarkers(content) {
  // Both opening and closing markers somewhere at line starts - strong signal,
  // avoids false positives from decorative `=======` underlines in markdown.
  return /^<{7}($| )/m.test(content) && /^>{7}($| )/m.test(content)
}

/** Extract the full commit message across one or more -m flags. */
function extractCommitMessage(command) {
  let message = ""
  for (const m of command.matchAll(/-m\s+(["'])([\s\S]+?)\1/g)) {
    message += `${m[2]}\n`
  }
  return message
}

/** Toast via the V1 TUI client when available, otherwise stdout. */
async function notify(client, message) {
  try {
    if (client?.tui && typeof client.tui.showToast === "function") {
      await client.tui.showToast({
        body: { title: "Code Review", message, variant: "warning", duration: 5000 },
      })
      return
    }
  } catch {
    // Toast unavailable - fall through to stdout.
  }
  process.stdout.write(`[Code Review] ${message}\n`)
}

export const CodeReviewCyclePlugin = async (ctx) => {
  const client = ctx.client

  // Files modified this session via write/edit (per plugin instance).
  const modified = new Map()
  let ordinaryEditsSinceReminder = 0

  const track = (filePath) => {
    // Re-editing a previously reviewed file makes it unreviewed again.
    const entry = {
      securitySensitive: isSecuritySensitive(filePath),
      reviewed: false,
    }
    modified.set(filePath, entry)
    return entry
  }

  const hooks = {
    "tool.execute.after": async (input, output) => {
      if (input.tool !== "write" && input.tool !== "edit") return

      // V1 file inputs use `filePath` (V2 renamed it to `path`).
      const filePath = output.args?.filePath
      if (!filePath) return

      const entry = track(filePath)

      if (entry.securitySensitive) {
        await notify(
          client,
          `[Code Review] Security-sensitive file modified: ${filePath}. ` +
            `Run /code-review before committing, then add the commit message trailer ` +
            `"Code-Review: reviewed".`,
        )
        return
      }

      ordinaryEditsSinceReminder++
      if (ordinaryEditsSinceReminder >= NUDGE_EVERY) {
        ordinaryEditsSinceReminder = 0
        await notify(
          client,
          `[Code Review] ${modified.size} file(s) modified this session without a recorded review. ` +
            `Consider running /code-review.`,
        )
      }
    },

    "tool.execute.before": async (input, output) => {
      // V1 shell tool id is `bash` (V2 renamed it to `shell`).
      if (input.tool !== "bash") return
      const command = String(output.args?.command ?? "")

      // ---- Soft reminders for push / PR operations -----------------------
      if (/git\s+push|gh\s+pr\s+(merge|create)/.test(command)) {
        if (modified.size > 0) {
          await notify(
            client,
            `[Code Review] Reminder: ${modified.size} file(s) modified this session. ` +
              `Pre-merge requirements: CI passing, conflicts resolved, branch up to date, review complete.`,
          )
        }
        return
      }

      // ---- Hard gates for commits ----------------------------------------
      if (!/git\s+commit/.test(command)) return

      const message = extractCommitMessage(command)
      const reviewed = TRAILER_PATTERN.test(message)

      // Gate 1 (sync): reviewed commits acknowledge pending security work.
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

      // Gate 2 (async I/O): conflict markers in session-modified files.
      // Awaited inline so a rejection blocks the commit under V1 as well.
      const conflicted = []
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

      // Soft nudge for ordinary (non-security) commits without a review trailer.
      if (!reviewed && modified.size > 0) {
        await notify(
          client,
          `[Code Review] Committing ${modified.size} session-modified file(s) without a ` +
            `"Code-Review: reviewed" trailer. Consider running /code-review first.`,
        )
      }
    },

    event: async ({ event }) => {
      if (event.type !== "session.idle") return
      if (modified.size === 0) return

      const security = [...modified.entries()].filter(([, f]) => f.securitySensitive)
      await notify(
        client,
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

  return hooks
}
