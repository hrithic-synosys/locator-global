import type { CountryCode } from "../../config/countries";

export const BLOG_CACHE_SECONDS = 60;
export const blogCacheTag = (market: CountryCode) =>
  `cms-public-blogs:${market}`;
