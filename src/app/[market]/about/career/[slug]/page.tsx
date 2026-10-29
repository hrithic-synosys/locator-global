import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ScrollReveal from '@/components/software/ScrollReveal'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import JobDetail from '@/components/about/career/JobDetail'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'
import { JOBS, getJob } from '@/components/about/career/jobs-data'

export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: j.slug }))
}

async function getPageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const job = getJob(slug)
  if (!job) return {}

  return {
    title: `${job.title} — Careers`,
    description: job.intro,
    alternates: { canonical: `/about/career/${job.slug}` },
    openGraph: {
      title: `${job.title} | Locator Careers`,
      description: job.intro,
      url: `/about/career/${job.slug}`,
      type: 'website',
    },
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const job = getJob(slug)
  if (!job) notFound()

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <SoftwareNavbar />
      <JobDetail key={job.slug} job={job} />
      {/* current="career" so a job page offers the other five pillars rather
          than a link back to the careers index the reader just came from. */}
      <AboutPillarNav current="career" />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode; slug: string }> }): Promise<Metadata> {
  const { market, slug } = await params;
  return marketMetadata(await getPageMetadata({ params }), market, `/about/career/${slug}`);
}
