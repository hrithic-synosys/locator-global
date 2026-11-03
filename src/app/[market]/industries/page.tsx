import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ScrollReveal from '@/components/software/ScrollReveal'
import IndustriesHero from '@/components/industries/IndustriesHero'
import IndustriesGrid from '@/components/industries/IndustriesGrid'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import { globalIndustries } from '@/content/pages/industries/global'

// Same trailing sections the industry detail pages already use (Why Locator,
// Numbers, Blog, FAQ, CTA) — reused here rather than duplicated, so the
// listing page isn't just a grid dropping straight into the footer.
const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

const pageMetadata: Metadata = {
  title: 'Industries We Serve',
  description:
    'Locator supports connected fleets across every industry in the UAE — from logistics and construction to healthcare, government, and more.',
  alternates: { canonical: '/industries' },
  openGraph: {
    title: 'Industries We Serve | Locator',
    description: 'GPS tracking, video telematics, and IoT for fleets across every UAE industry.',
    url: '/industries',
    type: 'website',
  },
}

export default async function IndustriesPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  const content = market === 'global' ? globalIndustries : undefined;
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <IndustriesHero content={content?.hero} />
      <IndustriesGrid content={content?.grid} />
      <ServiceWhyChoose />
      <WhoWeAreNumbers content={content?.numbers} />
      <SoftwareBlog market={market} tag={['Fleet Management', 'Fleet Tracking', 'GPS Tracking']} />
      <ServiceFAQ content={content?.faq} />
      <SoftwareCTA content={content?.finalCta} />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  const metadata: Metadata = market === 'global' ? {
    ...pageMetadata,
    title: globalIndustries.hero.heading,
    description: globalIndustries.hero.description,
    openGraph: { ...pageMetadata.openGraph, title: `${globalIndustries.hero.heading} | Locator`, description: globalIndustries.hero.description },
  } : pageMetadata;
  return marketMetadata(metadata, market, "/industries");
}
