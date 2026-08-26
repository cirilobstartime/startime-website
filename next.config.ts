import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000",
      },
    ];
    const privateSurfaceHeaders = [
      ...securityHeaders,
      {
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive, nosnippet",
      },
      {
        key: "Cache-Control",
        value: "private, no-store, max-age=0",
      },
    ];
    const publicMediaHeaders = [
      ...securityHeaders,
      {
        key: "X-Robots-Tag",
        value: "noindex, noarchive, nosnippet",
      },
      {
        key: "Cache-Control",
        value: "public, max-age=604800, stale-while-revalidate=86400",
      },
    ];
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/content-admin/:path*",
        headers: privateSurfaceHeaders,
      },
      {
        source: "/api/:path*",
        headers: privateSurfaceHeaders,
      },
      {
        source: "/api/media/file/:path*",
        headers: publicMediaHeaders,
      },
      {
        source: "/assets/:path*",
        headers: publicMediaHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.startime.sa",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default withPayload(nextConfig);
