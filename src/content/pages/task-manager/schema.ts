import type {
  ContentOverride,
  CtaContent,
  CtaLink,
  ServiceWhyChooseContent,
  ServiceFaqContent,
} from "../../page-schema";
export const taskManagerSections = [
  "hero",
  "introduction",
  "benefits",
  "tools",
  "industries",
  "whyChoose",
  "faq",
  "modules",
  "finalCta",
] as const;
export type TaskManagerSection = (typeof taskManagerSections)[number];
export type TaskCards = {
  heading: string;
  paragraphs: string[];
  order: string[];
  items: Record<string, { title: string; description: string }>;
};
export type TaskManagerContent = {
  seo: {
    title: string;
    absoluteTitle: boolean;
    description: string;
    keywords: string[];
  };
  sectionOrder: TaskManagerSection[];
  enabled: Record<TaskManagerSection, boolean>;
  hero: {
    eyebrowStyle: "large" | "compact";
    eyebrow: string;
    heading: string;
    accent: string;
    paragraphs: string[];
    image: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  introduction: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    itemsLabel: string;
    items: string[];
    listStyle: "chips" | "bullets";
  };
  benefits: TaskCards;
  tools: TaskCards & {
    cta: CtaLink;
    image: string;
    imageAlt: string;
    imageW: number;
    imageH: number;
  };
  industries: TaskCards & {
    image: string;
    imageAlt: string;
    imageW: number;
    imageH: number;
  };
  whyChoose: ServiceWhyChooseContent;
  faq: ServiceFaqContent;
  finalCta: CtaContent;
};
export type TaskManagerOverride = ContentOverride<TaskManagerContent>;
