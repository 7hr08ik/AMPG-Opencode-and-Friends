import type { Plugin } from "@opencode-ai/plugin"
import { warn } from "./lib/output.ts"

const GLOB_BUDGET_WINDOW_MS = 300000 // 5 minutes

// Any path containing a github.com/github/ segment is treated as a GitHub search.
const isGitHubSearch = (path: string): boolean =>
  path.includes("github.com") || path.includes("github/")

/**
 * WorkflowPlugin — throttles noisy code-discovery tools and nudges the agent
 * toward faster alternatives, so a runaway tool loop can't stall a session.
 *
 * Listens to "tool.execute.before" and:
 *   - Rate-limits the `glob` tool to 3 calls per a rolling time window
 *     (`globBudgetWindow`, default 5 min). On exceed it warns, **caps the
 *     history to the last 3 calls**, and THROWS to block further globs.
 *   - Always allows `codegraph_explore` (the recommended local-code-search path).
 *   - Warns (never blocks) on a `grep` executed outside a GitHub repo when
 *     `gracefulDegrade` is enabled.
 * The glob history is cleared on the next "session.idle" event.
 *
 * @param ctx  V2 plugin context (used for `warn`).
 * @param options Overrides for the defaults below (`globBudgetWindow`, etc.).
 */
export const WorkflowPlugin: Plugin = async (ctx, options) => {
  const defaults = {
    globBudgetWindow: GLOB_BUDGET_WINDOW_MS,
    allowedTools: [] as string[],
    gracefulDegrade: true,
  }
  const opts = { ...defaults, ...((options ?? {}) as Partial<typeof defaults>) }

  const globHistory: Array<{ timestamp: number; count: number }> = []

  return {
    "tool.execute.before": async (input, output) => {
      const tool = String(input.tool ?? "")
      const normalizedTool = tool.toLowerCase()

      if (normalizedTool === "glob") {
        const now = Date.now()
        globHistory.push({ timestamp: now, count: 1 })

        // BOUND the rolling window on EVERY push: evict expired entries from the
        // array itself (not just a filtered view), so the history can't grow
        // unbounded between caps or idle flushes. This is the defect the block
        // was originally reworked to fix - a filtered `.filter(...)` view left
        // stale entries in `globHistory` forever.
        const windowStart = now - opts.globBudgetWindow
        while (globHistory.length > 0 && globHistory[0].timestamp < windowStart) {
          globHistory.shift()
        }

        const totalInWindow = globHistory.reduce((sum, e) => sum + e.count, 0)

        if (totalInWindow > 3) {
          const summaryMsg =
            `Glob search budget exceeded: ${totalInWindow} searches in last ${opts.globBudgetWindow / 60000}min window. ` +
            `Use codegraph_explore for code intelligence or escalate to a subagent.`
          await warn(ctx, `[Workflow] ${summaryMsg}`)
          // Keep only the most recent 3 entries so the bounded array stays tight.
          while (globHistory.length > 3) globHistory.shift()
          throw new Error(`BLOCKED: Glob search budget exceeded.`)
        }
        return
      }

      // codegraph_explore is the recommended local-code-search path; never block it.
      if (normalizedTool.startsWith("codegraph")) {
        return
      }

      // When gracefulDegrade is on, `grep` outside GitHub is only warned about
      // (a hint to use codegraph_explore), never blocked.
      if (opts.gracefulDegrade && normalizedTool === "grep") {
        const args = (output?.args ?? {}) as Record<string, any>
        if (args.path && typeof args.path === "string") {
          if (!isGitHubSearch(args.path)) {
            await warn(
              ctx,
              `[Workflow] grep search outside GitHub repo: ${args.path}. ` +
                `Use codegraph_explore for local code search or glob for file discovery.`,
            )
          }
        }
      }
    },
    // Clear the glob budget when a session goes idle so it doesn't carry over.
    event: async ({ event }) => {
      if (event.type !== "session.idle") return
      globHistory.length = 0
    },
  }
}

// Default export satisfies the V2 PluginSupervisor, which requires a
// default definition with an id and an effect or setup function.
// Tool interception lives in `server` (SDK Hooks shape); setup is a
// no-op because this plugin registers no skills or session hooks.
export default {
  id: "workflow",
  server: WorkflowPlugin,
  setup: async () => {},
}
