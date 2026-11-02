import { Fragment } from "react";
import type { Metadata } from "next";
import { marketMetadata } from "@/lib/country/metadata";
import type { CountryCode } from "@/config/countries";
import { getTaskManagerContent } from "@/content/pages/task-manager/resolve";
import ScrollReveal from "@/components/software/ScrollReveal";
import TaskManagerHero from "@/components/service/task-manager/TaskManagerHero";
import ServiceTaskManager from "@/components/service/ServiceTaskManager";
import ServiceModuleTabs from "@/components/service/ServiceModuleTabs";
import SoftwareCTA from "@/components/software/SoftwareCTA";
import ServiceWhyChoose from "@/components/service/ServiceWhyChoose";
import ServiceFAQ from "@/components/service/ServiceFAQ";
import {
  TaskManagerSectionStyles,
  TaskManagerBenefits,
  TaskManagerTools,
  TaskManagerIndustries,
} from "@/components/service/task-manager/TaskManagerSections";
import Footer from "@/components/layouts/Footer";

type PageProps = { params: Promise<{ market: CountryCode }> };
export default async function TaskManagerPage({ params }: PageProps) {
  const { market } = await params;
  const content = getTaskManagerContent(market);
  const sections = {
    hero: <TaskManagerHero content={content.hero} />,
    introduction: <ServiceTaskManager content={content.introduction} />,
    benefits: <TaskManagerBenefits content={content.benefits} />,
    tools: <TaskManagerTools content={content.tools} />,
    industries: <TaskManagerIndustries content={content.industries} />,
    whyChoose: <ServiceWhyChoose content={content.whyChoose} />,
    faq: <ServiceFAQ content={content.faq} />,
    modules: <ServiceModuleTabs active="task-manager" />,
    finalCta: <SoftwareCTA content={content.finalCta} />,
  };
  return (
    <main style={{ background: "#ffffff", minHeight: "100vh" }}>
      <ScrollReveal />
      {content.sectionOrder.some(
        (id) =>
          content.enabled[id] &&
          ["benefits", "tools", "industries"].includes(id)
      ) && <TaskManagerSectionStyles />}
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
  const { seo } = getTaskManagerContent(market);
  return marketMetadata(
    {
      title: seo.absoluteTitle ? { absolute: seo.title } : seo.title,
      description: seo.description,
      ...(seo.keywords.length ? { keywords: seo.keywords } : {}),
      ...(seo.absoluteTitle
        ? {
            openGraph: {
              title: seo.title,
              description: seo.description,
              type: "website",
            },
            twitter: { title: seo.title, description: seo.description },
          }
        : {}),
    },
    market,
    "/service/task-manager"
  );
}
