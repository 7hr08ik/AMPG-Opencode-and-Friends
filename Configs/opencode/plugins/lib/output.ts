/**
 * Plugin output utility - writes warnings and errors as toast notifications.
 *
 * V2-compatible: accepts either a V1 client, a V2 plugin context, or
 * undefined. Toast shapes from `client.tui` (V1) and `ctx.tui` (V2) are
 * both attempted before falling back to a plain stdout write.
 *
 * When no toast API is available, both warn() and error() write to process.stdout.
 */

/**
 * The `body` payload of a toast notification, matching both the V1
 * (`client.tui.showToast`) and V2 (`ctx.tui.showToast`) signatures.
 */
interface ToastInput {
  body: {
    title?: string
    message: string
    variant: "info" | "success" | "error" | "warning"
    duration?: number
  }
}

/** Minimal `showToast` surface shared by the V1 and V2 toast APIs. */
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

// Render a prefixed message in console yellow so plugin output stands out.
function formatMessage(prefix: string, message: string): string {
  return `${YELLOW}${prefix}${RESET} ${message}`
}

// Find a usable `showToast` across the possible client shapes (direct, nested
// under `.client`, or undefined). Returns undefined when none is available,
// which makes warn/error fall back to stdout.
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
