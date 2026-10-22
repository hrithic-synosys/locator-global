# Locator Global: multi-country setup

## 1. Project overview

This workspace is the independent clone for **https://locatorglobal.com**. The original **locator.ae** repository, deployment and DNS are outside this implementation. Nothing has been deployed, committed or pushed by this task.

Existing UAE copy, contact details, assets, page markup, CSS and animations remain the defaults. Identical content across markets is intentional at this stage. The navbar indicator is the only intended visual change. Tracking and third-party chat now require the global site's own explicit configuration.

## 2. Supported countries

| Market | Public homepage | Example contact page |
| --- | --- | --- |
| Global | `/` | `/contact` |
| Saudi Arabia | `/sa` | `/sa/contact` |
| Qatar | `/qa` | `/qa/contact` |
| Kuwait | `/kw` | `/kw/contact` |
| Oman | `/om` | `/om/contact` |

The existing route is `/contact`, not `/contact-us`. UAE is excluded because it has its own website; Bahrain is not launching. `/ae`, `/uae`, `/bh` and `/bahrain` return 404. No redirects to locator.ae were added. Careers filters and office information may still mention other countries: those are existing content, not market websites.

## 3. Architecture overview

This project uses Next.js **16.2.6**, React 19 and the App Router. The existing 36 page files were relocated once into a single `[market]` segment; they were not copied per country. Existing slug routes and `generateStaticParams` continue to generate their normal pages for each market.

```text
next.config.ts                         Existing and country-prefixed legacy redirects
redirects.ts                           Original redirect mappings, unchanged
src/
  proxy.ts                             Public global URL -> internal /global URL
  app/
    layout.tsx                         Fonts, styles, tracking, structured data
    [market]/
      layout.tsx                       Validate/prerender markets; provide client context
      not-found.tsx                    Existing error UI inside country context
      page.tsx                         Existing shared homepage
      contact/page.tsx                  Existing shared contact page
      about/newsroom/blog/[slug]/page.tsx
      ...all other existing page routes...
      [...exclusive]/page.tsx           Explicitly registered exclusive pages only
    actions/                           Existing server actions, unchanged
    api/                               Existing HTTP endpoints, unchanged
    robots.ts
    sitemap.ts
  config/
    countries.ts                       Market codes, prefixes, flags, future locale mappings
    indexing.ts                        Market/page readiness, initially disabled
    site.ts                            New site's origin and existing business details
  lib/country/
    paths.ts                           Pure URL helpers
    metadata.ts                        Canonical, Open Graph URL/locale and robots
  components/country/
    CountryProvider.tsx                useCountry/useCountryPath/useCountryRouter
    CountryLink.tsx                    Next Link with market-aware href
    CountryAnchor.tsx                  Native anchor with market-aware href
  content/
    pages.ts                           Typed page/section contracts
    global.ts                          Gradually adopted default content
    countries/{sa,qa,kw,om}.ts          Optional per-market overrides
    resolve.ts                         Typed getPageContent and recursive fallback
    exclusive-pages.ts                 Empty, explicit route ownership registry
public/flags/global.svg                Neutral globe; country flags already existed
scripts/multi-country.test.mjs          Architecture unit tests
scripts/multi-country-routes.mjs        Read-only production HTTP checks
```

The internal segment value `global` is deliberately inaccessible as a public prefix. `/global` and `/global/contact` return 404. Do not link to internal `/global` URLs.

Why this approach: route params identify the market during server rendering and prerendering. No request headers, cookies, geolocation or client-only page rendering are needed. The production build prerenders the shared pages for all five markets; the APIs remain dynamic. This follows Next's [Proxy convention](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) and [static param generation](https://nextjs.org/docs/app/api-reference/functions/generate-static-params).

## 4. How country detection works

Opening `/qa` directly selects `[market]/page.tsx` with `market: 'qa'`. The market layout validates that value and provides Qatar to client descendants. Opening `/qa/contact` selects the same contact page used by all markets, with the same market param. The navbar can render Qatar's flag in the initial HTML without waiting for hydration.

Opening `/contact` is internally rewritten by `src/proxy.ts` to `/global/contact`. The browser keeps `/contact`. Query strings survive the rewrite; fragments remain in the browser. APIs, static files, `/_next`, robots and sitemap bypass the rewrite. Unknown paths reach the exclusive-route handler and call `notFound()` unless explicitly registered. There is no fallback to a homepage.

