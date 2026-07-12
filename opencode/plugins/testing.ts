import type { Plugin, Hooks, PluginInput } from "@opencode-ai/plugin"
import { warn } from "./lib/output.js"

/**
 * Testing Plugin - Enforces test-driven development discipline
 *
 * Behavior:
 * - tool.execute.before: Tracks writes and edits to implementation files
 *   (anything ending in .ts, .tsx, .js, .jsx that is NOT a test file).
 *   After the 3rd implementation edit without an intervening test file write,
 *   emits a warning reminding the user to write tests.
 *   Test files (matching .test., .spec., __tests__/, or test/ patterns) reset
 *   the counter, acknowledging that tests have been written.
 * - session.idle: If any implementation files were modified without corresponding
 *   test files, emits a warning listing the count and reminding the user to run
 *   tests with coverage before finishing the session.
 *
 * Goal: Prevent the common AI agent pattern of writing multiple implementation
 * files before writing any tests.
 */

// Track implementation attempts without tests
let implementationAttempts: Array<{ file: string; timestamp: number }> = [];
const TEST_FILE_PATTERNS = [
  /\.test\.(ts|tsx|js|jsx)$/,
  /\.spec\.(ts|tsx|js|jsx)$/,
  /__tests__\//,
  /test\//,
];

function isTestFile(filePath: string): boolean {
  return TEST_FILE_PATTERNS.some(pattern => pattern.test(filePath));
}

function isImplementationFile(filePath: string): boolean {
  return !isTestFile(filePath) &&
    (filePath.endsWith('.ts') || filePath.endsWith('.tsx') ||
      filePath.endsWith('.js') || filePath.endsWith('.jsx'));
}

export const TestingPlugin: Plugin = async (ctx: PluginInput) => {
  const client = ctx.client;
  const hooks: Hooks = {
    // Warn when implementing without tests
    "tool.execute.before": async (input, output) => {
      if (input.tool === "write" || input.tool === "edit") {
        const filePath = output.args?.filePath || '';

        if (isImplementationFile(filePath)) {
          implementationAttempts.push({
            file: filePath,
            timestamp: Date.now()
          });

          if (implementationAttempts.length > 3) {
            await warn(client, `[Testing] Multiple implementation edits (${implementationAttempts.length}) without test edits detected.`);
          }
        }

        // Reset counter when tests are written
        if (isTestFile(filePath)) {
          implementationAttempts = [];
        }
      }
    },

    // Remind to run tests at session end
    event: async (input) => {
      if (input.event.type === "session.idle") {
        if (implementationAttempts.length > 0) {
          await warn(client, `[Testing] ${implementationAttempts.length} implementation file(s) modified. Run tests with coverage before finishing.`);
          implementationAttempts = [];
        }
      }
    }
  };
  return hooks;
};
