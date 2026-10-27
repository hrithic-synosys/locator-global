/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loader } = require("./helpers/cms-test-loader.cjs");
const fixtureRoot = path.resolve("scripts/fixtures/published-content-v1");
const make = (env = {}, requestHeaders) =>
  loader({
    env: {
      BLOG_CONTENT_SOURCE: "published",
      LOCATOR_PUBLISHED_ROOT: fixtureRoot,
      ...env,
    },
    requestHeaders,
    fetchImpl: async () => {
      throw Error("CMS MUST NOT BE CALLED");
    },
  });
const loadStore = (l) => l.load("src/lib/cms-blog/publication/store.ts");
const plain = (value) => JSON.parse(JSON.stringify(value));
function copy() {
  fs.mkdirSync(".verification", { recursive: true });
  const root = fs.mkdtempSync(path.resolve(".verification/published-test-"));
  fs.cpSync(fixtureRoot, root, { recursive: true });
  return root;
}
function activate(root, market, releaseId) {
  const { sha256 } = loadStore(make());
  const manifestBytes = fs.readFileSync(
    path.join(root, market, "releases", releaseId, "manifest.json")
  );
  const manifest = JSON.parse(manifestBytes);
  const pointer = {
    schemaVersion: 1,
    market,
    releaseId,
    revision: manifest.revision,
    manifestSha256: sha256(manifestBytes),
    activatedAt: "2026-01-02T00:00:00.000Z",
  };
  fs.writeFileSync(
    path.join(root, market, "current.json"),
    JSON.stringify(pointer) + "\n"
  );
  return pointer;
}

test("CMS-generated releases validate byte checksums and isolate five markets, including empty Oman", async () => {
  const l = make();
  const { pinRelease } = loadStore(l);
  for (const market of ["global", "sa", "qa", "kw", "om"]) {
    const release = await pinRelease(fixtureRoot, market);
    assert.equal(release.pointer.market, market);
    if (market === "om") {
      assert.equal(release.list().items.length, 0);
      assert.equal(release.lookup("shared-slug").status, 404);
    } else {
      assert.ok(release.list().items.every((i) => i.market === market));
      if (release.list().items.length)
        assert.equal(
          release.lookup(release.list().items[0].slug).value.article.market,
          market
        );
    }
  }
  await assert.rejects(pinRelease(fixtureRoot, "ae"));
  await assert.rejects(pinRelease(fixtureRoot, "../ae"));
  assert.equal(l.requests.length, 0);
});

test("all public blog functions work with no CMS connection and match contract list semantics", async () => {
  const l = make();
  const client = l.load("src/lib/cms-blog/client.ts");
  const post = await client.getBlog("global", "shared-slug");
  assert.equal(post.market, "global");
  assert.equal(post.banner, null);
  assert.ok(post.content.length);
  assert.equal(
    (await client.listBlogs("global", 1, 12, "synthetic global", "fleet")).items
      .length,
    1
  );
  assert.equal(
    (await client.listBlogs("global", 1, 12, "no matching token")).items.length,
    0
  );
  assert.equal((await client.getFeaturedBlogs("global")).length, 1);
  assert.equal(
    (await client.getRelatedBlogs("global", "shared-slug")).length,
    0
  );
  assert.equal(
    (await client.getBlogSlugs("global"))[0].updatedAt,
    "2025-01-02T00:00:00.000Z"
  );
  assert.equal(await client.getBlog("om", "shared-slug"), null);
  assert.equal(l.requests.length, 0);
});

test("CMS redirect and removal fixtures have exact 308/410 lookup outcomes", async () => {
  const { pinRelease } = loadStore(make());
  const qa = await pinRelease(fixtureRoot, "qa");
  assert.equal(qa.lookup("shared-slug").status, 308);
  assert.equal(
    qa.lookup("shared-slug").value.publicUrl,
    "https://locatorglobal.com/qa/about/newsroom/blog/new-slug"
  );
  const sa = await pinRelease(fixtureRoot, "sa");
  assert.equal(sa.lookup("shared-slug").status, 410);
  assert.ok(!sa.slugs().some((e) => e.slug === "shared-slug"));
});

