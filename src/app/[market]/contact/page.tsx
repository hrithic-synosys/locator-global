import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import ContactHero from '@/components/contact/ContactHero'
import ContactOffices from '@/components/contact/ContactOffices'
import ContactChannels from '@/components/contact/ContactChannels'
import ContactSocial from '@/components/contact/ContactSocial'
import ContactForm from '@/components/contact/ContactForm'
import ContactPresence from '@/components/contact/ContactPresence'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'Contact Us — Fleet Telematics & GPS Tracking Support UAE',
  description:
    'Get in touch with LOCATOR for sales, support, partnerships, or regulatory GPS certification enquiries. Call, email, or send us a message — we reply within one working day.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | Locator',
    description:
      'Reach the LOCATOR team for sales, support, partnerships or any other enquiry across the UAE.',
    url: '/contact',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <ScrollReveal />
      <ContactHero />
      <ContactOffices />
      <ContactForm />
      <ContactPresence />
      <ContactChannels />
      <ContactSocial />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/contact");
}
