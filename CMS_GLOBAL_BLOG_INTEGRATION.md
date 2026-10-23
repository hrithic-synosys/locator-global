# Global CMS blog integration

Implemented in the Locator Global website on 23 October 2026. No CMS repository, database, production content, UAE website, deployment or remote Git branch was modified.

## Routes and market isolation

| Public newsroom / blog prefix | CMS market | API family |
| --- | --- | --- |
| `/about/newsroom` | `global` | `/api/v1/sites/global/blogs` |
| `/sa/about/newsroom` | `sa` | `/api/v1/sites/sa/blogs` |
| `/qa/about/newsroom` | `qa` | `/api/v1/sites/qa/blogs` |
| `/kw/about/newsroom` | `kw` | `/api/v1/sites/kw/blogs` |
| `/om/about/newsroom` | `om` | `/api/v1/sites/om/blogs` |

Append `/blog` for the index and `/blog/[slug]` for an article. All use the existing `src/app/[market]/about/newsroom/` routes. `src/proxy.ts` retains the internal Global rewrite without exposing `/global`. Unprefixed URLs remain Global, including with Qatar cookies and browser locale. Unsupported `/ae`, `/bh`, `/all`, `/xx` and public `/global` routes return the existing 404.

Each CMS client function requires an explicit supported market. Identical slugs have independent fetch URLs and request memoization entries. Empty countries remain empty, and missing articles return 404 without looking in another market or the old local catalogue. No translations/hreflang relationships are inferred.

`src/lib/cms-blog/urls.ts` centralizes newsroom, blog, pagination, media and content links. `switchCountryPath()` in `src/lib/country/paths.ts` sends article switches to the target market's blog index and clears newsroom/blog pagination on switches. It deliberately does not assume an equivalent article exists. Existing navigation and flags remain in place.

## Local configuration and public requests

The ignored local `.env` is configured with the owner-confirmed setting:

```env
CMS_API_BASE_URL=http://localhost:5000/api/v1
```

The same example appears in `.env.example`. This variable is server-only; it is not exposed through `NEXT_PUBLIC_*` or the Next config. Restart the website server after changing it. For hosting, supply the actual reachable hosted CMS API origin plus `/api/v1`; a deployed website cannot use this computer's localhost.

`src/lib/cms-blog/client.ts` exports:

| Function | GET request relative to the configured base |
| --- | --- |
| `listBlogs(market, page, limit, q, tag, featured)` | `sites/:market/blogs?page=1&limit=12` |
| `getFeaturedBlogs(market, limit)` | `sites/:market/blogs/featured?limit=6` |
| `getBlogSlugs(market)` | `sites/:market/blogs/slugs` |
| `getBlog(market, slug)` | `sites/:market/blogs/:encodedSlug` |
| `getRelatedBlogs(market, slug, limit)` | `sites/:market/blogs/:encodedSlug/related?limit=3` |

The API base is validated as HTTP(S), without credentials, query or fragment. Relative URL construction retains `/api/v1`. Requests omit credentials, never forward staff cookies/tokens, reject redirects and time out after eight seconds. Filters and limits are validated; there are no user-controlled API origins or market/category override queries.

`validation.ts` validates envelopes, exact market, Blog category, article format, publication dates, optional status, content version 2, every nested block, media and pagination consistency. Malformed or out-of-scope responses fail rather than being filtered into misleading counts. A null category cannot prove Blog scope and is rejected. Related responses can omit the full article format/body fields; the dedicated related endpoint and validated category/market establish their scope.

## Presentation and source files

