import { globalCopy } from '@/content/pages/car-gps-tracker/global'
import { sharedTrackingDevices } from '@/content/pages/tracking-devices/shared'
import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import CarGpsHero from '@/components/service/car-gps-tracker/CarGpsHero'
import CarGpsOffers from '@/components/service/car-gps-tracker/CarGpsOffers'
import CarGpsAbout from '@/components/service/car-gps-tracker/CarGpsAbout'
import TestimonialCarousel from '@/components/TestimonialCarousel/TestimonialCarousel'
import { TESTIMONIAL_DATA } from '@/components/TestimonialCarousel/testimonial-data'
import ServiceVideo from '@/components/service/ServiceVideo'
import ServiceUseCases from '@/components/service/ServiceUseCases'
import DeviceCarousel from '@/components/service/tracking-devices/DeviceCarousel'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'

const pageMetadata: Metadata = {
  title: 'Car GPS Tracker — Service',
  description:
    'The best car GPS tracker for maximum visibility — fuel management, real-time location, and customizable alerts for every vehicle in your fleet across the UAE.',
  alternates: { canonical: '/service/car-gps-tracker' },
  openGraph: {
    title: 'Car GPS Tracker | Locator',
    description:
      'A perfect solution to monitor your vehicles — live location, fuel management, and smart alerts from LOCATOR.',
    url: '/service/car-gps-tracker',
    type: 'website',
  },
}

const globalTitle = globalCopy.seo.title
const globalDescription = globalCopy.seo.description
const globalMetadata: Metadata = {
  ...pageMetadata,
  title: { absolute: globalTitle },
  description: globalDescription,
  keywords: globalCopy.seo.keywords,
  openGraph: { ...pageMetadata.openGraph, title: globalTitle, description: globalDescription },
}

export default async function CarGpsTrackerPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  const content = market === 'global' ? globalCopy : undefined
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <CarGpsHero content={content?.hero} />
      <CarGpsOffers content={content?.features} />
      <WhoWeAreNumbers content={content && { ...content.numbers, showStats: true }} />
      <CarGpsAbout content={content?.device} />
      <TestimonialCarousel
        testimonials={TESTIMONIAL_DATA}
        heading="What Our Clients Say"
        subheading={content?.reviews ?? 'Real feedback from UAE businesses using the LOCATOR car GPS tracker for vehicles and fleets.'}
      />
      <ServiceVideo
        eyebrow={content?.platform.eyebrow ?? ''}
        title={content?.platform.heading ?? 'All your Vehicles, Assets & Staffs on One Software'}
        titleColor="#1360ee"
        lead={content?.platform.description ?? 'Take control of your whole operation with LOCATOR GPS Tracking'}
        headingMaxWidth="760px"
      />
      <ServiceUseCases content={content?.platform} />
      <DeviceCarousel content={content && {
        ...sharedTrackingDevices.catalog,
        eyebrow: content.hardware.eyebrow,
        heading: content.hardware.heading,
        paragraphs: [content.hardware.description],
      }} />
      <SoftwareBlog content={content?.blog} market={market} tag="Car Tracking" />
      <SoftwareCTA content={content?.cta} />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(market === 'global' ? globalMetadata : pageMetadata, market, "/service/car-gps-tracker");
}
