import { notFound } from 'next/navigation';
import { countries, countryCodes, isCountryCode } from '@/config/countries';
import { CountryProvider } from '@/components/country/CountryProvider';
import ContactDock from '@/components/common/ContactDock';

export function generateStaticParams() {
  return countryCodes.filter(code => countries[code].enabled).map(market => ({ market }));
}

// Unknown params are rejected below. Leaving fallback enabled lets the explicit
// exclusive-route boundary return notFound() without a framework fallback error.

export default async function MarketLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isCountryCode(market) || !countries[market].enabled) notFound();
  return <CountryProvider country={market}>{children}<ContactDock /></CountryProvider>;
}
