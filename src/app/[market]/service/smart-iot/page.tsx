import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import SmartIotHero from '@/components/service/smart-iot/SmartIotHero'
import SmartIotShowcase from '@/components/service/smart-iot/SmartIotShowcase'
import SmartIotFeatures from '@/components/service/smart-iot/SmartIotFeatures'
import SmartIotFAQ from '@/components/service/smart-iot/SmartIotFAQ'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import { globalSmartIot } from '@/content/pages/smart-iot/global'

const pageMetadata: Metadata = {
  title: 'Smart IoT & GPS Asset Tracking Solutions UAE — Service',
  description:
    'Real-time visibility for road teams, machines, and business assets. GPS asset tracking, heavy machinery monitoring, and custom IoT sensor & telemetry projects across the UAE.',
  alternates: { canonical: '/service/smart-iot' },
  openGraph: {
    title: 'Smart IoT & Asset Intelligence | Locator',
    description:
      'GPS asset tracking, industrial telematics, and IoT sensor projects — unified in one connected LOCATOR dashboard.',
    url: '/service/smart-iot',
    type: 'website',
  },
}

export default async function SmartIotPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  const content = market === 'global' ? globalSmartIot : undefined;
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <SmartIotHero content={content?.hero} />
      <SmartIotShowcase blocks={content?.blocks} />
      <SmartIotFeatures content={content?.features} />
      <SmartIotFAQ items={content?.faq} />
      <SoftwareCTA content={content?.finalCta} />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  const metadata: Metadata = market === 'global' ? {
    ...pageMetadata,
    title: { absolute: globalSmartIot.seo.title },
    description: globalSmartIot.seo.description,
    keywords: globalSmartIot.seo.keywords,
    openGraph: { ...pageMetadata.openGraph, title: globalSmartIot.seo.title, description: globalSmartIot.seo.description },
  } : pageMetadata;
  return marketMetadata(metadata, market, "/service/smart-iot");
}
