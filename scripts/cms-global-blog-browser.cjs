/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node test harness. */
// Production-server checks against an isolated, read-only fixture API.
// Use PLAYWRIGHT_MODULE when Playwright is supplied by the workspace runtime.
const { spawn } = require("node:child_process");
const http = require("node:http"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  ts = require("typescript");
const React = require("react"),
  { renderToStaticMarkup } = require("react-dom/server");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const f = require("./fixtures/cms-blog.cjs");
const markets = ["global", "sa", "qa", "kw", "om"];
const prefix = (m) => (m === "global" ? "" : "/" + m);
const blog = (m) => prefix(m) + "/about/newsroom/blog";
const calls = [];
let emptyMarket = "",
  failMarket = "",
  listMode = "",
  relatedMode = "",
  allOffline = false,
  newPublished = false;
const card = (m, slug = "fixture-article", banner = f.image) => ({
  ...f.card(slug, banner),
  market: m,
  title: m + " article " + slug,
});
const detail = (m, slug = "fixture-article", banner = f.image) => ({
  ...f.detail(slug, banner),
  ...card(m, slug, banner),
});
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://localhost"),
    match = u.pathname.match(
      /^\/api\/v1\/sites\/(global|sa|qa|kw|om)\/blogs(.*)$/
    );
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  if (!match) {
    res.writeHead(404);
    return res.end("{}");
  }
  const [, market, suffix] = match;
  calls.push({ market, suffix, query: u.search });
  if (allOffline) return req.socket.destroy();
  if (!suffix && listMode === "slow")
    await new Promise((resolve) => setTimeout(resolve, 3000));
  if (!suffix && listMode === "malformed") return res.end("invalid JSON");
  if (!suffix && listMode === "wrong-market")
    return res.end(
      JSON.stringify(f.list([card(market === "om" ? "qa" : "om")]))
    );
  if (!suffix && listMode === "invalid-media")
    return res.end(
      JSON.stringify(
        f.list([
          card(market, "unsafe", { ...f.image, src: "javascript:invalid" }),
        ])
      )
    );
  let body;
  if (!suffix) {
    const page = Number(u.searchParams.get("page") || 1),
      limit = Number(u.searchParams.get("limit") || 12);
    const all = [
      card(market),
      ...Array.from({ length: 12 }, (_, i) =>
        card(market, "page-item-" + i, i % 2 ? null : f.image)
      ),
    ];
    if (failMarket === market) {
      res.writeHead(503);
      body = { success: false };
    } else
      body = f.list(
        emptyMarket === market || u.searchParams.has("q")
          ? []
          : all.slice((page - 1) * limit, page * limit),
        page,
        limit,
        emptyMarket === market || u.searchParams.has("q") ? 0 : all.length
      );
  } else if (suffix === "/featured")
    body = { success: true, items: [card(market)] };
  else if (suffix === "/slugs")
    body = {
      success: true,
      items: [
        "fixture-article",
        "plain",
        ...(newPublished ? ["new-after-build"] : []),
      ].map((slug) => ({ market, slug, updatedAt: "2025-02-01T00:00:00Z" })),
    };
  else if (suffix.endsWith("/related")) {
    if (relatedMode === "slow")
      await new Promise((resolve) => setTimeout(resolve, 3000));
    if (relatedMode === "offline" || relatedMode === "missing") {
      res.writeHead(relatedMode === "missing" ? 404 : 503);
      body = { success: false };
    } else body = { success: true, items: [card(market, "related", null)] };
  } else if (suffix === "/outage") {
    res.writeHead(503);
    body = { success: false };
  } else if (suffix === "/invalid-canonical")
    body = {
      success: true,
      article: {
        ...detail(market, "invalid-canonical"),
        seo: {
          ...f.detail().seo,
          canonicalUrl:
            "https://locator.ae/about/newsroom/blog/invalid-canonical",
        },
      },
    };
  else if (suffix === "/wrong-market")
    body = {
      success: true,
      article: detail(market === "qa" ? "global" : "qa", "wrong-market"),
    };
  else if (
    suffix === "/missing" ||
    (suffix === "/same" && market === "om") ||
    (suffix === "/new-after-build" && !newPublished)
  ) {
    res.writeHead(404);
    body = { success: false };
  } else {
    const slug = decodeURIComponent(suffix.slice(1));
    body = {
      success: true,
      article: detail(market, slug, slug === "plain" ? null : f.image),
    };
  }
  res.end(JSON.stringify(body));
});
function reference() {
  const file =
    process.env.CMS_PREVIEW_PATH ||
    "C:/Synosys/Locator CMS/Locator Frontend/src/components/articles/preview.tsx";
  if (!fs.existsSync(file)) return null;
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText,
    exports = {};
  vm.runInNewContext(code, {
    exports,
    require: (id) =>
      id === "react"
        ? React
        : id === "react/jsx-runtime"
          ? require(id)
          : id === "next/link"
            ? {
                __esModule: true,
                default: (props) =>
                  React.createElement("a", props, props.children),
              }
            : (() => {
                throw Error(id);
              })(),
  });
  return exports.default;
}
async function run(origin) {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH
      ? { executablePath: process.env.CHROME_PATH }
      : {}),
  });
  const results = [];
  const output = process.env.SCREENSHOT_DIR;
  if (output) fs.mkdirSync(output, { recursive: true });
  try {
    for (const width of process.env.CMS_TEST_WIDTHS
      ? process.env.CMS_TEST_WIDTHS.split(",").map(Number)
      : [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
        locale: "en-QA",
      });
      await context.addCookies([
        { name: "country", value: "qa", url: origin },
        { name: "market", value: "qa", url: origin },
      ]);
      await context.route("**/*", (route) =>
        route.request().url().startsWith(origin)
          ? route.continue()
          : route.fulfill({ contentType: "text/plain", body: "" })
      );
      const page = await context.newPage();
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      for (const market of markets) {
        await page.goto(origin + blog(market), { waitUntil: "networkidle" });
        assert.equal(
          await page.locator(".bl-lead").getAttribute("href"),
          blog(market) + "/fixture-article"
        );
        assert.equal(
          await page.locator(".bl-lead-title").innerText(),
          market + " article fixture-article"
        );
        await page
          .getByRole("navigation", { name: "Blog pagination", exact: true })
          .getByRole("link", { name: "Next", exact: true })
          .click();
        await page.waitForURL("**?page=2");
        assert.equal(
          await page.locator(".bl-lead").getAttribute("href"),
          blog(market) + "/page-item-11"
        );
        assert.equal(await page.locator(".bl-card").count(), 0);
        await page.goto(origin + prefix(market) + "/about/newsroom", {
          waitUntil: "networkidle",
        });
        assert.equal(await page.locator(".nvc-blog-card").count(), 3);
        assert.equal(
          await page.locator(".nvc-blog-title").first().innerText(),
          market + " article fixture-article"
        );
        assert.equal(
          await page.locator(".nvc-blog-card").first().getAttribute("href"),
          blog(market) + "/fixture-article"
        );
        await page.getByRole("tab", { name: "Blog", exact: true }).click();
        assert.equal(
          await page.locator(".nrb-grid .nrb-card-title").first().innerText(),
          market + " article fixture-article"
        );
        await page.goto(origin + blog(market) + "/same", {
          waitUntil: "networkidle",
        });
        if (market === "om")
          await page
            .getByRole("heading", { name: /This route went off the map/ })
            .waitFor();
        else {
          assert.equal(
            await page.locator(".ba h1").innerText(),
            market + " article same"
          );
          assert.equal(
            await page.locator('link[rel="canonical"]').getAttribute("href"),
            "https://locatorglobal.com" + blog(market) + "/same"
          );
        }
      }
      emptyMarket = "om";
      await page.goto(origin + blog("om"), { waitUntil: "networkidle" });
      await page
        .getByRole("heading", { name: "No articles yet", exact: true })
        .waitFor();
      emptyMarket = "";
      failMarket = "qa";
      await page.goto(origin + blog("qa"), { waitUntil: "networkidle" });
      await page
        .getByRole("heading", { name: "Articles temporarily unavailable" })
        .waitFor();
      failMarket = "";
      await page
        .getByRole("button", { name: "Try again", exact: true })
        .click();
      try {
        await page.locator(".bl-lead").waitFor();
      } catch (error) {
        if (output)
          await page.screenshot({
            path: path.join(output, "retry-failure-" + width + ".png"),
          });
        console.error(
          JSON.stringify({
            width,
            pageErrors,
            recentCalls: calls.slice(-5),
            retryButtons: await page
              .getByRole("button", { name: /Try|Trying/ })
              .evaluateAll((elements) =>
                elements.map((element) => element.outerHTML)
              ),
            headings: await page.locator("h1,h2").allTextContents(),
          })
        );
        throw error;
      }
      for (const slug of ["wrong-market", "outage", "invalid-canonical"]) {
        await page.goto(origin + blog("qa") + "/" + slug, {
          waitUntil: "networkidle",
        });
        await page
          .getByRole("heading", {
            name: "This article is temporarily unavailable",
          })
          .waitFor();
      }
      // Slow CMS responses must not block the rest of the newsroom, and the
      // selected Blog tab must survive the streamed feed arriving.
      listMode = "slow";
      await page.goto(origin + "/qa/about/newsroom", { waitUntil: "commit" });
      // Incoming streamed content can coexist with a hidden loading tree.
      await page.locator(".nrh-title:visible").waitFor();
      await page.getByRole("tab", { name: "Blog", exact: true }).click();
      await page.locator('.nrb-main [data-content-state="loading"]').waitFor();
      if (output)
        await page.screenshot({
          path: path.join(output, "newsroom-loading-" + width + ".png"),
        });
      await page.locator(".nrb-grid .nrb-card-title").first().waitFor();
      assert.equal(
        await page
          .getByRole("tab", { name: "Blog", exact: true })
          .getAttribute("aria-selected"),
        "true"
      );
      listMode = "";

      // Real empty content and service failure have different messages. News,
      // videos and other tabs remain available even with the CMS disconnected.
      allOffline = true;
      await page.goto(origin + "/qa/about/newsroom", {
        waitUntil: "networkidle",
      });
      await page
        .getByRole("heading", {
          name: "Articles temporarily unavailable",
          exact: true,
        })
        .waitFor();
      assert.ok(await page.locator(".nrb-hero-title").isVisible());
      await page.getByRole("tab", { name: "Blog", exact: true }).click();
      await page
        .locator('.nrb-main [data-content-state="unavailable"]')
        .waitFor();
      assert.equal(
        await page
          .getByRole("heading", { name: "No articles yet", exact: true })
          .count(),
        0
      );
      if (output)
        await page.screenshot({
          path: path.join(output, "newsroom-offline-" + width + ".png"),
        });
      allOffline = false;
      await page
        .getByRole("button", { name: "Try again", exact: true })
        .first()
        .click();
      await page.locator(".nvc-blog-card").first().waitFor();

      for (const mode of ["malformed", "wrong-market", "invalid-media"]) {
        listMode = mode;
        await page.goto(origin + blog("om"), { waitUntil: "networkidle" });
        await page
          .getByRole("heading", {
            name: "Articles temporarily unavailable",
            exact: true,
          })
          .waitFor();
        assert.equal(await page.locator(".bl-lead").count(), 0);
      }
      listMode = "";
      await page.goto(origin + blog("om") + "?q=unmatched", {
        waitUntil: "networkidle",
      });
      await page
        .getByRole("heading", { name: "No matching articles", exact: true })
        .waitFor();
      assert.equal(
        await page
          .getByRole("link", { name: "View all articles", exact: true })
          .getAttribute("href"),
        blog("om")
      );
      await page.goto(origin + blog("om") + "?page=999", {
        waitUntil: "networkidle",
      });
      await page
        .getByRole("heading", { name: "No articles on this page", exact: true })
        .waitFor();

      for (const mode of ["offline", "missing"]) {
        relatedMode = mode;
        await page.goto(origin + blog("qa") + "/fixture-article", {
          waitUntil: "networkidle",
        });
        assert.equal(
          await page.locator(".ba h1").innerText(),
          "qa article fixture-article"
        );
        assert.equal(await page.locator(".ba-table").count(), 2);
        assert.equal(await page.locator(".ba-rel-item").count(), 0);
      }
      relatedMode = "slow";
      await page.goto(origin + blog("qa") + "/fixture-article", {
        waitUntil: "commit",
      });
      await page.locator(".ba h1").waitFor();
      assert.equal(await page.locator(".ba-rel-item").count(), 0);
      await page.locator(".ba-rel-item").waitFor();
      relatedMode = "";

      allOffline = true;
      await page.goto(origin + blog("qa") + "/fixture-article", {
        waitUntil: "networkidle",
      });
      await page
        .getByRole("heading", {
          name: "This article is temporarily unavailable",
          exact: true,
        })
        .waitFor();
      assert.equal(
        await page
          .getByRole("link", { name: "Back to newsroom", exact: true })
          .getAttribute("href"),
        "/qa/about/newsroom"
      );
      assert.equal(await page.locator(".ba").count(), 0);
      if (output)
        await page.screenshot({
          path: path.join(output, "article-offline-" + width + ".png"),
        });
      allOffline = false;
      await page
        .getByRole("button", { name: "Try again", exact: true })
        .click();
      await page.locator(".ba h1").waitFor();
      assert.equal(
        new URL(page.url()).pathname,
        blog("qa") + "/fixture-article"
      );
      assert.deepEqual(pageErrors, []);

      newPublished = true;
      await page.goto(origin + blog("qa") + "/new-after-build", {
        waitUntil: "networkidle",
      });
      assert.equal(
        await page.locator(".ba h1").innerText(),
        "qa article new-after-build"
      );
      await page.goto(origin + blog("qa") + "/fixture-article", {
        waitUntil: "networkidle",
      });
      assert.equal(await page.locator(".ba-table").count(), 2);
      assert.equal(await page.locator(".ba-ov").count(), 2);
      assert.equal(await page.locator(".ba-split").count(), 2);
      assert.equal(
        await page.locator(".ba-rel-item").getAttribute("href"),
        blog("qa") + "/related"
      );
      assert.equal(
        await page.locator(".ba-btn").getAttribute("href"),
        "/qa/get-a-quote"
      );
      assert.ok(
        (
          await page
            .getByRole("link", { name: "Share on LinkedIn" })
            .getAttribute("href")
        ).includes(
          encodeURIComponent(
            "https://locatorglobal.com" + blog("qa") + "/fixture-article"
          )
        )
      );
      await page.locator('.ba-toc-link[href="#same-3"]').focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => location.hash === "#same-3");
      assert.equal(
        await page
          .locator('.ba-toc-link[href="#same-3"]')
          .getAttribute("aria-current"),
        "location"
      );
      assert.ok(
        await page
          .locator(".ba-hero-img")
          .evaluate((img) => img.complete && img.naturalWidth > 0)
      );
      const bounds = await page.locator(".ba-layout").boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
      await page.evaluate(async () => {
        window.scrollTo(0, 0);
        await document.fonts.ready;
      });
      if (output)
        await page.locator(".ba").screenshot({
          path: path.join(output, "cms-global-article-" + width + ".png"),
        });
      const Reference = reference();
      if (Reference) {
        const metrics = () =>
          page.locator(".ba-main").evaluate((el) =>
            [
              ...el.querySelectorAll(
                ".ba-h2,.ba-h3,.ba-p,.ba-figure,.ba-table-scroll,.ba-split,.ba-ov"
              ),
            ].map((e) => {
              const r = e.getBoundingClientRect();
              return {
                cls: e.className,
                x: r.x,
                y: r.y,
                width: r.width,
                height: r.height,
              };
            })
          );
        const actual = await metrics(),
          p = detail("qa");
        const html = renderToStaticMarkup(
          React.createElement(Reference, {
            title: p.title,
            excerpt: p.excerpt,
            coverImage: p.banner,
            content: p.content,
            format: p.format,
            author: p.author,
            summary: p.summary,
            relatedArticles: [card("qa", "related", null)],
            categoryName: "Blog",
            publishedAt: p.publishedAt,
            readingMinutes: p.readingMinutes,
          })
        );
        await page.locator(".ba").evaluate((el, html) => {
          const doc = new DOMParser().parseFromString(html, "text/html");
          doc
            .querySelectorAll("style")
            .forEach((style) => document.head.appendChild(style));
          el.replaceWith(doc.querySelector("article"));
        }, html);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            [...document.querySelectorAll(".ba img")].map((i) =>
              i.decode().catch(() => {})
            )
          );
        });
        const expected = await metrics();
        assert.equal(actual.length, expected.length);
        let maxDelta = 0;
        for (let i = 0; i < actual.length; i++)
          for (const k of ["x", "y", "width", "height"])
            maxDelta = Math.max(
              maxDelta,
              Math.abs(actual[i][k] - expected[i][k])
            );
        assert.ok(
          maxDelta <= 1,
          "CMS preview layout differs by " + maxDelta + "px at " + width + "px"
        );
        if (output)
          await page.locator(".ba").screenshot({
            path: path.join(output, "cms-global-reference-" + width + ".png"),
          });
        results.push({
          width,
          referenceBlocks: actual.length,
          maxLayoutDelta: maxDelta,
        });
      }
      await page.goto(origin + blog("qa") + "/plain", {
        waitUntil: "networkidle",
      });
      assert.equal(await page.locator(".ba-head-plain").count(), 1);
      assert.equal(await page.locator(".ba-hero-img").count(), 0);
      for (const invalid of ["ae", "bh", "all", "xx", "global"]) {
        const start = calls.length;
        await page.goto(origin + "/" + invalid + "/about/newsroom/blog", {
          waitUntil: "networkidle",
        });
        await page
          .getByRole("heading", { name: /This route went off the map/ })
          .waitFor();
        assert.equal(calls.length, start);
      }
      const sitemap = await context.request.get(origin + "/sitemap.xml");
      assert.equal(sitemap.status(), 200);
      assert.ok(!(await sitemap.text()).includes("/about/newsroom/blog/"));
      await context.close();
    }
    assert.deepEqual(
      [...new Set(calls.map((c) => c.market))].sort(),
      [...markets].sort()
    );
    console.log(
      JSON.stringify({
        passed: true,
        markets: markets,
        previewLayout: results,
        newSlugs: true,
        rootWithQatarCookies: true,
        errorVs404: true,
        fixturesOnly: true,
      })
    );
  } finally {
    await browser.close();
  }
}
server.listen(0, "127.0.0.1", () => {
  const port = 35000 + Math.floor(Math.random() * 5000),
    api = "http://127.0.0.1:" + server.address().port + "/api/v1";
  const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(port)],
    {
      env: {
        ...process.env,
        CMS_API_BASE_URL: api,
        NEXT_PUBLIC_SITE_URL: "https://locatorglobal.com",
        TURNSTILE_SECRET_KEY: "",
      },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  let started = false;
  const timeout = setTimeout(() => {
    console.error("Start timeout");
    child.kill();
    server.close();
    process.exitCode = 1;
  }, 60000);
  child.stdout.on("data", async (chunk) => {
    if (!started && chunk.toString().includes("Ready")) {
      started = true;
      clearTimeout(timeout);
      try {
        await run("http://127.0.0.1:" + port);
      } catch (e) {
        console.error(e);
        process.exitCode = 1;
      } finally {
        child.kill();
        server.close();
      }
    }
  });
  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    if (!/CMS blog|digest|at |\}/.test(text)) process.stderr.write(text);
  });
  child.on("exit", (code) => {
    if (!started) {
      clearTimeout(timeout);
      console.error("Next server exited before startup", code);
      server.close();
      process.exitCode = 1;
    }
  });
});
