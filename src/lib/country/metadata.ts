import type { Metadata } from 'next';
import { countries, type CountryCode } from '../../config/countries';
import { canIndex } from '../../config/indexing';
import { siteUrl } from '../../config/site';
import { countryPath } from './paths';

export function marketMetadata(metadata: Metadata, country: CountryCode, path: string): Metadata {
  const url = `${siteUrl}${countryPath(path, country)}`;
  const ready = canIndex(country, path);
  return {
    ...metadata,
    alternates: { canonical: url },
    openGraph: { ...metadata.openGraph, url, locale: countries[country].locale.replace('-', '_') },
    robots: { index: ready, follow: true, googleBot: { index: ready, follow: true } },
  };
}
