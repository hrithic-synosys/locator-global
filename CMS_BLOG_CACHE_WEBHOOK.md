# Public blog caching and CMS notification contract

## Repository and implementation

Inspected branch `feat/caching`, initially clean; no applicable AGENTS.md was found in the repository or its ancestors. Next.js is pinned to **16.2.6**, React to 19.2.4. Cache Components is not enabled. This implementation uses the installed framework's `unstable_cache` Data Cache API, with React request memoization retained. It does not enable Cache Components or alter the page rendering model, styles, blocks, optional banners, metadata, country routing, or unrelated newsroom content.

`src/lib/cms-blog/client.ts` caches validated public results for **60 seconds**. Cache identity includes the normalized CMS base URL, exact market, endpoint family and all function arguments (including page, limit, query, tag, featured selection, slug and related limit). The explicit market tag is `cms-public-blogs:<market>`. Global is its own market, with no aggregation or country fallback.

Covered reads: `/sites/:market/blogs`, `/featured`, `/slugs`, `/:slug`, and `/:slug/related`, all beneath the configured `/api/v1` base. Successful empty lists are cacheable. HTTP failures, network/timeouts, invalid JSON, invalid/wrong-market payloads and missing article/related responses are not saved as successful cache entries. Article canonical validation also occurs before persistence. Request-dependent work stays outside cache scope. No private endpoint, auth token or incoming cookie is added to cacheable requests. There is no authenticated preview endpoint in this integration; Next's draft-mode path bypasses persistent caching.

Public unprefixed newsroom/blog URLs continue to use Global, and `/sa`, `/qa`, `/kw`, `/om` use their respective markets. All existing callers of the public client, including secondary feeds and sitemap reads when enabled, use the same policy.

## Exact webhook contract for the CMS backend sender

**Endpoint:** `POST https://locatorglobal.com/api/revalidate/blogs`

