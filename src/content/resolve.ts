import type { CountryCode } from '../config/countries';
import type { ContentOverrides, PageContentMap } from './pages';
import { globalContent } from './global';
import { qaContent } from './countries/qa';
import { saContent } from './countries/sa';
import { kwContent } from './countries/kw';
import { omContent } from './countries/om';

const overrides: Record<CountryCode, ContentOverrides> = { global: {}, qa: qaContent, sa: saContent, kw: kwContent, om: omContent };

/** Merge sections, keep missing defaults; arrays and scalar values replace. No mutation. */
export function mergeContent<T>(defaults: T, override: unknown): T {
  if (override === undefined) return defaults;
  if (defaults && override && typeof defaults === 'object' && typeof override === 'object' && !Array.isArray(defaults) && !Array.isArray(override)) {
    const result = { ...defaults } as Record<string, unknown>;
    for (const [key, value] of Object.entries(override)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      result[key] = mergeContent(result[key], value);
    }
    return result as T;
  }
  return override as T;
}

export function getPageContent<P extends keyof PageContentMap>(page: P, country: CountryCode): PageContentMap[P] | undefined {
  return mergeContent(globalContent[page], overrides[country][page]);
}
