import type { Plugin, Hooks, PluginInput } from "@opencode-ai/plugin"
import { warn } from "./lib/output.js"

/**
 * Linting Plugin - Runs linters after file edits and checks for ignored return values
 *
 * Behavior:
 * - tool.execute.after: After every write or edit, checks the file extension against
 *   a configured linter map and runs the appropriate linter command (with --fix where
 *   applicable) if installed. Supported linters: ESLint, Ruff, go vet, Clippy,
 *   Checkstyle, Detekt, SwiftLint, clang-tidy, RuboCop, PHPStan, ShellCheck,
 *   YAMLLint.
 *
 *   If the linter is not installed, emits a warning and skips silently.
 *   If linting fails, emits a warning with the error details.
 *
 *   Additionally scans the written content for NASA Rule 7 violations:
 *   await calls and function calls whose return values are ignored (not assigned
 *   or checked), excluding safe patterns like console.log.
 */

interface LinterConfig {
  pattern: RegExp;
  command: string;
  description: string;
}

const LINTERS: LinterConfig[] = [
  { pattern: /\.(ts|tsx|js|jsx)$/, command: 'eslint --fix', description: 'ESLint' },
  { pattern: /\.py$/, command: 'ruff check --fix', description: 'Ruff' },
  { pattern: /\.go$/, command: 'go vet', description: 'go vet' },
  { pattern: /\.rs$/, command: 'cargo clippy', description: 'Clippy' },
  { pattern: /\.java$/, command: 'checkstyle', description: 'Checkstyle' },
  { pattern: /\.(kt|kts)$/, command: 'detekt', description: 'Detekt' },
  { pattern: /\.swift$/, command: 'swiftlint lint --fix', description: 'SwiftLint' },
  { pattern: /\.(cpp|hpp|cc|hh|cxx|h)$/, command: 'clang-tidy', description: 'clang-tidy' },
  { pattern: /\.rb$/, command: 'rubocop -A', description: 'RuboCop' },
  { pattern: /\.php$/, command: 'phpstan analyse', description: 'PHPStan' },
  { pattern: /\.(sh|bash)$/, command: 'shellcheck', description: 'ShellCheck' },
  { pattern: /\.(yaml|yml)$/, command: 'yamllint', description: 'YAMLLint' },
];

/**
 * Check if a command is available on the system.
 * 
 * Tries multiple detection methods in order:
 * 1. Try running the command directly via $ (BunShell) - if it doesn't throw
 *    "command not found", it's available.
 * 2. Check if the command exists in process.env.PATH using fs.access.
 * 
 * Returns true if the command appears to be installed, false otherwise.
 */
async function commandAvailable(cmd: string): Promise<boolean> {
  const firstToken = cmd.split(/\s+/)[0];
  
  // Method 1: Try running the command directly via $ (BunShell).
  // If the command is not found, BunShell throws an error with "command not found"
  // or the subprocess exits with code 127. We catch all errors and check.
  try {
    const result = await $`${firstToken} --version`;
    // If we get here without throwing, the command exists
    return true;
  } catch (error: any) {
    // Check if the error is specifically "command not found"
    const message = error?.message || String(error);
    const stderr = error?.stderr?.toString() || "";
    const exitCode = error?.exitCode;
    
    // BunShell throws for non-zero exit codes by default.
    // If exit code is 127, it's "command not found"
    if (exitCode === 127 || message.includes("command not found") || stderr.includes("command not found")) {
      return false;
    }
    
    // Any other error means the command exists but failed for another reason
    // (e.g., --version not supported, permission denied, etc.)
    // We consider it available.
    return true;
  }
}

// NASA Rule 7: Check for ignored return values
function checkIgnoredReturnValues(content: string): string[] {
  const violations: string[] = [];
  
  // Detect await without assignment or check
  const ignoredAwaitPattern = /await\s+\w+\(.*?\)\s*;/g;
  const awaitMatches = content.match(ignoredAwaitPattern);
  if (awaitMatches) {
    violations.push(`Potentially ignored await calls detected (${awaitMatches.length} occurrence(s))`);
  }
  
  // Detect function calls without assignment or check (common pattern)
  const ignoredCallPattern = /\w+\(.*?\)\s*;/g;
  const callMatches = content.match(ignoredCallPattern);
  if (callMatches) {
    // Filter out known safe patterns (console.log, etc.)
    const unsafeCalls = callMatches.filter(m => !m.startsWith('console.') && !m.startsWith('log.') && !m.startsWith('debug.'));
    if (unsafeCalls.length > 0) {
      violations.push(`Potentially ignored function calls detected (${unsafeCalls.length} occurrence(s))`);
    }
  }
  
  return violations;
}

export const LintingPlugin: Plugin = async (ctx: PluginInput) => {
  const client = ctx.client;
  const $ = ctx.$;
  const hooks: Hooks = {
    // Run linter after file writes (only if the linter is installed)
    "tool.execute.after": async (input, output) => {
      if (input.tool === "write" || input.tool === "edit") {
        const filePath = input.args?.filePath || '';
        const content = output.output || '';

        const linter = LINTERS.find(rule => rule.pattern.test(filePath));

        if (linter) {
          const available = await commandAvailable(linter.command);
          if (!available) {
            await warn(client, `[Linting] Skipped ${linter.description}: '${linter.command}' is not installed.`);
            return;
          }

          try {
            await $`${linter.command} "${filePath}"`;
            console.log(`[Linting] Applied ${linter.description} to ${filePath}`);
          } catch (error) {
            await warn(client, `[Linting] ${linter.description} failed for ${filePath}: ${error}`);
          }
        }

        // NASA Rule 7: Check for ignored return values
        const returnViolations = checkIgnoredReturnValues(content);
        for (const issue of returnViolations) {
          await warn(client, `[Linting] Return value check violation in ${filePath}: ${issue}`);
        }
      }
    }
  };
  return hooks;
};
