/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node test harness. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { loader, base } = require("./helpers/cms-test-loader.cjs");
const f = require("./fixtures/cms-blog.cjs");
const markets = ["global", "sa", "qa", "kw", "om"];
const card = (market = "global", slug = "same", banner = f.image) => ({
  ...f.card(slug, banner),
  market,
  title: market + " article " + slug,
});
const detail = (market = "global", slug = "same", banner = f.image) => ({
  ...f.detail(slug, banner),
  ...card(market, slug, banner),
});
const data = loader().load("src/lib/cms-blog/validation.ts");

test("all five boundaries enforce exact scope, publication, v2 and backend counts", () => {
  for (const market of markets) {
    assert.equal(
      data.parseDetail({ success: true, article: detail(market) }, base, market)
        .market,
      market
    );
    assert.equal(data.parseList(f.list([]), base, market).items.length, 0);
    for (const patch of [
      { market: market === "qa" ? "global" : "qa" },
      { market: "ae" },
      { format: "video" },
      { category: { ...f.category, slug: "news" } },
      { category: null },
      { status: "draft" },
      { status: "archived" },
      { publishedAt: "2999-01-01" },
      { contentVersion: 1 },
      { content: [{ type: "unknown" }] },
      {
        content: [
          {
            type: "split",
            mediaSide: "left",
            media: { kind: "video" },
            blocks: [],
          },
        ],
      },
    ])
      assert.throws(() =>
        data.parseDetail(
          { success: true, article: { ...detail(market), ...patch } },
          base,
          market
        )
      );
    assert.throws(() =>
      data.parseSlugs(
        {
          success: true,
          items: [{ slug: "same", market: "ae", updatedAt: "2025-01-01" }],
        },
        market
      )
    );
    assert.throws(() =>
      data.parseList(f.list([card(market)], 1, 12, 40), base, market)
    );
    const related = card(market);
    delete related.format;
    assert.equal(
      data.parseCards({ success: true, items: [related] }, base, market, true)
        .length,
      1
    );
    assert.throws(() =>
      data.parseCards(
        { success: true, items: [{ ...related, market: "ae" }] },
        base,
        market,
        true
      )
    );
  }
});
test("every public API preserves /api/v1 and its explicit market, including identical slugs", async () => {
  const l = loader({
      fetchImpl: async (input) => {
        const u = new URL(input),
          m = u.pathname.split("/")[4];
        if (u.pathname.endsWith("/slugs"))
          return Response.json({
            success: true,
            items: [{ slug: "same", market: m, updatedAt: "2025-02-01" }],
          });
        if (u.pathname.endsWith("/featured") || u.pathname.endsWith("/related"))
          return Response.json({ success: true, items: [] });
        if (u.pathname.endsWith("/blogs")) return Response.json(f.list([]));
        return Response.json({ success: true, article: detail(m) });
      },
    }),
    api = l.load("src/lib/cms-blog/client.ts");
  for (const m of markets) {
    assert.equal((await api.getBlog(m, "same")).title, m + " article same");
    await api.listBlogs(m);
    await api.getFeaturedBlogs(m);
    await api.getBlogSlugs(m);
    await api.getRelatedBlogs(m, "same");
  }
  for (const [u, opts] of l.requests) {
    assert.ok(
      /^\/api\/v1\/sites\/(global|sa|qa|kw|om)\/blogs/.test(u.pathname)
    );
    assert.equal(opts.credentials, "omit");
    assert.equal(opts.redirect, "error");
    assert.equal(opts.cache, "no-store");
    assert.equal(opts.headers, undefined);
  }
  for (const invalid of ["ae", "bh", "all", "xx", undefined])
    await assert.rejects(api.listBlogs(invalid));
  for (const bad of [
    "",
    "ftp://cms.test/api/v1",
    "https://u:p@cms.test/api/v1",
    "https://cms.test/api/v1?q=x",
    "https://cms.test/other",
  ])
    assert.throws(() =>
      loader({ env: { CMS_API_BASE_URL: bad } })
        .load("src/lib/cms-blog/client.ts")
        .apiBase()
    );
  const before = l.requests.length;
  await assert.rejects(api.getBlog("qa", ".."));
  assert.equal(l.requests.length, before);
});
test("404, empty, outage, invalid JSON and wrong-market responses stay distinct", async () => {
  assert.equal(
    (await loader().load("src/lib/cms-blog/client.ts").listBlogs("om")).items
      .length,
    0
  );
  assert.equal(
    await loader({ fetchImpl: async () => new Response("", { status: 404 }) })
      .load("src/lib/cms-blog/client.ts")
      .getBlog("om", "same"),
    null
  );
  for (const fetchImpl of [
    async () => new Response("", { status: 503 }),
    async () => {
      throw Error("offline");
    },
    async () => new Response("invalid"),
    async () => Response.json({ success: true, article: detail("global") }),
  ])
    await assert.rejects(
      loader({ fetchImpl })
        .load("src/lib/cms-blog/client.ts")
        .getBlog("om", "same")
    );
  await assert.rejects(
    loader({ fetchImpl: async () => new Response("", { status: 404 }) })
      .load("src/lib/cms-blog/client.ts")
      .listBlogs("qa")
  );
});
test("URL, filters, country switches, commercial CTA and media ownership policies", () => {
  const l = loader(),
    u = l.load("src/lib/cms-blog/urls.ts"),
    paths = l.load("src/lib/country/paths.ts");
  for (const m of markets) {
    const prefix = m === "global" ? "" : "/" + m;
    assert.equal(
      u.blogHref(m, "one/two"),
      prefix + "/about/newsroom/blog/one%2Ftwo"
    );
    assert.equal(
      paths.switchCountryPath("/qa/about/newsroom/blog/same?page=2#same", m),
      prefix + "/about/newsroom/blog"
    );
    assert.equal(
      paths.switchCountryPath("/qa/about/newsroom/blog?page=2", m),
      prefix + "/about/newsroom/blog"
    );
    assert.equal(u.contentHref("/get-a-quote", m), prefix + "/get-a-quote");
    assert.equal(u.contentHref("/sa/contact", m), "/sa/contact");
    for (const href of [
      "#same",
      "mailto:hello@example.test",
      "tel:+123",
      "https://example.test/story",
      "/about/newsroom/blog/intentional",
    ])
      assert.equal(u.contentHref(href, m), href);
    assert.equal(
      u.blogPageHref(
        m,
        { page: 2, q: "fleet", tag: "safety", featured: false },
        3
      ),
      prefix + "/about/newsroom/blog?page=3&q=fleet&tag=safety&featured=false"
    );
  }
  assert.equal(
    u.mediaUrl("/uploads/images/a.jpg", base),
    "https://cms.example.test/uploads/images/a.jpg"
  );
  assert.equal(u.mediaUrl("/blog/local.webp", base), "/blog/local.webp");
  assert.equal(
    u.mediaUrl("https://media.test/a.jpg", base),
    "https://media.test/a.jpg"
  );
  for (const bad of [
    "javascript:alert(1)",
    "data:text/html,evil",
    "//evil.test",
    "/\\evil.test",
    "https://u:p@host.test/x",
  ]) {
    assert.equal(u.safeHref(bad), "");
    assert.throws(() => u.mediaUrl(bad, base));
  }
  assert.equal(
    u.serializeJsonLd({ x: "</script><script>evil</script>" }).includes("<"),
    false
  );
});
test("renderer preserves every v2 feature, nested anchors, all market links and safe inline text", () => {
  const l = loader(),
    r = l.load("src/components/about/newsroom/blog/BlogArticle.tsx");
  for (const market of markets) {
    const p = detail(market),
      prefix = market === "global" ? "" : "/" + market;
    const prepared = r.prepareBlocks(p.content),
      ids = prepared.toc.map((i) => i.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.includes("same-3"));
    assert.ok(!ids.includes("hidden-from-toc"));
    const props = {
      market,
      title: p.title,
      excerpt: p.excerpt,
      coverImage: p.banner,
      content: p.content,
      format: p.format,
      author: p.author,
      summary: p.summary,
      relatedArticles: [card(market, "related")],
      publishedAt: p.publishedAt,
      readingMinutes: p.readingMinutes,
      url: "https://locatorglobal.com" + prefix + "/about/newsroom/blog/same",
    };
    const html = renderToStaticMarkup(React.createElement(r.default, props));
    for (const text of [
      "Fixture table caption",
      "Split table caption",
      "ba-list--check",
      "Fixture author",
      "Fixture image caption",
      'data-align="left"',
      'data-align="right"',
      'data-media="left"',
      'data-media="right"',
      'data-tone="tint"',
      "Fixture writer",
      "<sup>2</sup>",
      "<sub>2</sub>",
      prefix + "/about/newsroom/blog/related",
      prefix + "/get-a-quote",
      encodeURIComponent(props.url),
    ])
      assert.ok(html.includes(text), text);
    const plain = renderToStaticMarkup(
      React.createElement(r.default, {
        ...props,
        coverImage: null,
        author: null,
        summary: null,
        relatedArticles: [],
      })
    );
    assert.ok(plain.includes("ba-head-plain"));
    assert.ok(!plain.includes("Draft"));
    assert.ok(!plain.includes('ba-hero-img"'));
  }
  const rich = l.load(
    "src/components/about/newsroom/blog/RichText.tsx"
  ).default;
  const html = renderToStaticMarkup(
    React.createElement(rich, {
      market: "qa",
      html: '<a href="javascript:alert(1)">bad</a><a href="//evil.test">bad2</a><img src=x onerror=alert(1)><a href=\'/contact\' onclick="evil()">safe</a>',
    })
  );
  assert.ok(!html.includes('href="javascript:'));
  assert.ok(!html.includes('href="//'));
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes('href="/qa/contact"'));
  assert.ok(!/<a[^>]* onclick=/.test(html));
});
test("listings use backend pages, preserve filters/prefix, and allow empty/bannerless records", () => {
  const View = loader().load(
    "src/components/about/newsroom/blog/BlogListing.tsx"
  ).default;
  const empty = renderToStaticMarkup(
    React.createElement(View, {
      market: "om",
      posts: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 },
    })
  );
  assert.ok(empty.includes("No articles yet"));
  const html = renderToStaticMarkup(
    React.createElement(View, {
      market: "qa",
      posts: [card("qa", "plain", null)],
      pagination: { page: 2, limit: 12, total: 25, pages: 3 },
      filters: { page: 2, q: "fleet", tag: "safety" },
    })
  );
  assert.ok(
    html.includes("/qa/about/newsroom/blog?page=3&amp;q=fleet&amp;tag=safety")
  );
  assert.ok(!html.includes("<img"));
  assert.equal(
    (html.match(/href="\/qa\/about\/newsroom\/blog\/plain"/g) || []).length,
    1
  );
});
test("metadata/JSON-LD contain the exact market URL and real optional data, without invented hreflang", () => {
  const seo = loader().load("src/lib/cms-blog/seo.ts");
  for (const m of markets) {
    const p = detail(m, "same", null),
      prefix = m === "global" ? "" : "/" + m,
      url = "https://locatorglobal.com" + prefix + "/about/newsroom/blog/same";
    const metadata = seo.articleMetadata({ ...p, author: null, summary: null });
    assert.equal(metadata.alternates.canonical, url);
    assert.equal(metadata.alternates.languages, undefined);
    assert.equal(metadata.openGraph.url, url);
    assert.equal(metadata.twitter.card, "summary");
    const json = seo.articleJsonLd({ ...p, author: null });
    assert.equal(json["@graph"][0].author, undefined);
    assert.equal(json["@graph"][0].image, undefined);
    assert.ok(JSON.stringify(json).includes(prefix + "/about/newsroom"));
    assert.throws(() =>
      seo.articleMetadata({
        ...p,
        seo: {
          ...p.seo,
          canonicalUrl: "https://locator.ae/about/newsroom/blog/same",
        },
      })
    );
  }
});
test("new slugs have no build-time static catalogue gate and live paths do not import old records", () => {
  const route = fs.readFileSync(
    "src/app/[market]/about/newsroom/blog/[slug]/page.tsx",
    "utf8"
  );
  assert.match(route, /dynamic\s*=\s*["']force-dynamic["']/);
  assert.ok(!route.includes("generateStaticParams"));
  assert.ok(!route.includes("dynamicParams = false"));
  for (const file of [
    "src/app/[market]/about/newsroom/page.tsx",
    "src/app/[market]/about/newsroom/blog/page.tsx",
    "src/app/[market]/about/newsroom/blog/[slug]/page.tsx",
    "src/app/sitemap.ts",
    "src/components/about/newsroom/NewsroomBoard.tsx",
    "src/components/about/newsroom/NewsroomVideosAndBlogs.tsx",
    "src/components/software/SoftwareBlog.tsx",
    "src/components/regulatory/RegulatoryBlogFeed.tsx",
  ])
    assert.ok(
      !/BLOG_POSTS|BLOG_CONTENT|getBlogPost|getBlogContent|relatedPosts/.test(
        fs.readFileSync(file, "utf8")
      ),
      file
    );
});

test("sitemap fetches each enabled market independently and retains unrelated ready routes", async () => {
  const l = loader({
    env: { SITE_ENV: "production" },
    fetchImpl: async (input) => {
      const market = new URL(input).pathname.split("/")[4];
      return Response.json({
        success: true,
        items: [
          { market, slug: market + "-only", updatedAt: "2025-02-01T00:00:00Z" },
        ],
      });
    },
  });
  const { indexing } = l.load("src/config/indexing.ts");
  for (const m of markets) indexing[m].ready = true;
  const sitemap = await l.load("src/app/sitemap.ts").default();
  const blogs = sitemap.filter((e) => e.url.includes("/about/newsroom/blog/"));
  assert.equal(blogs.length, 5);
  assert.equal(l.requests.length, 5);
  for (const m of markets) {
    const prefix = m === "global" ? "" : "/" + m;
    assert.ok(
      blogs.some(
        (e) =>
          e.url ===
          "https://locatorglobal.com" +
            prefix +
            "/about/newsroom/blog/" +
            m +
            "-only"
      )
    );
    assert.ok(
      sitemap.some(
        (e) => e.url === "https://locatorglobal.com" + prefix + "/contact"
      )
    );
  }
  assert.ok(
    !sitemap.some((e) => /\/(ae|bh|global)\//.test(new URL(e.url).pathname))
  );
});

test(
  "live local CMS public reads and migration inventory",
  { skip: process.env.CMS_LIVE_TEST !== "true" },
  async () => {
    const l = loader({
        env: { CMS_API_BASE_URL: "http://localhost:5000/api/v1" },
        fetchImpl: fetch,
      }),
      api = l.load("src/lib/cms-blog/client.ts");
    const legacy = l.load(
        "src/components/about/newsroom/blog/blog-index.ts"
      ).BLOG_POSTS,
      report = [];
    for (const market of markets) {
      const list = await api.listBlogs(market),
        featured = await api.getFeaturedBlogs(market),
        slugs = await api.getBlogSlugs(market);
      for (const { slug } of slugs) {
        assert.equal((await api.getBlog(market, slug)).market, market);
        assert.ok(Array.isArray(await api.getRelatedBlogs(market, slug)));
      }
      assert.equal(
        await api.getBlog(market, "codex-nonexistent-read-only-check"),
        null
      );
      report.push({
        market,
        total: list.pagination.total,
        featured: featured.length,
        slugs: slugs.length,
        legacyReferenceCount: legacy.length,
        unmatchedLegacyReferenceSlugs: legacy
          .filter((p) => !slugs.some((s) => s.slug === p.slug))
          .map((p) => p.slug),
      });
    }
    console.log("CMS_LIVE_INVENTORY " + JSON.stringify(report));
  }
);