Known markets and article slugs remain prerendered. Unknown values are rejected by their explicit validation/`notFound()` guards. The market boundary and blog route allow that fallback validation rather than using `dynamicParams=false`, which produced internal Next.js fallback log errors on unknown URLs in this routing arrangement. This does not turn existing known pages into request-time pages.

Server components read params directly:

```tsx
import { countries, type CountryCode } from '@/config/countries';

export default async function Page({ params }: {
  params: Promise<{ market: CountryCode }>;
}) {
  const { market } = await params;
  const country = countries[market];
  return <p>{country.name}</p>;
}
```

Client components use `useCountry()` from `CountryProvider.tsx`. That value also supplies optional future form/analytics attribution (`useCountry().code`). No API payloads or conversion events were changed.

## 5. How to change global content

The existing homepage composition is `src/app/[market]/page.tsx`. Its existing hero is `src/components/HeroSection.tsx`; the `heroHeadlines` array contains three formatted headings and subheadings. Other sections are imported by the homepage. Edit those existing files to change shared defaults across every market, or gradually migrate a section into `src/content/global.ts` using the steps below.

An empty content registry intentionally does nothing. Existing hardcoded JSX is still rendered. Setting a registry value alone will not affect a component until that component reads it.

## 6. How to change only Qatar's homepage heading

The hero is **not yet migrated**. Perform these small steps when you are ready to change it; they are documentation examples, not changes already applied to the website.

1. In `src/app/[market]/page.tsx`, import `getPageContent` and change the existing `Home` function signature. Keep the entire existing return block and all sections:

```tsx
import { getPageContent } from '@/content/resolve';
// CountryCode is already imported in this file.

export default async function Home({ params }: {
  params: Promise<{ market: CountryCode }>;
}) {
  const { market } = await params;
  const content = getPageContent('home', market);
  // In the existing return block, replace only:
  // <HeroSection />
  // with:
  // <HeroSection heroHeading={content?.hero?.heading} />
  // Keep the rest of the return block exactly as it is.
}
```

2. In `src/components/HeroSection.tsx`, change its function signature to:

```tsx
export default function HeroSection({ heroHeading }: { heroHeading?: string }) {
```

Inside its existing `heroHeadlines.map((item, i) => ...)`, change only the existing h1 expression:

```tsx
<h1 style={headlineStyle}>
  {i === 0 && heroHeading !== undefined ? heroHeading : item.heading}
</h1>
```

Keep `headlineStyle`, wrappers, formatted fallback JSX, remaining slides and CSS unchanged. To retain selective bold emphasis in future custom copy, extend the content contract with structured heading parts and render those inside the existing span markup.

3. In `src/content/countries/qa.ts`, use the existing API:

```ts
import type { ContentOverrides } from '../pages';
export const qaContent: ContentOverrides = {
  home: { hero: { heading: 'Your reviewed Qatar homepage heading' } },
};
```

Only Qatar changes. Missing values in every other market retain their existing JSX fallback. To provide a shared default later, set `globalContent.home.hero.heading` in `src/content/global.ts`. Qatar's override wins over that value.

## 7. Other country content

Use the same `ContentOverrides` shape in `src/content/countries/sa.ts`, `kw.ts` or `om.ts`, retaining their respective exports `saContent`, `kwContent`, `omContent`. These files are already wired into `resolve.ts`.

`getPageContent('home', market)` merges nested objects field by field. Missing/undefined fields fall back; arrays replace as a whole. An empty string is an intentional replacement. Add more page keys and section fields to `PageContentMap` in `src/content/pages.ts` as you migrate them. Do not copy page components for identical layouts.

## 8. Country-specific images

The existing optional `home.hero.image` field can hold an asset path, for example `/markets/qa/hero.webp`. Add the file under `public/markets/qa/`, and set it in `qaContent`. Pass that resolved value into the relevant existing component and use `resolvedImage ?? existingImage` for its `Image` source. Preserve width, height, sizes, alt requirements, classes and styles. No image consumer has been migrated automatically. Do not prefix static asset paths with a market.

## 9. Create a Qatar-only page

There are currently **no registered exclusive pages**. Here is a complete future example; do not publish it until you have real reviewed content.

