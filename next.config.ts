import type { NextConfig } from "next";

/** Baked into client bundle so OAuth redirectTo matches the deployed host. */
function resolvePublicSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
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
