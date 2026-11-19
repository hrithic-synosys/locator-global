// Public CMS collections the website reads. Each one is a CMS category served
// per market at /api/v1/sites/{market}/{apiPath}, with its own Data Cache tag,
// webhook and public URL. Keep in sync with the CMS backend's PUBLIC_COLLECTIONS.
export const CMS_COLLECTIONS = {
  blogs: {
    apiPath: "blogs",
    categorySlug: "blog",
    formats: ["article"],
    /** Public URL segment under /about/newsroom. */
    route: "blog",
    label: "Blog",
    cacheKey: "cms-public-blogs-v1",
    tagPrefix: "cms-public-blogs",
    invalidated: "market_blogs",
  },
  "company-news": {
    apiPath: "company-news",
    categorySlug: "company-news",
    formats: ["article", "video"],
    route: "company-news",
    label: "Company News",
    cacheKey: "cms-public-company-news-v1",
    tagPrefix: "cms-public-company-news",
    invalidated: "market_company_news",
  },
} as const;

export type CmsCollection = keyof typeof CMS_COLLECTIONS;
export type CmsCollectionConfig = (typeof CMS_COLLECTIONS)[CmsCollection];
