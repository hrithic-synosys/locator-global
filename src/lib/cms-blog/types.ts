import type { CountryCode } from "../../config/countries";

export type ImageData = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};
export type HeadingBlock = {
  _key?: string;
  type: "heading";
  level: 2 | 3;
  html: string;
  tocLabel?: string;
  anchor?: string;
  hideFromToc?: boolean;
};
export type TextBlock =
  | HeadingBlock
  | { _key?: string; type: "p"; html: string }
  | { _key?: string; type: "quote"; html: string; cite?: string }
  | { _key?: string; type: "ul"; items: string[]; style?: "bullet" | "check" }
  | { _key?: string; type: "ol"; items: string[] };
export type TableData = { caption?: string; head: string[]; rows: string[][] };
export type BlogBlock =
  | TextBlock
  | ({ _key?: string; type: "table" } & TableData)
  | { _key?: string; type: "image"; image: ImageData }
  | {
      _key?: string;
      type: "overlay";
      image: ImageData;
      align: "left" | "right";
      kicker?: string;
      blocks: TextBlock[];
      cta?: { label: string; href: string };
    }
  | {
      _key?: string;
      type: "split";
      mediaSide: "left" | "right";
      tone?: "plain" | "tint";
      kicker?: string;
      media:
        | { kind: "image"; image: ImageData }
        | { kind: "table"; table: TableData };
      blocks: TextBlock[];
    };
export type ArticleAuthor = {
  name: string;
  role?: string | null;
  avatar?: ImageData | null;
};
export type ArticleSummary = {
  heading?: string | null;
  text: string;
  icon?: "truck" | "pin" | "chart";
};
export type CmsCategory = {
  id: string;
  name: string;
  slug: "blog";
  description?: string | null;
  sortOrder?: number;
  allowedFormats?: string[];
};
export type CmsCard = {
  id: string;
  market: CountryCode;
  slug: string;
  title: string;
  excerpt: string;
  format: "article";
  category: CmsCategory;
  publishedAt: string;
  readingMinutes: number;
  banner: ImageData | null;
};
export type RelatedArticle = Omit<CmsCard, "format">;
export type CmsDetail = CmsCard & {
  updatedAt: string;
  contentVersion: 2;
  author: ArticleAuthor | null;
  summary: ArticleSummary | null;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
    ogImage?: string;
  };
  content: BlogBlock[];
};
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};
export type CmsList = { items: CmsCard[]; pagination: Pagination };
export type CmsSlug = { slug: string; market: CountryCode; updatedAt: string };
