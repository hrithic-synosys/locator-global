# Editing content by page and market

Video Telematics is the first migrated page. The route stays at `/service/video-telematics` for Global and `/qa/service/video-telematics`, `/sa/...`, `/kw/...`, `/om/...` for countries. The renderer, images, styles and animation components are shared. Approved copy is stored separately by market.

## Files to edit

```text
src/content/
  page-schema.ts                    # Common CTA, card and partial-override types
  resolve-market-content.ts         # Shared defaults + this market only
  shared/software-cta.ts            # Existing shared CTA defaults
  pages/video-telematics/
    schema.ts                      # Available sections and fields
    shared.ts                      # Preserved original content for all markets
    global.ts                      # Approved Global PDF copy
    qa.ts                          # Preserved tutorial draft, disabled
    sa.ts                          # Saudi Arabia overrides
    kw.ts                          # Kuwait overrides
    om.ts                          # Oman overrides
    resolve.ts                     # Registers markets and checks item ordering
```

The page file is `src/app/[market]/service/video-telematics/page.tsx`. It renders the sections and builds metadata from the same resolved content. The existing `src/content/global.ts`, `src/content/countries/*` and `getPageContent()` remain for older pages: do not put Video Telematics updates there.

## How inheritance works

- Global = `shared.ts` + `global.ts`.
- Qatar = `shared.ts` + approved/enabled `qa.ts`.
- Saudi Arabia, Kuwait and Oman = `shared.ts` + their own file.
- A country never inherits the new Global copy. Only change shared defaults when the change is intentionally for every inheriting market.
- An omitted property keeps the default. An empty string or `[]` deliberately clears optional copy. Arrays replace the complete list; records merge by stable ID. Resolved data is cloned, so modifying one result cannot mutate another market.

The Qatar file contained the tutorial examples before this migration. Those examples were preserved and have **`qaVideoTelematicsEnabled = false`**. Replace all placeholder copy with approved Qatar content before changing this flag to true. Saudi Arabia/Kuwait/Oman files are active empty overrides and need no flag.

## Typical edits

Change a Global heading and two paragraphs inside `globalVideoTelematics`:

```ts
hero: {
  heading: "Your approved heading",
  paragraphs: [
    "Your first paragraph.",
    "Your second paragraph.",
  ],
},
```

Update one alert without changing its existing image or position:

```ts
driverAlerts: {
  items: {
    phoneUse: {
      title: "Phone\nUse",
      description: "Your approved description.",
    },
  },
},
```

Stable alert IDs: `yawning`, `seatbelt`, `smoking`, `nodding`, `droopy-eyes`, `talking`, `phoneUse`, `looking-away`. A newline controls the large animated title's line break. Keep labels short enough for phones. Image paths and dimensions live in the shared items and can be overridden together when replacing an asset.

Change a feature or industry by its ID rather than its visible title. For example, `industries.items.school` changes the school card while retaining its image. Adding an item requires a complete item and adding its ID to that section's `order`. Removing an ID from `order` removes it from the rendered list; deleting the override alone restores the shared default.

FAQ entries live under `faq.items` with their displayed order in `faq.order`. Change both the question and answer as approved. Paragraphs and descriptions are plain text and JSX-escaped; do not paste HTML. The optional description section supports a list of plain-text `emphasis` phrases without accepting raw HTML.

The available top-level sections are:

```text
hero, description, introFeatures, driverAlerts, showcase, journeySteps,
industries, whyChoose, video, faq, blogs, finalCta
```

`sectionOrder` is the complete ordered list for that market. `enabled` switches individual sections on/off. To show a newly supported section, both enable it and include it in `sectionOrder`; to hide it, set `enabled.<section> = false`. Keep `hero` first. Duplicate/unknown section IDs and missing/duplicate ordered-item IDs are rejected. A new visual layout or interaction still requires a new component, schema field and renderer entry once; copy files cannot invent an unsupported component.

Buttons have independent `label` and `href` values in `hero`, `journeySteps.cta` and `finalCta`. Keep internal commercial paths unprefixed (`/get-a-quote`, `/get-a-free-demo`): CountryLink supplies `/qa`, `/sa`, etc. Use a same-page anchor such as `#video-telematics` for exploration. Do not add manual country prefixes to shared buttons. Use distinct asset filenames when changing only one market's image.

## Metadata

Edit `seo.title`, `seo.description`, `seo.ogTitle`, `seo.ogDescription` and `seo.keywords` in the same market file. Global has `absoluteTitle: true` because the approved PDF includes the full title/brand; that prevents the root title template adding another brand suffix. Countries retain their existing metadata/title-template behavior. Canonicals, locale and indexing readiness still come from `marketMetadata`; editing copy does not enable indexing or change the route.

