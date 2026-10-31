import type {
  CardSection,
  ContentOverride,
  CtaContent,
  CtaLink,
  BlogFeedContent,
} from "../../page-schema";
export const videoTelematicsSections = [
  "hero",
  "description",
  "introFeatures",
  "driverAlerts",
  "showcase",
  "journeySteps",
  "industries",
  "whyChoose",
  "video",
  "faq",
  "blogs",
  "finalCta",
] as const;
export type VideoTelematicsSection = (typeof videoTelematicsSections)[number];
export type DriverAlert = {
  title: string;
  description?: string;
  image: string;
  imageW: number;
  imageH: number;
};
export type VideoTelematicsContent = {
  seo: {
    absoluteTitle?: boolean;
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    keywords: string[];
  };
  sectionOrder: VideoTelematicsSection[];
  enabled: Record<VideoTelematicsSection, boolean>;
  hero: {
    label: string;
    heading: string;
    paragraphs: string[];
    image: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  description: { paragraphs: string[]; emphasis: string[] };
  introFeatures: CardSection;
  driverAlerts: {
    detectionLabel?: string;
    heading: string;
    accent: string;
    paragraphs: string[];
    order: string[];
    items: Record<string, DriverAlert>;
  };
  showcase: CardSection & {
    eyebrow: string;
    subheading: string;
    secondaryParagraphs: string[];
    image: string;
    imageAlt: string;
  };
  journeySteps: CardSection & { cta: CtaLink };
  industries: CardSection & { eyebrow: string };
  whyChoose: CardSection & { eyebrow: string };
  faq: {
    heading: string;
    order: string[];
    items: Record<string, { q: string; a: string }>;
  };
  finalCta: CtaContent;
  blogs?: BlogFeedContent;
};
export type VideoTelematicsOverride = ContentOverride<VideoTelematicsContent>;
