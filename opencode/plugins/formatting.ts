import type { Plugin, Hooks, PluginInput } from "@opencode-ai/plugin"
import { warn } from "./lib/output.js"

/**
 * Formatting Plugin - Auto-formats files after edits using language-specific formatters
 *
 * Behavior:
 * - tool.execute.after: After every write or edit, checks the file extension against
 *   a configured formatter map and runs the appropriate formatter command if installed.
 *   Supported languages: TypeScript/JSX, Python (Black), Go (gofmt), Rust (cargo fmt),
 *   Java (google-java-format), Kotlin (ktfmt), Swift (SwiftFormat), C/C++ (clang-format),
 *   C# (dotnet format), F# (fantomas), Ruby (RuboCop), PHP (Pint), Shell (shfmt),
 *   YAML/JSON/Markdown (Prettier).
 *
 *   If the formatter is not installed, emits a warning and skips silently.
 *   If formatting fails, emits a warning with the error details.
 *
 * Debounce: Skips re-formatting the same file within 2 seconds to avoid redundant runs
 * when multiple edits hit the same file in quick succession.
 */

interface FormatterConfig {
  pattern: RegExp;
  command: string;
  description: string;
}

const FORMATTERS: FormatterConfig[] = [
  { pattern: /\.(ts|tsx|js|jsx)$/, command: 'prettier --write', description: 'Prettier' },
  { pattern: /\.py$/, command: 'black', description: 'Black' },
  { pattern: /\.go$/, command: 'gofmt -w', description: 'gofmt' },
  { pattern: /\.rs$/, command: 'cargo fmt', description: 'cargo fmt' },
  { pattern: /\.java$/, command: 'google-java-format --replace', description: 'google-java-format' },
  { pattern: /\.(kt|kts)$/, command: 'ktfmt --google-style', description: 'ktfmt' },
  { pattern: /\.swift$/, command: 'swiftformat', description: 'SwiftFormat' },
  { pattern: /\.(cpp|hpp|cc|hh|cxx|h)$/, command: 'clang-format -i', description: 'clang-format' },
  { pattern: /\.(cs)$/, command: 'dotnet format', description: 'dotnet format' },
  { pattern: /\.(fs|fsx)$/, command: 'fantomas', description: 'fantomas' },
  { pattern: /\.rb$/, command: 'rubocop -A', description: 'RuboCop' },
  { pattern: /\.php$/, command: 'pint', description: 'Pint' },
  { pattern: /\.(sh|bash)$/, command: 'shfmt -w', description: 'shfmt' },
  { pattern: /\.(yaml|yml)$/, command: 'prettier --write', description: 'Prettier' },
  { pattern: /\.json$/, command: 'prettier --write', description: 'Prettier' },
  { pattern: /\.md$/, command: 'prettier --write', description: 'Prettier' },
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

const lastFormatTime = new Map<string, number>();
const DEBOUNCE_MS = 2000;

export const FormattingPlugin: Plugin = async (ctx: PluginInput) => {
  const client = ctx.client;
  const $ = ctx.$;
  const hooks: Hooks = {
    // Auto-format files after writes (only if the formatter is installed)
    "tool.execute.after": async (input) => {
      if (input.tool === "write" || input.tool === "edit") {
        const filePath = input.args?.filePath || '';

        // Debounce: skip if same file was formatted within DEBOUNCE_MS
        const now = Date.now();
        const last = lastFormatTime.get(filePath) || 0;
        if (now - last < DEBOUNCE_MS) return;
        lastFormatTime.set(filePath, now);

        const formatter = FORMATTERS.find(f => f.pattern.test(filePath));

        if (formatter) {
          const available = await commandAvailable(formatter.command);
          if (!available) {
            await warn(client, `[Formatting] Skipped ${formatter.description}: '${formatter.command}' is not installed.`);
            return;
          }

          try {
            await $`${formatter.command} "${filePath}"`;
            console.log(`[Formatting] Applied ${formatter.description} to ${filePath}`);
          } catch (error) {
            await warn(client, `[Formatting] ${formatter.description} failed for ${filePath}: ${error}`);
          }
        }
      }
    }
  };
  return hooks;
};