Local development example: `http://localhost:3001/api/revalidate/blogs` (use the actual Global application's port).

**Authentication:** `Authorization: Bearer <shared-secret>` over HTTPS outside local development. No query-string secret, cookies or public client environment variables.

**Global website server environment variables:**

```dotenv
CMS_API_BASE_URL=http://localhost:5000/api/v1
CMS_BLOG_REVALIDATION_SECRET=<server-only-random-secret>
```

The secret must be at least 32 bytes long. Generate 32 random bytes encoded as hex (64 characters), for example `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`, and install it privately on both servers. Never use a `NEXT_PUBLIC_` variable. The website fails closed if the secret is missing or shorter than 32 bytes. Authentication compares fixed-length SHA-256 digests with `timingSafeEqual`. The handler does not log headers, payloads or secrets.

**Recommended matching CMS backend environment names** (the sender still needs implementing in that project):

```dotenv
LOCATOR_GLOBAL_BLOG_REVALIDATION_URL=http://localhost:3001/api/revalidate/blogs
LOCATOR_GLOBAL_BLOG_REVALIDATION_SECRET=<same-secret-as-CMS_BLOG_REVALIDATION_SECRET>
```

The URL is the Global website endpoint, not the CMS API URL. These are proposed sender settings, not variables read by this website. Configure the deployed website URL when hosting. No change to the CMS frontend is needed for this receiver contract.

**Headers:**

```http
Content-Type: application/json
Authorization: Bearer <shared-secret>
```

**JSON body:**

```json
{
  "market": "global",
  "slug": "new-article-slug",
  "previousSlug": "previous-article-slug"
}
```

- `market`: required exact string, one of `global`, `sa`, `qa`, `kw`, `om`. UAE/`ae`, wildcard and aggregate markets are rejected.
- `slug`: required current/last affected slug; 1–240 characters, lowercase alphanumeric words separated by single hyphens. Pass a slug, not a URL or path.
- `previousSlug`: optional previous affected slug after renaming, with the same validation. Omit if unused; do not send null or an empty string.
- Unknown fields are rejected. No `event`, `path`, `tag` or client-controlled cache expression is accepted. Maximum JSON request size is **4096 bytes**, enforced even without Content-Length.

**When the sender must call:** after a committed publication, content/SEO/banner update, archiving, restoration, deletion, slug change, or category/visibility/scheduling change affecting public blogs. For deletion, send the last saved slug. For an article moving between markets, notify **both markets**, using the previous market/slug in one request and the new market/slug in the other. Related-article, author, tag and category edits affecting rendered public blog content should also notify each affected market. Scheduled publication needs the notification when the content actually becomes public; time-based expiry remains the fallback.

Send after the public API reflects the committed change. The CMS should use a durable outbox/job with a short network timeout and bounded exponential retry for network errors and 5xx; alert on persistent authentication/configuration/validation failures. Repeat notifications are safe and idempotent in effect. A successful webhook acknowledges invalidation, not proactive fetching or a new website build. Preserve enough pre-edit data to notify previous slugs/markets after rename, move or deletion.

**Success:** HTTP 200, `Cache-Control: no-store`:

```json
{
  "success": true,
  "market": "global",
  "slug": "new-article-slug",
  "previousSlug": "previous-article-slug",
  "invalidated": "market_blogs"
}
```

`previousSlug` is omitted from the response when absent. Every valid request immediately expires **all** public blog entries tagged for that market: details for old/new slugs, listing/search/pagination variants, featured, related and slug catalogues. Other markets stay cached. Internally this uses `revalidateTag(tag, { expire: 0 })`, rather than the stale-while-revalidate `"max"` profile. The next uncached read must fetch; old content is not intentionally served once the tag has expired. Previously open browser tabs/prefetched client views are not pushed live updates: refresh/navigation is still needed. Requests already in flight can race with publication; the 60-second policy and notification retry remain fallback mechanisms.

**Failures:** all JSON, `Cache-Control: no-store`:

| HTTP | Body error | Meaning |
| --- | --- | --- |
| 400 | `invalid_json` | Missing/unreadable/malformed JSON body. |
| 400 | `invalid_payload` | Wrong fields, unsupported market, invalid slug, or non-object body. |
| 401 | `unauthorized` | Missing or incorrect Bearer authentication. No invalidation occurs. |
| 413 | `payload_too_large` | Body exceeds 4096 bytes. |
| 415 | `json_required` | Content-Type is not application/json. |
| 503 | `not_configured` | Receiver secret missing or too short. |
| 500 | `revalidation_failed` | Cache invalidation failed; retry is safe. |

Error bodies are `{"success":false,"error":"<code>"}`. Unsupported HTTP methods get framework 405 responses. Authentication/configuration is checked before parsing the body. Keep any reverse-proxy-generated error handling separate from these application responses.

## Avoid refilling from the CMS HTTP cache

The API advertises `public, max-age=60, stale-while-revalidate=300`. Caching that response again without bypass could multiply staleness after notification. Each actual origin read therefore uses:

- `fetch` with `cache: "no-store"`, so only the parsed-value Data Cache persists the result;
- request `Cache-Control: no-cache, no-store, max-age=0` and `Pragma: no-cache`;
- a fresh `_locator_fresh=<UUID>` query parameter, excluded from the stable application cache identity.

The current CMS route validation accepts this additional query parameter. It is a transport cache buster, not a security credential. Configure intermediaries to honor query strings/cache bypass headers; do not normalize away this parameter or cache solely by pathname. If hosting adds an origin-side output cache that ignores these controls, purge/bypass that layer before sending the notification. The receiver cannot purge an independently misconfigured proxy or a browser's existing asset cache. Media files overwritten at an unchanged URL may need versioned filenames or their own purge policy; this change caches public article data, not image bytes.

## Runtime and hosting limits

- Requires a running **Node.js Next server** (`npm run build`, then `npm start` or equivalent). Installed Next 16.2.6 requires Node >=20.9.0; local verification used Node 24.21.0. It is not a static export and the webhook is not an Edge handler. Existing email/API routes also require a server runtime.
- The actual repository has no custom shared cache handler, Cache Components configuration, Docker/PM2/nginx topology, or multi-instance invalidation coordination. Next's default Data Cache needs a writable `.next/cache` and appropriate persistence in a self-hosted deployment. Do not clear it on every request. Cold/ephemeral caches need a functioning CMS to populate.
- With several processes/replicas, do not assume local memory/files and tag invalidations are globally coordinated. Configure a shared Next-compatible cache/tag invalidation handler and memory-cache policy, or reliably notify every independent instance. A load-balanced webhook hitting one instance alone is insufficient.
- Route rendering remains dynamic; the Data Cache is independent of full-page/HTML caching. Do not add long-lived proxy caching to newsroom/blog HTML or the webhook. Ensure `/api/revalidate/blogs` is routed to the Global **Next server**, not a blanket `/api/*` proxy rule forwarding to CMS.
- Time expiry is request-driven: after 60 seconds, Next can serve the last successful value while refreshing in the background. A failed refresh can retain that previous successful value; errors themselves are not cached. Thus 60 seconds is a freshness/revalidation interval, not a strict maximum staleness guarantee or archive/deletion SLA during a broken webhook/CMS. Immediate notification expires the tag and the existing graceful unavailable state handles failed fresh reads. This does not restore the paused permanent-publication-store architecture or guarantee indefinite offline availability.
- Test using a production build. Development refresh/HMR behavior is not a reliable measure of persistent-cache effectiveness. Keep secret/configuration identical across intended replicas, and use a hosted CMS URL reachable from the website server. `localhost` only works when the backend is on the same network namespace/host.

Framework references: [unstable_cache](https://nextjs.org/docs/app/api-reference/functions/unstable_cache), [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag). The installed 16.2.6 implementation/types were inspected for cache scope restrictions, error writes and the `{ expire: 0 }` API. `use cache` migration requires opting into Cache Components and is outside this change.

## Local verification

```powershell
node --test scripts/cms-blog-cache.test.cjs scripts/cms-global-blog.test.cjs scripts/multi-country.test.mjs scripts/turnstile.test.cjs
npm run type-check
npm run build
node scripts/cms-blog-cache-integration.cjs
```

The production integration test launches its own loopback CMS and Next server, counts origin reads, simulates a stale upstream HTTP cache, checks market/query cache hits and immediate market invalidation, rename/missing behavior, failure exclusion/recovery, then waits through the actual 60-second interval. It never changes real CMS content. Node-only HTML reads do not execute analytics or mail submissions. It stops its own server after testing.

The existing `scripts/cms-global-blog-browser.cjs` rendering suite now uses authenticated fixture notifications before synthetic state changes. It blocks external browser traffic, checks all five markets at desktop/mobile widths, and retains the existing structured-content/layout comparisons. Set `PLAYWRIGHT_MODULE`, `CHROME_PATH` and `SCREENSHOT_DIR` as in the existing local browser setup. Unit tests use a controllable cache adapter; production integration uses Next's real Data Cache.

The CMS unavailable panel's retry uses a normal reload of the exact current URL. Production browser testing exposed a mobile soft-refresh transition that could remain pending after its data request finished. A new document avoids that transition while preserving market, slug and filters; the unexpected-error boundary retains its explicit reset handler. Browser test cases use fresh pages between independent market/availability scenarios, while retaining client pagination and tab checks within each scenario.

Evidence: `.verification/blog-cache-build.log`, `blog-cache-node.log`, `blog-cache-integration.log`, `blog-cache-browser.log`, and `blog-cache-browser/` screenshots (ignored local artifacts). No push or deployment was performed.

Completed results:

- Production build, standalone TypeScript, focused ESLint and diff whitespace checks passed.
- Combined Node suites: **42 passed, zero failed, one optional live-inventory test skipped** (43 total). Cache-specific tests cover all five endpoint families/markets, query identity, controlled expiry, error/negative exclusion, authentication, validation, body bounds and idempotent invalidation.
- Real Next production integration passed, including cache hits, market-only immediate invalidation, stale upstream HTTP bypass, renamed/missing slugs, failed-read recovery and the actual **60-second** time-based refresh without a notification.
- Final browser suite passed at **1440px and 390px** across all five markets, including empty/outage/retry states, new publication without rebuilding, structured blocks, optional banners, metadata/market links and root Global URLs with Qatar cookies. All 17 compared article-block rectangles matched the CMS preview with **0px maximum geometry difference** at both widths.
- A separate read-only request to the actual local CMS returned HTTP 200 and accepted `_locator_fresh`; no real CMS article was created, edited or deleted. Automated browser services/analytics were blocked, and no email was sent.
