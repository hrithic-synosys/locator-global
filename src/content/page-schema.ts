export type ContentOverride<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: ContentOverride<T[K]> }
    : T;
export type CtaLink = { label: string; href: string };
export type BlogFeedContent = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  allArticlesLabel: string;
};
export type CtaContent = {
  eyebrow: string;
  heading: string;
  accent?: string;
  paragraphs: string[];
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  trustItems: string[];
};
export type ContentCard = {
  title: string;
  description: string;
  icon?: "camera" | "shield" | "monitor" | "cargo" | "cost";
  image?: string;
};
export type CardSection = {
  heading: string;
  paragraphs: string[];
  order: string[];
  items: Record<string, ContentCard>;
};
