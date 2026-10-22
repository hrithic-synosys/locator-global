import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import QuoteHero from '@/components/quote/QuoteHero'
import QuoteForm from '@/components/quote/QuoteForm'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'Get a Free Quote — Fleet Telematics & GPS Tracking UAE',
  description:
    'Request a free, no-obligation quote for LOCATOR fleet telematics, GPS tracking, video telematics, and IoT solutions across the UAE. Four simple steps from quote to going live.',
  alternates: { canonical: '/get-a-quote' },
  openGraph: {
    title: 'Get a Free Quote | Locator',
    description:
      'Tell us about your fleet and we’ll prepare a tailored quote — free demo, installation at your location, and full support.',
    url: '/get-a-quote',
    type: 'website',
  },
}

export default function GetAQuotePage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <QuoteHero />
      <QuoteForm />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/get-a-quote");
}
