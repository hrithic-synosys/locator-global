import "server-only";
import { connection } from "next/server";
import type { CountryCode } from "../../config/countries";
import { listBlogs } from "./client";
import { blogHref, dateLabel } from "./urls";
import type { CmsCard } from "./types";

/** Secondary feeds can fail locally without taking commercial pages down.
 * Callers must display the unavailable state, never masquerade it as empty. */
export async function teaserBlogs(market: CountryCode, limit: number) {
  await connection();
  try {
    return {
      items: (await listBlogs(market, 1, limit)).items,
      unavailable: false,
    };
  } catch {
    return { items: [] as CmsCard[], unavailable: true };
  }
}
export const teaserCard = (post: CmsCard) => ({
  ...post,
  tag: post.category.name,
  date: post.publishedAt,
  dateLabel: dateLabel(post.publishedAt),
  hero: post.banner,
});
export const newsroomCard = (post: CmsCard) => ({
  id: post.id,
  category: "blog" as const,
  tag: post.category.name,
  title: post.title,
  excerpt: post.excerpt,
  image: post.banner?.src || "",
  alt: post.banner?.alt || "",
  date: dateLabel(post.publishedAt),
  href: blogHref(post.market, post.slug),
});
