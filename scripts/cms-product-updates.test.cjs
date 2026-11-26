/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node tests. */
// Product Updates: API scope, validation, caching, webhook, URLs and listing.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { loader } = require("./helpers/cms-test-loader.cjs");
const f = require("./fixtures/cms-blog.cjs");

const markets = ["global", "sa", "qa", "kw", "om"];
const secret = "isolated-product-updates-webhook-secret-32";
const category = { id: "fixture-product-updates", name: "Product Updates", slug: "product-updates" };
const newsCategory = { id: "fixture-company-news", name: "Company News", slug: "company-news" };
const item = (market, slug, extra = {}) => ({
  ...f.card(slug, null),
  market,
  category,
  ...extra,
});
const video = (market, slug) =>
  item(market, slug, { format: "video", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
const detail = (market, slug, extra = {}) => ({
  ...f.detail(slug, null),
  market,
  category,
  ...extra,
});

test("every market reads only its own /product-updates feed, articles and videos included", async () => {
  const l = loader({
    fetchImpl: async (input) => {
      const u = new URL(input);
      const [, , , , market, collection] = u.pathname.split("/");
      assert.equal(collection, "product-updates");
      return Response.json(f.list([item(market, market + "-award"), video(market, market + "-launch")]));
    },
  });
  const api = l.load("src/lib/cms-blog/client.ts");
  for (const market of markets) {
    const result = await api.listProductUpdates(market);
    assert.deepEqual(result.items.map((i) => i.slug), [market + "-award", market + "-launch"]);
    assert.equal(result.items[0].format, "article");
    assert.equal(result.items[0].videoUrl, null);
    assert.equal(result.items[1].format, "video");
    assert.equal(result.items[1].videoUrl, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    assert.equal(result.items[1].category.slug, "product-updates");
  }
  assert.equal(l.requests.length, 5);
});

test("out-of-scope or invalid Product Updates payloads are unavailable, never shown", async () => {
  for (const bad of [
    item("qa", "blog-item", { category: f.category }),
    item("qa", "news-item", { category: newsCategory }),
    item("qa", "webinar-item", { format: "webinar" }),
    item("qa", "no-video-link", { format: "video", videoUrl: null }),
    item("qa", "unsafe-video", { format: "video", videoUrl: "javascript:alert(1)" }),
    item("om", "wrong-market"),
    item("qa", "future", { publishedAt: new Date(Date.now() + 86400000).toISOString() }),
  ]) {
    const l = loader({ fetchImpl: async () => Response.json(f.list([bad])) });
    const { loadCmsResource } = l.load("src/lib/cms-blog/resource.ts");
    const api = l.load("src/lib/cms-blog/client.ts");
    assert.equal((await loadCmsResource(() => api.listProductUpdates("qa"))).status, "unavailable", bad.slug);
  }
  // Blog and Company News validation still reject Product Updates records.
  const l = loader({ fetchImpl: async () => Response.json(f.list([item("qa", "update")])) });
  const { loadCmsResource } = l.load("src/lib/cms-blog/resource.ts");
  const api = l.load("src/lib/cms-blog/client.ts");
  assert.equal((await loadCmsResource(() => api.listBlogs("qa"))).status, "unavailable");
  assert.equal((await loadCmsResource(() => api.listCompanyNews("qa"))).status, "unavailable");
});

test("outages, empty feeds and genuine 404s stay distinct", async () => {
  for (const fetchImpl of [
    async () => { throw new TypeError("connection refused"); },
    async () => new Response("offline", { status: 503 }),
    async () => new Response("not JSON"),
  ]) {
    const l = loader({ fetchImpl });
    const { loadCmsResource } = l.load("src/lib/cms-blog/resource.ts");
    assert.equal((await loadCmsResource(() => l.load("src/lib/cms-blog/client.ts").listProductUpdates("qa"))).status, "unavailable");
  }
  const empty = loader();
  const ready = await empty.load("src/lib/cms-blog/resource.ts").loadCmsResource(() =>
    empty.load("src/lib/cms-blog/client.ts").listProductUpdates("qa"));
  assert.equal(ready.status, "ready");
  assert.equal(ready.data.items.length, 0);
  const missing = loader({ fetchImpl: async () => new Response("{}", { status: 404 }) });
  const api = missing.load("src/lib/cms-blog/client.ts");
  assert.equal(await api.getProductUpdate("qa", "missing"), null);
  assert.equal(await api.getRelatedProductUpdates("qa", "missing"), null);
});

test("detail, related and canonical checks use Product Updates URLs", async () => {
  const l = loader({
    fetchImpl: async (input) => {
      const u = new URL(input);
      if (u.pathname.endsWith("/related"))
        return Response.json({ success: true, items: [video("qa", "other")] });
      const slug = u.pathname.split("/").pop();
      if (slug === "bad-canonical")
        return Response.json({ success: true, article: detail("qa", slug, { seo: { ...f.detail().seo, canonicalUrl: "https://locatorglobal.com/qa/about/newsroom/company-news/bad-canonical" } }) });
      return Response.json({ success: true, article: detail("qa", slug, { seo: { ...f.detail().seo, canonicalUrl: "https://locatorglobal.com/qa/about/newsroom/product-updates/" + slug } }) });
    },
  });
  const api = l.load("src/lib/cms-blog/client.ts");
  const story = await api.getProductUpdate("qa", "award");
  assert.equal(story.slug, "award");
  assert.equal(story.contentVersion, 2);
  await assert.rejects(api.getProductUpdate("qa", "bad-canonical"), /invalid or out-of-scope/);
  const related = await api.getRelatedProductUpdates("qa", "award");
  assert.deepEqual(related.map((r) => r.slug), ["other"]);
  const seo = l.load("src/lib/cms-blog/seo.ts");
  const meta = seo.articleMetadata(story, "product-updates");
  assert.equal(meta.alternates.canonical, "https://locatorglobal.com/qa/about/newsroom/product-updates/award");
  const ld = seo.articleJsonLd(story, "product-updates");
  assert.equal(ld["@graph"][0]["@type"], "NewsArticle");
  assert.equal(ld["@graph"][1].itemListElement[2].item, "https://locatorglobal.com/qa/about/newsroom/product-updates");
  assert.equal(ld["@graph"][1].itemListElement[2].name, "Product Updates");
  // Blog defaults are unchanged.
  assert.equal(seo.publicArticleUrl("qa", "x"), "https://locatorglobal.com/qa/about/newsroom/blog/x");
});

function cachedFixture() {
  const entries = new Map(), definitions = [], reads = [];
  const l = loader({
    env: { CMS_BLOG_REVALIDATION_SECRET: secret, CMS_COMPANY_NEWS_REVALIDATION_SECRET: secret, CMS_PRODUCT_UPDATES_REVALIDATION_SECRET: secret },
    cacheImpl: (fn, keys, options) => {
      definitions.push({ keys, options });
      return async () => {
        const key = JSON.stringify(keys);
        if (entries.has(key)) return entries.get(key).value;
        const value = await fn();
        entries.set(key, { value, tags: options.tags });
        return value;
      };
    },
    revalidateTag: (tag, profile) => {
      assert.deepEqual(JSON.parse(JSON.stringify(profile)), { expire: 0 });
      for (const [key, entry] of entries) if (entry.tags.includes(tag)) entries.delete(key);
    },
    fetchImpl: async (input) => {
      const u = new URL(input);
      const [, , , , market, collection] = u.pathname.split("/");
      reads.push(collection + ":" + market);
      const card = collection === "blogs" ? { ...f.card("story", null), market }
        : collection === "company-news" ? item(market, "story", { category: newsCategory }) : item(market, "story");
      return Response.json(f.list([card], Number(u.searchParams.get("page")), Number(u.searchParams.get("limit"))));
    },
  });
  return {
    api: l.load("src/lib/cms-blog/client.ts"),
    blogHook: l.load("src/app/api/revalidate/blogs/route.ts").POST,
    newsHook: l.load("src/app/api/revalidate/company-news/route.ts").POST,
    updatesHook: l.load("src/app/api/revalidate/product-updates/route.ts").POST,
    reads, definitions,
  };
}
const notify = (path, body, auth = secret) =>
  new Request("http://localhost/api/revalidate/" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth },
    body: JSON.stringify(body),
  });

test("Product Updates has its own cache namespace and tag; webhooks expire only their own feed", async () => {
  const t = cachedFixture();
  const warm = async () => {
    for (const market of ["global", "qa"]) {
      await t.api.listProductUpdates(market);
      await t.api.listCompanyNews(market);
      await t.api.listBlogs(market);
    }
  };
  await warm(); await warm();
  assert.equal(t.reads.length, 6);
  const updates = t.definitions.filter((d) => d.keys[0] === "cms-public-product-updates-v1");
  assert.ok(updates.length > 0);
  assert.ok(updates.every((d) => d.options.revalidate === 60 && d.options.tags.length === 1 && /^cms-public-product-updates:(global|qa)$/.test(d.options.tags[0])));
  assert.ok(t.definitions.filter((d) => d.keys[0] === "cms-public-company-news-v1").every((d) => /^cms-public-company-news:/.test(d.options.tags[0])));

  const res = await t.updatesHook(notify("product-updates", { collection: "product-updates", market: "qa", slug: "story", previousSlug: "old-story" }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true, collection: "product-updates", market: "qa", slug: "story", previousSlug: "old-story", invalidated: "market_product_updates" });
  assert.equal(res.headers.get("cache-control"), "no-store");
  await warm();
  assert.deepEqual(t.reads.slice(6), ["product-updates:qa"]);

  // A Company News notification leaves Product Updates cached, and vice versa.
  assert.equal((await t.newsHook(notify("company-news", { collection: "company-news", market: "global", slug: "story" }))).status, 200);
  await warm();
  assert.deepEqual(t.reads.slice(7), ["company-news:global"]);
});

test("the Product Updates webhook validates configuration, auth and payload", async () => {
  const unconfigured = loader().load("src/app/api/revalidate/product-updates/route.ts").POST;
  assert.equal((await unconfigured(notify("product-updates", { collection: "product-updates", market: "qa", slug: "story" }))).status, 503);
  const t = cachedFixture();
  assert.equal((await t.updatesHook(notify("product-updates", { collection: "product-updates", market: "qa", slug: "story" }, "wrong-secret-wrong-secret-wrong-secret"))).status, 401);
  for (const body of [
    { market: "qa", slug: "story" },
    { collection: "company-news", market: "qa", slug: "story" },
    { collection: "product-updates", market: "zz", slug: "story" },
    { collection: "product-updates", market: "qa", slug: "Bad Slug" },
    { collection: "product-updates", market: "qa", slug: "story", previousSlug: null },
    { collection: "product-updates", market: "qa", slug: "story", extra: true },
  ]) assert.equal((await t.updatesHook(notify("product-updates", body))).status, 400, JSON.stringify(body));
  const wrongType = new Request("http://localhost/api/revalidate/product-updates", {
    method: "POST", headers: { "Content-Type": "text/plain", Authorization: "Bearer " + secret }, body: "{}",
  });
  assert.equal((await t.updatesHook(wrongType)).status, 415);
  // The Company News and Blog webhooks still reject the Product Updates payload.
  assert.equal((await t.newsHook(notify("company-news", { collection: "product-updates", market: "qa", slug: "story" }))).status, 400);
  assert.equal((await t.blogHook(notify("blogs", { collection: "product-updates", market: "qa", slug: "story" }))).status, 400);
});

test("URLs, market switching and the listing use Product Updates paths", () => {
  const l = loader();
  const u = l.load("src/lib/cms-blog/urls.ts");
  const paths = l.load("src/lib/country/paths.ts");
  assert.equal(u.productUpdatesBase("global"), "/about/newsroom/product-updates");
  assert.equal(u.productUpdateHref("om", "release"), "/om/about/newsroom/product-updates/release");
  assert.equal(u.companyNewsHref("om", "release"), "/om/about/newsroom/company-news/release");
  assert.equal(paths.switchCountryPath("/qa/about/newsroom/product-updates/release", "kw"), "/kw/about/newsroom/product-updates");
  assert.equal(paths.switchCountryPath("/qa/about/newsroom/product-updates", "global"), "/about/newsroom/product-updates");
  assert.equal(paths.switchCountryPath("/qa/about/newsroom/company-news/launch", "sa"), "/sa/about/newsroom/company-news");

  const View = l.load("src/components/about/newsroom/blog/BlogListing.tsx").default;
  const empty = renderToStaticMarkup(React.createElement(View, {
    market: "om", collection: "product-updates", posts: [],
    pagination: { page: 1, limit: 12, total: 0, pages: 0 },
  }));
  assert.ok(empty.includes("No product updates yet"));
  assert.ok(empty.includes("New features and releases will appear here"));
  const html = renderToStaticMarkup(React.createElement(View, {
    market: "qa", collection: "product-updates",
    posts: [item("qa", "lead"), { ...video("qa", "clip"), videoUrl: "https://vimeo.com/123456789" }],
    pagination: { page: 2, limit: 12, total: 25, pages: 3 },
    filters: { page: 2, q: "dashboard", tag: "" },
  }));
  assert.ok(html.includes('href="/qa/about/newsroom/product-updates/lead"'));
  assert.ok(html.includes('href="/qa/about/newsroom/product-updates/clip"'));
  assert.ok(html.includes("/qa/about/newsroom/product-updates?page=3&amp;q=dashboard"));
  assert.ok(html.includes("Watch Video"));
  assert.ok(html.includes("LOCATOR Product Updates"));
  assert.ok(!html.includes("/about/newsroom/company-news"));
  assert.ok(!html.includes("/about/newsroom/blog"));
  // Company News wording is unchanged.
  const news = renderToStaticMarkup(React.createElement(View, {
    market: "om", collection: "company-news", posts: [],
    pagination: { page: 1, limit: 12, total: 0, pages: 0 },
  }));
  assert.ok(news.includes("Company announcements will appear here"));
});

test("the newsroom board cards link Product Updates to their own pages", () => {
  const l = loader();
  const { newsroomProductUpdateCard } = l.load("src/lib/cms-blog/teasers.ts");
  const card = newsroomProductUpdateCard({ ...video("sa", "clip"), banner: null });
  assert.equal(card.category, "product");
  assert.equal(card.href, "/sa/about/newsroom/product-updates/clip");
  assert.equal(card.video, true);
  assert.equal(card.cms, true);
});

