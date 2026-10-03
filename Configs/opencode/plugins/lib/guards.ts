/**
 * Shared guard functions used by several opencode plugins.
 * Centralizes common patterns to eliminate duplication and improve consistency.
 *
 * NOTE: actually imported by 4 of the 7 plugins (code-review-cycle, coding-style,
 * security, testing). The others (env-protection, git-workflow, workflow) inline
 * their own tool-state handling instead of using these helpers.
 */

// Standardize args extraction from any tool event variant
export function getArgs(event: any): Record<string, any> {
  return event?.input ?? event?.args ?? event?.output?.args ?? {}
}

// Check if a tool is a write/edit/patch tool
export function isWriteTool(t: string): t is "write" | "edit" | "patch" {
  return t === "write" || t === "edit" || t === "patch"
}

// Extract write content from any tool event variant (V1 write/edit, V2 patch's
// patchText, etc.). NOTE: security.ts keeps a near-identical copy that reads tool
// `args` instead of an event; they're kept separate to avoid changing call sites.
export function getWriteContent(event: any): string {
  const a = event
  if (typeof a.patchText === "string") return a.patchText
  if (typeof a.content === "string") return a.content
  if (typeof a.newString === "string") return a.newString
  if (typeof a.text === "string") return a.text
  if (typeof a.input === "string") return a.input
  return ""
}

// Return empty string when file path is empty (signals caller to skip)
export function getFilePath(filePath: string): string {
  return filePath || ""
}

// Cap a map at maxSize entries; when cap is reached, summarize + drop oldest
export function cappedPush<T>(
  map: Map<string, T>,
  key: string,
  value: T,
  maxSize: number = 500
): void {
  map.set(key, value)
  if (map.size > maxSize) {
    // Summarize: count entries, then drop oldest by key order
    const entries = Array.from(map.entries())
    // Sort by insertion order (Map preserves insertion order), drop oldest
    // Keep the most recent maxSize entries
    const newMap = new Map<string, T>()
    const startIndex = Math.max(0, entries.length - maxSize)
    for (let i = startIndex; i < entries.length; i++) {
      newMap.set(entries[i][0], entries[i][1])
    }
    // Replace original map contents
    map.clear()
    for (const [k, v] of newMap) {
      map.set(k, v)
    }
  }
}

// Aggregate notification into single summary toast + full list to stderr/log
export function aggregateNotify(
  toasts: Array<{ title: string; message: string }>,
  newMsg: { title: string; message: string },
  maxEntries: number = 500
): void {
  // Add new message to the list
  toasts.push(newMsg)

  // If we exceed maxEntries, summarize
  if (toasts.length > maxEntries) {
    const summaryMsg = `[Aggregated] ${toasts.length - maxEntries} additional violations dropped.`
    // Write full list to stderr for logging
    const allMessages = toasts.map((t) => t.message).join("\n")
    process.stderr.write(`[Plugin Audit] ${allMessages}\n`)
    // Keep only the most recent maxEntries entries, prepend summary
    const recent = toasts.slice(-maxEntries)
    // Replace with summarized version
    const newToasts: Array<{ title: string; message: string }> = []
    // Add a summary entry
    newToasts.push({
      title: "Audit Summary",
      message: summaryMsg,
    })
    // Add the recent entries
    for (const t of recent) {
      newToasts.push(t)
    }
    // Clear and replace
    toasts.length = 0
    for (const t of newToasts) {
      toasts.push(t)
    }
  }
}

// Safe tool name extraction with validation
export function toolName(event: any): string {
  const tool = typeof event?.tool === "string" ? event.tool : ""
  if (!tool) return ""
  return tool
}