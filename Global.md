# Locator Global website handbook

Repository reference and maintenance roadmap, verified against the `feat/seo` workspace on 5 November 2026. This describes the checked-out code, including the four tracking-page content updates in the working tree. Hosting configuration and CMS deployment status must be checked on the respective servers.

## Start here

| Task | Where to start |
| --- | --- |
| Change a Global service page | Find its route in `src/app/[market]/service/`, then follow its content import into `src/content/pages/`. |
| Change copy in one country | Edit that market's override or add a market-specific entry to the page's resolver. |
| Publish or edit a blog | Use the CMS for the selected market. The Global website reads published articles through the public API. |
| Change the header, market switcher or navigation links | Check `src/components/country/`, the relevant navbar, and `src/lib/country/paths.ts`. |
| Change a URL or prepare a page for indexing | Check routing, redirects, canonicals, `src/config/indexing.ts` and `src/app/sitemap.ts` together. |
| Diagnose a newsroom or blog issue | Check the market endpoint, CMS response, and frontend cache in the order described below. |

## 1. What this project does

Locator Global is the public marketing and lead-generation site for LOCATOR's fleet telematics, GPS tracking, software, devices, industries and regulatory solutions. One Next.js application serves the Global site and four country variants. The UAE website is a separate project and deployment. The CMS frontend is the editorial interface. The CMS backend owns publishing and serves public article data. This repository renders the website, validates public CMS payloads, caches reads and exposes a cache invalidation webhook.

| Market | Code | Public prefix | Example |
| --- | --- | --- | --- |
| Global | `global` | None | `/service/fleet-telematics` |
| Saudi Arabia | `sa` | `/sa` | `/sa/service/fleet-telematics` |
| Qatar | `qa` | `/qa` | `/qa/industries/field-services` |
| Kuwait | `kw` | `/kw` | `/kw/about/newsroom` |
| Oman | `om` | `/om` | `/om/about/newsroom/blog` |

Global has its own articles. Each country has its own articles, even when two markets use the same slug. Shared marketing copy is a separate concern and follows the page's content resolver.

## 2. Technology and local workflow

- **Application** — Next.js 16.2.6 App Router with Turbopack, React 19.2.4, TypeScript 5.x, and some existing JSX modules. Routes and data fetching generally run on the server. Interactive sections use `'use client'`.
- **Design** — Tailwind CSS 4 and PostCSS, global styles in `src/app/globals.css`, and section-specific styles in components. Inter and Poppins are bundled through `next/font/local`. The site uses Next Image for local assets, Lucide for icons, and GSAP and Framer Motion for animation.
- **Integrations** — Nodemailer over SMTP for forms, Cloudflare Turnstile for verification, Vimeo for existing videos, and optional GTM and Tawk scripts configured separately for this deployment.
- **Tooling** — npm and `package-lock.json`, ESLint 9, Prettier 3, Node test scripts and Playwright browser fixtures. The installed Next package declares Node.js 20.9 or newer. Use a supported Node version consistent with the server.

From the repo root on Windows PowerShell:

```powershell
npm ci
# Run only if you do not already have a local .env.local.
Copy-Item .env.example .env.local
npm run dev -- --port 3001
```

Open `http://localhost:3001` and compare the same path with and without a country prefix. Use an isolated CMS fixture or a local CMS and keep `SITE_ENV=development` while testing. Restart Next after changing environment variables. For production behavior, use `npm run build` and `npm start`. Set `LOCATOR_VERIFY_BUILD=true` for both commands when you want a separate `.next-verification` output while a dev server uses `.next`. Clear that variable when you want a normal build.

## 3. Folder map

