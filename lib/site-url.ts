/** Canonical production app URL (custom domain). */
export const PRODUCTION_SITE_URL = "https://therosterleague.com"

const LOCAL_DEV_ORIGIN = "http://localhost:3000"

/** Ensures env values like `therosterleague.com` become `https://therosterleague.com`. */
export function normalizeSiteUrl(url: string) {
  const trimmed = url.trim().replace(/\/$/, "")
  if (!trimmed) return trimmed
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }
  return `https://${trimmed}`
}

export function normalizePublicSiteUrl(url: string | undefined) {
  if (!url) return ""
  return normalizeSiteUrl(url)
}

export { LOCAL_DEV_ORIGIN }
