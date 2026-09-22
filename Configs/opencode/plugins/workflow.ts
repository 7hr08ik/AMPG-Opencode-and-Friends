import type { Plugin, Hooks } from "@opencode-ai/plugin"

/**
 * Workflow Plugin - Per-tool search budgets to prevent LLM search loops
 *
 * Behavior:
 * - tool.execute.before: Enforces different search budgets per tool:
 *
 *   1. codegraph_explore: UNLIMITED. This is the preferred first tool for code
 *      intelligence — it returns verbatim source, call paths, and blast radius
 *      in a single call, making repeated searches unnecessary.
 *
 *   2. glob: Limited to 3 searches per session. Used for local file discovery
 *      (finding files by pattern). Resets on session.idle. Exceeding the budget
 *      blocks further glob calls and suggests using codegraph_explore or
 *      escalating to a subagent.
 *
 *   3. grep: RESTRICTED to GitHub repository searches only. Local code searches
 *      should use codegraph_explore (preferred) or glob. This prevents the common
 *      LLM failure mode of running grep in loops on local codebases.
 *
 * - session.idle: Resets the glob search counter, giving the next task a fresh
 *   budget.
 *
 * Rationale: LLM agents have a known failure mode of getting stuck in search loops
 * (grep → not found → glob → not found → grep → ...), wasting tokens and context.
 * This plugin mechanically enforces the "max 3 searches then escalate" rule from
 * the project's AGENTS.md, while preferring the most efficient tool first.
 */

const MAX_GLOB_SEARCHES = 3;

export const WorkflowPlugin: Plugin = async () => {
  // Per-instance state (isolated per plugin load)
  const state = {
    globSearchCount: 0
  };

  const hooks: Hooks = {
    // Per-tool search budget enforcer
    "tool.execute.before": async (input, output) => {
      // codegraph_explore: unlimited (local, fast, returns source + call paths)
      if (input.tool.startsWith("codegraph")) {
        return; // No limit
      }

      // glob: limited to 3 searches (local file discovery)
      if (input.tool === "glob") {
        state.globSearchCount++;
        if (state.globSearchCount > MAX_GLOB_SEARCHES) {
          throw new Error(`BLOCKED: Glob search budget exceeded (${state.globSearchCount}/${MAX_GLOB_SEARCHES}). Use codegraph_explore for code intelligence or escalate to a subagent.`);
        }
        return;
      }

      // grep: GitHub repos only (external searches)
      if (input.tool === "grep") {
        const args = output.args || {};
        const path = args.path || '';
        
        // Allow grep if searching within a GitHub URL or repo path
        const isGitHubSearch = 
          typeof path === 'string' && (
            path.includes('github.com') ||
            path.includes('github/') ||
            path.includes(' GitHub ')
          );
        
        if (!isGitHubSearch) {
          throw new Error(`BLOCKED: grep is restricted to GitHub repositories only. Use codegraph_explore for local code search or glob for file discovery.`);
        }
      }
    },

    // Reset glob counter at session idle
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        state.globSearchCount = 0;
      }
    }
  };
  return hooks;
};