| Path | Purpose |
| --- | --- |
| `src/app/layout.tsx`, `globals.css`, `fonts/` | Root HTML, site metadata, fonts, common styles and deployment-specific scripts. |
| `src/app/[market]/layout.tsx` | Validates the market, provides the country context, and renders the contact dock. |
| `src/app/[market]/page.tsx` | Landing page composition. |
| `src/app/[market]/service/`, `industries/`, `about/` | Page entry points, section composition and metadata. |
| `src/app/[market]/[...exclusive]/` | Resolves registered market-exclusive paths and returns a not-found result for unknown paths. The registry in `src/content/exclusive-pages.ts` is currently empty. |
| `src/app/api/`, `src/app/actions/` | Server endpoints and form actions. These sit outside the market route tree. |
| `src/app/sitemap.ts`, `src/app/robots.ts` | Dynamic sitemap and crawl directives. |
| `src/components/` | Shared UI, page-specific sections, navigation, forms and article renderers. `service/`, `software/`, `industries/`, `about/`, `country/`, and `layouts/` are useful entry points. |
| `src/content/pages/`, `src/content/shared/` | Page copy, SEO fields, section order, media references, overrides and reusable content such as the software CTA. |
| `src/content/global.ts`, `countries/`, `pages.ts`, `resolve.ts` | Older general content registry and merge utilities. Check route imports before editing these files. Many pages read page-specific content directly. |
| `src/config/` | Market definitions, site origin and brand defaults, indexing gates and regulatory navigation. |
| `src/lib/country/`, `src/lib/cms-blog/` | Market URL helpers and metadata, plus the server-side CMS client, validation, cache policy, article SEO and teaser adapters. |
| `src/lib/email/`, `src/lib/turnstile.ts` | Mail transport and templates, and server-side form verification. |
| `src/hooks/`, `src/constants/`, `src/types/`, `src/utils/` | Shared React hooks, constants, types and utilities. The `@/` alias points to `src/`. |
| `public/` | Static brand, flags, services, industries, newsroom and other media. Use `/services/…` in markup for a file under `public/services/`. |
| `scripts/` | Route tests, content regression tests, CMS fixtures, browser checks and performance utilities. |
| `next.config.ts`, `redirects.ts`, `.env.example` | Next build and image options, legacy redirects, and the environment template. |
| `.next/`, `.next-verification/`, `.verification/`, `node_modules/` | Local build output, scratch verification artifacts and installed dependencies. |

### How the URL becomes a page

```text
/about/newsroom/blog       -> proxy rewrites internally to /global/about/newsroom/blog
/om/about/newsroom/blog    -> already contains the market segment
Both resolve to src/app/[market]/about/newsroom/blog/page.tsx
The page receives market = global or om and requests that market's CMS feed.
```

`src/proxy.ts` keeps the public URL unprefixed for Global and leaves API paths, Next internals and static files outside the rewrite. An explicit public `/global/...` URL goes to the unavailable route. `[market]` is a dynamic segment. `[slug]` supplies an identifier for a product, industry, job or article. An empty directory such as `src/app/about/newsroom/blog/` defines no page. A folder containing only subfolders may simply organize a deeper route. Git does not track empty directories, and the current public route files are under `[market]`.

Use `CountryLink` for internal marketing navigation or `countryPath()` on the server. These preserve intentional country links, query strings and hashes. The market switcher maps an article detail to the destination market's blog index because a matching article in that market is not guaranteed.

## 4. How to change page content

Follow the actual `page.tsx` import chain. The site has several content patterns while pages are migrated.

| Pattern | Pages and entry points | How to edit |
| --- | --- | --- |
| Typed shared baseline plus per-market overrides | `fleet-telematics`, `video-telematics`, `task-manager`, `tracking-devices` under `src/content/pages/` | `schema.ts` defines fields, `shared.ts` is the baseline, and `resolve.ts` selects and validates the market override. Edit `global.ts` or the market file for a scoped change. |
| Explicit Global copy with component defaults | Smart IoT, Industries overview, Who We Are, Mission, Vision, Car GPS Tracker, Car Tracker, Car Tracking System, Vehicle Tracking System | Edit the corresponding `src/content/pages/<page>/global.ts`. These routes select Global content explicitly. Country variants use their existing default components and metadata unless a market override is added. |
| Market and slug registry | Industry details in `src/content/pages/industries/resolve-detail.ts` and `detail-schema.ts` | Add or edit a typed module for the market and slug. The shared industry route uses its legacy data when there is no registered editorial entry for that pair. |
| Existing component copy or data module | Several other routes, including parts of the home page and older tracking pages | Trace the JSX and data imports. Introduce a scoped typed prop or override when only one market needs new copy. |
| Regulatory | `src/content/global-regulatory.ts` and `src/config/regulatory.ts` | Edit Global overview content separately from country menu items, availability and SEO readiness. |
| CMS article | `src/app/[market]/about/newsroom/blog/[slug]/page.tsx` | Edit and publish in the CMS for the exact market. The route and renderer are shared across all slugs. |

