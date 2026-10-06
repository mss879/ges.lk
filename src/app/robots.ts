import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/site";

/**
 * robots.txt. The admin area is deliberately NOT named here — listing it would
 * advertise the login page to anyone reading this file. Instead every /admin
 * response carries `X-Robots-Tag: noindex` (src/proxy.ts) and a robots noindex
 * meta tag, and /admin never appears in the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
