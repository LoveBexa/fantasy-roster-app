import {
  normalizePublicSiteUrl,
  normalizeSiteUrl,
  PRODUCTION_SITE_URL,
} from "@/lib/site-url"

export const AUTH_CALLBACK_PATH = "/auth/callback"
export const DEFAULT_POST_AUTH_PATH = "/dashboard"

export { PRODUCTION_SITE_URL }

/**
 * App origin for redirects.
 * Browser: current host (e.g. https://therosterleague.com).
 * Server: NEXT_PUBLIC_SITE_URL (normalized) or request fallback.
 */
export function getSiteOrigin(fallbackOrigin?: string) {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  const configured = normalizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
  if (configured) return configured
  if (fallbackOrigin) return normalizeSiteUrl(fallbackOrigin)
  return ""
}

/** OAuth redirect URL — no query string so Supabase allowlist matches exactly. */
export function getOAuthCallbackUrl(origin?: string) {
  const base = getSiteOrigin(origin)
  return `${base}${AUTH_CALLBACK_PATH}`
}

/** Production OAuth callback for Supabase redirect URL allowlist docs. */
export function getProductionOAuthCallbackUrl() {
  return `${PRODUCTION_SITE_URL}${AUTH_CALLBACK_PATH}`
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
