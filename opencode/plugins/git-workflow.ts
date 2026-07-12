import type { Plugin, Hooks } from "@opencode-ai/plugin"

/**
 * Git Workflow Plugin - Enforces conventional commit format and AI transparency
 *
 * Behavior:
 * - tool.execute.before: Intercepts every bash command containing "git commit".
 *   Extracts the commit message from the -m flag (supports multi-line messages)
 *   and validates two things:
 *
 *   1. Conventional commit format: The message must match the pattern
 *      {type}(optional scope): description, where type is one of:
 *      feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
 *
 *   2. AI transparency label: The message must contain the exact string
 *      "Note: AI Generated Commit" anywhere in the body. This ensures users
 *      can distinguish AI-authored commits from human-authored ones.
 *
 *   If either check fails, the commit is blocked with a descriptive error.
 *
 * Rationale: Conventional commits improve changelog generation and semantic
 * versioning. The AI label prevents ambiguity about authorship.
 */

const CONVENTIONAL_COMMIT_PATTERN = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,}/;
const AI_GENERATED_NOTE = "Note: AI Generated Commit";

export const GitWorkflowPlugin: Plugin = async () => {
  const hooks: Hooks = {
    // Enforce conventional commits and AI labeling
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash") {
        const command = output.args?.command || '';

        // Check for git commit commands
        if (command.match(/git\s+commit/)) {
          // Extract commit message from -m flag (use [\s\S] to match across newlines)
          const msgMatch = command.match(/-m\s+["']([\s\S]+?)["']/);
          if (msgMatch) {
            const message = msgMatch[1];

            // Check conventional commit format
            if (!CONVENTIONAL_COMMIT_PATTERN.test(message)) {
              throw new Error(`BLOCKED: Commit message does not follow conventional commit format: "${message}"`);
            }

            // Check for AI-generated commit label
            if (!message.includes(AI_GENERATED_NOTE)) {
              throw new Error(`BLOCKED: AI-generated commits must contain "${AI_GENERATED_NOTE}": "${message}"`);
            }
          }
        }
      }
    }
  };
  return hooks;
};
