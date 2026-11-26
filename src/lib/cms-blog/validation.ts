import { isCountryCode, type CountryCode } from "../../config/countries";
import type {
  BlogBlock,
  CmsCard,
  CmsDetail,
  CmsList,
  CmsSlug,
  CompanyNewsCard,
  CompanyNewsDetail,
  CompanyNewsList,
  ImageData,
  MediaCard,
  MediaDetail,
  MediaList,
  ProductUpdateCard,
  ProductUpdateDetail,
  ProductUpdateList,
  RelatedArticle,
} from "./types";
import {
  CMS_COLLECTIONS,
  type CmsCollection,
  type MediaCollection,
} from "./collections";
import { mediaUrl as resolveMediaUrl, safeHref } from "./urls";
export class CmsPayloadError extends Error {
  constructor() {
    super("CMS blog returned an invalid or out-of-scope payload");
    this.name = "CmsPayloadError";
  }
}
const fail = (): never => {
  throw new CmsPayloadError();
};
function mediaUrl(value: string, base: string): string {
  try {
    return resolveMediaUrl(value, base);
  } catch {
    return fail();
  }
}
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : fail();
const str = (v: unknown): string => (typeof v === "string" ? v : fail());
const arr = (v: unknown): unknown[] =>
  Array.isArray(v) && v.length <= 10000 ? v : fail();
const num = (v: unknown, min = 0): number =>
  typeof v === "number" && Number.isFinite(v) && v >= min ? v : fail();
const integer = (v: unknown, min = 0): number =>
  Number.isInteger(num(v, min)) ? (v as number) : fail();
const date = (v: unknown): string =>
  Number.isFinite(Date.parse(str(v))) ? (v as string) : fail();
const optional = (v: unknown): string | undefined =>
  v === undefined ? undefined : str(v);
const strings = (v: unknown): string[] => arr(v).map(str);
const slug = (v: unknown): string =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str(v)) && (v as string).length <= 240
    ? (v as string)
    : fail();
