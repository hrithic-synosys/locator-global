import type { CountryCode } from '@/config/countries';
import type { IndustryDetailContent } from './detail-schema';
import { globalRentalLeasing } from './rental-leasing/global';
import { globalTransportationLogistics } from './transportation-logistics/global';
import { globalCourierDelivery } from './courier-last-mile-delivery/global';
import { globalConstruction } from './construction/global';
import { globalFieldServices } from './field-services/global';
import { globalFoodBeverage } from './food-beverage/global';

// Add each approved industry/market here. Missing entries keep the legacy page;
// no country inherits Global editorial content.
const content: Partial<Record<CountryCode, Record<string, IndustryDetailContent>>> = {
  global: {
    'rental-leasing': globalRentalLeasing,
    'transportation-logistics': globalTransportationLogistics,
    'courier-last-mile-delivery': globalCourierDelivery,
    construction: globalConstruction,
    'field-services': globalFieldServices,
    'food-beverage': globalFoodBeverage,
  },
};
export function getIndustryDetailContent(market: CountryCode, slug: string) {
  const pages = content[market];
  return pages && Object.hasOwn(pages, slug) ? pages[slug] : undefined;
}
