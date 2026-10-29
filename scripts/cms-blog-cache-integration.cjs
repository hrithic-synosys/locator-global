/* eslint-disable @typescript-eslint/no-require-imports -- Local production integration fixture. */
// Node fetch reads HTML without running browser scripts: no analytics or email.
const http = require("node:http");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const f = require("./fixtures/cms-blog.cjs");
const secret = "isolated-production-cache-fixture-secret-32-plus";
const listen = (server) =>
  new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server.address().port))
  );
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let revision = 1,
  mode = "ready",
  renamed = false;
const reads = [],
  upstream = new Map();
const api = http.createServer((req, res) => {
  const url = new URL(req.url, "http://fixture"),
    [, market, suffix] =
      url.pathname.match(
        /^\/api\/v1\/sites\/(global|sa|qa|kw|om)\/blogs(.*)$/
      ) || [];
  if (!market) {
    res.writeHead(404);
    return res.end("{}");
  }
  reads.push({ market, suffix, nonce: url.searchParams.get("_locator_fresh") });
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Cache-Control",
    "public, max-age=60, stale-while-revalidate=300"
  );
  if (upstream.has(req.url)) return res.end(upstream.get(req.url));
  if (mode === "offline") {
    res.writeHead(503);
    return res.end("{}");
  }
  if (mode === "invalid") return res.end("not JSON");
  const slug = renamed ? "renamed" : "story";
  const card = {
    ...f.card(slug, null),
    market,
    title: market + " cache revision " + revision,
  };
  let body;
  if (!suffix) {
    const page = Number(url.searchParams.get("page") || 1),
      limit = Number(url.searchParams.get("limit") || 12);
    body = f.list(page === 1 ? [card] : [], page, limit, 1);
  } else if (suffix === "/featured") body = { success: true, items: [card] };
  else if (suffix === "/slugs")
    body = {
      success: true,
      items: [{ market, slug, updatedAt: "2025-02-01" }],
    };
  else if (suffix.endsWith("/related")) body = { success: true, items: [] };
  else if (suffix !== "/" + slug) {
    res.writeHead(404);
    return res.end("{}");
  } else
    body = { success: true, article: { ...f.detail(slug, null), ...card } };
  const text = JSON.stringify(body);
  upstream.set(req.url, text); // Deliberately stale HTTP cache without nonce.
  res.end(text);
});

(async () => {
  const apiPort = await listen(api),
    reservation = http.createServer();
  const port = await listen(reservation);
  await new Promise((resolve) => reservation.close(resolve));
  const origin = "http://127.0.0.1:" + port;
  const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(port)],
    {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        CMS_API_BASE_URL: "http://127.0.0.1:" + apiPort + "/api/v1",
        CMS_BLOG_REVALIDATION_SECRET: secret,
        TURNSTILE_SECRET_KEY: "",
        MAIL_HOST: "",
        MAIL_PASSWORD: "",
      },
    }
  );
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(Error("Fixture start timeout")),
        30000
      );
      child.stdout.on("data", (chunk) => {
        if (chunk.toString().includes("Ready")) {
          clearTimeout(timer);
          resolve();
        }
      });
      child.on("exit", () => {
        clearTimeout(timer);
        reject(Error("Fixture exited"));
      });
    });
    const blog = (market) =>
      (market === "global" ? "" : "/" + market) + "/about/newsroom/blog";
    const get = async (path) => {
      const response = await fetch(origin + path);
      return { status: response.status, html: await response.text() };
    };
    const notify = async (market, slug = "story", previousSlug) => {
      const response = await fetch(origin + "/api/revalidate/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + secret,
        },
        body: JSON.stringify({
          market,
          slug,
          ...(previousSlug ? { previousSlug } : {}),
        }),
      });
      assert.equal(response.status, 200);
    };
    const warm = async (market) => {
      await get(blog(market));
      await get(blog(market) + "?q=fleet");
      await get(blog(market) + "?page=2");
      await get(blog(market) + "/story");
    };
    await warm("global");
    await warm("qa");
    const count = reads.length;
    await warm("global");
    await warm("qa");
    assert.equal(reads.length, count, "production Data Cache must hit");
    revision = 2;
    assert.ok(
      (await get(blog("global"))).html.includes("global cache revision 1")
    );
    const qaCount = reads.filter((r) => r.market === "qa").length;
    await notify("global");
    assert.ok(
      (await get(blog("global"))).html.includes("global cache revision 2"),
      "webhook must block on a fresh origin read"
    );
    await get(blog("global") + "?q=fleet");
    await get(blog("global") + "?page=2");
    await get(blog("global") + "/story");
    assert.equal(
      reads.length,
      count + 5,
      "all warmed market variants, detail and related invalidated"
    );
    await warm("qa");
    assert.equal(
      reads.filter((r) => r.market === "qa").length,
      qaCount,
      "other market stays warm"
    );
    assert.ok(reads.every((r) => r.nonce));
    console.log(
      "PASS production hits, full-market webhook expiry, market isolation and stale upstream HTTP bypass"
    );

    renamed = true;
    await notify("global", "renamed", "story");
    const old = await get(blog("global") + "/story");
    // After headers stream, Next transports notFound through its Flight signal;
    // the existing browser suite separately verifies the final not-found UI.
    assert.ok(
      old.status === 404 || old.html.includes("NEXT_HTTP_ERROR_FALLBACK;404")
    );
    assert.ok(!old.html.includes('class="ba"'));
    assert.ok(
      (await get(blog("global") + "/renamed")).html.includes(
        "global cache revision 2"
      )
    );
    renamed = false;
    await notify("global");
    mode = "offline";
    assert.ok(
      (await get(blog("global"))).html.includes(
        "Articles temporarily unavailable"
      )
    );
    mode = "ready";
    assert.ok(
      (await get(blog("global"))).html.includes("global cache revision 2"),
      "failed read not cached"
    );
    await notify("global");
    mode = "invalid";
    assert.ok(
      (await get(blog("global"))).html.includes(
        "Articles temporarily unavailable"
      )
    );
    mode = "ready";
    assert.ok(
      (await get(blog("global"))).html.includes("global cache revision 2")
    );
    console.log(
      "PASS previous slug invalidation, real absence, failure exclusion and retry recovery"
    );

    // Real 60-second expiry in Next, without changing the production interval.
    await notify("global");
    await get(blog("global"));
    revision = 3;
    for (let i = 0; i < 3; i++) {
      await sleep(21000);
      console.log("TTL observation " + (i + 1) + "/3");
    }
    let refreshed = false;
    for (let i = 0; i < 15; i++) {
      if (
        (await get(blog("global"))).html.includes("global cache revision 3")
      ) {
        refreshed = true;
        break;
      }
      await sleep(200);
    }
    assert.ok(refreshed, "time-based revalidation refreshes without webhook");
    console.log(
      JSON.stringify({
        passed: true,
        framework: "Next.js 16.2.6 production Data Cache",
        ttlSeconds: 60,
        reads: reads.length,
        realCmsModified: false,
      })
    );
  } finally {
    child.kill();
    api.close();
  }
})().catch((error) => {
  console.error(error);
  api.close();
  process.exitCode = 1;
});
