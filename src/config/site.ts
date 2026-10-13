// Canonical site URL. Set NEXT_PUBLIC_SITE_URL in the deployment environment
// (e.g. https://locator.ae). The localhost fallback is dev-only — metadata,
// canonical URLs, sitemap and robots all derive from this, so a wrong value
// here silently breaks SEO in production.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const siteConfig = {
  // Used as the title-template suffix on every page — keep it short.
  name: "LOCATOR",
  title: "LOCATOR — Fleet Telematics, GPS Tracking & Video Telematics UAE",
  description:
    "LOCATOR delivers GPS fleet tracking, AI video telematics, smart IoT asset monitoring, and RTA-certified solutions across the UAE. Real-time visibility for vehicles, drivers, and business assets.",
  url: siteUrl,
  ogImage: "/brand/og-image.png",
  locale: "en_AE",
  phone: "+971525500956",
  phoneDisplay: "050 874 66 88",
  // Digits only, no '+' — that is the format wa.me expects. Same line as `phone`;
  // kept separate so the two can diverge without hunting through components.
  whatsapp: "971525500956",
  keywords: [
    "fleet management UAE",
    "GPS tracking Dubai",
    "vehicle tracking system UAE",
    "video telematics",
    "AI dashcam UAE",
    "fleet telematics Dubai",
    "IoT asset tracking UAE",
    "Asateel certified OBU",
    "Shahin RTA tracking",
    "SecurePath Dubai Police",
    "fleet management software",
  ],
  links: {
    website: "https://locator.ae",
  },
};

export type SiteConfig = typeof siteConfig;
