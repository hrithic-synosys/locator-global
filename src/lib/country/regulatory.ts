import { notFound } from 'next/navigation';
import type { CountryCode } from '@/config/countries';
import { isRegulatoryPageAvailable } from '@/config/regulatory';

export function requireRegulatoryPage(country: CountryCode, path: string) {
  if (!isRegulatoryPageAvailable(country, path)) notFound();
}
