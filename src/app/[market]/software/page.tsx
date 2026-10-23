import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import SoftwareHero from '@/components/software/SoftwareHero'
import BenefitsSection from '@/components/software/BenefitsSection'
import ModulesSection from '@/components/software/ModulesSection'
import DashcamShowcase from '@/components/software/DashcamShowcase'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import ScrollReveal from '@/components/software/ScrollReveal'
import Footer from '@/components/layouts/Footer'

const SoftwareFAQ = dynamic(() => import('@/components/software/SoftwareFAQ'))

const pageMetadata: Metadata = {
  title: 'Software — Fleet Telematics Platform',
  description:
    'One platform for complete fleet visibility. GPS tracking, telematics, tasks, expenses, inspections, maintenance and AI dashcams for your whole fleet.',
}

export default async function SoftwarePage({ params }: { params: Promise<{ market: CountryCode }> }) {
  const { market } = await params;
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <SoftwareHero />
      <BenefitsSection />
      <ModulesSection />
      <DashcamShowcase />
      <SoftwareBlog market={market} tag={['GPS Tracking', 'Fleet Tracking']} />
      <SoftwareFAQ />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/software");
}
