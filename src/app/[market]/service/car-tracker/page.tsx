import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import CarTrackerHero from '@/components/service/car-tracker/CarTrackerHero'
import LogoMarquee from '@/components/Logomarquee'
import CarTrackerStats from '@/components/service/car-tracker/CarTrackerStats'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import CarTrackerFeatures from '@/components/service/car-tracker/CarTrackerFeatures'
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
  title: 'Car Tracker — Service',
  description:
    'The revolutionary LOCATOR car tracker app — live tracking, instant notifications, route history, and service reminders for every vehicle in your fleet across the UAE.',
  alternates: { canonical: '/service/car-tracker' },
  openGraph: {
    title: 'Car Tracker | Locator',
    description:
      'Live tracking, alerts, and a dynamic dashboard for every car in your fleet — powered by LOCATOR.',
    url: '/service/car-tracker',
    type: 'website',
  },
}

export default async function CarTrackerPage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <CarTrackerHero />
      <LogoMarquee />
      <WhoWeAreNumbers />
      <CarTrackerStats />
      <ServiceWhyChoose />
      <CarTrackerFeatures />
      <TestimonialCarousel
        testimonials={TESTIMONIAL_DATA}
        heading="What Our Clients Say"
        subheading="Real feedback from UAE businesses using the LOCATOR car tracker app for vehicles, fleets, and drivers."
      />
      <ServiceVideo
        eyebrow=""
        title="All your Vehicles, Assets & Staffs on One Software"
        titleColor="#1360ee"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
        headingMaxWidth="760px"
      />
      <ServiceUseCases />
      <DeviceCarousel />
      <SoftwareBlog market={market} tag="Car Tracking" />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/service/car-tracker");
}
