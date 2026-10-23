import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import NewsroomHero from '@/components/about/newsroom/NewsroomHero'
import NewsroomTicker from '@/components/about/newsroom/NewsroomTicker'
import NewsroomBoard from '@/components/about/newsroom/NewsroomBoard'
import NewsroomHighlights from '@/components/about/newsroom/NewsroomHighlights'
import NewsroomSubscribe from '@/components/about/newsroom/NewsroomSubscribe'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'
import NewsroomVideosAndBlogs from '@/components/about/newsroom/NewsroomVideosAndBlogs'

import { listBlogs } from '@/lib/cms-blog/client';
import { assertMarket } from '@/lib/cms-blog/urls';
import { newsroomCard } from '@/lib/cms-blog/teasers';
export const dynamic = 'force-dynamic';

const pageMetadata: Metadata = {
  title: 'Newsroom — About Locator',
  description:
    'Company news, product announcements, and updates from the team building Locator’s AI-powered IoT platform.',
  alternates: { canonical: '/about/newsroom' },
  openGraph: {
    title: 'Newsroom | Locator',
    description: 'Company news and updates from the Locator team.',
    url: '/about/newsroom',
    type: 'website',
  },
}

export default async function AboutNewsroomPage({ params, searchParams }: { params: Promise<{ market: CountryCode }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { market } = await params;
  assertMarket(market);
  const query = await searchParams;
  const raw = typeof query.blogPage === 'string' ? query.blogPage : '';
  const page = /^\d{1,7}$/.test(raw) && Number(raw) > 0 ? Number(raw) : 1;
  const result = await listBlogs(market, page, 3);
  const blogs = result.items.map(newsroomCard);
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <ScrollReveal />
      <NewsroomHero />
      <NewsroomTicker />
      <NewsroomBoard key={`board:${market}`} blogs={blogs} />
      <NewsroomHighlights />
      <NewsroomVideosAndBlogs key={`videos-and-blogs:${market}`} market={market} blogs={blogs} pagination={result.pagination} />
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/about/newsroom");
}
