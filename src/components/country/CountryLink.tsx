'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useCountryPath } from './CountryProvider';

export default function CountryLink({ href, ...props }: ComponentProps<typeof Link>) {
  const path = useCountryPath();
  const scoped = typeof href === 'string' ? path(href) : href.host || href.hostname || href.protocol ? href : { ...href, pathname: href.pathname ? path(href.pathname) : href.pathname };
  return <Link {...props} href={scoped} />;
}
