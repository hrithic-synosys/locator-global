import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ScrollReveal from '@/components/software/ScrollReveal'
import IndustriesHero from '@/components/industries/IndustriesHero'
import IndustriesGrid from '@/components/industries/IndustriesGrid'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'

// Same trailing sections the industry detail pages already use (Why Locator,
// Numbers, Blog, FAQ, CTA) — reused here rather than duplicated, so the
// listing page isn't just a grid dropping straight into the footer.
const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

const pageMetadata: Metadata = {
  title: 'Industries We Serve',
  description:
    'Locator supports connected fleets across every industry in the UAE — from logistics and construction to healthcare, government, and more.',
  alternates: { canonical: '/industries' },
  openGraph: {
    title: 'Industries We Serve | Locator',
    description: 'GPS tracking, video telematics, and IoT for fleets across every UAE industry.',
    url: '/industries',
    type: 'website',
  },
}

export default function IndustriesPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <IndustriesHero />
      <IndustriesGrid />
      <ServiceWhyChoose />
      <WhoWeAreNumbers />
      <SoftwareBlog tag={['Fleet Management', 'Fleet Tracking', 'GPS Tracking']} />
      <ServiceFAQ />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/industries");
}