### Example A — Edit Fleet Telematics for Global only

1. Open `src/content/pages/fleet-telematics/global.ts`. Check `schema.ts` for supported fields and `shared.ts` for inherited values.
2. Edit the matching section, such as `hero`, `industries`, or `finalCta`. Change `seo` alongside the copy when the brief supplies new metadata.
3. For section order or visibility, use the page's `sectionOrder` and `enabled` fields. Keep the required hero first. For cards, preserve stable item IDs and valid `assetIndex` mappings.
4. Preview `/service/fleet-telematics` and a country path such as `/qa/service/fleet-telematics`. Check the heading, sections, links, and title for both.

The resolver merges nested object fields and replaces entire arrays. A missing field inherits the shared baseline. A deliberate empty array clears an array when the schema allows it. To reorder cards, use the section's `order` array where supported and verify that its IDs exist in `items`. Editing `shared.ts` can affect every market that inherits that field.

### Example B — Edit Field Services for Qatar only

1. Use `src/content/pages/industries/field-services/global.ts` as a structural reference. Define approved Qatar copy in `src/content/pages/industries/field-services/qa.ts` against `IndustryDetailContent`.
2. Import the module in `src/content/pages/industries/resolve-detail.ts` and register it under `qa: { 'field-services': … }`. Leave the Global entry in place. The slug already exists in `src/components/industries/industries-data.ts`.
3. Preview `/qa/industries/field-services`, the unprefixed Global path, and one other country. Check the market-specific metadata, hero, internal links and imagery.

The registered industry content currently covers six Global details: Rental & Leasing, Transportation & Logistics, Courier & Last-Mile Delivery, Construction, Field Services, and Food & Beverage. An existing industry with no override still renders. An unrecognized slug reaches the not-found boundary.

### Content and design checklist

- Treat headings, descriptions, captions and CTA labels as public copy. Keep editorial instructions, placeholder claims and search-intent notes out of the rendered page. If a brief explicitly retains numeric placeholders, flag them for review before launch.
- Reuse `IndustriesHero` for migrated industry pages and existing sections such as `ServiceWhyChoose`, `ServiceFAQ`, `IndustryShowcase`, `ServiceFleetShowcase`, `WhoWeAreNumbers` and `SoftwareCTA` where the content fits. Scope layout changes to the requested section and market.
- Keep the hero eyebrow, H1 and description separate. Compare against a sibling route on mobile and desktop. Fleet Telematics and Video Telematics have distinct hero designs.
- Use approved statistics, testimonials, customer logos, regulatory claims and technical specifications. Review inherited content for market relevance. `TrackingVoices` is excluded from the two Global system pages that use it in country variants. Other review and logo components are separate.
- Keep media paths, image dimensions and alt text accurate. Check long paragraphs, lists, FAQ categories, carousel cards, reduced motion, keyboard focus and layout overflow.
- Use stable keys for repeated sections and cards. Two siblings cannot share the same market-only key. The newsroom distinguishes its board and video/blog sections with separate key prefixes.

## 5. Newsroom and CMS blogs

| Public view | Role |
| --- | --- |
| `/about/newsroom` | Newsroom shell with editorial sections, videos and blog panels. The panels load independently inside Suspense. A market can visit the newsroom with zero blogs. |
| `/about/newsroom/blog` | Blog archive with `page`, `q`, `tag` and `featured` query support. The shell, subscription area and navigation remain available while results load. |
| `/about/newsroom/blog/<slug>` | Dynamic article, including SEO, structured content, optional banner, author, summary and related posts when available. |
| Landing and commercial pages | Secondary blog teasers with market-specific reads. A failed teaser does not take the host page down. |

Prefix these paths with `/sa`, `/qa`, `/kw` or `/om` for the relevant country. The server-only CMS client requires `CMS_API_BASE_URL` ending in `/api/v1` and uses the following public API family:

