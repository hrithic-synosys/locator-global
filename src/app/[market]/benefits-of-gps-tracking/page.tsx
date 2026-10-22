import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import BenefitsHero from '@/components/benefits/BenefitsHero'
import BenefitsIndex from '@/components/benefits/BenefitsIndex'
import BenefitsClosing from '@/components/benefits/BenefitsClosing'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import { BENEFITS } from '@/components/benefits/data'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'

const pageMetadata: Metadata = {
  title: 'Benefits of GPS Tracking',
  description:
    'Lower operating costs, less overtime, recovered vehicles and up to 20% off fuel — the eleven measurable returns UAE fleets get from GPS vehicle tracking.',
  alternates: { canonical: '/benefits-of-gps-tracking' },
  openGraph: {
    title: 'Benefits of GPS Tracking | LOCATOR',
    description:
      'Eleven measurable returns UAE fleets get from GPS vehicle tracking — from fuel and overtime savings to route compliance and vehicle recovery.',
    url: '/benefits-of-gps-tracking',
    type: 'website',
  },
}

export default function BenefitsOfGpsTrackingPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <BenefitsHero />
      <WhoWeAreNumbers />
      <BenefitsIndex />
      <BenefitsClosing />
      <SoftwareCTA />
      <Footer />

      {/* ItemList structured data. The page IS a list of eleven named benefits,
          so describing it as one is the honest markup — and it is what lets the
          entries surface individually in search rather than only as a page. It is
          generated from the same array the page renders, so the two cannot drift. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Benefits of GPS Tracking',
            itemListOrder: 'https://schema.org/ItemListUnordered',
            numberOfItems: BENEFITS.length,
            itemListElement: BENEFITS.map((b, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: b.title,
              description: b.desc,
            })),
          }),
        }}
      />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/benefits-of-gps-tracking");
}
