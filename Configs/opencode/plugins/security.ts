import type { Plugin } from "@opencode-ai/plugin"
import { isWriteTool } from "./lib/guards.ts"

const SECRET_PATTERNS = [
  { re: /AKIA[0-9A-Z]{16}/g, name: "AWS Access Key" },
  { re: /sk-[a-zA-Z0-9]{32,}/g, name: "Secret Key" },
  { re: /gh[pousr]_[a-zA-Z0-9]{36,}/g, name: "GitHub Token" },
  { re: /-----BEGIN.*PRIVATE KEY-----/g, name: "Private Key" },
  { re: /(password|pwd|secret|api[_-]?key)\s*[:=]\s*['"](?!\$)[^'"]{8,}/gi, name: "Plaintext Credential (quoted)" },
  { re: /(password|pwd|secret|api[_-]?key)\s*[:=]\s*(?!\$)(?!\-)[^\s'"<>]{8,}/gi, name: "Plaintext Credential (unquoted)" },
  { re: /mongodb(\+srv)?:\/\/[^"'\s$]+/g, name: "MongoDB Connection String" },
  { re: /postgres(ql)?:\/\/[^"'\s$]+/g, name: "PostgreSQL Connection String" },
  { re: /mysql:\/\/[^"'\s$]+/g, name: "MySQL Connection String" },
  { re: /redis:\/\/[^"'\s$]+/g, name: "Redis Connection String" },
]

const DANGEROUS_PATTERNS = [
  /\brm\s+-rf\b/,
  /\brm\s+-/,
  /\brm\s+-r\s+\//,
  /\brm\s+-rf\s+\./,
  /\brm\s+-rf\s+\$HOME\b/,
  /\bshutdown\b/,
  /\breboot\b/,
  /\binit\s+[0-6]\b/,
  /\bchmod\s+-R\s+777\s+\//,
  /\bchown\s+-R\b/,
  /:\(\{:\|\:&\)\};:/,
  /\bcurl\s+|\|\s*sh\b/,
  /\bwget\s+|\|\s*sh\b/,
  /eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/,
  /sk_live_[A-Za-z0-9_]+/,
  /xox[b-p][a-z]-[0-9]/,
]

const scanForSecrets = (content: string): Array<{ name: string }> => {
  const findings: Array<{ name: string }> = []
  for (const pattern of SECRET_PATTERNS) {
    pattern.re.lastIndex = 0
    const matches = content.match(pattern.re)
    if (matches) {
      for (const _match of matches) {
        findings.push({ name: pattern.name })
      }
    }
  }
  return findings
}

const getWriteContent = (args: Record<string, any>): string => {
  if (typeof args.patchText === "string") return args.patchText
  if (typeof args.content === "string") return args.content
  if (typeof args.newString === "string") return args.newString
  if (typeof args.text === "string") return args.text
  if (typeof args.input === "string") return args.input
  return ""
}

export const SecurityPlugin: Plugin = async (_ctx, options) => {
  const defaults = {
    extraSecurityPatterns: [] as RegExp[],
    maxAuditEntries: 500,
  }
  const opts = { ...defaults, ...((options ?? {}) as Partial<typeof defaults>) }

  let sessionSecretsFound: Array<{ file: string; nameCounts: Record<string, number>; total: number }> = []

  const recordFinding = (file: string, findings: Array<{ name: string }>) => {
    const nameCounts = findings.reduce(
      (acc, f) => {
        acc[f.name] = (acc[f.name] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    sessionSecretsFound.push({ file, nameCounts, total: findings.length })
    if (sessionSecretsFound.length > opts.maxAuditEntries) {
      sessionSecretsFound = sessionSecretsFound.slice(-opts.maxAuditEntries)
    }
    return Object.entries(nameCounts)
      .map(([name, count]) => `${name}: ${count}`)
      .join(", ")
  }

  return {
    "tool.execute.before": async (input, output) => {
      const tool = String(input.tool ?? "")
      const args = (output?.args ?? {}) as Record<string, any>

      if (isWriteTool(tool)) {
        const content = getWriteContent(args)
        const findings = scanForSecrets(content)
        if (findings.length > 0) {
          const summary = recordFinding(String(args.filePath ?? args.path ?? "unknown"), findings)
          throw new Error(
            `BLOCKED: Secret pattern(s) detected in write content: ${summary}. ` +
              `Secrets must never be committed to code.`,
          )
        }
      }

      if (tool === "bash" || tool === "shell") {
        const command = String(args.command ?? "")
        const findings = scanForSecrets(command)
        if (findings.length > 0) {
          const summary = recordFinding(`command:${input.sessionID || "unknown"}`, findings)
          throw new Error(
            `BLOCKED: Secret pattern(s) detected in command: ${summary}. ` +
              `Secrets must never be committed to code.`,
          )
        }
        for (const pattern of DANGEROUS_PATTERNS) {
          if (pattern.test(command)) {
            throw new Error(`BLOCKED: Dangerous command detected.`)
          }
        }
      }
    },
    event: async ({ event }) => {
      if (event.type !== "session.idle") return
      if (sessionSecretsFound.length === 0) return
      const total = sessionSecretsFound.length
      const details = sessionSecretsFound
        .map((s) => `  - ${s.file}: ${Object.keys(s.nameCounts || {}).join(", ")}`)
        .join("\n")
      process.stderr.write(`[Security Audit] ${total} secret pattern(s) found during session:\n${details}\n`)
      sessionSecretsFound = []
    },
  }
}

// Default export satisfies the V2 PluginSupervisor, which requires a
// default definition with an id and an effect or setup function.
// Tool interception lives in `server` (SDK Hooks shape); setup is a
// no-op because this plugin registers no skills or session hooks.
export default {
  id: "security",
  server: SecurityPlugin,
  setup: async () => {},
}