| Request | What it supplies |
| --- | --- |
| `GET /api/v1/sites/{market}/blogs` | Listing with `page`, `limit`, and optional `q`, `tag`, `featured`. |
| `GET /api/v1/sites/{market}/blogs/featured` | Featured cards with a limit. |
| `GET /api/v1/sites/{market}/blogs/slugs` | Published slugs and modification dates for the sitemap. |
| `GET /api/v1/sites/{market}/blogs/{slug}` | Article details and structured content. |
| `GET /api/v1/sites/{market}/blogs/{slug}/related` | Related cards with a limit. |

`src/lib/cms-blog/validation.ts` validates payloads against the requested market and the public article contract. Details use `contentVersion: 2`. The renderer supports H2/H3 headings, paragraphs, quotes, lists, images, tables, overlays and split blocks. The contract allows articles without banners. `/uploads/…` resolves against the CMS origin, so production media URLs must be reachable by browsers, even when the server-to-server API uses a private network address.

| State | Expected behavior |
| --- | --- |
| Loading | Styled newsroom or section placeholder while the shell remains navigable. |
| Successful empty feed | “No articles yet” or the relevant empty results state. |
| CMS timeout, upstream error or invalid payload | Temporary-unavailability UI with retry on the primary blog surfaces. The newsroom retains its other sections. |
| Article API returns an authoritative 404 | The article route calls `notFound()`. A streamed Next.js response can carry the not-found boundary after headers have been sent, so verify both the response and rendered page when diagnosing status codes. |
| Related feed fails | The main article stays readable and the related section is omitted. |

### Publishing workflow and SEO continuity

1. Publish in the correct CMS market and confirm the corresponding public API returns the article and its slug.
2. After the public API reflects the change, the CMS sender can invalidate the website cache using the webhook below.
3. Load the public detail, archive, newsroom and, if indexing is enabled for that URL, the sitemap. A new slug is served on demand by the existing `[slug]` route. Article edits and new posts require no frontend rebuild.
4. Keep established slugs stable when they are used by search results, ads or external links. If a slug must change, arrange an explicit permanent redirect and verify the old URL. Sending `previousSlug` to the webhook expires cache entries without creating a redirect.

The active implementation is API-backed. The `feat/publishedcontent` branch and `LocatorData-Test` folder were part of a separate experiment. This checkout has no durable last-known-good article store. Existing cache entries can help during some outages, but a cold cache, restart, expiry or explicit invalidation can still require a working CMS. An unavailable article currently renders a fallback through the page route without a dedicated 503 status contract. Treat outage UX and long-term SEO availability as separate concerns.

## 6. Cache and CMS webhook

Successful parsed public reads are stored in Next.js's Data Cache with `unstable_cache` and a **60-second revalidation interval**. React `cache()` also deduplicates matching work within a server render. The application cache identity includes the API base, market, endpoint, and typed arguments such as slug, page, limit, search, tag and featured. Each market has one tag, `cms-public-blogs:<market>`, shared by its listings, details, featured, related and slugs.

Failed requests, invalid payloads and negative detail/related lookups do not become successful cache entries. Authenticated previews and private CMS endpoints are outside this cache. Time-based revalidation is request-driven, so 60 seconds is a freshness interval rather than a scheduled push or a guarantee of exactly when every browser refreshes.

The CMS advertises `public, max-age=60, stale-while-revalidate=300`. On a real origin read the client sends `cache: "no-store"`, bypass headers and a unique `_locator_fresh` query value. The nonce stays out of the stable application cache key. Keep this transport behavior when extending the client, and ensure any upstream proxy preserves the query string and bypass semantics. Otherwise, revalidation can repopulate the Next cache with a stale HTTP response.

### Exact sender contract