Create `src/content/exclusive/qa/qatar-compliance.tsx`:

```tsx
import SoftwareNavbar from '@/components/software/SoftwareNavbar';
import Footer from '@/components/layouts/Footer';
import type { CountryCode } from '@/config/countries';

export default function QatarCompliance({ country }: { country: CountryCode }) {
  return (
    <main data-market={country}>
      <SoftwareNavbar />
      <section style={{ padding: '120px 28px 60px' }}>
        <h1>Your reviewed Qatar page title</h1>
        <p>Your reviewed Qatar content.</p>
      </section>
      <Footer />
    </main>
  );
}
```

Register it in `src/content/exclusive-pages.ts` using the existing `ExclusivePage` type:

```ts
export const exclusivePages: Record<string, ExclusivePage> = {
  '/qatar-compliance': {
    markets: ['qa'],
    metadata: { title: 'Your reviewed Qatar page title' },
    load: () => import('./exclusive/qa/qatar-compliance'),
  },
};
```

Rebuild. `/qa/qatar-compliance` renders the registered component. Global, Saudi, Kuwait and Oman requests return 404. Metadata and sitemap eligibility follow the same readiness settings as shared pages. The market layout already supplies the dock and country context.

Keys must be normalized absolute paths without query strings, hashes or trailing slashes. Use a unique path: existing filesystem pages always take precedence over this catch-all. A path underneath an existing `[slug]` route belongs to that slug route; do not register exclusive pages under those namespaces. A new regulatory page such as `/qatar-compliance` avoids that conflict. Remove a registration and rebuild to remove its route.

## 10. Create a shared page

Add `src/app/[market]/your-page/page.tsx` once. Keep the route below `[market]`, reuse existing UI components, and export market-aware metadata:

```tsx
import type { CountryCode } from '@/config/countries';
import { marketMetadata } from '@/lib/country/metadata';

export async function generateMetadata({ params }: {
  params: Promise<{ market: CountryCode }>;
}) {
  const { market } = await params;
  return marketMetadata({ title: 'Your page' }, market, '/your-page');
}

export default function Page() {
  return <main>Your reviewed shared page content</main>;
}
```

It is available at `/your-page` and all supported market prefixes. Add its path to `ROUTES` in `src/app/sitemap.ts`; it will only be emitted when readiness permits. For a dynamic route, supply its own `generateStaticParams`, validate the slug, and pass the resolved unprefixed path into `marketMetadata`.

## 11. Add a new country later

1. Add its code, prefix, label, flag and locale to `src/config/countries.ts` and its flag asset under `public/flags/`.
2. Add its initially disabled entry to `src/config/indexing.ts`.
3. Create its typed content override file and wire it into the `overrides` record in `src/content/resolve.ts`. TypeScript flags missing market keys.
4. Rebuild and extend the route tests. Static generation, flag resolution, prefixed legacy redirects and sitemap iteration derive from the centralized country list.

Do not add AE or BH as part of this task. `enabled: false` keeps a configured market out of static generation, indexing and prefixed redirects.

## 12. Country-aware navigation

Existing `next/link` imports were switched to the shared adapter. New components should use it too:

```tsx
import Link from '@/components/country/CountryLink';

<Link href="/contact">Contact</Link>
<Link href="/software#fleet-manager">Fleet manager</Link>
<Link href="/about/newsroom/blog/fleet-tracking-software-real-time-vehicle-management?source=card">Read</Link>
<Link href="https://example.com">External</Link>
```

On Qatar these become `/qa/contact`, `/qa/software#fleet-manager`, and the Qatar blog URL. Global paths remain unprefixed. Explicit country links retain their destination, and already-prefixed links do not get a second prefix. Query strings and hashes are preserved.

For a native anchor, use `CountryAnchor` from `src/components/country/CountryAnchor.tsx`; it retains download, target and normal browser behavior. Components with scoped `styled-jsx` anchors should keep their original `<a>` tag and use `const path = useCountryPath(); <a href={path('/contact')}>...</a>` so scoped styles remain attached.

Use `useCountryRouter()` instead of `useRouter()` for programmatic page `push`, `replace`, and `prefetch`. It retains Next's back/forward/refresh methods. In server code use `countryPath('/contact', market)` directly. Navbar active-item comparisons use `stripCountry(pathname)`; animations and scroll handlers otherwise retain the public pathname.

