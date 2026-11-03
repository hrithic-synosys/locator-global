import type { Device } from "@/components/service/tracking-devices/devices-data";
import type {
  ContentOverride,
  CtaContent,
  CtaLink,
  ServiceFaqContent,
  ServiceWhyChooseContent,
  ServiceJourneyContent,
} from "../../page-schema";
export const trackingDeviceSections = [
  "hero",
  "catalog",
  "journey",
  "whyChoose",
  "faq",
  "finalCta",
] as const;
export type TrackingDeviceSection = (typeof trackingDeviceSections)[number];
export type DeviceCard = Device & { linkLabel?: string };
export type TrackingDevicesContent = {
  seo: {
    title: string;
    absoluteTitle: boolean;
    description: string;
    ogTitle: string;
    ogDescription: string;
    keywords: string[];
  };
  sectionOrder: TrackingDeviceSection[];
  enabled: Record<TrackingDeviceSection, boolean>;
  hero: {
    eyebrow: string;
    eyebrowStyle: "large" | "compact";
    heading: string;
    accent: string;
    paragraphs: string[];
    image: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  catalog: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    fullDescriptions: boolean;
    order: string[];
    items: Record<string, DeviceCard>;
  };
  journey: ServiceJourneyContent;
  whyChoose: ServiceWhyChooseContent;
  faq: ServiceFaqContent;
  finalCta: CtaContent;
};
export type TrackingDevicesOverride = ContentOverride<TrackingDevicesContent>;