- **Method and path** — `POST /api/revalidate/blogs` on the **Global website** origin, over HTTPS in production.
- **Authentication** — `Authorization: Bearer <shared-secret>`. Set `CMS_BLOG_REVALIDATION_SECRET` on the website to the same secret the CMS sender uses. The website requires a value at least 32 bytes long. Generate a random secret and keep it on the servers. The CMS sender may choose its own environment variable name for its copy.
- **Body** — `Content-Type: application/json`, maximum 4,096 bytes. Required `market` is one of `global`, `sa`, `qa`, `kw`, `om`. Required `slug` and optional `previousSlug` are lowercase alphanumeric segments separated by single hyphens, at most 240 characters. Omit `previousSlug` when it does not apply. Unknown fields and null slug values fail validation.
- **When to send** — After publish, edit, archive, restore, delete or a visibility-affecting change reaches the public API. Use the affected slug for a deletion. For a market move, notify both affected markets separately. For a rename within one market, include the old slug as `previousSlug`.

Example request body:

```json
{"market":"om","slug":"oman-fleet-guide","previousSlug":"old-oman-fleet-guide"}
```

Example success body:

```json
{"success":true,"market":"om","slug":"oman-fleet-guide","previousSlug":"old-oman-fleet-guide","invalidated":"market_blogs"}
```

| HTTP status | Meaning |
| --- | --- |
| 200 | The market tag was expired immediately with `revalidateTag(tag, { expire: 0 })`. The next server read can refill it. Other markets keep their tags. |
| 400 | `invalid_json` or `invalid_payload`. |
| 401 | `unauthorized`. |
| 413 | `payload_too_large`. |
| 415 | `json_required`. |
| 500 | `revalidation_failed`. |
| 503 | `not_configured` because the website secret is missing or too short. |

Responses are `no-store`. The sender should log delivery outcomes without the secret and retry transient delivery failures. A webhook success expires cached data without fetching the article or proactively updating a visitor's already-open tab. Keep the time-based interval as the fallback for missed notifications.

## 7. SEO, routes and release controls

- `marketMetadata()` in `src/lib/country/metadata.ts` builds market-aware canonicals, Open Graph URLs and robots metadata. Keep a new page's H1, title, description and social preview aligned with the approved content. An absolute title is useful when the approved title already includes the brand.
- Article metadata and JSON-LD are in `src/lib/cms-blog/seo.ts`. A CMS-supplied article canonical must exactly match the public market-and-slug URL. A mismatched canonical is treated as an invalid CMS payload. Article and blog index metadata do not infer translations or alternate-market equivalents.
- `src/config/indexing.ts` currently has `ready: false` and an empty `pages` list for **every market**. Pages can be browsable and still receive `noindex, follow`. Changing `SITE_ENV` alone will not make these markets indexable. Release a reviewed page using its unprefixed path in the relevant market's allowlist, or set market-wide readiness after the entire market has been reviewed. Regulatory readiness is a separate gate.
- `src/app/sitemap.ts` builds entries from its route list, known industries/devices/jobs, exclusive pages and market-scoped CMS slugs. It filters through the same readiness logic. The sitemap starts empty with the current readiness settings, and `robots.ts` omits its advertisement until a market has an indexable route. Add eligible code routes to the sitemap list when creating them. With readiness enabled for the new URL, CMS publication can update the dynamic sitemap without a build.
- Global Regulatory lives at `/gps-tracking-regulatory-compliance`. Unprefixed `/regulatory` and older Global certification entry paths permanently redirect to it. Country regulatory menus and their temporary legacy pages are controlled separately. Those legacy entries are currently marked unready, so review local wording and approvals before releasing them for indexing.
- Keep legacy redirects in `redirects.ts` and `next.config.ts` aligned with the public URL strategy. Verify old paths, campaign query strings and final canonical URLs when changing a route.

## 8. Environment and self-hosting

Use `.env.example` as the starting point. Keep real credentials in local ignored env files or the deployment secret store.

| Variables | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public Global origin used by canonicals, share URLs and sitemap. Set it to the correct origin at build and runtime. |
| `SITE_ENV` | Site-level production and indexing switch. Use development for ordinary local checks. |
| `CMS_API_BASE_URL` | Server-to-server API. The local example is `http://localhost:5000/api/v1`. In containers, localhost refers to that container, so use a reachable service address. |
| `CMS_BLOG_REVALIDATION_SECRET` | Server-only webhook bearer secret. |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_TAWK_EMBED_URL` | Optional Global-specific analytics and chat. The root layout gates them on the production site environment. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_ALLOWED_HOSTNAMES` | Turnstile site key, server verification secret and allowed submission hostnames. Use test settings for local verification. |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` | SMTP connection and sender. |
| `QUOTE_RECIPIENT_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, `CAREER_RECIPIENT_EMAIL` | Form destinations. Quote, demo and quick-contact actions use the quote recipient. Set the career recipient explicitly because the handler has a legacy fallback. |

