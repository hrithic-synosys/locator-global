import type { CountryCode } from './countries';

export const regulatoryPaths = {
  overview: '/regulatory',
  shahin: '/shahin',
  asateel: '/asateel-certified-obu',
  securepath: '/securepath',
  securepathPremium: '/securepath-premium',
} as const;

export const legacyRegulatoryPaths: readonly string[] = [
  regulatoryPaths.shahin, regulatoryPaths.asateel,
  regulatoryPaths.securepath, regulatoryPaths.securepathPremium,
];

export type RegulatoryEntry = {
  id: string;
  href: string;
  label: string;
  tagline?: string;
  /** Existing icon/description to reuse; omit for a new neutral entry. */
  productSlug?: string;
  /** False until the actual page content has been reviewed for this market. */
  ready: boolean;
  seo?: { title?: string; description?: string };
};

export type RegulatoryNavigation = {
  kind: 'link' | 'dropdown';
  label: string;
  description: string;
  overviewReady: boolean;
  items: readonly RegulatoryEntry[];
};

export const temporaryRegulatoryEntries: readonly RegulatoryEntry[] = [
  { id: 'shahin', href: regulatoryPaths.shahin, label: 'SHAHIN', productSlug: 'shahin', ready: false },
  { id: 'asateel', href: regulatoryPaths.asateel, label: 'ASATEEL Certified OBU', productSlug: 'asateel-certified-obu', ready: false },
  { id: 'securepath', href: regulatoryPaths.securepath, label: 'Securepath', productSlug: 'securepath', ready: false },
  { id: 'securepath-premium', href: regulatoryPaths.securepathPremium, label: 'Securepath Premium', productSlug: 'securepath-premium', ready: false },
];

const temporaryNavigation: RegulatoryNavigation = {
  kind: 'dropdown', label: 'Regulatory GPS Certifications',
  description: 'Certified GPS & OBU solutions built to meet UAE regulatory requirements.',
  overviewReady: false, items: temporaryRegulatoryEntries,
};

/** Override one market here; the temporary entries are shared, never mutated. */
export const regulatoryNavigation: Record<CountryCode, RegulatoryNavigation> = {
  global: { kind: 'link', label: 'Regulatory', description: '', overviewReady: true, items: [] },
  sa: { ...temporaryNavigation },
  qa: { ...temporaryNavigation },
  kw: { ...temporaryNavigation },
  om: { ...temporaryNavigation },
};

export function getRegulatoryNavigation(country: CountryCode): RegulatoryNavigation {
  return regulatoryNavigation[country];
}

export function getRegulatoryEntry(country: CountryCode, path: string) {
  return getRegulatoryNavigation(country).items.find(item => item.href === path);
}

/** Regulatory ownership includes removed legacy paths and all configured new paths. */
export function isRegulatoryPath(path: string): boolean {
  return path === regulatoryPaths.overview || path.startsWith(`${regulatoryPaths.overview}/`) || legacyRegulatoryPaths.includes(path) ||
    Object.values(regulatoryNavigation).some(menu => menu.items.some(item => item.href === path));
}

export function isRegulatoryPageAvailable(country: CountryCode, path: string): boolean {
  if (!isRegulatoryPath(path)) return true;
  if (path === regulatoryPaths.overview) return true;
  return !!getRegulatoryEntry(country, path);
}

export function isRegulatoryPageReady(country: CountryCode, path: string): boolean {
  if (!isRegulatoryPath(path)) return true;
  if (!isRegulatoryPageAvailable(country, path)) return false;
  return path === regulatoryPaths.overview
    ? getRegulatoryNavigation(country).overviewReady
    : getRegulatoryEntry(country, path)?.ready === true;
}

export function isRegulatoryNavigationActive(country: CountryCode, path: string): boolean {
  return path === regulatoryPaths.overview || !!getRegulatoryEntry(country, path);
}
