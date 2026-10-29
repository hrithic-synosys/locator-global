import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { unstable_cache } from "next/cache";
import { randomUUID } from "node:crypto";
import { BLOG_CACHE_SECONDS, blogCacheTag } from "./cache-policy";
import { articleCanonical } from "./seo";
import type { CountryCode } from "../../config/countries";
import { assertMarket } from "./urls";
import { parseCards, parseDetail, parseList, parseSlugs } from "./validation";

export class CmsRequestError extends Error {
  constructor(public readonly status?: number) {
    super("CMS blog is temporarily unavailable");
    this.name = "CmsRequestError";
  }
}
class MissingPublicBlog extends Error {}

// Cache parsed public values, not HTTP responses: errors and invalid payloads
// must never become successful cache entries. Keep request APIs outside scope.
function publicCache<Args extends unknown[], Result>(
  endpoint: string,
  load: (market: CountryCode, ...args: Args) => Promise<Result>
) {
  return cache(async (market: CountryCode, ...args: Args): Promise<Result> => {
    assertMarket(market);
    await connection();
    const base = apiBase().href;
    const identity = JSON.stringify([
      base,
      market,
      endpoint,
      args.map((value) => [typeof value, value]),
    ]);
    try {
      return await unstable_cache(
        async () => {
          const result = await load(market, ...args);
          // Do not persist negative lookups; newly published/restored slugs work
          // immediately, even if somebody requested them before publication.
          if (result === null) throw new MissingPublicBlog();
          return result;
        },
        ["cms-public-blogs-v1", identity],
        {
          revalidate: BLOG_CACHE_SECONDS,
          tags: [blogCacheTag(market)],
        }
      )();
    } catch (error) {
      if (error instanceof MissingPublicBlog) return null as Result;
      throw error;
    }
  });
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
  const base = apiBase();
  const url = new URL(`sites/${market}/blogs${path}`, base);
  url.search = new URLSearchParams(query).toString();
  // The CMS advertises max-age=60, stale-while-revalidate=300. Each actual
  // origin read uses a unique HTTP URL plus bypass headers so a webhook cannot
  // refill Next's cache from that older upstream representation. This transport
  // nonce is intentionally excluded from the stable application cache identity.
  url.searchParams.set("_locator_fresh", randomUUID());
  let response: Response;
  try {
    response = await fetch(url, {
      credentials: "omit",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, max-age=0",
        Pragma: "no-cache",
      },
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
export const listBlogs = publicCache(
  "list",
  async (
    market: CountryCode,
    page: number = 1,
    limit: number = 12,
    q: string = "",
    tag: string = "",
    featured?: boolean
  ) => {
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
export const getBlog = publicCache(
  "detail",
  async (market: CountryCode, slug: string) => {
    const r = await request(market, `/${articleSegment(slug)}`, {}, true);
    const article =
      r.data === null ? null : parseDetail(r.data, r.base, market);
    if (article && article.slug !== slug) throw new CmsRequestError();
    if (article) articleCanonical(article);
    return article;
  }
);
export const getFeaturedBlogs = publicCache(
  "featured",
  async (market: CountryCode, limit: number = 6) => {
    bounded(limit, 50);
    const r = await request(market, "/featured", { limit: String(limit) });
    const items = parseCards(r.data, r.base, market);
    if (items.length > limit) throw new CmsRequestError();
    return items;
  }
);
export const getBlogSlugs = publicCache(
  "slugs",
  async (market: CountryCode) => {
    const r = await request(market, "/slugs");
    return parseSlugs(r.data, market);
  }
);
export const getRelatedBlogs = publicCache(
  "related",
  async (market: CountryCode, slug: string, limit: number = 3) => {
    bounded(limit, 12);
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
