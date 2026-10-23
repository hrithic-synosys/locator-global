import { NextResponse, type NextRequest } from 'next/server';
import { resolveCountry } from './config/countries';
import { canIndex } from './config/indexing';
import { stripCountry } from './lib/country/paths';
import { isRegulatoryPageAvailable } from './config/regulatory';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Leave static resources, API contracts, Next internals and metadata files alone.
  if (/^\/(?:api|_next)(?:\/|$)/.test(pathname) || /\.[^/]+$/.test(pathname)) return NextResponse.next();

  const country = resolveCountry(pathname);
  const destination = request.nextUrl.clone();
  // `global` is an internal segment, never a second public global website.
  if (!isRegulatoryPageAvailable(country.code, stripCountry(pathname))) {
    destination.pathname = `/${country.code}/__unavailable__`;
  } else if (pathname === '/global' || pathname.startsWith('/global/')) {
    destination.pathname = '/global/__unavailable__';
  } else if (country.code === 'global') {
    destination.pathname = `/global${pathname === '/' ? '' : pathname}`;
  }
  const response = destination.pathname === pathname ? NextResponse.next() : NextResponse.rewrite(destination);
  if (!canIndex(country.code, stripCountry(pathname))) response.headers.set('X-Robots-Tag', 'noindex, follow');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
