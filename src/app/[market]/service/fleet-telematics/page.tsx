import { Fragment } from 'react'
import { getFleetTelematicsContent } from '@/content/pages/fleet-telematics/resolve'
import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ServiceHero from '@/components/service/ServiceHero'
import BenefitsSection from '@/components/software/BenefitsSection'
import ServiceFleetShowcase from '@/components/service/ServiceFleetShowcase'
import ServiceIndustries from '@/components/service/ServiceIndustries'
import ServiceProcess from '@/components/service/ServiceProcess'
import AnimatedGlobeHero from '@/components/AnimatedGlobeHero'
import ServiceVideo from '@/components/service/ServiceVideo'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import DashcamShowcase from '@/components/software/DashcamShowcase'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import ScrollReveal from '@/components/software/ScrollReveal'
import Footer from '@/components/layouts/Footer'

const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

export default async function FleetTelematicsPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  const content = getFleetTelematicsContent(market);
  const sections = {
    hero: <ServiceHero content={content.hero} />,
    benefits: <BenefitsSection content={content.benefits} />,
    showcase: <ServiceFleetShowcase content={content.showcase} />,
    industries: <ServiceIndustries content={content.industries} market={market} />,
    process: <ServiceProcess content={content.process} />,
    statistics: <AnimatedGlobeHero stats={content.statistics.items} />,
    videoPlayer: <ServiceVideo {...content.videoPlayer} />,
    whyChoose: <ServiceWhyChoose content={content.whyChoose} />,
    videoTelematics: <DashcamShowcase content={content.videoTelematics} />,
    blogs: <SoftwareBlog market={market} tag={['Fleet Tracking', 'Fleet Management']} />,
    faq: <ServiceFAQ content={content.faq} />,
    finalCta: <SoftwareCTA content={content.finalCta} />,
  };
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      {content.sectionOrder.filter(id => content.enabled[id]).map(id => <Fragment key={id}>{sections[id]}</Fragment>)}
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  const { seo } = getFleetTelematicsContent(market);
  return marketMetadata({ title: seo.title, description: seo.description,
    openGraph: { title: seo.ogTitle, description: seo.ogDescription, type: 'website' },
  }, market, "/service/fleet-telematics");
}