- `src/app/[market]/about/newsroom/page.tsx`: fetches three scoped records per backend page (`?blogPage=2`) for both the Blog tab and the video/blog feed. Other newsroom sections remain intact.
- `src/app/[market]/about/newsroom/blog/page.tsx`: fetches twelve records per page; supports `page`, `q`, `tag` and `featured`. Pagination retains filters and the active prefix. The first returned record is the lead on each page, followed by that page's remaining records exactly once. No separate featured request changes catalogue order.
- `src/app/[market]/about/newsroom/blog/[slug]/page.tsx`: request-time article/detail, related records, metadata and JSON-LD; no static slug gate or build-time catalogue. Newly published slugs work without rebuilding.
- `src/components/about/newsroom/blog/BlogArticle.tsx`: one CMS v2 renderer across all markets. Its layout, CSS, preparation of unique heading anchors and interactive ToC derive from the CMS preview.
- `BlogListing.tsx`: keeps the existing listing-card design, with empty states and nullable images.
- `RichText.tsx`: parses only the supported inline tags into React elements, discards executable attributes and blocks unsafe destinations. No raw CMS block HTML injection.
- `src/lib/cms-blog/types.ts`: website-local types adapted from the CMS contract; unrelated root types and country configuration are untouched.
- `seo.ts`: market-aware canonicals, Open Graph, real author/dates, breadcrumbs and safely serialized JSON-LD.
- `teasers.ts`, `SoftwareBlog.tsx`, `RegulatoryBlogFeed.tsx`, `BlogSection.jsx` and `BlogCards.jsx`: existing secondary blog cards now receive the active market's CMS records. Legacy display tag labels are not guessed to be CMS tag slugs. Secondary outages display an unavailable message; they do not take commercial pages down or substitute static posts. Homepage animation/card design remains in `BlogCards.jsx`.
- `error.tsx` / `loading.tsx` beneath newsroom: loading, error and retry states. Genuine article absence uses the existing not-found view. With streamed responses, the initial HTTP status may already be 200; the final not-found view includes crawler exclusion.

Supported blocks: H2/H3 with anchors/ToC labels/visibility, paragraphs, quotations with citations, bullets/checklists, ordered lists, figures with captions, tables with captions, both overlay alignments with optional CTA, image/table splits on either side with tone/kicker and nested text order. Optional banner, author/avatar, summary icons and related cards follow the reference. Draft placeholders are omitted. Article content is server rendered even though ToC/share controls hydrate on the client.

Related cards, View all, breadcrumbs, share URLs and pagination use the active market's real public routes. Root-relative commercial links such as `/get-a-quote` follow the existing country policy. Explicit country, external, editorial, hash, mail and phone destinations remain intentional; media URLs never receive country prefixes.

The reference's normal `<img>` approach is retained for validated CMS media in article/list/feed cards, so `next/image` is not opened to arbitrary remote hosts. Absolute HTTP(S) URLs stay absolute. `/uploads/...` resolves against the CMS backend origin; `/blog/...` remains a website asset. Alt text, supplied dimensions and image/table captions are preserved in the corresponding content figures/tables. Other website images retain their existing Next Image behavior.

## SEO, sitemap and freshness

Article canonicals and Open Graph URLs use the existing `siteUrl` and exact market route. An absent CMS canonical uses that URL; a supplied canonical differing from it is a visible integration error requiring editorial review. It is neither silently overwritten nor allowed to identify a Global article as UAE or another country's article. Correct or clear such CMS metadata before publication. Optional OG media is resolved centrally. JSON-LD escapes `<`; absent author/images are omitted rather than invented.

`src/app/sitemap.ts` retains unrelated routes and fetches each enabled market's complete eligible slug list independently when indexing is enabled. CMS timestamps supply article `lastModified`. It does not copy Global slugs to other countries. Existing readiness rules in `src/config/indexing.ts` are preserved: all markets are currently unready, so the sitemap is deliberately empty and pages remain noindex. Enabling indexing is a separate content-readiness decision. Existing redirect mappings are unchanged; CMS previous-slug fields do not create new redirects automatically.

Blog/newsroom routes and the sitemap render at request time. CMS fetches use `cache: 'no-store'`; React `cache()` only memoizes within the server render using market plus slug/filter arguments. There is no second persistent Next data cache, full-route snapshot, slug-only cache or publish webhook. API/CDN caches still follow `public, max-age=60, stale-while-revalidate=300`; therefore publication and archival are not instantaneous and upstream stale content can remain visible during its configured cache window. A hosting proxy must not add an unreviewed HTML/API cache on top.

