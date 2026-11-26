import type { CountryCode } from "../../config/countries";
import { CMS_COLLECTIONS, type CmsCollection } from "./collections";

export const BLOG_CACHE_SECONDS = 60;
/** One tag per collection and market, so a webhook only expires that feed. */
export const cmsCacheTag = (collection: CmsCollection, market: CountryCode) =>
  `${CMS_COLLECTIONS[collection].tagPrefix}:${market}`;
export const blogCacheTag = (market: CountryCode) =>
  cmsCacheTag("blogs", market);
export const companyNewsCacheTag = (market: CountryCode) =>
  cmsCacheTag("company-news", market);
export const productUpdatesCacheTag = (market: CountryCode) =>
  cmsCacheTag("product-updates", market);
