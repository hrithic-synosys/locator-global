// Node-only read path. Ported from CMS publication/reader.ts against its v1
// JSON Schema (vendored byte-for-byte). No API, database, writer or SQLite use.
import path from "node:path";
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import Ajv from "ajv/dist/2020";
import addFormats from "ajv-formats";
import schema from "./schema-v1.json";
import { isCountryCode, type CountryCode } from "../../../config/countries";
import type { CmsCard, CmsDetail } from "../types";
import { blogHref } from "../urls";
import { siteUrl } from "../../../config/site";
import { PublicationUnavailable } from "./errors";
export { PublicationUnavailable } from "./errors";
export type Pointer = {
  schemaVersion: 1;
  market: CountryCode;
  releaseId: string;
  revision: number;
  manifestSha256: string;
  activatedAt: string;
};
type Header = Pick<
  Pointer,
  "schemaVersion" | "market" | "releaseId" | "revision"
>;
type StoredCard = CmsCard & {
  tags: (string | { id: string; name: string; slug: string })[];
  description: string;
  keywords: string[];
};
type Entry = {
  id: string;
  slug: string;
  editorialRevision: string;
  publicUrl: string;
  modifiedAt: string;
  featured: boolean;
  relatedIds: string[];
  card: StoredCard;
};
type ArticleFile = Header & {
  editorialRevision: string;
  publicUrl: string;
  modifiedAt: string;
  article: CmsDetail & StoredCard;
  relatedIds: string[];
};
type Redirect = {
  from: string;
  to: string;
  articleId: string;
  publicUrl: string;
  httpStatus: 308;
};
type Removal = {
  slug: string;
  articleId: string;
  removedAt: string;
  reason: "withdrawn";
  httpStatus: 410;
};
type Manifest = Header & {
  articleCount: number;
  files: Record<string, string>;
  media: {
    path: string;
    sha256: string;
    bytes: number;
    mime: string;
    url: string;
  }[];
};

const ajv = new Ajv({ strict: false, allErrors: false, validateFormats: true });
addFormats(ajv);
ajv.addSchema(schema);
const validators = Object.fromEntries(
  ["pointer", "manifest", "catalogue", "article", "redirects", "removals"].map(
    (name) => [name, ajv.compile({ $ref: `${schema.$id}#/$defs/${name}` })]
  )
);
function checked<T>(name: string, value: unknown): T {
  if (!validators[name](value)) throw new PublicationUnavailable();
  return value as T;
}
export const sha256 = (value: Buffer | string) =>
  createHash("sha256").update(value).digest("hex");
function canonical(value: unknown): string {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value && typeof value === "object")
    return (
      "{" +
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => JSON.stringify(key) + ":" + canonical(item))
        .join(",") +
      "}"
    );
  return JSON.stringify(value);
}
async function regularFile(filename: string, marketRoot: string) {
  const real = await fs.realpath(filename);
  if (
    !real.startsWith(marketRoot + path.sep) ||
    !(await fs.lstat(filename)).isFile()
  )
    throw new PublicationUnavailable();
  return fs.readFile(real);
}
export function validatePointer(value: unknown, market: CountryCode): Pointer {
  const pointer = checked<Pointer>("pointer", value);
  if (!isCountryCode(market) || pointer.market !== market)
    throw new PublicationUnavailable();
  return pointer;
}

