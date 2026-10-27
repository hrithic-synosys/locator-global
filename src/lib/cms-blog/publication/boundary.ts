import { NextResponse } from "next/server";
import type { CountryCode } from "../../../config/countries";
import { countryCodes, countries } from "../../../config/countries";
import { hasIndexableMarkets } from "../../../config/indexing";
import { countryPath } from "../../country/paths";
import { pinRelease, type Pointer } from "./store";

export const PIN_HEADER = "x-locator-publication-pins";

/** Real HTTP status before App Router starts streaming. No stale rollback. */
function statusPage(status: 404 | 410 | 503, market: CountryCode) {
  const title =
    status === 503
      ? "Articles are temporarily unavailable"
      : status === 410
        ? "This article is no longer available"
        : "Article not found";
  const detail =
    status === 503
      ? "Please try again shortly."
      : "Explore the newsroom for our latest articles.";
  const home = countryPath("/", market);
  const newsroom = countryPath("/about/newsroom", market);
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | LOCATOR</title><style>body{margin:0;color:#0b1220;background:#f5f9ff;font:16px/1.65 Arial,sans-serif}header{padding:24px max(24px,6vw);background:white;border-bottom:1px solid #e1e9f6}a{color:#1360ee}header img{width:145px;height:auto;display:block}header a{font-size:24px;font-weight:800;text-decoration:none}main{max-width:720px;margin:clamp(40px,10vh,120px) auto;padding:0 24px}section{text-align:center;background:linear-gradient(145deg,#f5f9ff,#fff 72%);border:1px solid #e1e9f6;border-radius:20px;padding:clamp(24px,5vw,56px)}small{color:#1360ee;font-weight:bold;letter-spacing:.12em}h1{font-size:clamp(24px,3vw,32px);line-height:1.2}nav{display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;margin-top:28px}.primary{display:inline-flex;text-decoration:none;background:#1360ee;color:white;border:0;border-radius:8px;padding:12px 20px;font:inherit;cursor:pointer}</style></head><body><header><a href="${home}"><img src="/brand/logo-wordmark.png" alt="LOCATOR" width="145" height="50"></a></header><main><section><small>NEWSROOM</small><h1>${title}</h1><p>${detail}</p><nav>${status === 503 ? '<a class="primary" href="">Try again</a>' : ""}<a href="${newsroom}">Visit newsroom</a><a href="${home}">Home</a></nav></section></main></body></html>`;
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      ...(status === 503 ? { "Retry-After": "60" } : {}),
    },
  });
}

export async function publicationBoundary(market: CountryCode, route: string) {
  const pins: Partial<Record<CountryCode, Pointer>> = {};
  const sitemap = route === "/sitemap.xml" && hasIndexableMarkets();
  const article = route.match(/^\/about\/newsroom\/blog\/([^/]+)\/?$/);
  // Newsroom also contains videos, news and announcements. Its blog panel
  // handles empty/unavailable delivery locally; never gate that whole page.
  const feed = /^\/about\/newsroom\/blog\/?$/.test(route);
  if (!sitemap && !article && !feed) return { pins };
  try {
    const markets = sitemap
      ? countryCodes.filter((code) => countries[code].enabled)
      : [market];
    for (const code of markets) {
      const release = await pinRelease(
        process.env.LOCATOR_PUBLISHED_ROOT || "",
        code
      );
      pins[code] = release.pointer;
      if (article) {
        let slug: string;
        try {
          slug = decodeURIComponent(article[1]);
        } catch {
          return { response: statusPage(404, market), pins };
        }
        const result = release.lookup(slug);
        if (result.status === 308)
          return {
            response: NextResponse.redirect(result.value.publicUrl, 308),
            pins,
          };
        if (result.status === 404 || result.status === 410)
          return { response: statusPage(result.status, market), pins };
      }
    }
    return { pins };
  } catch {
    // Log a safe code, never storage paths, editorial data or raw stack traces.
    console.error("LOCATOR_PUBLICATION_UNAVAILABLE", market);
    return { response: statusPage(503, market), pins };
  }
}
