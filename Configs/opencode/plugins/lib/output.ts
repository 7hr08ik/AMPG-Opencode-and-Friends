/**
 * Plugin output utility - writes warnings and errors as toast notifications.
 *
 * V2-compatible: accepts either a V1 client, a V2 plugin context, or
 * undefined. Toast shapes from `client.tui` (V1) and `ctx.tui` (V2) are
 * both attempted before falling back to stdout/stderr.
 *
 * When no toast API is available, routes through process stdout/stderr.
 */

interface ToastInput {
  body: {
    title?: string
    message: string
    variant: "info" | "success" | "error" | "warning"
    duration?: number
  }
}

interface ToastApi {
  showToast(input: ToastInput): Promise<any>
}

/** Minimal shapes from V1 PluginInput and V2 plugin context. */
type ToastClient =
  | { tui: ToastApi }
  | { client: { tui: ToastApi } }
  | undefined

const YELLOW = "\x1b[33m"
const RESET = "\x1b[0m"

function formatMessage(prefix: string, message: string): string {
  return `${YELLOW}${prefix}${RESET} ${message}`
}

function resolveToast(client: unknown): ToastApi | undefined {
  if (!client || typeof client !== "object") return undefined
  const direct = (client as { tui?: ToastApi }).tui
  if (direct && typeof direct.showToast === "function") return direct
  const nested = (client as { client?: { tui?: ToastApi } }).client?.tui
  if (nested && typeof nested.showToast === "function") return nested
  return undefined
}

/**
 * Print a warning message as a toast notification.
 * When a client is provided, routes through toast notifications instead of stdout.
 */
export async function warn(client: ToastClient | unknown, message: string): Promise<void> {
  const formatted = formatMessage("[Plugin Warning]", message)
  const toast = resolveToast(client)
  if (toast) {
    await toast.showToast({
      body: {
        title: "Plugin Warning",
        message,
        variant: "warning",
        duration: 5000,
      },
    })
  } else {
    process.stdout.write(`${formatted}\n`)
  }
}

/**
 * Print an error message as a toast notification.
 * When a client is provided, routes through toast notifications instead of stdout.
 */
export async function error(client: ToastClient | unknown, message: string): Promise<void> {
  const formatted = formatMessage("[Plugin Error]", message)
  const toast = resolveToast(client)
  if (toast) {
    await toast.showToast({
      body: {
        title: "Plugin Error",
        message,
        variant: "error",
        duration: 5000,
      },
    })
  } else {
    process.stdout.write(`${formatted}\n`)
  }
}
