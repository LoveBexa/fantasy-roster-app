export const AUTH_CALLBACK_PATH = "/auth/callback"
export const DEFAULT_POST_AUTH_PATH = "/dashboard"

/** Canonical app origin (set in Vercel env or injected from VERCEL_* at build). */
export function getSiteOrigin(fallbackOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  if (configured) return configured
  if (fallbackOrigin) return fallbackOrigin.replace(/\/$/, "")
  if (typeof window !== "undefined") return window.location.origin
  return ""
}

/** OAuth redirect URL — no query string so Supabase allowlist matches exactly. */
export function getOAuthCallbackUrl(origin?: string) {
  const base = getSiteOrigin(origin)
  return `${base}${AUTH_CALLBACK_PATH}`
}

/** Email / password-reset links may include a `next` path on the callback. */
export function getAuthCallbackUrl(next: string, origin?: string) {
  const base = getSiteOrigin(origin)
  const url = new URL(AUTH_CALLBACK_PATH, base)
  url.searchParams.set("next", next)
  return url.toString()
}

export function sanitizeAuthNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_POST_AUTH_PATH
  }
  return next
}