function image(v: unknown, base: string): ImageData {
  const o = obj(v);
  return {
    src: mediaUrl(str(o.src), base),
    alt: str(o.alt),
    width: num(o.width, 1),
    height: num(o.height, 1),
    ...(o.caption === undefined ? {} : { caption: str(o.caption) }),
  };
}
function table(v: unknown) {
  const o = obj(v);
  const head = strings(o.head),
    rows = arr(o.rows).map(strings);
  if (rows.some((r) => head.length > 0 && r.length !== head.length)) fail();
  return {
    head,
    rows,
    ...(o.caption === undefined ? {} : { caption: str(o.caption) }),
  };
}
function block(v: unknown, base: string, nested = false): BlogBlock {
  const o = obj(v),
    key = o._key === undefined ? {} : { _key: str(o._key) };
  switch (o.type) {
    case "heading":
      if (![2, 3].includes(o.level as number)) fail();
      if (o.hideFromToc !== undefined && typeof o.hideFromToc !== "boolean")
        fail();
      return {
        ...key,
        type: "heading",
        level: o.level as 2 | 3,
        html: str(o.html),
        anchor: optional(o.anchor),
        tocLabel: optional(o.tocLabel),
        hideFromToc: o.hideFromToc as boolean | undefined,
      };
    case "p":
      return { ...key, type: "p", html: str(o.html) };
    case "quote":
      return {
        ...key,
        type: "quote",
        html: str(o.html),
        cite: optional(o.cite),
      };
    case "ul":
      if (o.style !== undefined && !["bullet", "check"].includes(str(o.style)))
        fail();
      return {
        ...key,
        type: "ul",
        items: strings(o.items),
        style: o.style as "bullet" | "check" | undefined,
      };
    case "ol":
      return { ...key, type: "ol", items: strings(o.items) };
  }
  if (nested) return fail();
  switch (o.type) {
    case "image":
      return { ...key, type: "image", image: image(o.image, base) };
    case "table":
      return { ...key, type: "table", ...table(o) };
    case "overlay": {
      if (!["left", "right"].includes(str(o.align))) fail();
      const c = o.cta === undefined ? undefined : obj(o.cta);
      if (c && !safeHref(str(c.href))) fail();
      return {
        ...key,
        type: "overlay",
        align: o.align as "left" | "right",
        image: image(o.image, base),
        kicker: optional(o.kicker),
        blocks: arr(o.blocks).map((v) =>
          block(v, base, true)
        ) as import("./types").TextBlock[],
        ...(c ? { cta: { label: str(c.label), href: str(c.href) } } : {}),
      };
    }
    case "split": {
      if (
        !["left", "right"].includes(str(o.mediaSide)) ||
        (o.tone !== undefined && !["plain", "tint"].includes(str(o.tone)))
      )
        fail();
      const m = obj(o.media);
      if (!["image", "table"].includes(str(m.kind))) fail();
      return {
        ...key,
        type: "split",
        mediaSide: o.mediaSide as "left" | "right",
        tone: o.tone as "plain" | "tint" | undefined,
        kicker: optional(o.kicker),
        media:
          m.kind === "image"
            ? { kind: "image", image: image(m.image, base) }
            : { kind: "table", table: table(m.table) },
        blocks: arr(o.blocks).map((v) =>
          block(v, base, true)
        ) as import("./types").TextBlock[],
      };
    }
    default:
      return fail();
  }
}
/** Video links open in a new tab or a privacy embed; only plain web URLs pass. */
function videoUrl(v: unknown): string {
  const value = str(v);
  return /^https:\/\//i.test(value) && safeHref(value) ? value : fail();
}
// Shared card checks for every collection: exact market, category, allowed
// format, publication and content version. Related cards may omit `format`
// (it then means "article", as the Blog contract allows).
function collectionCard(
  v: unknown,
  base: string,
  market: CountryCode,
  collection: CmsCollection,
  related = false
) {
  const o = obj(v),
    c = obj(o.category),
    scope = CMS_COLLECTIONS[collection],
    format = related && o.format === undefined ? "article" : o.format;
  if (
    !isCountryCode(market) ||
    o.market !== market ||
    c.slug !== scope.categorySlug ||
    !(scope.formats as readonly unknown[]).includes(format) ||
    (o.status !== undefined && o.status !== "published") ||
    (o.contentVersion !== undefined && o.contentVersion !== 2)
  )
    fail();
  const publishedAt = date(o.publishedAt);
  if (Date.parse(publishedAt) > Date.now()) fail();
  return {
    o,
    format: format as string,
    card: {
      id: str(o.id),
      market,
      slug: slug(o.slug),
      title: str(o.title),
      excerpt: str(o.excerpt),
      category: { id: str(c.id), name: str(c.name) },
      publishedAt,
      readingMinutes: integer(o.readingMinutes),
      banner: o.banner === null ? null : image(o.banner, base),
    },
  };
}
function card(
  v: unknown,
  base: string,
  market: CountryCode,
  related = false
): CmsCard {
  const { card } = collectionCard(v, base, market, "blogs", related);
  return {
    ...card,
    format: "article",
    category: { ...card.category, slug: "blog" },
  };
}
// Article + video collections (Company News, Product Updates) share one card shape.
function mediaCard<C extends MediaCollection>(
  collection: C,
  v: unknown,
  base: string,
  market: CountryCode,
  related = false
): MediaCard<C> {
  const { o, format, card } = collectionCard(v, base, market, collection, related);
  return {
    ...card,
    format: format as MediaCard<C>["format"],
    category: { ...card.category, slug: collection },
    // A video without a playable link is an invalid record, not an empty one.
    videoUrl: format === "video" ? videoUrl(o.videoUrl) : null,
  };
}
const companyNewsCard = (
  v: unknown,
  base: string,
  market: CountryCode,
  related = false
): CompanyNewsCard => mediaCard("company-news", v, base, market, related);
const envelope = (v: unknown) => {
  const o = obj(v);
  if (o.success !== true) fail();
  return o;
};
function unique<T extends { slug: string }>(items: T[]): T[] {
  if (new Set(items.map((i) => i.slug)).size !== items.length) fail();
  return items;
}
function list<T extends { slug: string }>(
  v: unknown,
  parse: (v: unknown) => T
): { items: T[]; pagination: CmsList["pagination"] } {
  const o = envelope(v),
    p = obj(o.pagination),
    items = unique(arr(o.items).map(parse));
  const pagination = {
    page: integer(p.page, 1),
    limit: integer(p.limit, 1),
    total: integer(p.total),
    pages: integer(p.pages),
  };
  if (
    pagination.limit > 50 ||
    pagination.pages !== Math.ceil(pagination.total / pagination.limit) ||
    items.length > pagination.limit ||
    items.length > pagination.total
  )
    fail();
  const expected = Math.max(
    0,
    Math.min(
      pagination.limit,
      pagination.total - (pagination.page - 1) * pagination.limit
    )
  );
  if (items.length !== expected) fail();
  return { items, pagination };
}
export const parseList = (
  v: unknown,
  base: string,
  market: CountryCode
): CmsList => list(v, (item) => card(item, base, market));
export const parseCompanyNewsList = (
  v: unknown,
  base: string,
  market: CountryCode
): CompanyNewsList => list(v, (item) => companyNewsCard(item, base, market));
export const parseMediaList = <C extends MediaCollection>(
  collection: C,
  v: unknown,
  base: string,
  market: CountryCode
): MediaList<C> => list(v, (item) => mediaCard(collection, item, base, market));
export const parseProductUpdateList = (
  v: unknown,
  base: string,
  market: CountryCode
): ProductUpdateList => parseMediaList("product-updates", v, base, market);
export const parseCards = (
  v: unknown,
  base: string,
  market: CountryCode,
  related = false
): RelatedArticle[] =>
  unique(arr(envelope(v).items).map((v) => card(v, base, market, related)));
