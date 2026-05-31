export const AUTH_CALLBACK_PATH = "/auth/callback"
export const DEFAULT_POST_AUTH_PATH = "/dashboard"

/** OAuth redirect URL — no query string so Supabase allowlist matches exactly. */
export function getOAuthCallbackUrl(origin: string) {
  return `${origin}${AUTH_CALLBACK_PATH}`
}

/** Email / password-reset links may include a `next` path on the callback. */
export function getAuthCallbackUrl(origin: string, next: string) {
  const url = new URL(AUTH_CALLBACK_PATH, origin)
  url.searchParams.set("next", next)
  return url.toString()
}

export function sanitizeAuthNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_POST_AUTH_PATH
  }
  return next
}
