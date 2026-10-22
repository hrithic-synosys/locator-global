import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ScrollReveal from '@/components/software/ScrollReveal'
import VehicleTrackingHero from '@/components/vehicle-tracking/VehicleTrackingHero'
import VehicleTrackingFeatures from '@/components/vehicle-tracking/VehicleTrackingFeatures'
import VehicleTrackingWhy from '@/components/vehicle-tracking/VehicleTrackingWhy'
import TrackingVoices from '@/components/tracking/TrackingVoices'
import VehicleTrackingBenefits from '@/components/vehicle-tracking/VehicleTrackingBenefits'
import ServiceVideo from '@/components/service/ServiceVideo'
import TrackingUseCases from '@/components/tracking/TrackingUseCases'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
// import { FEATURES, WHY_POINTS, BENEFIT_POINTS } from '@/components/vehicle-tracking/data'
// import { VOICES } from '@/components/tracking/data'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'

// Below-the-fold and self-contained, so its client JS goes in its own chunk.
// SSR stays on — the HTML is still server-rendered, so there is no pop-in.
const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

const pageMetadata: Metadata = {
  title: 'Vehicle Tracking System UAE — The Best GPS Tracker',
  description:
    'Manage your vehicles with one click. LOCATOR vehicle tracking for UAE fleets — real-time GPS location, proper fuel management, customisable alerts and 100% accurate reports.',
  alternates: { canonical: '/service/vehicle-tracking-system' },
  openGraph: {
    title: 'The Best Vehicle Tracking System in UAE | LOCATOR',
    description:
      'Real-time location, fuel management and customisable alerts for every vehicle you own — across Dubai and all Emirates.',
    url: '/service/vehicle-tracking-system',
    type: 'website',
  },
}

export default function VehicleTrackingSystemPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <VehicleTrackingHero />
      <VehicleTrackingFeatures />
      <WhoWeAreNumbers />
      <VehicleTrackingWhy />
      <TrackingVoices />
      <VehicleTrackingBenefits />
      <ServiceVideo
        eyebrow=""
        title="All your Vehicles, Assets & Staffs on One Software"
        titleColor="#1360ee"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
        headingMaxWidth="760px"
      />
      <TrackingUseCases />
      <SoftwareBlog tag={['GPS Tracking', 'Vehicle Maintenance']} />
      <ServiceFAQ />
      <SoftwareCTA />
      <Footer />

      {/* Product + reviews structured data, generated from the same arrays the
          page renders so the two cannot drift. aggregateRating is deliberately
          absent — we hold no rating figures, and inventing one is the dishonest
          part of this markup. */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'LOCATOR Vehicle Tracking System',
            description:
              'GPS vehicle tracking system for UAE fleets — real-time location, fuel management, customisable alerts and accurate reporting.',
            brand: { '@type': 'Brand', name: 'LOCATOR' },
            category: 'Vehicle Tracking System',
            areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
            additionalProperty: [
              ...FEATURES.map(f => ({ '@type': 'PropertyValue', name: f.title, value: f.desc })),
              ...BENEFIT_POINTS.map(b => ({ '@type': 'PropertyValue', name: b.title, value: b.desc })),
              ...WHY_POINTS.map(w => ({ '@type': 'PropertyValue', name: 'Why Locator', value: w })),
            ],
            review: VOICES.map(v => ({
              '@type': 'Review',
              reviewBody: v.quote,
              author: { '@type': 'Organization', name: v.company },
            })),
          }),
        }}
      /> */}
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/service/vehicle-tracking-system");
}
