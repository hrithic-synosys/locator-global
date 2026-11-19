/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node tests. */
// Company News: API scope, validation, caching, webhook, URLs and listing.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { loader } = require("./helpers/cms-test-loader.cjs");
const f = require("./fixtures/cms-blog.cjs");

const markets = ["global", "sa", "qa", "kw", "om"];
const secret = "isolated-company-news-webhook-secret-32b";
const category = { id: "fixture-company-news", name: "Company News", slug: "company-news" };
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

test("every market reads only its own /company-news feed, articles and videos included", async () => {
  const l = loader({
    fetchImpl: async (input) => {
      const u = new URL(input);
      const [, , , , market, collection] = u.pathname.split("/");
      assert.equal(collection, "company-news");
      return Response.json(f.list([item(market, market + "-award"), video(market, market + "-launch")]));
    },
  });
  const api = l.load("src/lib/cms-blog/client.ts");
  for (const market of markets) {
    const result = await api.listCompanyNews(market);
    assert.deepEqual(result.items.map((i) => i.slug), [market + "-award", market + "-launch"]);
    assert.equal(result.items[0].format, "article");
    assert.equal(result.items[0].videoUrl, null);
    assert.equal(result.items[1].format, "video");
    assert.equal(result.items[1].videoUrl, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    assert.equal(result.items[1].category.slug, "company-news");
  }
  assert.equal(l.requests.length, 5);
});

test("out-of-scope or invalid Company News payloads are unavailable, never shown", async () => {
  for (const bad of [
    item("qa", "blog-item", { category: f.category }),
    item("qa", "webinar-item", { format: "webinar" }),
    item("qa", "no-video-link", { format: "video", videoUrl: null }),
    item("qa", "unsafe-video", { format: "video", videoUrl: "javascript:alert(1)" }),
    item("om", "wrong-market"),
    item("qa", "future", { publishedAt: new Date(Date.now() + 86400000).toISOString() }),
  ]) {
    const l = loader({ fetchImpl: async () => Response.json(f.list([bad])) });
    const { loadCmsResource } = l.load("src/lib/cms-blog/resource.ts");
    const api = l.load("src/lib/cms-blog/client.ts");
    assert.equal((await loadCmsResource(() => api.listCompanyNews("qa"))).status, "unavailable", bad.slug);
  }
  // Blog validation still rejects Company News records.
  const l = loader({ fetchImpl: async () => Response.json(f.list([item("qa", "news")])) });
  const { loadCmsResource } = l.load("src/lib/cms-blog/resource.ts");
  assert.equal((await loadCmsResource(() => l.load("src/lib/cms-blog/client.ts").listBlogs("qa"))).status, "unavailable");
});

test("outages, empty feeds and genuine 404s stay distinct", async () => {
  for (const fetchImpl of [
    async () => { throw new TypeError("connection refused"); },
    async () => new Response("offline", { status: 503 }),
    async () => new Response("not JSON"),
  ]) {
    const l = loader({ fetchImpl });
    const { loadCmsResource } = l.load("src/lib/cms-blog/resource.ts");
    assert.equal((await loadCmsResource(() => l.load("src/lib/cms-blog/client.ts").listCompanyNews("qa"))).status, "unavailable");
  }
  const empty = loader();
  const ready = await empty.load("src/lib/cms-blog/resource.ts").loadCmsResource(() =>
    empty.load("src/lib/cms-blog/client.ts").listCompanyNews("qa"));
  assert.equal(ready.status, "ready");
  assert.equal(ready.data.items.length, 0);
  const missing = loader({ fetchImpl: async () => new Response("{}", { status: 404 }) });
  const api = missing.load("src/lib/cms-blog/client.ts");
  assert.equal(await api.getCompanyNews("qa", "missing"), null);
  assert.equal(await api.getRelatedCompanyNews("qa", "missing"), null);
});

test("detail, related and canonical checks use Company News URLs", async () => {
  const l = loader({
    fetchImpl: async (input) => {
      const u = new URL(input);
      if (u.pathname.endsWith("/related"))
        return Response.json({ success: true, items: [video("qa", "other")] });
      const slug = u.pathname.split("/").pop();
      if (slug === "bad-canonical")
        return Response.json({ success: true, article: detail("qa", slug, { seo: { ...f.detail().seo, canonicalUrl: "https://locatorglobal.com/qa/about/newsroom/blog/bad-canonical" } }) });
      return Response.json({ success: true, article: detail("qa", slug, { seo: { ...f.detail().seo, canonicalUrl: "https://locatorglobal.com/qa/about/newsroom/company-news/" + slug } }) });
    },
  });
  const api = l.load("src/lib/cms-blog/client.ts");
  const story = await api.getCompanyNews("qa", "award");
  assert.equal(story.slug, "award");
  assert.equal(story.contentVersion, 2);
  await assert.rejects(api.getCompanyNews("qa", "bad-canonical"), /invalid or out-of-scope/);
  const related = await api.getRelatedCompanyNews("qa", "award");
  assert.deepEqual(related.map((r) => r.slug), ["other"]);
  const seo = l.load("src/lib/cms-blog/seo.ts");
  const meta = seo.articleMetadata(story, "company-news");
  assert.equal(meta.alternates.canonical, "https://locatorglobal.com/qa/about/newsroom/company-news/award");
  const ld = seo.articleJsonLd(story, "company-news");
  assert.equal(ld["@graph"][0]["@type"], "NewsArticle");
  assert.equal(ld["@graph"][1].itemListElement[2].item, "https://locatorglobal.com/qa/about/newsroom/company-news");
  // Blog defaults are unchanged.
  assert.equal(seo.publicArticleUrl("qa", "x"), "https://locatorglobal.com/qa/about/newsroom/blog/x");
});

function cachedFixture() {
  const entries = new Map(), definitions = [], reads = [];
  const l = loader({
    env: { CMS_BLOG_REVALIDATION_SECRET: secret, CMS_COMPANY_NEWS_REVALIDATION_SECRET: secret },
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
      const card = collection === "blogs" ? { ...f.card("story", null), market } : item(market, "story");
      return Response.json(f.list([card], Number(u.searchParams.get("page")), Number(u.searchParams.get("limit"))));
    },
  });
  return {
    api: l.load("src/lib/cms-blog/client.ts"),
    blogHook: l.load("src/app/api/revalidate/blogs/route.ts").POST,
    newsHook: l.load("src/app/api/revalidate/company-news/route.ts").POST,
    reads, definitions,
  };
}
const notify = (path, body, auth = secret) =>
  new Request("http://localhost/api/revalidate/" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth },
    body: JSON.stringify(body),
  });

