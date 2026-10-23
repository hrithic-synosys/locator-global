import type { Metadata } from 'next';
import { countries, type CountryCode } from '../../config/countries';
import { canIndex } from '../../config/indexing';
import { siteUrl } from '../../config/site';
import { countryPath } from './paths';
import { getRegulatoryEntry } from '../../config/regulatory';

export function marketMetadata(metadata: Metadata, country: CountryCode, path: string): Metadata {
  const url = `${siteUrl}${countryPath(path, country)}`;
  const ready = canIndex(country, path);
  const seo = getRegulatoryEntry(country, path)?.seo;
  return {
    ...metadata,
    ...(seo?.title !== undefined ? { title: seo.title } : {}),
    ...(seo?.description !== undefined ? { description: seo.description } : {}),
    alternates: { canonical: url },
    openGraph: { ...metadata.openGraph, ...seo, url, locale: countries[country].locale.replace('-', '_') },
    robots: { index: ready, follow: true, googleBot: { index: ready, follow: true } },
  };
}
