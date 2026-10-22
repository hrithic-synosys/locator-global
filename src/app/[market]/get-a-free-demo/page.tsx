import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import DemoHero from '@/components/demo/DemoHero'
import DemoSteps from '@/components/demo/DemoSteps'
import DemoBooking from '@/components/demo/DemoBooking'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'Get a Free Demo — Fleet Telematics & GPS Tracking UAE',
  description:
    'Book a free, personalized demo of LOCATOR fleet telematics, GPS tracking, video telematics, and IoT solutions. Pick a date and time that works for you — no obligation.',
  alternates: { canonical: '/get-a-free-demo' },
  openGraph: {
    title: 'Get a Free Demo | Locator',
    description:
      'Tell us about your fleet and schedule a live demo tailored to your operation — installation at your location and full support.',
    url: '/get-a-free-demo',
    type: 'website',
  },
}

export default function GetAFreeDemoPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <DemoHero />
      <DemoSteps />
      <DemoBooking />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/get-a-free-demo");
}
