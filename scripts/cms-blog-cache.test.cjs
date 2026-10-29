/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node tests. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { loader } = require("./helpers/cms-test-loader.cjs");
const f = require("./fixtures/cms-blog.cjs");
const secret = "isolated-cache-webhook-test-secret-32-bytes";

function fixture() {
  const entries = new Map(),
    definitions = [],
    reads = [];
  let revision = 1,
    mode = "ready",
    now = 0;
  const l = loader({
    env: { CMS_BLOG_REVALIDATION_SECRET: secret },
    cacheImpl: (fn, keys, options) => {
      definitions.push({ keys, options });
      return async () => {
        const key = JSON.stringify(keys),
          entry = entries.get(key);
        if (entry && now < entry.until) return entry.value;
        const value = await fn();
        entries.set(key, {
          value,
          until: now + options.revalidate,
          tags: options.tags,
        });
        return value;
      };
    },
    revalidateTag: (tag, profile) => {
      assert.deepEqual(JSON.parse(JSON.stringify(profile)), { expire: 0 });
      for (const [key, entry] of entries)
        if (entry.tags.includes(tag)) entries.delete(key);
    },
    fetchImpl: async (input, opts) => {
      const u = new URL(input),
        market = u.pathname.split("/")[4];
      reads.push({ u, opts });
      if (mode === "offline") throw Error("offline");
      if (mode === "missing") return new Response("{}", { status: 404 });
      if (mode === "invalid")
        return Response.json({ success: true, items: [{}] });
      if (mode === "malformed") return new Response("invalid");
      const card = {
        ...f.card("story", null),
        market,
        title: market + " revision " + revision,
      };
      if (u.pathname.endsWith("/slugs"))
        return Response.json({
          success: true,
          items: [{ market, slug: "story", updatedAt: "2025-02-01" }],
        });
      if (u.pathname.endsWith("/featured"))
        return Response.json({ success: true, items: [card] });
      if (u.pathname.endsWith("/related"))
        return Response.json({
          success: true,
          items: [{ ...card, slug: "other", id: "other" }],
        });
      if (u.pathname.endsWith("/blogs")) {
        const page = Number(u.searchParams.get("page")),
          limit = Number(u.searchParams.get("limit"));
        return Response.json(
          f.list([card], page, limit, (page - 1) * limit + 1)
        );
      }
      return Response.json({
        success: true,
        article: { ...f.detail("story", null), ...card },
      });
    },
  });
  return {
    api: l.load("src/lib/cms-blog/client.ts"),
    webhook: l.load("src/app/api/revalidate/blogs/route.ts").POST,
    reads,
    definitions,
    set: (value) => {
      mode = value;
    },
    advance: () => {
      now += 61;
      revision++;
    },
  };
}
const notify = (market = "global") =>
  new Request("http://localhost/api/revalidate/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + secret,
    },
    body: JSON.stringify({ market, slug: "story", previousSlug: "old-story" }),
  });

test("all public endpoint families cache by market, endpoint and query, with 60s expiry and market-only invalidation", async () => {
  const t = fixture();
  const warm = async (market) => {
    await t.api.listBlogs(market);
    await t.api.getBlog(market, "story");
    await t.api.getFeaturedBlogs(market);
    await t.api.getBlogSlugs(market);
    await t.api.getRelatedBlogs(market, "story");
  };
  for (const market of ["global", "sa", "qa", "kw", "om"]) {
    await warm(market);
    await warm(market);
  }
  assert.equal(t.reads.length, 25);
  for (const args of [
    [2, 12, "", ""],
    [1, 3, "", ""],
    [1, 12, "fleet", ""],
    [1, 12, "", "safety"],
    [1, 12, "", "", true],
    [1, 12, "", "", false],
  ]) {
    await t.api.listBlogs("global", ...args);
    await t.api.listBlogs("global", ...args);
  }
  assert.equal(t.reads.length, 31);
  await t.api.getFeaturedBlogs("global", 3);
  await t.api.getRelatedBlogs("global", "story", 2);
  assert.equal(t.reads.length, 33);
  assert.ok(
    t.definitions.every(
      (d) => d.options.revalidate === 60 && d.options.tags.length === 1
    )
  );
  assert.equal((await t.webhook(notify())).status, 200);
  await warm("qa");
  assert.equal(t.reads.length, 33);
  await warm("global");
  assert.equal(t.reads.length, 38);
  t.advance();
  await warm("global");
  assert.equal(t.reads.length, 43);
  const nonces = t.reads.map((r) => r.u.searchParams.get("_locator_fresh"));
  assert.equal(new Set(nonces).size, nonces.length);
  assert.ok(
    t.reads.every(
      (r) =>
        r.opts.cache === "no-store" &&
        r.opts.credentials === "omit" &&
        !r.opts.headers.Authorization &&
        r.opts.headers["Cache-Control"].includes("no-cache")
    )
  );
});

test("failed reads, invalid payloads and article/related 404s are not persisted", async () => {
  for (const mode of ["offline", "invalid", "malformed"]) {
    const t = fixture();
    t.set(mode);
    await assert.rejects(t.api.listBlogs("qa"));
    await assert.rejects(t.api.listBlogs("qa"));
    assert.equal(t.reads.length, 2);
    t.set("ready");
    assert.equal((await t.api.listBlogs("qa")).items.length, 1);
  }
  const t = fixture();
  t.set("missing");
  assert.equal(await t.api.getBlog("global", "story"), null);
  assert.equal(await t.api.getBlog("global", "story"), null);
  assert.equal(await t.api.getRelatedBlogs("global", "story"), null);
  assert.equal(await t.api.getRelatedBlogs("global", "story"), null);
  assert.equal(t.reads.length, 4);
  t.set("ready");
  assert.ok(await t.api.getBlog("global", "story"));
});

test("webhook fails closed, validates payload/body bounds and never invalidates on rejected requests", async () => {
  let invalidations = 0;
  const make = (env) =>
    loader({
      env,
      revalidateTag: () => {
        invalidations++;
      },
    }).load("src/app/api/revalidate/blogs/route.ts").POST;
  assert.equal((await make({})(notify())).status, 503);
  const post = make({ CMS_BLOG_REVALIDATION_SECRET: secret });
  assert.equal(
    (await post(new Request("http://localhost", { method: "POST" }))).status,
    401
  );
  const send = (body, type = "application/json") =>
    post(
      new Request("http://localhost", {
        method: "POST",
        headers: { Authorization: "Bearer " + secret, "Content-Type": type },
        body,
      })
    );
  assert.equal((await send("{}", "text/plain")).status, 415);
  assert.equal((await send("broken")).status, 400);
  assert.equal((await send("x".repeat(5000))).status, 413);
  for (const payload of [
    null,
    [],
    {},
    { market: "ae", slug: "story" },
    { market: "global", slug: "../escape" },
    { market: "qa", slug: "story", previousSlug: "" },
    { market: "qa", slug: "story", path: "/arbitrary" },
  ])
    assert.equal((await send(JSON.stringify(payload))).status, 400);
  assert.equal(invalidations, 0);
  const response = await post(notify("om"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(invalidations, 1);
  assert.equal((await post(notify("om"))).status, 200);
  const failure = loader({
    env: { CMS_BLOG_REVALIDATION_SECRET: secret },
    revalidateTag: () => {
      throw Error("private diagnostics");
    },
  }).load("src/app/api/revalidate/blogs/route.ts").POST;
  const failed = await failure(notify());
  assert.equal(failed.status, 500);
  assert.ok(!(await failed.text()).includes("private diagnostics"));
});
