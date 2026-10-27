import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import type { CountryCode } from "../../config/countries";
import { assertMarket } from "./urls";
import { parseCards, parseDetail, parseList, parseSlugs } from "./validation";
import { blogContentSource } from "./source";
import { siteUrl } from "../../config/site";

async function stored(market: CountryCode) {
  assertMarket(market);
  return (await import("./publication/request")).publishedRelease(market);
}

export class CmsRequestError extends Error {
  constructor(public readonly status?: number) {
    super("CMS blog is temporarily unavailable");
    this.name = "CmsRequestError";
  }
}
export function apiBase(): URL {
  const value = process.env.CMS_API_BASE_URL;
  let url: URL;
  try {
    url = new URL(value || "");
  } catch {
    throw new CmsRequestError();
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname.replace(/\/$/, "") !== "/api/v1"
  ) {
    throw new CmsRequestError();
  }
  url.pathname = "/api/v1/";
  return url;
}
async function request(
  market: CountryCode,
  path = "",
  query: Record<string, string> = {},
  allow404 = false
) {
  assertMarket(market);
  // Request rendering + no persistent Next cache: new publications need no build.
  // React memoization includes market; the upstream API cache still applies.
  await connection();
  const base = apiBase();
  const url = new URL(`sites/${market}/blogs${path}`, base);
  url.search = new URLSearchParams(query).toString();
  let response: Response;
  try {
    response = await fetch(url, {
      credentials: "omit",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
  } catch {
    throw new CmsRequestError();
  }
  if (response.status === 404 && allow404)
    return { data: null, base: base.href };
  if (!response.ok) throw new CmsRequestError(response.status);
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new CmsRequestError();
  }
  return { data, base: base.href };
}
function bounded(value: number, max: number) {
  if (!Number.isSafeInteger(value) || value < 1 || value > max)
    throw new CmsRequestError(400);
}
function articleSegment(slug: string) {
  if (!slug || slug.length > 240 || slug === "." || slug === "..")
    throw new CmsRequestError(400);
  return encodeURIComponent(slug);
}
// Primitive arguments keep identical page/metadata requests memoized by all
// scope/filter dimensions, rather than object identity or a slug-only key.
export const listBlogs = cache(
  async (
    market: CountryCode,
    page = 1,
    limit = 12,
    q = "",
    tag = "",
    featured?: boolean
  ) => {
    assertMarket(market);
    bounded(page, Number.MAX_SAFE_INTEGER);
    bounded(limit, 50);
    if (
      typeof q !== "string" ||
      q.length > 200 ||
      typeof tag !== "string" ||
      (tag && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)) ||
      (featured !== undefined && typeof featured !== "boolean")
    )
      throw new CmsRequestError(400);
    if (blogContentSource() === "published") {
      const release = await stored(market);
      const result = release.list({ page, limit, q, tag, featured });
      return parseList({ success: true, ...result }, siteUrl, market);
    }
    const query: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (q) query.q = q;
    if (tag) query.tag = tag;
    if (featured !== undefined) query.featured = String(featured);
    const r = await request(market, "", query);
    const result = parseList(r.data, r.base, market);
    if (result.pagination.page !== page || result.pagination.limit !== limit)
      throw new CmsRequestError();
    return result;
  }
);
export const getBlog = cache(async (market: CountryCode, slug: string) => {
  assertMarket(market);
  articleSegment(slug);
  if (blogContentSource() === "published") {
    const result = (await stored(market)).lookup(slug);
    return result.status === 200
      ? parseDetail(
          { success: true, article: result.value.article },
          siteUrl,
          market
        )
      : null; // Proxy owns exact 308/410/404 HTTP responses before streaming.
  }
  const r = await request(market, `/${articleSegment(slug)}`, {}, true);
  const article = r.data === null ? null : parseDetail(r.data, r.base, market);
  if (article && article.slug !== slug) throw new CmsRequestError();
  return article;
});
export const getFeaturedBlogs = cache(
  async (market: CountryCode, limit = 6) => {
    assertMarket(market);
    bounded(limit, 50);
    if (blogContentSource() === "published") {
      const items = (await stored(market)).list({
        featured: true,
        limit,
      }).items;
      return parseCards(
        { success: true, items },
        siteUrl,
        market
      ) as import("./types").CmsCard[];
    }
    const r = await request(market, "/featured", { limit: String(limit) });
    const items = parseCards(r.data, r.base, market);
    if (items.length > limit) throw new CmsRequestError();
    return items;
  }
);
export const getBlogSlugs = cache(async (market: CountryCode) => {
  assertMarket(market);
  if (blogContentSource() === "published")
    return (await stored(market)).slugs();
  const r = await request(market, "/slugs");
  return parseSlugs(r.data, market);
});
export const getRelatedBlogs = cache(
  async (market: CountryCode, slug: string, limit = 3) => {
    assertMarket(market);
    bounded(limit, 12);
    articleSegment(slug);
    if (blogContentSource() === "published") {
      const items = (await stored(market)).related(slug, limit);
      return parseCards({ success: true, items }, siteUrl, market, true);
    }
    const r = await request(
      market,
      `/${articleSegment(slug)}/related`,
      { limit: String(limit) },
      true
    );
    if (r.data === null) return null;
    const items = parseCards(r.data, r.base, market, true);
    if (items.length > limit || items.some((item) => item.slug === slug))
      throw new CmsRequestError();
    return items;
  }
);