Run the site as a Node/Next.js service behind HTTPS. Dynamic article routes, API handlers, server actions and the cache webhook require a server runtime. Static-file hosting alone cannot run those features. If multiple processes or replicas serve the site, verify that all instances observe cache/tag invalidation. The repository has no custom shared cache handler, so a single successful webhook call is not evidence of cross-instance invalidation. Review reverse-proxy cache rules for blog HTML and the webhook, and verify invalidation through the same ingress visitors use.

## 9. Verification and troubleshooting

```powershell
npm run type-check
npm run test:page-content
npm run test:cms-blog
node --test scripts/cms-blog-cache.test.cjs scripts/multi-country.test.mjs
npm run build
node scripts/cms-blog-cache-integration.cjs
```

The cache integration script starts a production server against a synthetic CMS. Run it after a build using the same output-directory setting. For deeper coverage, `npm run test:cms-blog:browser` uses Playwright and a browser. Playwright is supplied separately from this project's dependencies. The script supports `PLAYWRIGHT_MODULE` when it is provided by the workspace. Check script expectations against the current route policy when running older fixtures. For example, `scripts/multi-country-routes.mjs` still expects an intermediate Global `/regulatory` redirect target in some assertions.

| Symptom | Check first |
| --- | --- |
| A code page appears to be missing | Confirm the public path, market code, route file and slug registry. Check the running dev server and restart it after branch or config changes. Review the regulatory gate for compliance paths. |
| A country changed after a Global edit | Check for a shared baseline edit, a hard-coded component change, or a resolver that selects the wrong market. |
| A CMS article is published but missing from the site | Request the exact market's public list and detail endpoints from the web server. Check publish visibility, slug, market field, content version, canonical and validation. Compare the newsroom and archive, which can request different pages and limits. |
| Old article copy persists | Check whether the public API already serves new content, then verify the webhook market, secret and response. Check upstream/CDN behavior and all web instances. Reload the route in a fresh browser tab to distinguish browser state from server cache. |
| Article media is missing | Inspect the returned media URL from the browser. Check whether `/uploads/` resolves to a public, HTTPS-reachable host. |
| URLs are absent from the sitemap | Check production site mode, market readiness, page allowlist, regulatory readiness where applicable, and the exact market's `/slugs` response for articles. |
| Forms fail | Verify the hostname, Turnstile configuration, SMTP settings and route-specific recipient using test submissions. |

Before releasing a change, verify the requested market and a control market, mobile and desktop layout, navigation and CTA targets, canonical and robots output, and any affected redirects. For CMS work include populated, empty, slow/offline, invalid payload, unknown slug, renamed slug, bannerless article and cache invalidation cases. Use fixtures for destructive publishing scenarios.

## 10. Roadmap

1. **Maintain the current site.** Use the existing market content pattern for each page. Keep Global and country changes separate, with route and content checks alongside broader changes.
2. **Prepare market launches.** Finish editorial and regulatory review per market, confirm approved figures and testimonials, validate local contact and media assets, and enable indexing in deliberate increments.
3. **Operationalize the CMS integration.** Verify the sender against the documented webhook on a staging environment. Monitor API failures and delivery results. Review sitemap, canonical and redirect behavior before directing campaigns to new URLs.
4. **Migrate older marketing pages as briefs arrive.** Move legacy copy into typed market-scoped modules when needed, and preserve country defaults while migrating. Reuse the shared section components where they fit the new brief.
5. **Extend the newsroom when additional article types are approved.** Agree on a versioned CMS contract, publication rules, URLs, cache isolation, empty and failure states, and sitemap behavior before integrating a new feed.
6. **Revisit durable publication only as a separate project.** If serving ranked articles throughout CMS outages becomes a launch requirement, design and test a durable published representation with atomic updates, media availability, deletion and slug-change behavior, and consistent sitemap data. The current cache and webhook remain the active implementation.
