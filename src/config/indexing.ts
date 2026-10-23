import { countries, countryCodes, type CountryCode } from './countries';
import { isRegulatoryPageReady } from './regulatory';

// Deliberately empty until each market's copied content has been reviewed.
export const indexing: Record<CountryCode, { ready: boolean; pages: readonly string[] }> = {
  global: { ready: false, pages: [] },
  sa: { ready: false, pages: [] },
  qa: { ready: false, pages: [] },
  kw: { ready: false, pages: [] },
  om: { ready: false, pages: [] },
};

export function canIndex(country: CountryCode, path: string): boolean {
  const setting = indexing[country];
  return process.env.SITE_ENV === 'production' && countries[country].enabled && isRegulatoryPageReady(country, path) && (setting.ready || setting.pages.includes(path));
}

export function hasIndexableMarkets(): boolean {
  return countryCodes.some(code => process.env.SITE_ENV === 'production' && (indexing[code].ready || indexing[code].pages.some(path => canIndex(code, path))));
}