For deterministic development inspection, run the isolated fixture browser test, which serves `Cache-Control: no-store` responses. Real API inspection remains subject to the backend's cache policy; this implementation does not bypass TLS or claim an unsupported cache purge feature.

## Live content inventory and cutover

Read-only local API checks succeeded for all five markets: list, featured, complete slugs and a deliberately missing detail. **Global, Saudi Arabia, Qatar, Kuwait and Oman each currently have zero eligible published Blog articles.** Real populated detail/related rendering could not be verified because those catalogues are empty; their rendering and failure cases were verified with fixtures.

The old website contained twelve static reference slugs, previously served under every market prefix. None occurs in the current five CMS slug lists. This is a reference comparison, not a claim that those old UAE-oriented articles belong in every country. The full inventory is in the `CMS_LIVE_INVENTORY` line of `.verification/cms-live-tests.log`.

The original `blog-index.ts`, `blog-content.ts`, legacy `BlogBlocks.tsx` and assets are preserved for migration/reference. Live pages, related feeds and sitemap no longer import those static records. Empty CMS catalogues now show the deliberate empty state; old records are not a runtime fallback. Before production cutover, review ownership/content for each market and publish the intended records through the CMS. No automatic import, production write or deletion was performed.

## Validation and evidence

Commands:

```powershell
npm run type-check
npm run build
node --test scripts/cms-global-blog.test.cjs scripts/multi-country.test.mjs scripts/turnstile.test.cjs
$env:CMS_LIVE_TEST='true'; npm run test:cms-blog
npm run test:cms-blog:browser
npm run lint
```

The browser script requires Playwright and a browser. Set `PLAYWRIGHT_MODULE` to a supplied package path if it is not installed locally; `CHROME_PATH` can identify installed Chrome. `CMS_PREVIEW_PATH` can override the local CMS preview source location. `SCREENSHOT_DIR` selects an output directory. These are test-only settings; fixtures never enter production rendering.

Executed results:

- TypeScript and optimized production build passed. The first sandboxed build could not connect to a Tailwind/Turbopack worker; rerunning with the required local process permissions passed.
- Combined fixture/country/Turnstile suite: 29 passed, zero failed, one separately enabled live test skipped. Tests cover the five scopes, same-slug isolation, no fallback, error/404 distinctions, backend counts, full v2 blocks, safe links/images/JSON-LD, SEO, sitemap and country switching.
- Separately enabled live public API tests passed; no CMS data was changed. All catalogues were empty as described above.
- Production-server/headless Chrome fixture checks passed at 1440px and 390px, including root URLs with Qatar cookies/locale, all five newsroom/blog routes, invalid country paths, new post publication after server startup, empty/outage/wrong-market/404 cases, optional banner, keyboard ToC, reduced motion, related/share/CTA prefixes and image loading.
- Comparing seventeen content-block rectangles with the actual CMS preview under the same viewport, website fonts and container produced **0px maximum geometry difference** at both widths. Desktop/mobile screenshots were also inspected. This is measured fixture layout parity, not a claim of universal pixel equality for every possible CMS article.
- Repository-wide lint remains blocked by existing issues: before this work, 73 errors/27 warnings; after, 72 errors/27 warnings. No new lint diagnostics were introduced. Existing unrelated failures were not disabled.

Local evidence (ignored by Git): `.verification/cms-tests.log`, `cms-live-tests.log`, `cms-build.log`, `cms-type-check.log`, `cms-lint-before.log`, `cms-lint-after.log`, `cms-browser.log`, plus `cms-blog/cms-global-article-{1440,390}.png` and matching reference screenshots.

Before hosting: provide the hosted API URL, publish and verify market-owned content, review any canonical mismatches, then review indexing readiness. No deployment or push was performed.
