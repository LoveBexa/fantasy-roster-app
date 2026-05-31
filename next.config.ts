import type { NextConfig } from "next";

function normalizeSiteUrl(url: string) {
  const trimmed = url.trim().replace(/\/$/, "");
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/** Baked into client bundle so OAuth redirectTo matches the deployed host. */
function resolvePublicSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionHost) {
    return `https://${productionHost}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "";
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL: resolvePublicSiteUrl(),
  },
};

export default nextConfig;
