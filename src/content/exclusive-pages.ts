import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import type { CountryCode } from '../config/countries';

export type ExclusivePage = {
  markets: readonly CountryCode[];
  metadata: Metadata;
  load: () => Promise<{ default: ComponentType<{ country: CountryCode }> }>;
};

/** Keys are unprefixed paths. Existing filesystem pages always take precedence. */
export const exclusivePages: Record<string, ExclusivePage> = {};

export function getExclusivePage(path: string, country: CountryCode): ExclusivePage | undefined {
  const page = Object.hasOwn(exclusivePages, path) ? exclusivePages[path] : undefined;
  return page?.markets.includes(country) ? page : undefined;
}
