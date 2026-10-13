import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Assets are served from the CDN; server code reads src/generated/asset-manifest.json instead, so keep them out of functions.
  outputFileTracingExcludes: { "/*": ["public/**"] },
  // 90 is for screenshots with fine text (case files ask for it per image).
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 90] },
  // Analytics go through this site (/ingest) to PostHog's EU cloud (src/instrumentation-client.ts).
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://eu-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/array/:path*", destination: "https://eu-assets.i.posthog.com/array/:path*" },
      { source: "/ingest/:path*", destination: "https://eu.i.posthog.com/:path*" },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
