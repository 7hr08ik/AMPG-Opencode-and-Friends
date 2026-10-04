/**
 * Guards and shared helpers for the plugins.
 *
 * Only the helpers actually consumed by a plugin live here. If you add a helper,
 * use it in at least one plugin (see `isWriteTool` below, used by 4 of them);
 * otherwise remove it before committing - an unused export is a hidden contract
 * for the (untracked) plugin default-export that the SDK never calls.
 */

/** True for any write/edit/patch-shaped tool. */
export const isWriteTool = (tool: string): boolean =>
  tool === "write" || tool === "edit" || tool === "patch"

/**
 * Reads the written content out of a tool call's `args`, accepting whichever of
 * the write/edit/patch shapes the plugin was handed (write→`content`,
 * edit/patch→`newString`, generic→`text`/`input`). Plugins that only need to know
 * the tool type should prefer {@link isWriteTool}; use this when they also need
 * the bytes being written (e.g. to scan for secrets).
 *
 * @param args The raw tool `args` object.
 * @returns The written content, or "" when the shape carried none.
 */
export const unwrapWriteContent = (args: Record<string, any>): string =>
  String(args.patchText ?? args.content ?? args.newString ?? args.text ?? args.input ?? "")

/** True for a shell-invoking tool (`bash`/`shell`). */
export const isShellTool = (tool: string): boolean => tool === "bash" || tool === "shell"
