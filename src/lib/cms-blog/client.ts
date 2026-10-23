import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import type { CountryCode } from "../../config/countries";
import { assertMarket } from "./urls";
import { parseCards, parseDetail, parseList, parseSlugs } from "./validation";

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
export const getBlog = cache(async (market: CountryCode, slug: string) => {
  const r = await request(market, `/${articleSegment(slug)}`, {}, true);
  const article = r.data === null ? null : parseDetail(r.data, r.base, market);
  if (article && article.slug !== slug) throw new CmsRequestError();
  return article;
});
export const getFeaturedBlogs = cache(
  async (market: CountryCode, limit = 6) => {
    bounded(limit, 50);
    const r = await request(market, "/featured", { limit: String(limit) });
    const items = parseCards(r.data, r.base, market);
    if (items.length > limit) throw new CmsRequestError();
    return items;
  }
);
export const getBlogSlugs = cache(async (market: CountryCode) => {
  const r = await request(market, "/slugs");
  return parseSlugs(r.data, market);
});
export const getRelatedBlogs = cache(
  async (market: CountryCode, slug: string, limit = 3) => {
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