test("Company News has its own cache namespace and tag; webhooks expire only their own feed", async () => {
  const t = cachedFixture();
  const warm = async () => {
    for (const market of ["global", "qa"]) {
      await t.api.listCompanyNews(market);
      await t.api.listBlogs(market);
    }
  };
  await warm(); await warm();
  assert.equal(t.reads.length, 4);
  const news = t.definitions.filter((d) => d.keys[0] === "cms-public-company-news-v1");
  assert.ok(news.length > 0);
  assert.ok(news.every((d) => d.options.revalidate === 60 && d.options.tags.length === 1 && /^cms-public-company-news:(global|qa)$/.test(d.options.tags[0])));
  assert.ok(t.definitions.filter((d) => d.keys[0] === "cms-public-blogs-v1").every((d) => /^cms-public-blogs:/.test(d.options.tags[0])));

  const res = await t.newsHook(notify("company-news", { collection: "company-news", market: "qa", slug: "story", previousSlug: "old-story" }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true, collection: "company-news", market: "qa", slug: "story", previousSlug: "old-story", invalidated: "market_company_news" });
  assert.equal(res.headers.get("cache-control"), "no-store");
  await warm();
  assert.deepEqual(t.reads.slice(4), ["company-news:qa"]);

  assert.equal((await t.blogHook(notify("blogs", { market: "global", slug: "story" }))).status, 200);
  await warm();
  assert.deepEqual(t.reads.slice(5), ["blogs:global"]);
});

