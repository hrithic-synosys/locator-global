import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import MissionHero from '@/components/about/MissionHero'
import MissionPillars from '@/components/about/MissionPillars'
import MissionCTA from '@/components/about/MissionCTA'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'
import { globalMission } from '@/content/pages/mission/global'

const pageMetadata: Metadata = {
  title: 'Our Mission — About Locator',
  description:
    'Our mission is to empower businesses worldwide with AI-powered IoT solutions that create safer, smarter, and more efficient operations — turning complexity into clarity and growth.',
  alternates: { canonical: '/about/mission' },
  openGraph: {
    title: 'Our Mission | Locator',
    description:
      'Empowering businesses worldwide with AI-powered IoT solutions for safer, smarter, more efficient operations.',
    url: '/about/mission',
    type: 'website',
  },
}

export default async function AboutMissionPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  const content = market === 'global' ? globalMission : undefined;
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <MissionHero content={content?.hero} />
      <MissionPillars content={content?.statement} />
      <AboutPillarNav current="mission" content={content?.explore} />
      <MissionCTA content={content?.cta} />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/about/mission");
}
