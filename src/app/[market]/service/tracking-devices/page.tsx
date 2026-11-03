import { Fragment } from "react";
import type { Metadata } from "next";
import { marketMetadata } from "@/lib/country/metadata";
import type { CountryCode } from "@/config/countries";
import { getTrackingDevicesContent } from "@/content/pages/tracking-devices/resolve";
import ScrollReveal from "@/components/software/ScrollReveal";
import TrackingDevicesHero from "@/components/service/tracking-devices/TrackingDevicesHero";
import DeviceCarousel from "@/components/service/tracking-devices/DeviceCarousel";
import HardwareJourney from "@/components/service/tracking-devices/HardwareJourney";
import ServiceWhyChoose from "@/components/service/ServiceWhyChoose";
import ServiceFAQ from "@/components/service/ServiceFAQ";
import SoftwareCTA from "@/components/software/SoftwareCTA";
import Footer from "@/components/layouts/Footer";

type PageProps = { params: Promise<{ market: CountryCode }> };
export default async function TrackingDevicesPage({ params }: PageProps) {
  const { market } = await params;
  const content = getTrackingDevicesContent(market);
  const sections = {
    hero: <TrackingDevicesHero content={content.hero} />,
    catalog: <DeviceCarousel content={content.catalog} />,
    journey: <HardwareJourney content={content.journey} />,
    whyChoose: <ServiceWhyChoose content={content.whyChoose} />,
    faq: <ServiceFAQ content={content.faq} />,
    finalCta: <SoftwareCTA content={content.finalCta} />,
  };
  return (
    <main style={{ background: "#ffffff", minHeight: "100vh" }}>
      <ScrollReveal />
      {content.sectionOrder
        .filter((id) => content.enabled[id])
        .map((id) => (
          <Fragment key={id}>{sections[id]}</Fragment>
        ))}
      <Footer />
    </main>
  );
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { market } = await params;
  const { seo } = getTrackingDevicesContent(market);
  return marketMetadata(
    {
      title: seo.absoluteTitle ? { absolute: seo.title } : seo.title,
      description: seo.description,
      ...(seo.keywords.length ? { keywords: seo.keywords } : {}),
      ...(seo.absoluteTitle
        ? { twitter: { title: seo.ogTitle, description: seo.ogDescription } }
        : {}),
      openGraph: {
        title: seo.ogTitle,
        description: seo.ogDescription,
        type: "website",
      },
    },
    market,
    "/service/tracking-devices"
  );
}
