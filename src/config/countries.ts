export const countries = {
  global: { code: 'global', name: 'Global', label: 'Global', prefix: '', flag: '/flags/global.svg', locale: 'en', hreflang: 'x-default', enabled: true },
  sa: { code: 'sa', name: 'Saudi Arabia', label: 'Saudi Arabia', prefix: '/sa', flag: '/flags/saudi-arabia.svg', locale: 'en-SA', hreflang: 'en-SA', enabled: true },
  qa: { code: 'qa', name: 'Qatar', label: 'Qatar', prefix: '/qa', flag: '/flags/qatar.svg', locale: 'en-QA', hreflang: 'en-QA', enabled: true },
  kw: { code: 'kw', name: 'Kuwait', label: 'Kuwait', prefix: '/kw', flag: '/flags/kuwait.svg', locale: 'en-KW', hreflang: 'en-KW', enabled: true },
  om: { code: 'om', name: 'Oman', label: 'Oman', prefix: '/om', flag: '/flags/oman.svg', locale: 'en-OM', hreflang: 'en-OM', enabled: true },
} as const;

export type CountryCode = keyof typeof countries;
export type Country = (typeof countries)[CountryCode];
export const countryCodes = Object.keys(countries) as CountryCode[];

export function isCountryCode(value: string): value is CountryCode {
  return Object.hasOwn(countries, value);
}

export function resolveCountry(path: string): Country {
  const segment = path.split(/[/?#]/)[1] || '';
  return countries[isCountryCode(segment) ? segment : 'global'];
}
