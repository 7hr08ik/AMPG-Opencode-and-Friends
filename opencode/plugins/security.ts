import type { Plugin, Hooks, PluginInput } from "@opencode-ai/plugin"
import { error, warn } from "./lib/output.js"

/**
 * Security Plugin - Prevents secret leakage and blocks dangerous commands
 *
 * Behavior:
 * - tool.execute.before: Scans write/edit content and bash commands for secret patterns
 *   (cloud provider keys, platform tokens, private keys, database URIs, plaintext
 *   credentials). Also blocks destructive shell commands such as recursive force-remove
 *   of root, disk formatting, disk overwrite, fork bombs, and system shutdown/reboot.
 * - tool.execute.after: Re-scans written content as a second line of defense. If secrets
 *   are found post-write, blocks further execution and prompts the user for handling
 *   (move to .env, use a secrets manager, etc.).
 * - session.idle: Emits an audit report listing all files and secret types detected during
 *   the session, then clears the tracker.
 *
 * Secret categories detected:
 *   - Cloud provider access keys
 *   - Platform API tokens
 *   - PEM-encoded private keys
 *   - Plaintext credentials assigned to recognizable variable names
 *   - Database and cache connection URIs
 */

// Patterns that indicate leaked secrets
const SECRET_PATTERNS = [
  { re: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Key' },
  { re: /sk-[a-zA-Z0-9]{32,}/g, name: 'Secret Key' },
  { re: /gh[pousr]_[a-zA-Z0-9]{36,}/g, name: 'GitHub Token' },
  { re: /-----BEGIN.*PRIVATE KEY-----/g, name: 'Private Key' },
  { re: /(password|pwd|secret|api[_-]?key)\s*[:=]\s*['"][^'"]{8,}/gi, name: 'Plaintext Credential (quoted)' },
  { re: /(password|pwd|secret|api[_-]?key)\s*[:=]\s*[^\s'"<>]{8,}/gi, name: 'Plaintext Credential (unquoted)' },
  { re: /mongodb(\+srv)?:\/\/[^"'\s]+/g, name: 'MongoDB Connection String' },
  { re: /postgres(ql)?:\/\/[^"'\s]+/g, name: 'PostgreSQL Connection String' },
  { re: /mysql:\/\/[^"'\s]+/g, name: 'MySQL Connection String' },
  { re: /redis:\/\/[^"'\s]+/g, name: 'Redis Connection String' },
];

// Track secrets found during session for audit
let sessionSecretsFound: Array<{ file: string; secret: string }> = [];

function scanForSecrets(content: string): Array<{ name: string; match: string }> {
  const findings: Array<{ name: string; match: string }> = [];

  for (const pattern of SECRET_PATTERNS) {
    const matches = content.match(pattern.re);
    if (matches) {
      for (const match of matches) {
        findings.push({ name: pattern.name, match: match.substring(0, 20) + '...' });
      }
    }
  }

  return findings;
}

export const SecurityPlugin: Plugin = async (ctx: PluginInput) => {
  const client = ctx.client;
  const hooks: Hooks = {
    // Block writes containing secrets
    "tool.execute.before": async (input, output) => {
      if (input.tool === "write" || input.tool === "edit") {
        const content = output.args.content || output.args.newString || '';
        const findings = scanForSecrets(content);

        if (findings.length > 0) {
          const details = findings.map(f => `${f.name} (${f.match})`).join(', ');
          throw new Error(`BLOCKED: Secret pattern detected in write content: ${details}. Remove secrets before writing.`);
        }
      }

      // Block bash commands containing secrets
      if (input.tool === "bash") {
        const command = output.args.command || '';
        const findings = scanForSecrets(command);

        if (findings.length > 0) {
          const details = findings.map(f => `${f.name} (${f.match})`).join(', ');
          throw new Error(`BLOCKED: Secret pattern detected in command: ${details}. Remove secrets before executing.`);
        }

        // Block dangerous commands
        const dangerousPatterns = [
          /\brm\s+-rf\s+[\/~]/,
          /\bmkfs\b/,
          /\bdd\s+if=/,
          /\b:\(\)\s*\{/,
          /\bshutdown\b/,
          /\breboot\b/,
          /\binit\s+[06]/,
        ];

        for (const pattern of dangerousPatterns) {
          if (pattern.test(command)) {
            throw new Error(`BLOCKED: Dangerous command detected: ${command}. This command could cause system damage.`);
          }
        }
      }
    },

    // Block writes containing secrets detected after the fact
    "tool.execute.after": async (input, output) => {
      if (input.tool === "write" || input.tool === "edit") {
        const content = output.output || '';
        const filePath = input.args?.filePath || 'unknown';
        const findings = scanForSecrets(content);

        if (findings.length > 0) {
          for (const finding of findings) {
            sessionSecretsFound.push({
              file: filePath,
              secret: finding.name,
            });
          }

          const details = findings.map(f => `${f.name} (${f.match})`).join(', ');
          throw new Error(
            `BLOCKED: Secret pattern(s) detected in ${filePath}: ${details}. ` +
            `Secrets must never be committed to code. ` +
            `DO NOT proceed silently. Ask the user how to handle this:\n` +
            `  - Move the secret to a .env file (ensure it is in .gitignore)?\n` +
            `  - Use a secrets manager?\n` +
            `  - Something else?\n` +
            `Wait for the user's instruction before rewriting the file.`
          );
        }
      }
    },

    // Report secrets found during session
    event: async (input) => {
      if (input.event.type === "session.idle") {
        if (sessionSecretsFound.length > 0) {
          const report = sessionSecretsFound.map(s =>
            `  - ${s.secret} in ${s.file}`
          ).join('\n');

          await error(client, `[Security Audit] ${sessionSecretsFound.length} secret(s) found during session:\n${report}`);
          sessionSecretsFound = [];
        }
      }
    }
  };
  return hooks;
};