External URLs, protocol-relative links, `tel:`, `mailto:`, `#anchors`, query-only links, file downloads, assets, `/api` and `/_next` are not scoped. Internal links in rich blog text use the same adapter. API fetch URLs remain unchanged.

There is no existing site-wide country selector, and none was added. If one is added later, `switchCountryPath('/qa/contact?source=nav#form', 'kw')` returns `/kw/contact?source=nav#form`. For an exclusive route check `getExclusivePage(unprefixedPath, destinationCountry)` first; if unavailable use `countryPath('/', destinationCountry)`. The switch helper itself does not claim that a destination page exists. Do not auto-select a country using location or browser language.

An explicit market switch should send that result through the raw Next router/Link or a native anchor. Do not pass an explicit global destination back through the current country's adapter: an unprefixed ordinary navigation link intentionally remains in the current market.

## 13. SEO configuration

`src/config/site.ts` derives the new origin from `NEXT_PUBLIC_SITE_URL`. Its fallback is `https://locatorglobal.com`; a copied `locator.ae`/`www.locator.ae` value is ignored. The local `.env` was left untouched, so replace its copied origin yourself. Existing titles/descriptions remain as requested.

Every existing page's metadata passes through `marketMetadata`. Canonicals and Open Graph URLs identify that page's own market. Blog structured-data page and breadcrumb URLs are also scoped. Locale/hreflang values in the country configuration are readiness mappings; **no hreflang alternatives are published yet**.

Indexing initially defaults to **noindex, follow for every market**, even if `SITE_ENV=production`. Page metadata and proxy `X-Robots-Tag` agree. `robots.txt` allows crawling so search engines can observe noindex; blocking all crawling would prevent them from seeing that instruction. API and Next-internal crawling are disallowed. The sitemap is initially empty, and robots does not advertise it.

When content is ready, edit `src/config/indexing.ts` deliberately:

```ts
// Enable just the reviewed Qatar homepage and contact page:
qa: { ready: false, pages: ['/', '/contact'] },
// OR enable all real Qatar pages after reviewing the whole market:
qa: { ready: true, pages: [] },
```

Paths in `pages` are unprefixed, including `/` for a homepage. `SITE_ENV=production` is also required. Rebuild and verify canonical, robots meta, response headers and sitemap. Only eligible URLs from `ROUTES` and registered exclusive pages are emitted. Static pages require a new build when readiness changes.

Later, add hreflang only for real equivalent pages that are all ready, crawlable and indexable. Do not apply it to exclusive pages or assume identical copied content has been localized. No cross-market canonical consolidation was introduced.

Legacy redirects remain in `redirects.ts`. `next.config.ts` derives equivalent country redirects, so `/qa/contact.html?campaign=one` permanently redirects to `/qa/contact?campaign=one`. Next applies these before Proxy. No original mapping was removed.

## 14. Environment variables

