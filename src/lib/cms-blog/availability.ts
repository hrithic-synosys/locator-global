import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import type { CountryCode } from "../../config/countries";
import { assertMarket } from "./urls";
import { getBlog, getRelatedBlogs, listBlogs } from "./client";

// Recover expected delivery failures at the presentation boundary. The strict
// API client still distinguishes outages, invalid payloads and genuine absence.
// connection() stays outside catch so Next's prerender boundary is not swallowed.
export const loadBlogFeed = cache(
  async (
    market: CountryCode,
    page = 1,
    limit = 12,
    q = "",
    tag = "",
    featured?: boolean
  ) => {
    assertMarket(market);
    await connection();
    try {
      const result = await listBlogs(market, page, limit, q, tag, featured);
      return { state: "ready" as const, ...result };
    } catch {
      return { state: "unavailable" as const };
    }
  }
);

export const loadBlogArticle = cache(
  async (market: CountryCode, slug: string) => {
    assertMarket(market);
    await connection();
    try {
      const article = await getBlog(market, slug);
      return article
        ? { state: "ready" as const, article }
        : { state: "not-found" as const };
    } catch {
      return { state: "unavailable" as const };
    }
  }
);

export const loadRelatedBlogs = cache(
  async (market: CountryCode, slug: string) => {
    assertMarket(market);
    await connection();
    try {
      const items = await getRelatedBlogs(market, slug);
      return items === null
        ? { state: "not-found" as const }
        : { state: "ready" as const, items };
    } catch {
      return { state: "unavailable" as const };
    }
  }
);
