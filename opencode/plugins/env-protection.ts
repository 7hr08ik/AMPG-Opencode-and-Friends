import type { Plugin, Hooks, PluginInput } from "@opencode-ai/plugin"
import { error } from "./lib/output.js"

/**
 * Env Protection Plugin - Blocks reading of .env files to prevent secret exposure
 *
 * Behavior:
 * - tool.execute.before: Intercepts every read tool call. If the file path basename
 *   is exactly ".env" or starts with ".env." (e.g., .env.local, .env.production),
 *   clears the read arguments and throws a blocking error.
 *
 *   The check matches only the basename, so paths like "src/.environmental.ts" are
 *   NOT blocked — only actual dotenv files are targeted.
 *
 * Rationale: .env files commonly contain API keys, database passwords, and other
 * secrets. Reading them into the LLM context risks leakage into logs, outputs, or
 * downstream systems. This plugin ensures the agent never sees their contents.
 */
export const EnvProtectionPlugin: Plugin = async (ctx: PluginInput) => {
  const client = ctx.client;
  const hooks: Hooks = {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "read") return;

      const filePath = output.args?.filePath;
      if (!filePath) return;

      // Match .env files specifically — not substrings like ".environmental"
      const basename = filePath.split("/").pop() ?? "";
      if (basename === ".env" || basename.startsWith(".env.")) {
        output.args = undefined as any;
        throw new Error(`BLOCKED: reading "${filePath}" is not allowed. This file may contain secrets.`);
      }
    }
  };
  return hooks;
};
