import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ServiceHero from '@/components/service/ServiceHero'
import BenefitsSection from '@/components/software/BenefitsSection'
import ServiceFleetShowcase from '@/components/service/ServiceFleetShowcase'
import ServiceIndustries from '@/components/service/ServiceIndustries'
import ServiceProcess from '@/components/service/ServiceProcess'
import AnimatedGlobeHero from '@/components/AnimatedGlobeHero'
import ServiceVideo from '@/components/service/ServiceVideo'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import DashcamShowcase from '@/components/software/DashcamShowcase'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import ScrollReveal from '@/components/software/ScrollReveal'
import Footer from '@/components/layouts/Footer'

const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

// Numbers section — same animated globe used on the landing page.
const SERVICE_STATS = [
  { value: '15+',    label: 'Years of fleet expertise',  side: 'left',  row: 'top',    icon: 'award' },
  { value: '60,000+', label: 'Vehicles tracked daily',    side: 'left',  row: 'bottom', icon: 'pin' },
  { value: '6,000+',   label: 'UAE businesses served',     side: 'right', row: 'top',    icon: 'smile' },
  { value: '99.9%',  label: 'Tracking network uptime',   side: 'right', row: 'bottom', icon: 'chart' },
]

const pageMetadata: Metadata = {
  title: 'Fleet Telematics — Service',
  description:
    'Improve fleet operations with real-time GPS tracking and telematics. Manage drivers, routes, and road operations with ease across all UAE industries.',
  alternates: { canonical: '/service/fleet-telematics' },
  openGraph: {
    title: 'Fleet Telematics | Locator',
    description:
      'Real-time GPS tracking and telematics for fleets across the UAE.',
    url: '/service/fleet-telematics',
    type: 'website',
  },
}

export default async function FleetTelematicsPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <ServiceHero />
      <BenefitsSection />
      {/* Landing target for the Fleet Telematics feature cards on the home page —
          they link to /service/fleet-telematics#fleet-telematics, where the same
          six features are spelled out in full. */}
      <ServiceFleetShowcase />
      <ServiceIndustries />
      <ServiceProcess />
      <AnimatedGlobeHero stats={SERVICE_STATS} />
      <ServiceVideo />
      <ServiceWhyChoose />
      <DashcamShowcase />
      <SoftwareBlog market={market} tag={['Fleet Tracking', 'Fleet Management']} />
      <ServiceFAQ />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/service/fleet-telematics");
}
