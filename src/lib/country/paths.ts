import { countries, resolveCountry, type CountryCode } from '../../config/countries';

/** Only public page paths are scoped. Files, APIs and external URLs are untouched. */
export function isPagePath(href: string): boolean {
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  const path = href.split(/[?#]/)[0];
  return !/^\/(?:api|_next)(?:\/|$)/.test(path) && !/\.[^/]+$/.test(path);
}

export function stripCountry(path: string): string {
  const country = resolveCountry(path);
  const prefix = country.code === 'global' ? (path === '/global' || path.startsWith('/global/') ? '/global' : '') : country.prefix;
  if (!prefix) return path;
  const rest = path.slice(prefix.length);
  return !rest || rest.startsWith('?') || rest.startsWith('#') ? `/${rest}` : rest;
}

/** Idempotent: an explicitly scoped destination keeps its own market. */
export function countryPath(href: string, country: CountryCode): string {
  if (!isPagePath(href)) return href;
  if (resolveCountry(href).code !== 'global') return href;
  const path = stripCountry(href);
  const prefix = countries[country].prefix;
  if (!prefix) return path;
  return prefix + (path === '/' ? '' : path.startsWith('/?') || path.startsWith('/#') ? path.slice(1) : path);
}

/** Articles are independent across markets; switch to the target blog index. */
export function switchCountryPath(href: string, country: CountryCode): string {
  const path = stripCountry(href);
  if (/^\/about\/newsroom\/blog\/[^/?#]+/.test(path)) return countryPath("/about/newsroom/blog", country);
  if (/^\/about\/newsroom(?:\/blog)?(?:[?#]|$)/.test(path)) return countryPath(path.split(/[?#]/)[0], country);
  return countryPath(path, country);
}