test("the Company News webhook validates configuration, auth and payload", async () => {
  const unconfigured = loader().load("src/app/api/revalidate/company-news/route.ts").POST;
  assert.equal((await unconfigured(notify("company-news", { collection: "company-news", market: "qa", slug: "story" }))).status, 503);
  const t = cachedFixture();
  assert.equal((await t.newsHook(notify("company-news", { collection: "company-news", market: "qa", slug: "story" }, "wrong-secret-wrong-secret-wrong-secret"))).status, 401);
  for (const body of [
    { market: "qa", slug: "story" },
    { collection: "blogs", market: "qa", slug: "story" },
    { collection: "company-news", market: "zz", slug: "story" },
    { collection: "company-news", market: "qa", slug: "Bad Slug" },
    { collection: "company-news", market: "qa", slug: "story", previousSlug: null },
    { collection: "company-news", market: "qa", slug: "story", extra: true },
  ]) assert.equal((await t.newsHook(notify("company-news", body))).status, 400, JSON.stringify(body));
  const wrongType = new Request("http://localhost/api/revalidate/company-news", {
    method: "POST", headers: { "Content-Type": "text/plain", Authorization: "Bearer " + secret }, body: "{}",
  });
  assert.equal((await t.newsHook(wrongType)).status, 415);
  // The Blog webhook still rejects the Company News payload shape.
  assert.equal((await t.blogHook(notify("blogs", { collection: "company-news", market: "qa", slug: "story" }))).status, 400);
});

test("URLs, market switching and the listing use Company News paths", () => {
  const l = loader();
  const u = l.load("src/lib/cms-blog/urls.ts");
  const paths = l.load("src/lib/country/paths.ts");
  assert.equal(u.companyNewsBase("global"), "/about/newsroom/company-news");
  assert.equal(u.companyNewsHref("om", "launch"), "/om/about/newsroom/company-news/launch");
  assert.equal(u.blogHref("om", "launch"), "/om/about/newsroom/blog/launch");
  assert.equal(paths.switchCountryPath("/qa/about/newsroom/company-news/launch", "kw"), "/kw/about/newsroom/company-news");
  assert.equal(paths.switchCountryPath("/qa/about/newsroom/company-news", "global"), "/about/newsroom/company-news");
  assert.equal(paths.switchCountryPath("/qa/about/newsroom/blog/post", "sa"), "/sa/about/newsroom/blog");

  const View = l.load("src/components/about/newsroom/blog/BlogListing.tsx").default;
  const empty = renderToStaticMarkup(React.createElement(View, {
    market: "om", collection: "company-news", posts: [],
    pagination: { page: 1, limit: 12, total: 0, pages: 0 },
  }));
  assert.ok(empty.includes("No company news yet"));
  const html = renderToStaticMarkup(React.createElement(View, {
    market: "qa", collection: "company-news",
    posts: [item("qa", "lead"), { ...video("qa", "clip"), videoUrl: "https://vimeo.com/123456789" }],
    pagination: { page: 2, limit: 12, total: 25, pages: 3 },
    filters: { page: 2, q: "award", tag: "" },
  }));
  assert.ok(html.includes('href="/qa/about/newsroom/company-news/lead"'));
  assert.ok(html.includes('href="/qa/about/newsroom/company-news/clip"'));
  assert.ok(html.includes("/qa/about/newsroom/company-news?page=3&amp;q=award"));
  assert.ok(html.includes("Watch Video"));
  assert.ok(html.includes("LOCATOR Company News"));
  assert.ok(!html.includes("/about/newsroom/blog"));
});

test("video embeds are limited to YouTube and Vimeo privacy players", () => {
  const { videoEmbedUrl } = loader().load("src/components/about/newsroom/blog/BlogArticle.tsx");
  assert.equal(videoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  assert.equal(videoEmbedUrl("https://youtu.be/dQw4w9WgXcQ?t=3"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  assert.equal(videoEmbedUrl("https://youtube.com/shorts/dQw4w9WgXcQ"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  assert.equal(videoEmbedUrl("https://vimeo.com/123456789"), "https://player.vimeo.com/video/123456789");
  for (const other of ["https://example.com/video.mp4", "http://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.youtube.com/watch?v=<script>", "not a url"])
    assert.equal(videoEmbedUrl(other), null, other);
});
