import type { Plugin } from "@opencode-ai/plugin"
import { isWriteTool } from "./lib/guards.ts"
import { warn } from "./lib/output.ts"

const FUNCSIZE = 60

const checkImmutability = (content: string): string[] => {
  const stripped = content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'/g, "")
  const patterns = [
    { re: /\.\w+\s*\(/g, name: "Method call (potential mutation)" },
    { re: /\.shift\s*\(/g, name: "Array.shift (mutates)" },
    { re: /\.unshift\s*\(/g, name: "Array.unshift (mutates)" },
    { re: /\[[^\]]*\./g, name: "Direct index access (mutates)" },
  ]
  const violations: string[] = []
  for (const pattern of patterns) {
    const matches = stripped.match(pattern.re)
    if (matches) violations.push(`${pattern.name} (${matches.length} occurrence(s))`)
  }
  return violations
}

const checkNestingDepth = (content: string): number => {
  // Brace depth, skipping strings/comments via the same lexer states.
  // (The previous keyword-counting version never matched - a 10-char window
  // can never equal "if"/"for" - so depth was always 0. Object literals do
  // inflate this heuristic; the threshold accounts for that.)
  let maxDepth = 0
  let depth = 0
  let i = 0
  const n = content.length
  let quoteChar = ""
  let mode: "code" | "line-comment" | "block-comment" | "string" | "template" = "code"
  while (i < n) {
    const c = content[i]
    const next = content[i + 1]
    if (mode === "code") {
      if (c === "/" && next === "/") { mode = "line-comment"; i += 2; continue }
      if (c === "/" && next === "*") { mode = "block-comment"; i += 2; continue }
      if (c === '"' || c === "'") { mode = "string"; quoteChar = c; i++; continue }
      if (c === "`") { mode = "template"; i++; continue }
      if (c === "{") { depth++; maxDepth = Math.max(maxDepth, depth) }
      if (c === "}") { depth = Math.max(0, depth - 1) }
      i++
      continue
    }
    if (mode === "line-comment") {
      if (c === "\n") mode = "code"
      i++
      continue
    }
    if (mode === "block-comment") {
      if (c === "*" && next === "/") { mode = "code"; i += 2; continue }
      i++
      continue
    }
    if (mode === "string") {
      if (c === "\\") { i += 2; continue }
      if (c === quoteChar) { mode = "code"; i++; continue }
      i++
      continue
    }
    if (mode === "template") {
      if (c === "\\") { i += 2; continue }
      if (c === "`") { mode = "code"; i++; continue }
      if (c === "$" && next === "{") { depth++; maxDepth = Math.max(maxDepth, depth); i += 2; continue }
      i++
    }
  }
  return maxDepth
}

const FUNC_REGEX = /(?:function\s+\w+|const\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>|let\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>|var\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>|class\s+\w+|export\s+default\s+function\s+\w+|export\s+function\s+\w+)/g

const extractFuncName = (header: string): string => {
  // FUNC_REGEX has no capture groups, so derive the name from the header text.
  const m =
    header.match(/function\s+([\w$]+)/) ??
    header.match(/class\s+([\w$]+)/) ??
    header.match(/(?:const|let|var)\s+([\w$]+)\s*=/)
  return m ? m[1] : header.slice(0, 30)
}

const buildLineIndex = (content: string): number[] => {
  const starts = [0]
  for (let i = content.indexOf("\n"); i !== -1; i = content.indexOf("\n", i + 1)) {
    starts.push(i + 1)
  }
  return starts
}

const lineOf = (starts: number[], index: number): number => {
  let lo = 0
  let hi = starts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (starts[mid] <= index) lo = mid
    else hi = mid - 1
  }
  return lo + 1 // 1-based line number
}

const measureFunctions = (content: string): Array<{ name: string; body: string; lines: number }> => {
  // Perf: the old version called content.substring(0, i).split("\n") twice
  // per function (O(n) each) plus two O(n) tail copies - O(f*n) total, ~15ms
  // on a 2000-line file. Line index + binary search + direct scan: O(n + f*len).
  const starts = buildLineIndex(content)
  const out: Array<{ name: string; body: string; lines: number }> = []
  let match: RegExpExecArray | null
  FUNC_REGEX.lastIndex = 0
  while ((match = FUNC_REGEX.exec(content)) !== null) {
    const funcName = extractFuncName(match[0])
    const startLine = lineOf(starts, match.index)
    let braceCount = 0
    let endLine = startLine
    const braceIndex = content.indexOf("{", match.index)
    if (braceIndex >= 0) {
      for (let i = braceIndex; i < content.length; i++) {
        const ch = content[i]
        if (ch === "{") braceCount++
        else if (ch === "}") {
          braceCount--
          if (braceCount === 0) {
            endLine = lineOf(starts, i)
            break
          }
        }
      }
    }
    out.push({
      name: funcName,
      body: braceIndex >= 0 ? content.substring(braceIndex) : content.substring(match.index),
      lines: endLine - startLine + 1,
    })
  }
  return out
}

const checkFunctionSize = (content: string): Array<{ name: string; lines: number }> =>
  measureFunctions(content)
    .filter((f) => f.lines > FUNCSIZE)
    .map((f) => ({ name: f.name, lines: f.lines }))

const checkLoopBounds = (content: string): string[] => {
  const violations: string[] = []
  const forInfiniteMatches = content.match(/for\s*\(\s*;[^;]*;\s*\)|for\s*\(\s*;;\s*\)/g)
  if (forInfiniteMatches) violations.push(`Infinite-for loops detected (${forInfiniteMatches.length} occurrence(s))`)
  const whileNotTrueMatches = content.match(/while\s*\(\s*(?!true|1)\s*.*\)/g)
  if (whileNotTrueMatches) violations.push(`Unbounded while loops detected (${whileNotTrueMatches.length} occurrence(s))`)
  const doWhileMatches = content.match(/do\s*\{[\s\S]*?\}\s*while\s*\(/g)
  if (doWhileMatches) violations.push(`do-while loops detected (${doWhileMatches.length} occurrence(s))`)
  // NOTE: removed the old "Potential recursive calls" heuristic - it matched
  // every `name(` call in the file, so it warned on literally any code.
  return violations
}

const TEST_PATH_PATTERN = /(\.test\.[tj]sx?|\.spec\.[tj]sx?|__tests__\/|(^|\/)test\/|_test\.go$|(^|\/)test_.*\.py$)/i

const checkAssertionDensity = (filePath: string, content: string): Array<{ name: string; assertions: number }> => {
  // Gate on the file PATH, not the content: the old content sniff
  // (/test\./) treated any file mentioning "test." as a test file.
  if (!TEST_PATH_PATTERN.test(filePath)) return []
  const out: Array<{ name: string; assertions: number }> = []
  for (const f of measureFunctions(content)) {
    const count = (f.body.match(/(?:assert|expect|verify|check|assertEqual|assertNotEqual|assertTrue|assertFalse)/g) || []).length
    if (count < 2) out.push({ name: f.name, assertions: count })
  }
  return out
}

interface Violation {
  type: string
  file: string
  details: string
}

export const CodingStylePlugin: Plugin = async (ctx, _options) => {
  let sessionViolations: Violation[] = []

  return {
    "tool.execute.before": async (input, output) => {
      try {
        const tool = String(input.tool ?? "")
        if (!isWriteTool(tool)) return
        const args = (output?.args ?? {}) as Record<string, any>
        const content = String(args.content ?? args.newString ?? args.text ?? "")
        const filePath = String(args.filePath ?? args.path ?? "")

        for (const issue of checkImmutability(content)) {
          sessionViolations.push({ type: "immutability", file: filePath, details: issue })
          await warn(ctx, `[Coding Style] Immutability issue in ${filePath}: ${issue}`)
        }

        const maxNesting = checkNestingDepth(content)
        if (maxNesting > 4) {
          sessionViolations.push({ type: "nesting-depth", file: filePath, details: `${maxNesting} levels (max 4)` })
          await warn(ctx, `[Coding Style] Nesting depth violation in ${filePath}: ${maxNesting} levels (max 4)`)
        }

        for (const func of checkFunctionSize(content)) {
          sessionViolations.push({ type: "function-size", file: filePath, details: `${func.name}: ${func.lines} lines (max ${FUNCSIZE})` })
          await warn(ctx, `[Coding Style] Function size violation in ${filePath}: ${func.name} has ${func.lines} lines (max ${FUNCSIZE})`)
        }

        for (const issue of checkLoopBounds(content)) {
          sessionViolations.push({ type: "loop-bounds", file: filePath, details: issue })
          await warn(ctx, `[Coding Style] Loop bounds violation in ${filePath}: ${issue}`)
        }

        for (const func of checkAssertionDensity(filePath, content)) {
          sessionViolations.push({ type: "assertion-density", file: filePath, details: `${func.name}: ${func.assertions} assertion(s) (min 2)` })
          await warn(ctx, `[Coding Style] Assertion density violation in ${filePath}: ${func.name} has ${func.assertions} assertion(s) (min 2)`)
        }
      } catch (e) {
        process.stderr.write(`[CodingStyle Debug] hook body error: ${(e as Error).message}\n`)
      }
    },
    event: async ({ event }) => {
      if (event.type !== "session.idle") return
      if (sessionViolations.length === 0) return
      await warn(ctx, `[Code Quality Audit] ${sessionViolations.length} violation(s) found during session:`)
      for (const v of sessionViolations) {
        await warn(ctx, `[Code Quality Audit]   - [${v.type}] ${v.file}: ${v.details}`)
      }
      sessionViolations = []
    },
  }
}

// Default export satisfies the V2 PluginSupervisor, which requires a
// default definition with an id and an effect or setup function.
// Tool interception lives in `server` (SDK Hooks shape); setup is a
// no-op because this plugin registers no skills or session hooks.
export default {
  id: "coding-style",
  server: CodingStylePlugin,
  setup: async () => {},
}
