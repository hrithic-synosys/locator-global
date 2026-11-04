import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import ScrollReveal from '@/components/software/ScrollReveal'
import IndustryHero from '@/components/industries/IndustryHero'
import IndustriesHero from '@/components/industries/IndustriesHero'
import IndustryBlocks from '@/components/industries/IndustryBlocks'
import IndustryShowcase from '@/components/industries/IndustryShowcase'
import IndustryEditorialSection from '@/components/industries/IndustryEditorialSection'
import ContentCards from '@/components/service/video-telematics/VideoTelematicsContentCards'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import ServiceVideo from '@/components/service/ServiceVideo'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import { INDUSTRIES, getIndustry } from '@/components/industries/industries-data'
import { getIndustryDetailContent } from '@/content/pages/industries/resolve-detail'

// Same trailing sections as the rest of the site (Why Locator, Videos, Blogs,
// FAQ, Footer) — generic and shared, not duplicated per industry.
const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }))
}

async function getPageMetadata({
  params,
}: {
  params: Promise<{ slug: string; market: CountryCode }>
}): Promise<Metadata> {
  const { slug, market } = await params
  const industry = getIndustry(slug)
  if (!industry) return {}
  const content = getIndustryDetailContent(market, slug)

  return {
    title: content ? { absolute: content.seo.title } : `${industry.name} — Industries`,
    description: content?.seo.description ?? industry.lead,
    ...(content ? { keywords: content.seo.keywords } : {}),
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      title: content?.seo.title ?? `${industry.name} | Locator`,
      description: content?.seo.description ?? industry.lead,
      url: `/industries/${industry.slug}`,
      type: 'website',
    },
  }
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string; market: CountryCode }>
}) {
  const { slug, market } = await params
  const industry = getIndustry(slug)
  if (!industry) notFound()
  const content = getIndustryDetailContent(market, slug)

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      {content ? <IndustriesHero content={content.hero} image={content.hero.image} breadcrumbLabel={industry.name} /> : <IndustryHero industry={industry} />}
      <IndustryBlocks industry={industry} blocks={content?.blocks} />
      {content?.utilisation && <IndustryShowcase content={content.utilisation} id="rental-utilisation" />}
      {content?.applications && <IndustryShowcase content={content.applications} id="rental-applications" reverse />}
      {content?.sections?.map(section => {
        if (section.kind === 'showcase') {
          return <IndustryShowcase key={section.id} id={section.id} content={section.content} reverse={section.reverse} />
        }
        if (section.kind === 'cards') {
          return <ContentCards key={section.id} id={section.id} content={section.content} eyebrow={section.content.eyebrow} />
        }
        return <IndustryEditorialSection key={section.id} id={section.id} content={section.content} variant={section.kind} />
      })}
      <ServiceWhyChoose content={content?.whyChoose} />
      <WhoWeAreNumbers />
      <ServiceVideo
        eyebrow=""
        title="All your Vehicles, Assets & Staffs on One Software"
        titleColor="#1360ee"
        headingMaxWidth="none"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
      />
      <SoftwareBlog market={market} tag={['Fleet Management', 'Fleet Tracking', 'GPS Tracking']} />
      <ServiceFAQ content={content?.faq} />
      <SoftwareCTA content={content?.finalCta} />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode; slug: string }> }): Promise<Metadata> {
  const { market, slug } = await params;
  return marketMetadata(await getPageMetadata({ params }), market, `/industries/${slug}`);
}
