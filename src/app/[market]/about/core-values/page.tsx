import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import AboutPillarHero from '@/components/about/AboutPillarHero'
import CoreValuesIntro from '@/components/about/CoreValuesIntro'
import AboutValues from '@/components/about/AboutValues'
import MissionCTA from '@/components/about/MissionCTA'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'Our Core Values — About Locator',
  description:
    'Customer success, purpose-driven innovation, operational excellence, transparency, safety, and ownership with integrity — the principles behind everything we build.',
  alternates: { canonical: '/about/core-values' },
  openGraph: {
    title: 'Our Core Values | Locator',
    description:
      'The six principles that guide how we build products and work with customers every day.',
    url: '/about/core-values',
    type: 'website',
  },
}

export default function AboutCoreValuesPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <AboutPillarHero
        slug="core-values"
        title="# The principles that guide how we innovate, work, and grow together."
        lead="The principles that guide how we innovate, work, and grow together."
      />
      <CoreValuesIntro />
      <AboutValues />
      <AboutPillarNav current="core-values" />
      <MissionCTA />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/about/core-values");
}