export const parseCompanyNewsCards = (
  v: unknown,
  base: string,
  market: CountryCode,
  related = false
): CompanyNewsCard[] =>
  unique(
    arr(envelope(v).items).map((v) => companyNewsCard(v, base, market, related))
  );
export const parseMediaCards = <C extends MediaCollection>(
  collection: C,
  v: unknown,
  base: string,
  market: CountryCode,
  related = false
): MediaCard<C>[] =>
  unique(
    arr(envelope(v).items).map((v) => mediaCard(collection, v, base, market, related))
  );
export const parseProductUpdateCards = (
  v: unknown,
  base: string,
  market: CountryCode,
  related = false
): ProductUpdateCard[] => parseMediaCards("product-updates", v, base, market, related);
export const parseDetail = (
  v: unknown,
  base: string,
  market: CountryCode
): CmsDetail => detail(v, base, (o) => card(o, base, market));
export const parseCompanyNewsDetail = (
  v: unknown,
  base: string,
  market: CountryCode
): CompanyNewsDetail => detail(v, base, (o) => companyNewsCard(o, base, market));
export const parseMediaDetail = <C extends MediaCollection>(
  collection: C,
  v: unknown,
  base: string,
  market: CountryCode
): MediaDetail<C> => detail(v, base, (o) => mediaCard(collection, o, base, market));
export const parseProductUpdateDetail = (
  v: unknown,
  base: string,
  market: CountryCode
): ProductUpdateDetail => parseMediaDetail("product-updates", v, base, market);
function detail<C extends CmsCard | MediaCard>(
  v: unknown,
  base: string,
  parseCard: (o: Record<string, unknown>) => C
): C & Omit<CmsDetail, keyof CmsCard> {
  const o = obj(envelope(v).article),
    c = parseCard(o),
    seo = obj(o.seo);
  if (o.contentVersion !== 2) fail();
  const a = o.author === null ? null : obj(o.author),
    s = o.summary === null ? null : obj(o.summary);
  if (s && !["truck", "pin", "chart"].includes(str(s.icon))) fail();
  const canonicalUrl = optional(seo.canonicalUrl);
  if (
    canonicalUrl &&
    (!safeHref(canonicalUrl) || !/^https?:\/\//.test(canonicalUrl))
  )
    fail();
  return {
    ...c,
    contentVersion: 2,
    updatedAt: date(o.updatedAt),
    author: a
      ? {
          name: str(a.name),
          role: a.role == null ? null : str(a.role),
          avatar: a.avatar == null ? null : image(a.avatar, base),
        }
      : null,
    summary: s
      ? {
          heading: s.heading == null ? null : str(s.heading),
          text: str(s.text),
          icon: s.icon as "truck" | "pin" | "chart",
        }
      : null,
    seo: {
      title: str(seo.title),
      description: str(seo.description),
      keywords: strings(seo.keywords),
      ...(canonicalUrl ? { canonicalUrl } : {}),
      ...(seo.ogImage ? { ogImage: mediaUrl(str(seo.ogImage), base) } : {}),
    },
    content: arr(o.content).map((v) => block(v, base)),
  } as C & Omit<CmsDetail, keyof CmsCard>;
}
export function parseSlugs(v: unknown, market: CountryCode): CmsSlug[] {
  return unique(
    arr(envelope(v).items).map((v) => {
      const o = obj(v);
      if (!isCountryCode(market) || o.market !== market) fail();
      return {
        slug: slug(o.slug),
        market,
        updatedAt: date(o.updatedAt),
      };
    })
  );
}
