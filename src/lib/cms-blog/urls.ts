import {
  countries,
  isCountryCode,
  type CountryCode,
} from "../../config/countries";
import { countryPath } from "../country/paths";

export function assertMarket(value: unknown): asserts value is CountryCode {
  if (
    typeof value !== "string" ||
    !isCountryCode(value) ||
    !countries[value].enabled
  ) {
    throw new Error("Unsupported CMS blog market");
  }
}
export function newsroomHref(market: CountryCode): string {
  assertMarket(market);
  return `${countries[market].prefix}/about/newsroom`;
}
export const blogBase = (market: CountryCode) => `${newsroomHref(market)}/blog`;
export const blogHref = (market: CountryCode, slug: string) =>
  `${blogBase(market)}/${encodeURIComponent(slug)}`;
export const dateLabel = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export function safeHref(value: string): string {
  if (!value || /[\u0000-\u0020\u007f\\]/.test(value)) return "";
  if (value.startsWith("#")) return value;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? value
      : "";
  } catch {
    return "";
  }
}

/** Only commercial page links follow the active market. Editorial and explicit
 * country destinations remain intentional; never infer article equivalence. */
export function contentHref(value: string, market: CountryCode): string {
  const href = safeHref(value);
  return /^\/(?:get-a-quote|get-a-free-demo|contact|software|industries|service)(?:[/?#]|$)/.test(
    href
  )
    ? countryPath(href, market)
    : href;
}

export function mediaUrl(value: string, apiBase: string): string {
  if (
    !safeHref(value) ||
    !(value.startsWith("/") || /^https?:\/\//i.test(value))
  )
    throw new Error("Invalid CMS media URL");
  return value.startsWith("/uploads/")
    ? new URL(value, new URL(apiBase).origin).href
    : value;
}
export const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export type BlogFilters = {
  page: number;
  q: string;
  tag: string;
  featured?: boolean;
};
export function readBlogFilters(
  search: Record<string, string | string[] | undefined>
): BlogFilters {
  const single = (key: string) =>
    typeof search[key] === "string" ? (search[key] as string) : "";
  const rawPage = single("page");
  const page =
    /^\d{1,7}$/.test(rawPage) && Number(rawPage) >= 1 ? Number(rawPage) : 1;
  const tag = single("tag");
  return {
    page,
    q: single("q").trim().slice(0, 200),
    tag: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag) ? tag : "",
    ...(single("featured") === "true"
      ? { featured: true }
      : single("featured") === "false"
        ? { featured: false }
        : {}),
  };
}
export function blogPageHref(
  market: CountryCode,
  filters: BlogFilters,
  page: number
): string {
  const query = new URLSearchParams();
  if (page > 1) query.set("page", String(page));
  if (filters.q) query.set("q", filters.q);
  if (filters.tag) query.set("tag", filters.tag);
  if (filters.featured !== undefined)
    query.set("featured", String(filters.featured));
  return blogBase(market) + (query.size ? `?${query}` : "");
}
