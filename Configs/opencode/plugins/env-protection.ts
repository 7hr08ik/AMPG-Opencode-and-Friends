import type { Plugin } from "@opencode-ai/plugin"

/**
 * EnvProtectionPlugin — blocks the `read` tool from opening files that commonly
 * hold secrets, before their contents ever reach the model.
 *
 * Inspects a read target's path: a read is THROWN (blocked) when the basename
 * exactly matches a blocked name (.env, credentials.json) OR when the basename
 * or full path matches any blocked regex (id_rsa/id_*.pem/*.key/.aws/
 * credentials/secrets.yaml/...). Only the `read` tool is inspected.
 *
 * @param ctx  V2 plugin context (unused; kept for API parity).
 * @param options Overrides for the defaults below.
 *   - `extraSecurityPatterns` and `caseNormalize` both apply.
 *   - `blockedEnvNames` is reserved but unused today; blocked names are
 *     hardcoded in the `blockedNames`/`blockedRegex` arrays.
 */
export const EnvProtectionPlugin: Plugin = async (_ctx, options) => {
  const defaults = {
    blockedEnvNames: [".env"],
    extraSecurityPatterns: [] as RegExp[],
    caseNormalize: "lower" as "lower" | "none",
  }
  const opts = { ...defaults, ...((options ?? {}) as Partial<typeof defaults>) }

  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "read") return
      const args = (output?.args ?? {}) as Record<string, any>
      const filePath = String(args.filePath ?? args.path ?? "")
      if (!filePath) return

      const basename = String(filePath).split(/[/\\]/).pop() ?? ""
      const normalized = opts.caseNormalize === "lower" ? basename.toLowerCase() : basename
      const haystacks = [normalized, filePath.toLowerCase()]

      // Basenames that are always blocked, regardless of directory.
      const blockedNames = [
        ".env",
        ".ENV",
        "credentials.json",
      ]
      // NOTE: extra patterns are RegExps - they must be tested, not compared
      // with .includes() (a RegExp object never === a string, so the old code
      // silently never matched). They join the regex list below.
      const blockedRegex = [
        /\.env[^/]*$/i,
        /credentials\.json$/i,
        /\b(id_rsa|id_dsa|id_ecdsa|id_ed25519)\b/,
        /\.pem$/i,
        /\.key$/i,
        /\.aws\/credentials/i,
        /secrets\.yaml/,
        ...(opts.extraSecurityPatterns ?? []),
      ]

      const nameBlocks = blockedNames.includes(normalized)
      // Match against both the basename (e.g. "id_rsa") and the full path
      // (e.g. ".aws/credentials", whose basename alone would never match).
      const regexBlocks = haystacks.some((h) => blockedRegex.some((r) => r.test(h)))

      if (nameBlocks || regexBlocks) {
        throw new Error(`BLOCKED: reading "${filePath}" is not allowed. This file may contain secrets.`)
      }
    },
  }
}

// Default export satisfies the V2 PluginSupervisor, which requires a
// default definition with an id and an effect or setup function.
// Tool interception lives in `server` (SDK Hooks shape); setup is a
// no-op because this plugin registers no skills or session hooks.
export default {
  id: "env-protection",
  server: EnvProtectionPlugin,
  setup: async () => {},
}
