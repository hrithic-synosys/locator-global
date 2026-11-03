import { DEVICES } from "@/components/service/tracking-devices/devices-data";
import { softwareCtaContent } from "../../shared/software-cta";
import type { TrackingDevicesContent } from "./schema";
// Original page and catalogue, preserved for countries and existing callers.
export const sharedTrackingDevices: TrackingDevicesContent = {
  seo: {
    title: "Tracking Devices & Accessories — Service",
    absoluteTitle: false,
    description:
      "GPS trackers, driver-ID readers, fuel and temperature sensors, and CAN adapters supplied, installed, and configured by Locator across the UAE.",
    ogTitle: "Tracking Devices & Accessories | Locator",
    ogDescription:
      "Certified Teltonika GPS terminals, iButton and RFID driver ID, fuel and temperature sensors — all feeding the LOCATOR platform.",
    keywords: [],
  },
  sectionOrder: ["hero", "catalog", "finalCta"],
  enabled: {
    hero: true,
    catalog: true,
    journey: false,
    whyChoose: false,
    faq: false,
    finalCta: true,
  },
  hero: {
    eyebrow: "GPS Tracking Devices",
    eyebrowStyle: "large",
    heading: "The hardware behind\nevery Locator install.",
    accent: "Locator",
    paragraphs: [
      "A great platform always needs great hardware. Certified GPS terminals, driver-ID readers, and sensors — supplied, installed, and configured by our own engineers.",
    ],
    image: "/services/tracking-devices-hero-banner.webp",
    primaryCta: { label: "Request device pricing", href: "/contact" },
    secondaryCta: { label: "Talk to an engineer", href: "/contact" },
  },
  catalog: {
    eyebrow: "Tracking Devices & Accessories",
    heading: "A great platform needs great hardware.",
    paragraphs: [
      "Certified GPS terminals, driver-ID readers, and sensors — supplied, installed, and configured by our own engineers.",
    ],
    fullDescriptions: false,
    order: DEVICES.map((device) => device.slug),
    items: Object.fromEntries(DEVICES.map((device) => [device.slug, device])),
  },
  journey: {
    heading: "",
    paragraphs: [],
    order: [],
    items: {},
    cta: { label: "", href: "/contact" },
  },
  whyChoose: {
    eyebrow: "Why LOCATOR",
    heading: "",
    paragraphs: [],
    order: [],
    items: {},
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Frequently asked questions",
    categories: [],
    order: [],
    items: {},
  },
  finalCta: softwareCtaContent,
};
