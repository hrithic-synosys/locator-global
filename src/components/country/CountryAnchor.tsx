'use client';

import type { ComponentProps } from 'react';
import { useCountryPath } from './CountryProvider';

/** Keep native anchor behavior (downloads, target, browser navigation). */
export default function CountryAnchor({ href, ...props }: ComponentProps<'a'>) {
  const path = useCountryPath();
  return <a {...props} href={href ? path(href) : href} />;
}
