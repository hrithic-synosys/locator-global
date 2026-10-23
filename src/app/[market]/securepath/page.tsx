import { regulatoryPaths } from '@/config/regulatory';
import { requireRegulatoryPage } from '@/lib/country/regulatory';
import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import SecurepathHero from '@/components/regulatory/securepath/SecurepathHero'
import SecurepathExplainer from '@/components/regulatory/securepath/SecurepathExplainer'
import SecurepathBenefits from '@/components/regulatory/securepath/SecurepathBenefits'
import SecurepathProcess from '@/components/regulatory/securepath/SecurepathProcess'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import SecurepathFAQ from '@/components/regulatory/securepath/SecurepathFAQ'
import SecurepathConclusion from '@/components/regulatory/securepath/SecurepathConclusion'
import RegulatoryBlogFeed from '@/components/regulatory/RegulatoryBlogFeed'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'SecurePath — Regulatory GPS Certification',
  description:
    'SecurePath GPS tracking from LOCATOR — SIRA & RTA compliant registration, installation, and monitoring for Dubai car rental and security-related vehicles.',
  alternates: { canonical: '/securepath' },
  openGraph: {
    title: 'SecurePath GPS Certification | Locator',
    description:
      'SIRA & RTA compliant SecurePath registration for Dubai rental vehicles — approved installation, certification, and real-time monitoring.',
    url: '/securepath',
    type: 'website',
  },
}

export default async function SecurepathPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  requireRegulatoryPage(market, regulatoryPaths.securepath);
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <SecurepathHero />
      <SecurepathExplainer />
      <SecurepathBenefits />
      <SecurepathProcess />
      <ServiceWhyChoose />
      <WhoWeAreNumbers />
      <SecurepathFAQ />
      <SecurepathConclusion />
      <RegulatoryBlogFeed tag={['GPS Tracking', 'Fleet Management']} />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, regulatoryPaths.securepath);
}