test("fresh requests see active revisions, while an existing pin stays internally consistent", async () => {
  const root = copy();
  const { pinRelease } = loadStore(make());
  const releases = fs.readdirSync(path.join(root, "global", "releases")).sort();
  const pointer = activate(root, "global", releases[0]);
  const first = await pinRelease(root, "global");
  activate(root, "global", releases[1]);
  const second = await pinRelease(root, "global");
  const pinned = await pinRelease(root, "global", pointer);
  assert.equal(first.pointer.revision, 1);
  assert.equal(second.pointer.revision, 2);
  assert.equal(pinned.pointer.revision, first.pointer.revision);
  assert.deepEqual(plain(pinned.slugs()), plain(first.slugs()));
  assert.notEqual(first.pointer.manifestSha256, second.pointer.manifestSha256);
});

test("corrupt, absent, mismatched and traversing pointers fail as 503 without stale fallback or API requests", async () => {
  const root = copy();
  const l = make({ LOCATOR_PUBLISHED_ROOT: root });
  const { pinRelease } = loadStore(l);
  const current = path.join(root, "global", "current.json");
  const original = JSON.parse(fs.readFileSync(current));
  for (const pointer of [
    { ...original, market: "qa" },
    { ...original, schemaVersion: 2 },
    { ...original, releaseId: "../../ae" },
    { ...original, manifestSha256: "0".repeat(64) },
  ]) {
    fs.writeFileSync(current, JSON.stringify(pointer));
    await assert.rejects(pinRelease(root, "global"), (e) => e.status === 503);
  }
  fs.writeFileSync(current, JSON.stringify(original));
  fs.appendFileSync(
    path.join(root, "global", "releases", original.releaseId, "catalogue.json"),
    " "
  );
  await assert.rejects(pinRelease(root, "global"), (e) => e.status === 503);
  await assert.rejects(
    pinRelease(root, "qa", { ...original, market: "qa" }),
    (e) => e.status === 503
  );
  await assert.rejects(
    pinRelease(root + "-missing", "global"),
    (e) => e.status === 503
  );
  assert.equal(l.requests.length, 0);
});

test("unavailable published source does not fall back to API, while valid empty release stays ready", async () => {
  const l = make({
    LOCATOR_PUBLISHED_ROOT: path.resolve(".verification/no-store-here"),
  });
  const availability = l.load("src/lib/cms-blog/availability.ts");
  assert.equal(
    (await availability.loadBlogArticle("global", "shared-slug")).state,
    "unavailable"
  );
  assert.equal((await availability.loadBlogFeed("qa")).state, "unavailable");
  assert.equal(l.requests.length, 0);
  const empty = await make()
    .load("src/lib/cms-blog/availability.ts")
    .loadBlogFeed("om");
  assert.equal(empty.state, "ready");
  assert.equal(empty.pagination.total, 0);
});

test("request adapter uses the proxy-selected pointer instead of rereading a newer active release", async () => {
  const root = copy();
  const releases = fs.readdirSync(path.join(root, "global", "releases")).sort();
  const pointer = activate(root, "global", releases[0]);
  activate(root, "global", releases[1]);
  const l = make(
    { LOCATOR_PUBLISHED_ROOT: root },
    new Headers({
      "x-locator-publication-pins": JSON.stringify({ global: pointer }),
    })
  );
  const release = await l
    .load("src/lib/cms-blog/publication/request.ts")
    .publishedRelease("global");
  assert.equal(release.pointer.revision, 1);
});

