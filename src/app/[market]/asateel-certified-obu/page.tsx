import { regulatoryPaths } from '@/config/regulatory';
import { requireRegulatoryPage } from '@/lib/country/regulatory';
import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import AsateelHero from '@/components/regulatory/asateel/AsateelHero'
import AsateelExplainer from '@/components/regulatory/asateel/AsateelExplainer'
import AsateelSteps from '@/components/regulatory/asateel/AsateelSteps'
import AsateelInstallation from '@/components/regulatory/asateel/AsateelInstallation'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import AsateelHireUsNow from '@/components/regulatory/asateel/AsateelHireUsNow'
import AsateelVideo from '@/components/regulatory/asateel/AsateelVideo'
import RegulatoryBlogFeed from '@/components/regulatory/RegulatoryBlogFeed'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'ASATEEL Certified OBU — Regulatory GPS Certification',
  description:
    'Get your commercial fleet ASATEEL-certified with a fully managed on-board unit (OBU) installation service — approved by Abu Dhabi\'s ITC, with real-time compliance reporting.',
  alternates: { canonical: '/asateel-certified-obu' },
  openGraph: {
    title: 'ASATEEL Certified OBU Installation | Locator',
    description:
      'ITC-approved ASATEEL OBU installation for Abu Dhabi commercial fleets — enrollment, certified installation, and compliance reporting.',
    url: '/asateel-certified-obu',
    type: 'website',
  },
}

export default async function AsateelCertifiedObuPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  requireRegulatoryPage(market, regulatoryPaths.asateel);
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <AsateelHero />
      <AsateelExplainer />
      <AsateelSteps />
      <AsateelInstallation />
      <ServiceWhyChoose />
      <WhoWeAreNumbers />
      <AsateelHireUsNow />
      <AsateelVideo />
      <RegulatoryBlogFeed tag="ASATEEL Compliance" />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, regulatoryPaths.asateel);
}
