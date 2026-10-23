import { getRegulatoryNavigation, type RegulatoryEntry } from '@/config/regulatory';
import type { CountryCode } from '@/config/countries';
import { REGULATORY_PRODUCTS } from './data';

export function regulatoryCard(entry: RegulatoryEntry) {
  const product = REGULATORY_PRODUCTS.find(product => product.slug === entry.productSlug);
  return {
    slug: entry.id,
    href: entry.href,
    name: entry.label,
    tagline: entry.tagline ?? product?.tagline ?? '',
    accent: product?.accent ?? '#1360ee',
    icon: product?.icon ?? REGULATORY_PRODUCTS[0].icon,
  };
}

/** Both navbars and the regional overview consume this one menu presentation. */
export function getRegulatoryDropdown(country: CountryCode) {
  const menu = getRegulatoryNavigation(country);
  return menu.kind === 'dropdown' && menu.items.length ? {
    items: menu.items.map(regulatoryCard),
    base: '', label: menu.label, blurb: menu.description,
  } : undefined;
}