test("sitemap uses published catalogue for additions, updates and removals under isolated readiness", async () => {
  const root = copy();
  const l = make({ LOCATOR_PUBLISHED_ROOT: root, SITE_ENV: "production" });
  const { indexing } = l.load("src/config/indexing.ts");
  for (const setting of Object.values(indexing)) setting.ready = true;
  const sitemap = l.load("src/app/sitemap.ts").default;
  const before = await sitemap();
  assert.ok(
    before.some(
      (e) =>
        e.url === "https://locatorglobal.com/about/newsroom/blog/shared-slug"
    )
  );
  assert.ok(
    !before.some(
      (e) =>
        e.url === "https://locatorglobal.com/sa/about/newsroom/blog/shared-slug"
    )
  );
  const { publishNewGlobal } = require("./helpers/published-fixtures.cjs");
  publishNewGlobal(root);
  const after = await sitemap();
  assert.ok(after.some((e) => e.url.endsWith("/blog/new-after-start")));
  assert.equal(
    after.find(
      (e) =>
        e.url === "https://locatorglobal.com/about/newsroom/blog/shared-slug"
    ).lastModified,
    "2026-01-03T00:00:00.000Z"
  );
  assert.ok(after.some((e) => e.url === "https://locatorglobal.com/contact"));
  assert.equal(l.requests.length, 0);
});

test("pre-stream boundary returns actual 404, 410, 308 and 503 with Retry-After", async () => {
  const boundary = make().load(
    "src/lib/cms-blog/publication/boundary.ts"
  ).publicationBoundary;
  assert.equal(
    (await boundary("global", "/about/newsroom/blog/unknown")).response.status,
    404
  );
  assert.equal(
    (await boundary("sa", "/about/newsroom/blog/shared-slug")).response.status,
    410
  );
  const redirect = (await boundary("qa", "/about/newsroom/blog/shared-slug"))
    .response;
  assert.equal(redirect.status, 308);
  assert.equal(
    redirect.headers.get("location"),
    "https://locatorglobal.com/qa/about/newsroom/blog/new-slug"
  );
  const missing = make({
    LOCATOR_PUBLISHED_ROOT: path.resolve(".verification/no-current-release"),
  }).load("src/lib/cms-blog/publication/boundary.ts").publicationBoundary;
  const failed = (await missing("global", "/about/newsroom/blog")).response;
  assert.equal(failed.status, 503);
  assert.equal(failed.headers.get("retry-after"), "60");
  assert.equal(failed.headers.get("cache-control"), "no-store");
});

test("newsroom is never gated by its optional blog source; an initial market is distinct from a lost release", async () => {
  fs.mkdirSync(".verification", { recursive: true });
  const root = fs.mkdtempSync(path.resolve(".verification/initial-newsroom-"));
  fs.mkdirSync(path.join(root, "global"));
  const initial = make({ LOCATOR_PUBLISHED_ROOT: root });
  const feed = await initial
    .load("src/lib/cms-blog/availability.ts")
    .loadBlogFeed("global");
  assert.equal(feed.state, "unavailable");
  assert.equal(feed.notInitialized, true);
  const boundary = initial.load(
    "src/lib/cms-blog/publication/boundary.ts"
  ).publicationBoundary;
  assert.equal(
    (await boundary("global", "/about/newsroom")).response,
    undefined
  );
  assert.equal(
    (await boundary("global", "/about/newsroom/")).response,
    undefined
  );
  assert.equal(
    (await boundary("global", "/about/newsroom/blog/example")).response.status,
    503
  );
  const history = copy();
  fs.renameSync(
    path.join(history, "global", "current.json"),
    path.join(history, "global", "current.test-offline")
  );
  const lost = make({ LOCATOR_PUBLISHED_ROOT: history });
  const failure = await lost
    .load("src/lib/cms-blog/availability.ts")
    .loadBlogFeed("global");
  assert.equal(failure.state, "unavailable");
  assert.equal(failure.notInitialized, false);
  assert.equal(
    (
      await lost
        .load("src/lib/cms-blog/publication/boundary.ts")
        .publicationBoundary("global", "/about/newsroom")
    ).response,
    undefined
  );
  const empty = await make()
    .load("src/lib/cms-blog/availability.ts")
    .loadBlogFeed("om");
  assert.equal(empty.state, "ready");
  assert.equal(empty.pagination.total, 0);
});
