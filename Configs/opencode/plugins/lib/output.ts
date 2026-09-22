/**
 * Plugin output utility - writes warnings and errors as toast notifications.
 *
 * Uses the same approach as the true-mem plugin:
 * https://github.com/rizal72/true-mem/blob/main/src/utils/toast.ts
 *
 * When a client is provided, routes through toast notifications.
 * Falls back to process.stdout.write when no client is available.
 */

/** Minimal client shape from OpenCode's PluginInput. */
interface PluginClient {
  tui: {
    showToast(input: { body: { title?: string; message: string; variant: "info" | "success" | "error" | "warning"; duration?: number } }): Promise<any>
  }
}

const YELLOW = "\x1b[33m"
const RESET = "\x1b[0m"

function formatMessage(prefix: string, message: string): string {
  return `${YELLOW}${prefix}${RESET} ${message}`
}

/**
 * Print a warning message as a toast notification.
 * When a client is provided, routes through toast notifications instead of stdout.
 */
export async function warn(client: PluginClient | undefined, message: string): Promise<void> {
  const formatted = formatMessage("[Plugin Warning]", message)
  if (client) {
    await client.tui.showToast({
      body: {
        title: "Plugin Warning",
        message,
        variant: "warning",
        duration: 5000,
      },
    })
  } else {
    process.stdout.write(formatted + "\n")
  }
}

/**
 * Print an error message as a toast notification.
 * When a client is provided, routes through toast notifications instead of stdout.
 */
export async function error(client: PluginClient | undefined, message: string): Promise<void> {
  const formatted = formatMessage("[Plugin Error]", message)
  if (client) {
    await client.tui.showToast({
      body: {
        title: "Plugin Error",
        message,
        variant: "error",
        duration: 5000,
      },
    })
  } else {
    process.stdout.write(formatted + "\n")
  }
}
