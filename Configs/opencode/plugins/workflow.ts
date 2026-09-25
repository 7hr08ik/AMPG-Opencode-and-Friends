import type { Plugin } from "@opencode-ai/plugin"
import { warn } from "./lib/output.ts"

const GLOB_BUDGET_WINDOW_MS = 300000 // 5 minutes

const isGitHubSearch = (path: string): boolean =>
  path.includes("github.com") || path.includes("github/")

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

        const recent = globHistory.filter(
          (entry) => now - entry.timestamp < opts.globBudgetWindow,
        )

        const totalInWindow = recent.reduce((sum, entry) => sum + entry.count, 0)

        if (totalInWindow > 3) {
          const summaryMsg =
            `Glob search budget exceeded: ${totalInWindow} searches in last ${opts.globBudgetWindow / 60000}min window. ` +
            `Use codegraph_explore for code intelligence or escalate to a subagent.`
          await warn(ctx, `[Workflow] ${summaryMsg}`)
          const capped = recent.slice(-3)
          globHistory.length = 0
          for (const e of capped) {
            globHistory.push(e)
          }
          throw new Error(`BLOCKED: Glob search budget exceeded.`)
        }
        return
      }

      if (normalizedTool.startsWith("codegraph")) {
        return
      }

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
