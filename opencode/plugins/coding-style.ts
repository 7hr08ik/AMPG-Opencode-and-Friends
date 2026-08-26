import type { Plugin, Hooks, PluginInput } from "@opencode-ai/plugin"
import { warn, error } from "./lib/output.js"

/**
 * Coding Style Plugin - Enforces code quality rules inspired by NASA software standards
 *
 * Behavior:
 * - tool.execute.after: Inspects content of every written or edited file for the
 *   following violations, emitting a warning for each and recording it for the
 *   session-end audit:
 *     1. Immutability — detects in-place array mutations (push, pop, splice, sort,
 *        reverse, fill) and Object.assign with empty target.
 *     2. Nesting depth — flags files whose brace depth exceeds 4 levels.
 *     3. Function size — flags functions exceeding 60 lines (NASA Rule 4).
 *     4. Loop bounds — detects for-loops without increment/condition and
 *        while(true) loops without a clear exit path (NASA Rule 2).
 *     5. Assertion density — flags functions with fewer than 2 test assertions
 *        (NASA Rule 5).
 * - session.idle: Emits a consolidated audit report listing every violation type,
 *   file, and detail found during the session, then clears the tracker.
 */

// Track violations during session
let sessionViolations: Array<{ type: string; file: string; details: string }> = [];

// NASA Rule 4: Functions should not exceed one page (60 lines)
const funcsize = 60;

function checkImmutability(content: string): string[] {
  const violations: string[] = [];
  const patterns = [
    { re: /\.push\(/g, name: 'Array.push (mutates)' },
    { re: /\.pop\(/g, name: 'Array.pop (mutates)' },
    { re: /\.splice\(/g, name: 'Array.splice (mutates)' },
    { re: /\.sort\(\s*\)/g, name: 'Array.sort (mutates, use.toSorted())' },
    { re: /\.reverse\(/g, name: 'Array.reverse (mutates)' },
    { re: /\.fill\(/g, name: 'Array.fill (mutates)' },
    { re: /Object\.assign\(\s*\{\s*\}/, name: 'Object.assign pattern (prefer spread)' },
  ];

  for (const pattern of patterns) {
    const matches = content.match(pattern.re);
    if (matches) {
      violations.push(`${pattern.name} (${matches.length} occurrence(s))`);
    }
  }

  return violations;
}

function checkNestingDepth(content: string): number {
  let maxDepth = 0;
  let currentDepth = 0;

  for (const char of content) {
    if (char === '{' || char === '(' || char === '[') {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (char === '}' || char === ')' || char === ']') {
      currentDepth--;
    }
  }

  return maxDepth;
}

function checkFunctionSize(content: string): Array<{ name: string; lines: number }> {
  const functions: Array<{ name: string; lines: number }> = [];

  const funcRegex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>))/g;
  let match;

  while ((match = funcRegex.exec(content)) !== null) {
    const funcName = match[1] || match[2];
    const startLine = content.substring(0, match.index).split('\n').length;

    let braceCount = 0;
    let endLine = startLine;
    const remaining = content.substring(match.index);

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i] === '{') braceCount++;
      if (remaining[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endLine = content.substring(0, match.index + i + 1).split('\n').length;
          break;
        }
      }
    }

    const lines = endLine - startLine + 1;
    if (lines > funcsize) {
      functions.push({ name: funcName, lines });
    }
  }

  return functions;
}

// NASA Rule 2: Check loop bounds - detect loops without fixed upper-bound
function checkLoopBounds(content: string): string[] {
  const violations: string[] = [];
  
  // Detect for loops with no increment or condition
  const forLoopPattern = /for\s*\(\s*;[^;]*;\s*\)/g;
  const matches = content.match(forLoopPattern);
  if (matches) {
    violations.push(`Loops without fixed upper-bound detected (${matches.length} occurrence(s))`);
  }
  
  // Detect while loops without clear termination condition
  const whileLoopPattern = /while\s*\(\s*(?:true|1)\s*\)/g;
  const whileMatches = content.match(whileLoopPattern);
  if (whileMatches) {
    violations.push(`Unbounded while(true) loops detected (${whileMatches.length} occurrence(s))`);
  }
  
  return violations;
}

// NASA Rule 5: Check assertion density - detect functions with <2 assertions
function checkAssertionDensity(content: string): Array<{ name: string; assertions: number }> {
  const functions: Array<{ name: string; assertions: number }> = [];
  
  const funcRegex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>))/g;
  let match;

  while ((match = funcRegex.exec(content)) !== null) {
    const funcName = match[1] || match[2];
    const startLine = content.substring(0, match.index).split('\n').length;

    let braceCount = 0;
    let endLine = startLine;
    const remaining = content.substring(match.index);

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i] === '{') braceCount++;
      if (remaining[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endLine = content.substring(0, match.index + i + 1).split('\n').length;
          break;
        }
      }
    }

    const funcBody = remaining.substring(0, remaining.indexOf('}', remaining.indexOf('{') + 1));
    const assertionCount = (funcBody.match(/(?:assert|expect|verify|check|assertEqual|assertNotEqual|assertTrue|assertFalse)/g) || []).length;
    
    if (assertionCount < 2) {
      functions.push({ name: funcName, assertions: assertionCount });
    }
  }

  return functions;
}

