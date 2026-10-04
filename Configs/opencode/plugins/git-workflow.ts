import type { Plugin } from "@opencode-ai/plugin"
import { isShellTool } from "./lib/guards.ts"

const CONVENTIONAL_COMMIT_PATTERN =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-zA-Z0-9_-]+\))?: (.*?)(?:\n(.+))?$/

const AI_GENERATED_NOTE = "Note: AI Generated Commit"


/**
 * GitWorkflowPlugin — enforces conventional commit messages on `git commit`
 * shell commands.
 *
 * Reassembles the commit message from every -m/--message/-F/-C/-c/--amend
 * occurrence, then:
 *   - Skips messages allow-listed by prefix (merge/revert/fixup/amend).
 *   - Otherwise requires Conventional Commits form (`<type>: <subject>`) AND the
 *     "Note: AI Generated Commit" tag. Any violation THROWS to block the commit.
 * Only bash/shell tools are inspected.
 *
 * @param ctx  V2 plugin context (unused; kept for API parity).
 * @param options Overrides for the defaults below.
 *   - `allowPatterns` and `caseSensitiveNote` both apply.
 *   - `conventionalPrefix` is reserved but unused today; the required prefix
 *     is fixed to "feat:" via `CONVENTIONAL_COMMIT_PATTERN`.
 */
export const GitWorkflowPlugin: Plugin = async (_ctx, options) => {
  const defaults = {
    conventionalPrefix: "feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert",
    allowPatterns: ["merge", "revert", "fixup", "amend"] as string[],
    caseSensitiveNote: true,
  }
  const opts = { ...defaults, ...((options ?? {}) as Partial<typeof defaults>) }

  return {
    "tool.execute.before": async (input, output) => {
      if (!isShellTool(String(input.tool ?? ""))) return
      const args = (output?.args ?? {}) as Record<string, any>
      const command = String(args.command ?? "")
      if (!/git\s+commit/.test(command)) return

      // Reassemble the commit message from every -m/--message/-F/-C/-c/--amend
      // occurrence in the command (a message may be passed more than once).
      let message = ""
      for (const m of command.matchAll(
        /(-m\s+(?:"([\s\S]*?)"|'([\s\S]*?'|[^\s]*'?))|--message=([\s\S]*?)|-F\s+([\s\S]*?)|-C|-c|--amend|(?:--no-edit))\s*/g,
      )) {
        if (m[2]) message += `${m[2]}\n`
        if (m[3]) message += `${m[3]}\n`
        if (m[4]) message += `${m[4]}\n`
        if (m[5]) message += `${m[5]}\n`
      }
      message = message.endsWith("\n") ? message.slice(0, -1) : message

      const lowerMsg = message.toLowerCase()
      const allowList = opts.allowPatterns?.map((p) => p.toLowerCase()) ?? []
      const isAllowlisted = allowList.some((pattern) => {
        if (pattern === "merge") return /^merge/.test(lowerMsg)
        if (pattern === "revert") return /^revert/.test(lowerMsg)
        if (pattern === "fixup") return /^fixup/.test(lowerMsg)
        if (pattern === "amend") return /^amend/.test(lowerMsg)
        return false
      })

      if (isAllowlisted) return

      if (!CONVENTIONAL_COMMIT_PATTERN.test(message)) {
        throw new Error(`BLOCKED: Commit message does not follow conventional commit format: "${message}"`)
      }

      const notePattern = opts.caseSensitiveNote
        ? new RegExp(AI_GENERATED_NOTE)
        : new RegExp(AI_GENERATED_NOTE, "i")
      if (!notePattern.test(message)) {
        throw new Error(`BLOCKED: Commit message must contain "${AI_GENERATED_NOTE}": "${message}"`)
      }
    },
  }
}

// Default export satisfies the V2 PluginSupervisor, which requires a
// default definition with an id and an effect or setup function.
// Tool interception lives in `server` (SDK Hooks shape); setup is a
// no-op because this plugin registers no skills or session hooks.
export default {
  id: "git-workflow",
  server: GitWorkflowPlugin,
  setup: async () => {},
}