The current Global title is **“Video Telematics & AI Dashcams | LOCATOR”**. The replacement editorial PDF supplies no SEO metadata, so the current SEO settings are preserved. Editorial labels such as H1/H2 and button instructions are not published as body text. The real video player, scoped blog feed, footer and commercial routes remain present. Country copy remains in the shared baseline; Global now uses the replacement PDF's fifteen FAQs and qualified answers about camera features and battery consumption.

## Publishing workflow

1. Identify the page and target market from the editorial document.
2. Map each item to a section: unchanged, edited, added, removed or reordered. Do not remove a section solely because the editorial document omits it.
3. Edit only that market's file. Keep the stable IDs, field types and local image references valid.
4. Check headings, paragraphs, all cards, FAQs, CTA labels/destinations and metadata on desktop/mobile. Check normal and reduced-motion behavior if the page contains animations.
5. Check at least one unaffected country. For this migration, all four country contents have regression coverage against the original data. When intentionally publishing approved country copy later, update the relevant country regression expectation rather than changing the shared baseline to make the test pass.
6. Run `npm run test:page-content`, `npm run type-check`, and `npm run build`. Deploy the new build using the normal release process. These marketing pages are code-based content, independent of CMS blog caching/webhooks.

## Migrating the next page

Create `src/content/pages/<page>/schema.ts`, `shared.ts`, `global.ts`, market files and `resolve.ts`. Start `shared.ts` with that page's current copy; use `ContentOverride<T>` and `resolveMarketContent<T>` for defaults and market isolation. Make its components accept the resolved section data, and call its resolver from both the page and `generateMetadata`. New pages can have different section types; do not force every service and industry into Video Telematics' exact schema. No other marketing page has been silently migrated by this change.

## Validation tools

`scripts/video-telematics-content.test.cjs` checks the original country content, market isolation, stable-ID edits/array replacement, approved Global counts/copy, canonical URLs, local assets and exclusion of draft/instruction text. The original data fixture is in `scripts/fixtures/video-telematics-legacy.json`.

`scripts/video-telematics-browser.cjs` is a manually run local regression test, not production code. Start the synthetic local fixture with `node scripts/helpers/home-performance-server.cjs` after building; set `VIDEO_TEST_ORIGIN` to the origin in `.verification/home-performance/endpoints.json`, plus `PLAYWRIGHT_MODULE` and `CHROME_PATH`, then run the script. It blocks external services/analytics and saves screenshots under `.verification/video-content-browser/`. Do not point the test at a live website or submit real enquiries.

Migration verification: production build, standalone TypeScript and focused ESLint passed. The combined page-content/CMS/cache/country/Turnstile suites passed 46 tests with zero failures and one optional live-CMS test skipped. All 108 supplied Global text fields were checked against the original seven-page PDF after whitespace normalization. Browser checks passed at 1440px and 390px in normal and reduced-motion modes, including all eight alerts, four journey controls, five industry panels, seven FAQ expansions, CTA URLs, Global metadata and country isolation. The new long Global introduction receives a mobile readability treatment; the shorter original country banners retain their prior styling. Screenshots were inspected. No live analytics or form delivery was exercised, and no push or deployment was performed.

## Replacement editorial document — 30 October 2026

`Video telematics Updated  locator global.pdf` supersedes the earlier sample. Global now uses the original hero headline/buttons, two new introductory paragraphs, eight original detection labels with the supplied detection HUD label, four revised operational feature cards, five revised industry panels, fifteen updated FAQs, new CMS-blog section copy and the revised final CTA. The earlier six-card introduction, four-step journey and Why Choose sections are disabled and absent from Global's section order. Their reusable renderers remain available for future approved content. Country files/shared content were not changed by this revision.

Global blog editorial fields are now in `blogs.eyebrow`, `blogs.heading`, `blogs.paragraphs` and `blogs.allArticlesLabel`. These customize the existing live CMS feed; the heading and link remain present if the feed is empty/unavailable. Other pages and country routes that do not supply these optional fields retain their existing blog behavior. The new document has no SEO section, so the existing title without UAE, description and other SEO settings remain unchanged. All 71 replacement text fields were checked directly against the PDF after whitespace normalization.

Replacement validation: production build, TypeScript and focused ESLint passed; the combined suites passed 47 tests with zero failures and one optional live-CMS test skipped. Desktop/mobile browser checks passed at 1440px and 390px with normal/reduced motion, including fifteen FAQ expansions, all alert labels, five industry panels, the absence of the superseded sections, the blog copy/link, metadata, CTA URLs and unchanged country content. New tests also cover the custom Global blog copy when CMS results are empty or unavailable. Evidence is under `.verification/video-updated/`; no real CMS articles, analytics conversions, deployment or push were involved.
