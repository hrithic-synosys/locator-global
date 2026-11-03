import type { CountryCode } from '@/config/countries';
import type { IndustryDetailContent } from './detail-schema';
import { globalRentalLeasing } from './rental-leasing/global';
import { globalTransportationLogistics } from './transportation-logistics/global';

// Add each approved industry/market here. Missing entries keep the legacy page;
// no country inherits Global editorial content.
const content: Partial<Record<CountryCode, Record<string, IndustryDetailContent>>> = {
  global: { 'rental-leasing': globalRentalLeasing, 'transportation-logistics': globalTransportationLogistics },
};
export function getIndustryDetailContent(market: CountryCode, slug: string) {
  const pages = content[market];
  return pages && Object.hasOwn(pages, slug) ? pages[slug] : undefined;
}
