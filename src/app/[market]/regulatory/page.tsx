import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import RegulatoryHeader from '@/components/regulatory/RegulatoryHeader'
import RegulatoryGrid from '@/components/regulatory/RegulatoryGrid'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'Regulatory GPS Certifications',
  description:
    'Explore certified GPS tracking solutions — SHAHIN, ASATEEL Certified OBU, SecurePath, and SecurePath Premium — built to meet UAE fleet regulatory requirements.',
  alternates: { canonical: '/regulatory' },
  openGraph: {
    title: 'Regulatory GPS Certifications | Locator',
    description:
      'Certified GPS tracking solutions built to meet UAE fleet regulatory requirements — SHAHIN, ASATEEL, SecurePath, and SecurePath Premium.',
    url: '/regulatory',
    type: 'website',
  },
}

export default function RegulatoryPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <RegulatoryHeader
        eyebrow="Regulatory Compliance"
        title="Regulatory GPS Certifications"
        subtitle="Certified GPS tracking solutions built to meet UAE fleet regulatory requirements — choose the certification that matches your fleet."
      >
        <RegulatoryGrid />
      </RegulatoryHeader>
      <SoftwareCTA />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/regulatory");
}
