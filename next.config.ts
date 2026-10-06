import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        // Project, site and blog photographs uploaded through /admin into Supabase Storage.
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Social-card fonts and artwork, read with fs by opengraph-image routes. Most
  // cards are built at deploy time, but new blog posts render theirs on demand.
  outputFileTracingIncludes: {
    "/**/opengraph-image*": ["./src/assets/og/**/*"],
    "/opengraph-image*": ["./src/assets/og/**/*"],
  },
  async headers() {
    return [
      {
        // The chat API is never something to index. (/admin gets the same
        // header from src/proxy.ts, which runs on every admin request.)
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
