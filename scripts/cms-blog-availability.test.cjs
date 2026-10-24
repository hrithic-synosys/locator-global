/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node test harness. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { loader } = require("./helpers/cms-test-loader.cjs");
const fixture = require("./fixtures/cms-blog.cjs");

test("presentation keeps successful empty catalogues distinct from delivery failures", async () => {
  const ready = await loader({
    fetchImpl: async () => Response.json(fixture.list([], 1, 3)),
  })
    .load("src/lib/cms-blog/availability.ts")
    .loadBlogFeed("qa", 1, 3);
  assert.equal(ready.state, "ready");
  assert.equal(ready.pagination.total, 0);
  for (const fetchImpl of [
    async () => {
      throw Error("ECONNREFUSED");
    },
    async () => new Response("", { status: 503 }),
    async () => new Response("invalid JSON"),
    async () =>
      Response.json({
        success: true,
        items: [{ ...fixture.card(), market: "global" }],
        pagination: { page: 1, limit: 3, total: 1, pages: 1 },
      }),
  ]) {
    const l = loader({ fetchImpl });
    const result = await l
      .load("src/lib/cms-blog/availability.ts")
      .loadBlogFeed("qa", 1, 3);
    assert.equal(result.state, "unavailable");
    assert.equal(result.items, undefined);
    assert.equal(result.pagination, undefined);
    assert.ok(
      l.requests.every(([url]) =>
        url.pathname.startsWith("/api/v1/sites/qa/blogs")
      )
    );
  }
});

test("article and related availability never turn network outages into missing records", async () => {
  const missing = loader({
    fetchImpl: async () => new Response("", { status: 404 }),
  }).load("src/lib/cms-blog/availability.ts");
  assert.equal(
    (await missing.loadBlogArticle("om", "missing")).state,
    "not-found"
  );
  assert.equal(
    (await missing.loadRelatedBlogs("om", "missing")).state,
    "not-found"
  );
  const offline = loader({
    fetchImpl: async () => {
      throw Error("offline");
    },
  }).load("src/lib/cms-blog/availability.ts");
  assert.equal(
    (await offline.loadBlogArticle("om", "missing")).state,
    "unavailable"
  );
  assert.equal(
    (await offline.loadRelatedBlogs("om", "missing")).state,
    "unavailable"
  );
  await assert.rejects(offline.loadBlogFeed("ae"));
});

test("an article remains readable if only its recommendations fail", async () => {
  const l = loader({
    fetchImpl: async (url) =>
      url.pathname.endsWith("/related")
        ? new Response("", { status: 503 })
        : Response.json({
            success: true,
            article: { ...fixture.detail("example"), market: "qa" },
          }),
  });
  const Page = l.load(
    "src/app/[market]/about/newsroom/blog/[slug]/page.tsx"
  ).default;
  const html = renderToStaticMarkup(
    await Page({ params: Promise.resolve({ market: "qa", slug: "example" }) })
  );
  assert.ok(html.includes("Fixture article example"));
  assert.ok(html.includes("Related articles are unavailable"));
  assert.ok(html.includes("Fixture table caption"));
});

test("article outages render a retry card and no article JSON-LD; metadata is noindex", async () => {
  const l = loader({
    fetchImpl: async () => {
      throw Error("offline");
    },
  });
  const route = l.load("src/app/[market]/about/newsroom/blog/[slug]/page.tsx");
  const props = { params: Promise.resolve({ market: "qa", slug: "example" }) };
  const html = renderToStaticMarkup(await route.default(props));
  assert.ok(html.includes("Articles are temporarily unavailable"));
  assert.ok(html.includes("Try again"));
  assert.ok(!html.includes("application/ld+json"));
  const metadata = await route.generateMetadata(props);
  assert.equal(metadata.robots.index, false);
  assert.equal(
    metadata.alternates.canonical,
    "https://locatorglobal.com/qa/about/newsroom/blog/example"
  );
});

test("empty and loading UI are accessible styled states rather than page-wide loading text", () => {
  const l = loader();
  const State = l.load(
    "src/components/about/newsroom/blog/BlogStatus.tsx"
  ).default;
  const Skeleton = l.load(
    "src/components/about/newsroom/blog/BlogSkeleton.tsx"
  ).default;
  const empty = renderToStaticMarkup(
    React.createElement(State, { kind: "empty" })
  );
  assert.ok(empty.includes("No articles yet"));
  assert.ok(!empty.includes("Try again"));
  assert.ok(!empty.includes("temporarily unavailable"));
  const loading = renderToStaticMarkup(React.createElement(Skeleton));
  assert.ok(loading.includes('aria-busy="true"'));
  assert.ok(loading.includes("cms-blog-skeleton-card"));
  assert.ok(loading.includes("prefers-reduced-motion"));
});
