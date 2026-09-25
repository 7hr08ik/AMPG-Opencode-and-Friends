import type { Plugin } from "@opencode-ai/plugin"
import { isWriteTool } from "./lib/guards.ts"
import { warn } from "./lib/output.ts"

const TEST_FILE_PATTERNS = [
  /\.test\.(ts|tsx|js|jsx)$/,
  /\.spec\.(ts|tsx|js|jsx)$/,
  /__tests__\//,
  /test\//,
  /\.test\.py$/,
  /^test_.*\.py$/,
  /_test\.go$/,
  /^_test\.go$/,
  /\/\* test \*\/|\/\*\/ test/,
]

const isTestFile = (filePath: string): boolean =>
  TEST_FILE_PATTERNS.some((pattern) => pattern.test(filePath))

const isImplementationFile = (filePath: string): boolean =>
  !isTestFile(filePath) &&
  (filePath.endsWith(".ts") ||
    filePath.endsWith(".tsx") ||
    filePath.endsWith(".js") ||
    filePath.endsWith(".jsx"))

export const TestingPlugin: Plugin = async (ctx, options) => {
  const defaults = {
    testPatterns: [
      /\.test\.(ts|tsx|js|jsx)$/,
      /\.spec\.(ts|tsx|js|jsx)$/,
      /__tests__\//,
      /test\//,
    ] as RegExp[],
    enforceOnCommit: false,
    testEditWindowMinutes: 5,
  }
  const opts = { ...defaults, ...((options ?? {}) as Partial<typeof defaults>) }

  const implToTestMap = new Map<string, string>()
  let implementationAttempts: Array<{ file: string; timestamp: number }> = []

  const resetImplAttempts = (filePath: string) => {
    // Normalize a test file to the implementation basename it covers:
    // strip dirs + extension, then strip test affixes (foo.test -> foo,
    // test_foo -> foo, foo_test -> foo). Then drop attempts for impl files
    // with that basename (attempts store impl paths, not test paths).
    const testBasename = filePath
      .replace(/^.*[/\\]/, "")
      .replace(/\.[^.]+$/, "")
      .replace(/\.(test|spec)$/, "")
      .replace(/^test_/, "")
      .replace(/_test$/, "")
    implementationAttempts = implementationAttempts.filter((a) => {
      const implBasename = a.file.replace(/^.*[/\\]/, "").replace(/\.[^.]+$/, "")
      return implBasename !== testBasename
    })
  }

  async function checkTestCoverage(implFiles: string[]): Promise<boolean> {
    for (const implFile of implFiles) {
      const basename = implFile.replace(/^.*\//, "").replace(/\.[^.]+$/, "")
      const potentialTestFiles = [
        `${basename}.test.${implFile.split(".").pop()}`,
        `test_${basename}.${implFile.split(".").pop()}`,
        `/test/${basename}.${implFile.split(".").pop()}`,
      ]
      const hasTest = potentialTestFiles.some((_pf) => {
        const dir = implFile.replace(/\/[^/]*$/, "/")
        return dir.includes("/test/") || dir.endsWith("/tests")
      })
      if (!hasTest) return false
    }
    return true
  }

  return {
    "tool.execute.before": async (input, output) => {
      const tool = String(input.tool ?? "")
      if (!isWriteTool(tool)) return
      const args = (output?.args ?? {}) as Record<string, any>
      const filePath = String(args.filePath ?? args.path ?? "")
      if (!filePath) return

      if (isImplementationFile(filePath)) {
        const basename = filePath.replace(/^.*\//, "").replace(/\.[^.]+$/, "")
        implToTestMap.set(filePath, basename)
        implementationAttempts.push({ file: filePath, timestamp: Date.now() })

        const windowMs = opts.testEditWindowMinutes * 60 * 1000
        const recentImpl = implementationAttempts.filter(
          (a) => Date.now() - a.timestamp < windowMs,
        )
        if (recentImpl.length > 3 && !isTestFile(filePath)) {
          await warn(
            ctx,
            `[Testing] Warning: Multiple implementation edits (${recentImpl.length}) without test edits detected in ${opts.testEditWindowMinutes}-min window.`,
          )
        }
      }

      if (isTestFile(filePath)) {
        resetImplAttempts(filePath)
        implementationAttempts = implementationAttempts.filter(
          (a) => a.file !== filePath,
        )
      }
    },
    event: async ({ event }) => {
      if (event.type !== "session.idle") return
      if (implementationAttempts.length === 0) return
      if (opts.enforceOnCommit) {
        const recentImpl = implementationAttempts.filter(
          (a) => Date.now() - a.timestamp < 300000,
        )
        if (recentImpl.length > 0) {
          const testCoverage = await checkTestCoverage(
            recentImpl.map((a) => a.file),
          )
          if (!testCoverage) {
            throw new Error(
              `BLOCKED: ${recentImpl.length} implementation file(s) modified without corresponding test edits. Set enforceOnCommit=false to allow.`,
            )
          }
        }
      }
      await warn(
        ctx,
        `[Testing] ${implementationAttempts.length} implementation file(s) modified. Run tests with coverage before finishing.`,
      )
      implementationAttempts = []
    },
  }
}

// Default export satisfies the V2 PluginSupervisor, which requires a
// default definition with an id and an effect or setup function.
// Tool interception lives in `server` (SDK Hooks shape); setup is a
// no-op because this plugin registers no skills or session hooks.
export default {
  id: "testing",
  server: TestingPlugin,
  setup: async () => {},
}