export const CodingStylePlugin: Plugin = async (ctx: PluginInput) => {
  const client = ctx.client;
  const hooks: Hooks = {
    // Check code quality before file writes
    "tool.execute.before": async (input, output) => {
      if (input.tool === "write" || input.tool === "edit") {
        const content = output.args?.content || output.args?.newString || '';
        const filePath = output.args?.filePath || 'unknown';

        // Immutability Enforcer
        const immutabilityIssues = checkImmutability(content);
        for (const issue of immutabilityIssues) {
          sessionViolations.push({
            type: 'immutability',
            file: filePath,
            details: issue
          });
          await warn(client, `[Coding Style] Immutability issue in ${filePath}: ${issue}`);
        }

        // Nesting Depth Enforcer
        const maxNesting = checkNestingDepth(content);
        if (maxNesting > 4) {
          sessionViolations.push({
            type: 'nesting-depth',
            file: filePath,
            details: `${maxNesting} levels (max 4)`
          });
          await warn(client, `[Coding Style] Nesting depth violation in ${filePath}: ${maxNesting} levels (max 4)`);
        }

        // Function Size Enforcer (NASA Rule 4: max 60 lines)
        const largeFunctions = checkFunctionSize(content);
        for (const func of largeFunctions) {
          sessionViolations.push({
            type: 'function-size',
            file: filePath,
            details: `${func.name}: ${func.lines} lines (max 60)`
          });
          await warn(client, `[Coding Style] Function size violation in ${filePath}: ${func.name} has ${func.lines} lines (max ${funcsize})`);
        }

        // Loop Bounds Enforcer (NASA Rule 2: detect unbounded loops)
        const loopViolations = checkLoopBounds(content);
        for (const issue of loopViolations) {
          sessionViolations.push({
            type: 'loop-bounds',
            file: filePath,
            details: issue
          });
          await warn(client, `[Coding Style] Loop bounds violation in ${filePath}: ${issue}`);
        }

        // Assertion Density Enforcer (NASA Rule 5: min 2 assertions per function)
        const lowAssertionFunctions = checkAssertionDensity(content);
        for (const func of lowAssertionFunctions) {
          sessionViolations.push({
            type: 'assertion-density',
            file: filePath,
            details: `${func.name}: ${func.assertions} assertion(s) (min 2)`
          });
          await warn(client, `[Coding Style] Assertion density violation in ${filePath}: ${func.name} has ${func.assertions} assertion(s) (min 2)`);
        }
      }
    },

    // Report violations at session end
    event: async (input) => {
      if (input.event.type === "session.idle") {
        if (sessionViolations.length > 0) {
          await error(client, `[Code Quality Audit] ${sessionViolations.length} violation(s) found during session:`);
          for (const v of sessionViolations) {
            await error(client, `  - [${v.type}] ${v.file}: ${v.details}`);
          }
          sessionViolations = [];
        }
      }
    }
  };
  return hooks;
};
