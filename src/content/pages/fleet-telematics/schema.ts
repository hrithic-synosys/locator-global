import type { ContentOverride, CtaContent, CtaLink } from "../../page-schema";
export const fleetSections = [
  "hero",
  "benefits",
  "showcase",
  "industries",
  "process",
  "statistics",
  "videoPlayer",
  "videoTelematics",
  "whyChoose",
  "blogs",
  "faq",
  "finalCta",
] as const;
export type FleetSection = (typeof fleetSections)[number];
type Ordered<T> = { order: string[]; items: Record<string, T> };
type Copy = { eyebrow: string; heading: string; paragraphs: string[] };
export type FleetContent = {
  seo: {
    title: string;
    absoluteTitle?: boolean;
    description: string;
    keywords?: string[];
    ogTitle: string;
    ogDescription: string;
  };
  sectionOrder: FleetSection[];
  enabled: Record<FleetSection, boolean>;
  hero: {
    label: string;
    heading: string;
    paragraphs: string[];
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
    secondaryIsLink: boolean;
  };
  benefits: Copy &
    Ordered<{ label: string; short: string; assetIndex: number }>;
  showcase: Copy & {
    subheading: string;
    secondaryParagraphs: string[];
  } & Ordered<{ title: string; desc: string; assetIndex: number }>;
  industries: Copy & { cta?: CtaLink; showVehicleTypes: boolean } & Ordered<{
      id: string;
      num: string;
      title: string;
      desc: string;
      vehicles: string[];
      count: number;
      image?: string;
      imageW?: number;
      imageH?: number;
      keywords?: string[];
    }>;
  process: Copy & { closingParagraphs: string[]; cta: CtaLink } & Ordered<{
      num: string;
      title: string;
      desc: string;
      accent: string;
      assetIndex: number;
    }>;
  statistics: {
    heading: string;
    verified: boolean;
    items: Array<{
      value: string;
      label: string;
      side: string;
      row: string;
      icon: string;
    }>;
  };
  videoPlayer: { eyebrow: string; title: string; lead: string };
  videoTelematics: Copy & {
    cta?: CtaLink;
    stats: Array<{ v: string; l: string }>;
  } & Ordered<{ title: string; desc: string; image: string }>;
  whyChoose: Copy &
    Ordered<{
      title: string;
      desc: string;
      accent: string;
      assetIndex: number;
    }>;
  faq: {
    eyebrow: string;
    heading: string;
    categories: Array<{ id: string; label: string }>;
  } & Ordered<{ cat: string; q: string; a: string }>;
  finalCta: CtaContent;
};
export type FleetOverride = ContentOverride<FleetContent>;
