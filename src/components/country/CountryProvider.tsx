'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { countries, type CountryCode } from '@/config/countries';
import { countryPath } from '@/lib/country/paths';

const CountryContext = createContext<CountryCode>('global');

export function CountryProvider({ country, children }: { country: CountryCode; children: ReactNode }) {
  return <CountryContext.Provider value={country}>{children}</CountryContext.Provider>;
}

export function useCountry() {
  return countries[useContext(CountryContext)];
}

export function useCountryPath() {
  const { code } = useCountry();
  return (href: string) => countryPath(href, code);
}

export function useCountryRouter() {
  const router = useRouter();
  const path = useCountryPath();
  return {
    ...router,
    push: (href: string, options?: Parameters<typeof router.push>[1]) => router.push(path(href), options),
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) => router.replace(path(href), options),
    prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) => router.prefetch(path(href), options),
  };
}
