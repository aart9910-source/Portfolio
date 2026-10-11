import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Local, correctly sized project art is served through the Next.js image
  // pipeline, so keep formats modern and caching long-lived.
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30
  },
  // The sandbox preview proxies the dev server through its own host, so allow
  // that origin for dev-only requests. Production behaviour is unaffected.
  allowedDevOrigins: ["*.e2b.app"]
};

export default nextConfig;
