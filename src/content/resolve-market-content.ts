import type { CountryCode } from "@/config/countries";
import { mergeContent } from "./resolve";
import type { ContentOverride } from "./page-schema";

// Shared means the preserved baseline, not the Global website's new copy.
// Missing fields inherit the baseline; only this market's override is applied.
// Arrays replace in full. Stable-ID records can be overridden field by field.
export function resolveMarketContent<T>(
  shared: T,
  overrides: Partial<Record<CountryCode, ContentOverride<T>>>,
  market: CountryCode
): T {
  return structuredClone(mergeContent(shared, overrides[market]));
}
