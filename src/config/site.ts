// Ignore a copied UAE origin in this clone. No metadata should identify it as
// the original UAE deployment. Set this to the clone's own origin before build.
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
export const siteUrl = configuredUrl && !['locator.ae', 'www.locator.ae'].includes(new URL(configuredUrl).hostname)
  ? configuredUrl
  : 'https://locatorglobal.com';

export const siteConfig = {
  // Used as the title-template suffix on every page — keep it short.
  name: "LOCATOR",
  title: "LOCATOR — Fleet Telematics, GPS Tracking & Video Telematics UAE",
  description:
    "LOCATOR delivers GPS fleet tracking, AI video telematics, smart IoT asset monitoring, and RTA-certified solutions across the UAE. Real-time visibility for vehicles, drivers, and business assets.",
  url: siteUrl,
  ogImage: "/brand/og-image.png",
  locale: "en",
  phone: "+971508746688",
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
    website: siteUrl,
  },
};

export type SiteConfig = typeof siteConfig;
