/* eslint-disable @typescript-eslint/no-require-imports -- Local production integration harness. */
// All writes are confined to a new .verification copy. Never touches CMS/live store.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const { once } = require("node:events");
const {
  current,
  rewriteMedia,
  publishNewGlobal,
  publishFirstOman,
} = require("./helpers/published-fixtures.cjs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = fs.mkdtempSync(path.resolve(".verification/published-browser-"));
fs.cpSync(path.resolve("scripts/fixtures/published-content-v1"), root, {
  recursive: true,
});
const log = fs.createWriteStream(path.join(root, "next.log"));
let child,
  browser,
  apiCalls = 0;
const independentMedia = http.createServer((req, res) => {
  const match = req.url.match(
    /^\/published\/([a-f0-9]{64}\.(?:png|jpg|webp|gif))$/
  );
  if (!match) {
    res.writeHead(404);
    return res.end();
  }
  const file = path.join(root, "_media", "published", match[1]);
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    return res.end();
  }
  res.setHeader(
    "Content-Type",
    match[1].endsWith(".png") ? "image/png" : "image/jpeg"
  );
  fs.createReadStream(file).pipe(res);
});
const cms = http.createServer((req, res) => {
  apiCalls++;
  res.writeHead(503);
  res.end("CMS offline");
});
const listen = (server) =>
  new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server.address().port))
  );
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function startServer(port, env) {
  child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(port)],
    {
      env: { ...process.env, ...env },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  child.stdout.pipe(log, { end: false });
  child.stderr.pipe(log, { end: false });
  for (let i = 0; i < 90; i++) {
    if (child.exitCode !== null)
      throw Error(
        "Next exited: " + fs.readFileSync(path.join(root, "next.log"), "utf8")
      );
    try {
      const r = await fetch(`http://127.0.0.1:${port}/sitemap.xml`, {
        signal: AbortSignal.timeout(2000),
      });
      if (r.status === 200) return;
    } catch {
      /* wait for test-owned server */
    }
    await pause(500);
  }
  throw Error("Next startup timeout");
}
async function stopServer() {
  if (child && child.exitCode === null) {
    const old = child;
    child.kill();
    await Promise.race([once(old, "exit"), pause(4000)]);
  }
}
async function run() {
  const mediaPort = await listen(independentMedia);
  const cmsPort = await listen(cms);
  rewriteMedia(root, `http://127.0.0.1:${mediaPort}`);
  const reservation = http.createServer();
  const port = await listen(reservation);
  await new Promise((r) => reservation.close(r));
  const origin = `http://127.0.0.1:${port}`;
  const env = {
    BLOG_CONTENT_SOURCE: "published",
    LOCATOR_PUBLISHED_ROOT: root,
    CMS_API_BASE_URL: `http://127.0.0.1:${cmsPort}/api/v1`,
    NEXT_PUBLIC_SITE_URL: "https://locatorglobal.com",
  };
  await startServer(port, env);
  const results = [];
  async function check(route, status, text, headers = {}) {
    const response = await fetch(origin + route, {
      redirect: "manual",
      headers,
      signal: AbortSignal.timeout(20000),
    });
    const html = await response.text();
    assert.equal(response.status, status, route + " " + html.slice(0, 200));
    if (text) assert.ok(html.includes(text), route + " missing expected text");
    results.push({ route, status });
    return { response, html };
  }
  for (const market of ["global", "sa", "qa", "kw", "om"]) {
    const prefix = market === "global" ? "" : "/" + market;
    await check(prefix + "/about/newsroom", 200);
    await check(
      prefix + "/about/newsroom/blog",
      200,
      market === "om" || market === "sa" ? "No articles yet" : "Synthetic"
    );
  }
  await check(
    "/about/newsroom/blog/shared-slug",
    200,
    "Synthetic global article"
  );
  await check(
    "/kw/about/newsroom/blog/shared-slug",
    200,
    "Synthetic kw article"
  );
  const redirected = await check("/qa/about/newsroom/blog/shared-slug", 308);
  assert.equal(
    redirected.response.headers.get("location"),
    "https://locatorglobal.com/qa/about/newsroom/blog/new-slug"
  );
  await check("/qa/about/newsroom/blog/new-slug", 200, "Synthetic qa article");
  await check(
    "/sa/about/newsroom/blog/shared-slug",
    410,
    "no longer available"
  );
  await check("/om/about/newsroom/blog/shared-slug", 404);
  await check("/about/newsroom/blog/does-not-exist", 404);
  for (const route of [
    "/global/about/newsroom/blog/shared-slug",
    "/ae/about/newsroom/blog/shared-slug",
    "/bh/about/newsroom/blog/shared-slug",
  ])
    await check(route, 404);
  const saReleases = fs.readdirSync(path.join(root, "sa", "releases")).sort();
  const oldPointer = JSON.parse(
    fs.readFileSync(
      path.join(root, "sa", "releases", saReleases[0], "manifest.json")
    )
  );
  await check("/sa/about/newsroom/blog/shared-slug", 410, undefined, {
    "x-locator-publication-pins": JSON.stringify({
      sa: {
        ...current(root, "sa"),
        releaseId: oldPointer.releaseId,
        revision: oldPointer.revision,
      },
    }),
  });
  assert.equal(apiCalls, 0);
  await new Promise((resolve) => cms.close(resolve));
  publishNewGlobal(root);
  await check(
    "/about/newsroom/blog/new-after-start",
    200,
    "New article activated without rebuilding"
  );
  await check(
    "/about/newsroom/blog/shared-slug",
    200,
    "Updated article body after startup."
  );
  await check(
    "/about/newsroom/blog",
    200,
    "New article activated without rebuilding"
  );
  // Indexing gates stay unchanged; current checkout intentionally emits no entries.
  const sitemap = await check("/sitemap.xml", 200);
  assert.ok(!sitemap.html.includes("<loc>"));
  await stopServer();
  await startServer(port, env);
  await check(
    "/about/newsroom/blog/new-after-start",
    200,
    "New article activated without rebuilding"
  );
  const pointer = current(root, "global");
  fs.writeFileSync(
    path.join(root, "global", "current.json"),
    '{"broken":true}'
  );
  for (const route of [
    "/about/newsroom/blog",
    "/about/newsroom/blog/shared-slug",
  ]) {
    const fail = await check(
      route,
      503,
      "Articles are temporarily unavailable"
    );
    assert.equal(fail.response.headers.get("retry-after"), "60");
  }
  const newsroomDuringFailure = await check(
    "/about/newsroom",
    200,
    "Customer Review Videos"
  );
  assert.ok(
    newsroomDuringFailure.html.includes("Articles are temporarily unavailable")
  );
  fs.writeFileSync(
    path.join(root, "global", "current.json"),
    JSON.stringify(pointer)
  );
  const kwPointerFile = path.join(root, "kw", "current.json");
  const kwPointer = fs.readFileSync(kwPointerFile);
  fs.renameSync(kwPointerFile, kwPointerFile + ".test-offline");
  const kwFail = await check("/kw/about/newsroom/blog/shared-slug", 503);
  assert.equal(kwFail.response.headers.get("retry-after"), "60");
  fs.writeFileSync(kwPointerFile, kwPointer);
  // The fixture media is served by a different process boundary from the CMS.
  const imageName = fs.readdirSync(path.join(root, "_media", "published"))[0];
  const mediaResponse = await fetch(
    `http://127.0.0.1:${mediaPort}/published/${imageName}`
  );
  assert.equal(mediaResponse.status, 200);
  assert.match(mediaResponse.headers.get("content-type"), /^image\//);
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH
      ? { executablePath: process.env.CHROME_PATH }
      : {}),
  });
  const errors = [];
  const page = await browser.newPage();
  await page.route("**/*", (route) => {
    const url = route.request().url();
    return url.startsWith(origin) ||
      url.startsWith("http://127.0.0.1:" + mediaPort) ||
      url.startsWith("data:")
      ? route.continue()
      : route.abort();
  });
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(origin + "/about/newsroom/blog/shared-slug", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(900);
    await page.screenshot({
      path: path.join(root, `article-${width}.png`),
      fullPage: true,
    });
    assert.ok(await page.locator("h1").innerText());
    await page.goto(origin + "/om/about/newsroom/blog", {
      waitUntil: "domcontentloaded",
    });
    await page.screenshot({
      path: path.join(root, `empty-${width}.png`),
      fullPage: true,
    });
    fs.writeFileSync(path.join(root, "global", "current.json"), "{}");
    await page.goto(origin + "/about/newsroom/blog", {
      waitUntil: "domcontentloaded",
    });
    await page.screenshot({
      path: path.join(root, `unavailable-${width}.png`),
      fullPage: true,
    });
    fs.writeFileSync(
      path.join(root, "global", "current.json"),
      JSON.stringify(pointer)
    );
  }
  // Check client navigation as well as initial document loads.
  await page.goto(origin + "/about/newsroom/blog", {
    waitUntil: "domcontentloaded",
  });
  await page
    .locator('a[href="/about/newsroom/blog/new-after-start"]')
    .first()
    .click();
  await page.waitForURL("**/new-after-start");
  assert.ok(
    (await page.locator("h1").innerText()).includes("New article activated")
  );
  await page.goto(origin + "/about/newsroom/blog", {
    waitUntil: "domcontentloaded",
  });
  fs.writeFileSync(path.join(root, "global", "current.json"), "{}");
  await page
    .locator('a[href="/about/newsroom/blog/shared-slug"]')
    .first()
    .click();
  await page.waitForURL("**/shared-slug");
  await page
    .getByRole("heading", { name: "Articles are temporarily unavailable" })
    .waitFor();
  fs.writeFileSync(
    path.join(root, "global", "current.json"),
    JSON.stringify(pointer)
  );
  await page.getByRole("link", { name: "Try again" }).click();
  await page
    .getByRole("heading", {
      name: "Existing article edited after startup",
      exact: true,
    })
    .waitFor();
  // An initially empty market must update BOTH entry points on publication.
  publishFirstOman(root);
  await check(
    "/om/about/newsroom",
    200,
    "First Oman article after empty release"
  );
  await check(
    "/om/about/newsroom/blog",
    200,
    "First Oman article after empty release"
  );
  await page.goto(origin + "/om/about/newsroom", {
    waitUntil: "domcontentloaded",
  });
  await page
    .locator(
      'section[aria-label="Newsroom videos and blog content"] a[href="/om/about/newsroom/blog"]'
    )
    .click();
  await page.waitForURL("**/om/about/newsroom/blog");
  await page
    .getByRole("heading", {
      name: "First Oman article after empty release",
      exact: true,
    })
    .waitFor();
  assert.deepEqual(errors, []);
  if (process.env.LOCATOR_VERIFY_REAL_ROOT) {
    await stopServer();
    await startServer(port, {
      ...env,
      LOCATOR_PUBLISHED_ROOT: process.env.LOCATOR_VERIFY_REAL_ROOT,
    });
    const { loader } = require("./helpers/cms-test-loader.cjs");
    const { pinRelease } = loader().load(
      "src/lib/cms-blog/publication/store.ts"
    );
    for (const market of ["global", "sa", "qa", "kw", "om"]) {
      const prefix = market === "global" ? "" : "/" + market;
      let release;
      try {
        release = await pinRelease(
          process.env.LOCATOR_VERIFY_REAL_ROOT,
          market
        );
      } catch {
        await check(prefix + "/about/newsroom", 200, "Customer Review Videos");
        await check(prefix + "/about/newsroom/blog", 503);
        continue;
      }
      await check(prefix + "/about/newsroom/blog", 200);
      if (release.catalogue.items.length) {
        const entry = release.catalogue.items[0];
        await check(
          prefix + "/about/newsroom/blog/" + entry.slug,
          200,
          entry.card.title
        );
      }
    }
  }
  console.log(
    JSON.stringify(
      { root, results, cmsRequests: apiCalls, browserErrors: errors },
      null,
      2
    )
  );
}
run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    await stopServer();
    independentMedia.close();
    cms.close();
    log.end();
  });
