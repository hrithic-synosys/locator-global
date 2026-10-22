import { notFound } from 'next/navigation';
import { isCountryCode } from '@/config/countries';
import { exclusivePages, getExclusivePage } from '@/content/exclusive-pages';
import { marketMetadata } from '@/lib/country/metadata';

type Props = { params: Promise<{ market: string; exclusive: string[] }> };

export function generateStaticParams({ params }: { params: { market: string } }) {
  return Object.entries(exclusivePages)
    .filter(([, page]) => page.markets.some(market => market === params.market))
    .map(([path]) => ({ exclusive: path.slice(1).split('/') }));
}

// Unknown paths must remain real 404s, including when the registry is empty.
export const dynamicParams = true;

export async function generateMetadata({ params }: Props) {
  const { market, exclusive } = await params;
  if (!isCountryCode(market)) notFound();
  const path = `/${exclusive.join('/')}`;
  const page = getExclusivePage(path, market);
  if (!page) notFound();
  return marketMetadata(page.metadata, market, path);
}

export default async function ExclusivePage({ params }: Props) {
  const { market, exclusive } = await params;
  if (!isCountryCode(market)) notFound();
  const page = getExclusivePage(`/${exclusive.join('/')}`, market);
  if (!page) notFound();
  const { default: Page } = await page.load();
  return <Page country={market} />;
}
