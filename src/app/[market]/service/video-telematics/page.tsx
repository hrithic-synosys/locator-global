import { marketMetadata } from "@/lib/country/metadata";
import type { CountryCode } from "@/config/countries";
import type { Metadata } from "next";
import { Fragment } from "react";
import ScrollReveal from "@/components/software/ScrollReveal";
import VideoTelematicsHero from "@/components/service/video-telematics/VideoTelematicsHero";
import VideoTelematicsDescription from "@/components/service/video-telematics/VideoTelematicsDescription";
import VideoTelematicsAlertsScroll from "@/components/service/video-telematics/VideoTelematicsAlertsScroll";
import VideoTelematicsShowcase from "@/components/service/video-telematics/VideoTelematicsShowcase";
import VideoTelematicsIndustries from "@/components/service/video-telematics/VideoTelematicsIndustries";
import VideoTelematicsFAQ from "@/components/service/video-telematics/VideoTelematicsFAQ";
import VideoTelematicsVideo from "@/components/service/video-telematics/VideoTelematicsVideo";
import SoftwareBlog from "@/components/software/SoftwareBlog";
import SoftwareCTA from "@/components/software/SoftwareCTA";
import Footer from "@/components/layouts/Footer";
import { getVideoTelematicsContent } from "@/content/pages/video-telematics/resolve";
import VideoTelematicsContentCards from "@/components/service/video-telematics/VideoTelematicsContentCards";
import VideoTelematicsJourney from "@/components/service/video-telematics/VideoTelematicsJourney";

export default async function VideoTelematicsPage({
  params,
}: {
  params: Promise<{ market: CountryCode }>;
}) {
  const { market } = await params;
  const content = getVideoTelematicsContent(market);
  const sections = {
    hero: <VideoTelematicsHero content={content.hero} />,
    description: <VideoTelematicsDescription content={content.description} />,
    introFeatures: (
      <VideoTelematicsContentCards
        id="video-features"
        content={content.introFeatures}
      />
    ),
    driverAlerts: (
      <VideoTelematicsAlertsScroll content={content.driverAlerts} />
    ),
    showcase: <VideoTelematicsShowcase content={content.showcase} />,
    journeySteps: <VideoTelematicsJourney content={content.journeySteps} />,
    industries: <VideoTelematicsIndustries content={content.industries} />,
    whyChoose: (
      <VideoTelematicsContentCards
        id="why-choose-video"
        content={content.whyChoose}
        eyebrow={content.whyChoose.eyebrow}
      />
    ),
    video: <VideoTelematicsVideo />,
    faq: <VideoTelematicsFAQ content={content.faq} />,
    blogs: (
      <SoftwareBlog
        market={market}
        tag={["Fleet Tracking", "GPS Tracking"]}
        content={content.blogs}
      />
    ),
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
}: {
  params: Promise<{ market: CountryCode }>;
}): Promise<Metadata> {
  const { market } = await params;
  const { seo } = getVideoTelematicsContent(market);
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
    "/service/video-telematics"
  );
}
