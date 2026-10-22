import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { hasIndexableMarkets } from '@/config/indexing';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Crawl must be allowed so engines can observe page-level noindex.
      allow: "/",
      disallow: ['/api/', '/_next/'],
    },
    sitemap: hasIndexableMarkets() ? `${siteUrl}/sitemap.xml` : undefined,
    host: siteUrl,
  };
}
