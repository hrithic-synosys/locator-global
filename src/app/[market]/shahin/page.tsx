import { regulatoryPaths } from '@/config/regulatory';
import { requireRegulatoryPage } from '@/lib/country/regulatory';
import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import ShahinHero from '@/components/regulatory/shahin/ShahinHero'
import ShahinExplainer from '@/components/regulatory/shahin/ShahinExplainer'
import ShahinCrossSell from '@/components/regulatory/shahin/ShahinCrossSell'
import ShahinSteps from '@/components/regulatory/shahin/ShahinSteps'
import ShahinFAQ from '@/components/regulatory/shahin/ShahinFAQ'
import ShahinConclusion from '@/components/regulatory/shahin/ShahinConclusion'
import ShahinVideo from '@/components/regulatory/shahin/ShahinVideo'
import RegulatoryBlogFeed from '@/components/regulatory/RegulatoryBlogFeed'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'SHAHIN — Regulatory GPS Certification',
  description:
    'Get your fleet SHAHIN-certified with a fully managed, SIRA-compliant GPS tracking solution — registration, installation, and real-time compliance reporting.',
  alternates: { canonical: '/shahin' },
  openGraph: {
    title: 'SHAHIN — Regulatory GPS Certification | Locator',
    description:
      'SIRA-compliant SHAHIN GPS certification for Dubai cargo fleets — fully managed registration, installation, and compliance reporting.',
    url: '/shahin',
    type: 'website',
  },
}

export default async function ShahinPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  requireRegulatoryPage(market, regulatoryPaths.shahin);
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <ShahinHero />
      <ShahinExplainer />
      <ShahinCrossSell />
      <ShahinSteps />
      <ShahinFAQ />
      <ShahinConclusion />
      <ShahinVideo />
      <RegulatoryBlogFeed market={market} tag={['Fleet Management', 'Fleet Tracking']} />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, regulatoryPaths.shahin);
}
