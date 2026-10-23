import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import type { CountryCode } from '../config/countries';
import { getRegulatoryEntry, isRegulatoryPageAvailable } from '../config/regulatory';

export type ExclusivePage = {
  markets: readonly CountryCode[];
  section?: 'regulatory';
  metadata: Metadata;
  load: () => Promise<{ default: ComponentType<{ country: CountryCode }> }>;
};

/** Keys are unprefixed paths. Existing filesystem pages always take precedence. */
export const exclusivePages: Record<string, ExclusivePage> = {};

export function getExclusivePage(path: string, country: CountryCode): ExclusivePage | undefined {
  if (!isRegulatoryPageAvailable(country, path)) return undefined;
  const page = Object.hasOwn(exclusivePages, path) ? exclusivePages[path] : undefined;
  if (page?.section === 'regulatory' && !getRegulatoryEntry(country, path)) return undefined;
  return page?.markets.includes(country) ? page : undefined;
}
