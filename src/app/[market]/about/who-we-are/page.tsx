import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import WhoWeAreHero from '@/components/about/who-we-are/WhoWeAreHero'
import WhoWeArePurpose from '@/components/about/who-we-are/WhoWeArePurpose'
import WhoWeAreRoots from '@/components/about/who-we-are/WhoWeAreRoots'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import WhoWeAreJourney from '@/components/about/who-we-are/WhoWeAreJourney'
import WhoWeAreServices from '@/components/about/who-we-are/WhoWeAreServices'
// import ServiceIndustries from '@/components/service/ServiceIndustries' // GPS Fleet Services — disabled
// import WhoWeAreTechnology from '@/components/about/who-we-are/WhoWeAreTechnology' // Technology & Innovation — disabled
// import WhoWeAreWhyChoose from '@/components/about/who-we-are/WhoWeAreWhyChoose' // Why Businesses Choose LOCATOR — disabled
// import WhoWeAreVideo from '@/components/about/who-we-are/WhoWeAreVideo' // video section — disabled
import WhoWeAreFAQ from '@/components/about/who-we-are/WhoWeAreFAQ'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'Who We Are — About Locator',
  description:
    'LOCATOR is a technology company building intelligent fleet telematics and IoT solutions — connecting vehicles and assets and turning real-time data into actionable business intelligence across the UAE.',
  alternates: { canonical: '/about/who-we-are' },
  openGraph: {
    title: 'Who We Are | Locator',
    description:
      'More than a GPS provider — a connected mobility company shaping the future of fleet telematics and IoT.',
    url: '/about/who-we-are',
    type: 'website',
  },
}

export default function WhoWeArePage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <WhoWeAreHero />
      <WhoWeAreRoots />
      <WhoWeArePurpose />
      <WhoWeAreNumbers />
      <WhoWeAreJourney />
      <WhoWeAreServices />
      {/* <ServiceIndustries /> */}
      {/* <WhoWeAreTechnology /> */}
      {/* <WhoWeAreWhyChoose /> */}
      {/* <WhoWeAreVideo /> */}
      <WhoWeAreFAQ />
      <AboutPillarNav current="who-we-are" />
      <SoftwareBlog /> {/* No single topic — About page shows the most recent posts overall */}
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/about/who-we-are");
}