/** Fresh pin per request. Never select an older release on errors/removals. */
export async function pinRelease(
  root: string,
  market: CountryCode,
  pinnedPointer?: unknown
) {
  try {
    if (!root || !path.isAbsolute(root) || !isCountryCode(market))
      throw new PublicationUnavailable();
    const realRoot = await fs.realpath(root);
    const marketRoot = await fs.realpath(path.join(realRoot, market));
    if (marketRoot !== path.join(realRoot, market))
      throw new PublicationUnavailable();
    let selectedPointer = pinnedPointer;
    if (selectedPointer === undefined) {
      try {
        selectedPointer = JSON.parse(
          (
            await regularFile(path.join(marketRoot, "current.json"), marketRoot)
          ).toString("utf8")
        );
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          // A configured market with no release history can show an initial
          // empty teaser. Never treat a lost/corrupt existing release as empty.
          const history = await fs
            .readdir(path.join(marketRoot, "releases"))
            .catch((failure: NodeJS.ErrnoException) => {
              if (failure.code === "ENOENT") return [];
              throw failure;
            });
          if (history.length === 0)
            throw new PublicationUnavailable("not-initialized");
        }
        throw error;
      }
    }
    const pointer = validatePointer(selectedPointer, market);
    const releaseRoot = path.join(marketRoot, "releases", pointer.releaseId);
    const manifestBytes = await regularFile(
      path.join(releaseRoot, "manifest.json"),
      marketRoot
    );
    if (sha256(manifestBytes) !== pointer.manifestSha256)
      throw new PublicationUnavailable();
    const manifest = checked<Manifest>(
      "manifest",
      JSON.parse(manifestBytes.toString("utf8"))
    );
    const same = (v: Header) => {
      if (
        v.market !== market ||
        v.releaseId !== pointer.releaseId ||
        v.revision !== pointer.revision
      )
        throw new PublicationUnavailable();
    };
    same(manifest);
    const files: Record<string, unknown> = {};
    for (const [filename, hash] of Object.entries(manifest.files)) {
      const bytes = await regularFile(
        path.join(releaseRoot, filename),
        marketRoot
      );
      if (sha256(bytes) !== hash) throw new PublicationUnavailable();
      files[filename] = JSON.parse(bytes.toString("utf8"));
    }
    const catalogue = checked<Header & { items: Entry[] }>(
      "catalogue",
      files["catalogue.json"]
    );
    const redirects = checked<Header & { entries: Redirect[] }>(
      "redirects",
      files["redirects.json"]
    );
    const removals = checked<Header & { entries: Removal[] }>(
      "removals",
      files["removals.json"]
    );
    same(catalogue);
    same(redirects);
    same(removals);
    const articles = new Map<string, ArticleFile>();
    const bySlug = new Map<string, Entry>();
    for (const entry of catalogue.items) {
      const article = checked<ArticleFile>(
        "article",
        files[`articles/${entry.id}.json`]
      );
      same(article);
      if (
        article.article.market !== market ||
        article.article.id !== entry.id ||
        article.article.slug !== entry.slug ||
        article.editorialRevision !== entry.editorialRevision ||
        article.publicUrl !== entry.publicUrl ||
        entry.publicUrl !== new URL(blogHref(market, entry.slug), siteUrl).href
      )
        throw new PublicationUnavailable();
      if (
        entry.modifiedAt !== article.modifiedAt ||
        article.modifiedAt !== article.article.updatedAt ||
        canonical(entry.relatedIds) !== canonical(article.relatedIds)
      )
        throw new PublicationUnavailable();
      const detailFields = new Set([
        "content",
        "author",
        "summary",
        "seo",
        "updatedAt",
        "contentVersion",
      ]);
      const card = Object.fromEntries(
        Object.entries(article.article).filter(
          ([key]) => !detailFields.has(key)
        )
      );
      if (
        canonical(entry.card) !== canonical(card) ||
        bySlug.has(entry.slug) ||
        articles.has(entry.id)
      )
        throw new PublicationUnavailable();
      if (Date.parse(article.article.publishedAt) > Date.now())
        throw new PublicationUnavailable();
      bySlug.set(entry.slug, entry);
      articles.set(entry.id, article);
    }
    for (const entry of catalogue.items)
      if (entry.relatedIds.some((id) => id === entry.id || !articles.has(id)))
        throw new PublicationUnavailable();
    if (
      manifest.articleCount !== articles.size ||
      Object.keys(files).length !== articles.size + 3
    )
      throw new PublicationUnavailable();
    const redirectMap = new Map(redirects.entries.map((r) => [r.from, r]));
    const removalMap = new Map(removals.entries.map((r) => [r.slug, r]));
    if (
      redirectMap.size !== redirects.entries.length ||
      removalMap.size !== removals.entries.length
    )
      throw new PublicationUnavailable();
    for (const redirect of redirectMap.values()) {
      const target = bySlug.get(redirect.to);
      if (
        bySlug.has(redirect.from) ||
        removalMap.has(redirect.from) ||
        !target ||
        target.id !== redirect.articleId ||
        target.publicUrl !== redirect.publicUrl ||
        redirectMap.has(redirect.to)
      )
        throw new PublicationUnavailable();
    }
    for (const removal of removalMap.values())
      if (bySlug.has(removal.slug)) throw new PublicationUnavailable();
    return {
      pointer,
      manifest,
      catalogue,
      lookup(slug: string) {
        const entry = bySlug.get(slug);
        if (entry)
          return { status: 200 as const, value: articles.get(entry.id)! };
        const redirect = redirectMap.get(slug);
        if (redirect) return { status: 308 as const, value: redirect };
        const removal = removalMap.get(slug);
        if (removal) return { status: 410 as const, value: removal };
        return { status: 404 as const };
      },
      list({
        page = 1,
        limit = 12,
        q = "",
        tag = "",
        featured,
      }: {
        page?: number;
        limit?: number;
        q?: string;
        tag?: string;
        featured?: boolean;
      } = {}) {
        if (
          !Number.isSafeInteger(page) ||
          page < 1 ||
          !Number.isSafeInteger(limit) ||
          limit < 1 ||
          limit > 50
        )
          throw new Error("Invalid listing bounds");
        const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
        const entries = catalogue.items.filter(
          (e) =>
            (featured === undefined || e.featured === featured) &&
            (!tag ||
              e.card.tags.some(
                (t) => typeof t === "object" && t.slug === tag
              )) &&
            tokens.every((token) =>
              `${e.card.title} ${e.card.excerpt} ${e.card.description} ${e.card.keywords.join(" ")}`
                .toLowerCase()
                .includes(token)
            )
        );
        return {
          items: entries
            .slice((page - 1) * limit, page * limit)
            .map((e) => e.card),
          pagination: {
            page,
            limit,
            total: entries.length,
            pages: Math.ceil(entries.length / limit),
          },
        };
      },
      related(slug: string, limit = 3) {
        if (!Number.isSafeInteger(limit) || limit < 1 || limit > 12)
          throw new Error("Invalid related limit");
        const entry = bySlug.get(slug);
        if (!entry) return [];
        return [
          ...new Set([
            ...entry.relatedIds,
            ...catalogue.items.map((e) => e.id),
          ]),
        ]
          .filter((id) => id !== entry.id && articles.has(id))
          .slice(0, limit)
          .map((id) => articles.get(id)!.article);
      },
      slugs: () =>
        catalogue.items.map((e) => ({
          slug: e.slug,
          market,
          updatedAt: e.modifiedAt,
        })),
    };
  } catch (error) {
    if (error instanceof PublicationUnavailable) throw error;
    throw new PublicationUnavailable();
  }
}
export type PinnedRelease = Awaited<ReturnType<typeof pinRelease>>;