`.env.example` lists configuration names without secrets. Never commit `.env`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Build-time canonical origin; set `https://locatorglobal.com` for production |
| `SITE_ENV` | `development` for previews; `production` permits reviewed indexing and configured integrations |
| `NEXT_PUBLIC_GTM_ID` | Optional global-site GTM container; empty means no GTM |
| `NEXT_PUBLIC_TAWK_EMBED_URL` | Optional approved Tawk embed URL; empty means no external chat widget |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` | Existing mail transport settings |
| `QUOTE_RECIPIENT_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, `CAREER_RECIPIENT_EMAIL` | Existing mail recipients; review for the clone |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_ALLOWED_HOSTNAMES` | Existing verification settings; authorize the new deployment hostname |

The copied hardcoded GTM container was `GTM-W99N62T` and the copied Tawk property was `5ed23f408ee2956d73a601e9/default`. Neither is automatically reused. There are no separate hardcoded GA4/Google Ads IDs in the inspected source; those may be configured inside GTM. Obtain appropriate identifiers and verify conversion settings before enabling tracking. No IDs were invented, and no event contracts or form payloads were changed. Built-in support chat and telephone/WhatsApp controls remain functional.

## 15. Running locally

Use npm and the existing lockfile:

```sh
npm ci
npm run dev
npm run type-check
npm run lint
node --test scripts/multi-country.test.mjs scripts/turnstile.test.cjs
npm run build
npm run start -- --port 3100
# In a second terminal:
node scripts/multi-country-routes.mjs
```

The HTTP test defaults to port 3100; set `TEST_ORIGIN` for another local server. It expects the initial noindex setup. It performs GET requests only and sends no leads. Unit tests mock mail delivery and verification services. Use test mail/verification settings when manually testing forms; this task did not send live leads or conversion events.

Try `/`, `/sa`, `/qa`, `/kw`, `/om`, their `/contact` pages and deep blog/device links. The original user's uncommitted `package-lock.json` change was retained.

## 16. Production deployment

Deploy this clone as a **separate** Next.js project, set its own environment variables, build, and attach locatorglobal.com only to that deployment. Do not repoint locator.ae or share its deployment project settings automatically. No deployment or DNS work was executed.

Use a Next.js-capable Node/serverless host that runs Proxy, route handlers and server actions. Static `output: 'export'` hosting is unsuitable. A reverse proxy must forward public paths and query strings unchanged, permit `/_next` and `/api`, support form POST bodies, and preserve Next's RSC/navigation headers. Do not perform an additional country rewrite in the hosting layer. Any CDN cache must distinguish public market paths and honor Next's cache/Vary behavior. Configure HTTPS, mail sender permissions, Turnstile hostnames and the new tracking properties independently.

## 17. Troubleshooting

| Symptom | Check |
| --- | --- |
| Wrong flag | URL market, `countries.ts`, local flag asset, and whether the component is inside `CountryProvider` |
| Navigation loses prefix | Use `CountryLink`, `CountryAnchor`, `useCountryRouter` or explicit `countryPath`; avoid direct raw internal hrefs |
| Duplicate prefix | Do not concatenate prefixes manually; use the idempotent helper |
| Deep page returns 404 | Actual existing route name, supported market, known slug and registered exclusive-page ownership; rebuild after adding routes |
| `/global` returns 404 | Expected; the public global URL is `/` |
| Country override has no effect | Migrate that component to consume `getPageContent`; confirm export, page key, optional field and passed prop |
| Missing override field | It intentionally falls back to the global object or existing JSX |
| Hydration mismatch | Read market from params/provider; do not resolve initial country with `window.location` or initialize from a default flag |
| Incorrect canonical | Check origin environment at build time and page's `marketMetadata` call |
| Empty sitemap | Expected until production mode and indexing readiness are both enabled |
| Tracking/chat absent | Expected without production mode and explicit global-site identifiers |
| Build worker fails in a sandbox | Turbopack needs to spawn CSS workers; run in a normal local terminal with process execution allowed |

## 18. Future CMS integration

Keep country codes, route ownership and page contracts stable. Replace the file-backed content lookup in `src/content/resolve.ts` with CMS data keyed by page and market, then apply the same fallback policy. Prefer server-side fetching with an explicit page/market cache key and an intentional revalidation policy. Shared components continue consuming their typed section props. Do not expose CMS secrets through client components or convert all pages to request-time rendering simply to determine their market.

## Implementation inventory and validation

New files and responsibilities are shown in the architecture tree. The four country content files and `global.ts` intentionally export empty overrides. No demo business pages were published. Existing page files were relocated under `[market]` with metadata adapters; their rendered content was retained.

Existing navigation consumers changed only their Link import or href adapter; the two navbars additionally read country flags and normalize active-path comparisons. `RoadSection.tsx`, `BlogSection.jsx` and `SupportChat.tsx` adapt programmatic/native navigation. `layout.tsx` moves the dock inside market context and gates copied tracking/chat. `next.config.ts`, `site.ts`, `sitemap.ts`, `robots.ts`, `.gitignore` and `eslint.config.mjs` supply redirect, SEO and verification-artifact support. APIs, server actions, form contracts, CSS files, animation logic and original `redirects.ts` mappings remain unchanged.

Validation results and limitations are recorded in the final implementation report. Re-run the checks above after content or configuration changes. Desktop/mobile screenshots are useful comparisons, but animation phases and lazy images require a settled, controlled capture for a strict pixel comparison. Third-party challenge-service logs are separate from application hydration errors.

Before launch: update reviewed global/regional content and metadata, configure the new origin/mail/Turnstile/tracking settings, verify the independent host, then selectively enable indexing. These remain deliberate owner decisions.
