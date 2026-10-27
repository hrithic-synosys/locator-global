import { NextResponse, type NextRequest } from "next/server";
import { resolveCountry } from "./config/countries";
import { canIndex } from "./config/indexing";
import { stripCountry } from "./lib/country/paths";
import { isRegulatoryPageAvailable } from "./config/regulatory";
import { blogContentSource } from "./lib/cms-blog/source";
import {
  publicationBoundary,
  PIN_HEADER,
} from "./lib/cms-blog/publication/boundary";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  // Always strip caller-supplied pins, including API mode and static paths.
  requestHeaders.delete(PIN_HEADER);
  const country = resolveCountry(pathname);
  const internalGlobal =
    pathname === "/global" || pathname.startsWith("/global/");
  if (!internalGlobal) {
    try {
      if (blogContentSource() === "published") {
        const delivery = await publicationBoundary(
          country.code,
          stripCountry(pathname)
        );
        if (delivery.response) {
          if (!canIndex(country.code, stripCountry(pathname)))
            delivery.response.headers.set("X-Robots-Tag", "noindex, follow");
          return delivery.response;
        }
        if (Object.keys(delivery.pins).length)
          requestHeaders.set(PIN_HEADER, JSON.stringify(delivery.pins));
      }
    } catch {
      // Invalid delivery configuration must not silently choose the API source.
      return new NextResponse(
        "Published content configuration is unavailable",
        {
          status: 503,
          headers: { "Retry-After": "60", "Cache-Control": "no-store" },
        }
      );
    }
  }
  // Leave static resources, API contracts, Next internals and metadata files alone.
  if (/^\/(?:api|_next)(?:\/|$)/.test(pathname) || /\.[^/]+$/.test(pathname))
    return NextResponse.next({ request: { headers: requestHeaders } });

  const destination = request.nextUrl.clone();
  // `global` is an internal segment, never a second public global website.
  if (!isRegulatoryPageAvailable(country.code, stripCountry(pathname))) {
    destination.pathname = `/${country.code}/__unavailable__`;
  } else if (pathname === "/global" || pathname.startsWith("/global/")) {
    destination.pathname = "/global/__unavailable__";
  } else if (country.code === "global") {
    destination.pathname = `/global${pathname === "/" ? "" : pathname}`;
  }
  const response =
    destination.pathname === pathname
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : NextResponse.rewrite(destination, {
          request: { headers: requestHeaders },
        });
  if (!canIndex(country.code, stripCountry(pathname)))
    response.headers.set("X-Robots-Tag", "noindex, follow");
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
