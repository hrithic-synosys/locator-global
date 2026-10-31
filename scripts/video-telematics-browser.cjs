/* eslint-disable @typescript-eslint/no-require-imports -- Local browser regression. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = process.env.VIDEO_TEST_ORIGIN;
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin || ""))
  throw Error("Use the isolated local fixture origin");
const output = process.env.VIDEO_ARTIFACT_DIR || ".verification/video-content-browser";
fs.mkdirSync(output, { recursive: true });
const legacy = require("./fixtures/video-telematics-legacy.json");
const { loader } = require("./helpers/cms-test-loader.cjs");
const { getVideoTelematicsContent } = loader().load(
  "src/content/pages/video-telematics/resolve.ts"
);
const normal = (s) => s.replace(/\s+/g, " ").trim();

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH,
  });
  const results = [];
  try {
    for (const width of [1440, 390])
      for (const motion of ["reduce", "no-preference"]) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          reducedMotion: motion,
        });
        await context.route("**/*", (route) =>
          route.request().url().startsWith(origin)
            ? route.continue()
            : route.fulfill({ contentType: "text/plain", body: "" })
        );
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(origin + "/service/video-telematics", {
          waitUntil: "networkidle",
        });
        const global = getVideoTelematicsContent("global");
        assert.equal(await page.title(), global.seo.title);
        assert.equal(await page.locator("h1").innerText(), global.hero.heading);
        assert.equal(
          await page.locator("meta[name=description]").getAttribute("content"),
          global.seo.description
        );
        assert.equal(
          await page
            .locator('meta[property="og:title"]')
            .getAttribute("content"),
          global.seo.ogTitle
        );
        assert.equal(
          await page
            .locator('meta[name="twitter:title"]')
            .getAttribute("content"),
          global.seo.ogTitle
        );
        assert.equal(
          await page.locator("link[rel=canonical]").getAttribute("href"),
          "https://locatorglobal.com/service/video-telematics"
        );
        assert.equal(
          await page.locator("#video-features .vt-content-card").count(),
          0
        );
        assert.equal(
          await page.locator("#why-choose-video .vt-content-card").count(),
          0
        );
        assert.equal(await page.locator(".vtfq-item").count(), 15);
        assert.equal(await page.locator("#video-in-action").count(), 0);
        assert.equal(
          await page.locator("#blogs h2").innerText(),
          global.blogs.heading
        );
        assert.equal(
          await page
            .locator("#blogs")
            .getByRole("link", { name: "All Articles", exact: true })
            .getAttribute("href"),
          "/about/newsroom/blog"
        );
        await page.screenshot({
          path: path.join(output, `global-hero-${width}-${motion}.png`),
        });
        for (const id of global.driverAlerts.order) {
          const item = global.driverAlerts.items[id];
          const button = page
            .getByRole("button", {
              name: new RegExp(
                normal(item.title).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
              ),
            })
            .filter({ has: page.locator(".vta-rail-name") });
          // The live rail is outside the remounting preview, so keyboard/click
          // selection survives each scroll-driven scene change.
          await button.click();
          await page.waitForFunction(
            (expected) =>
              document
                .querySelector(".vta-title")
                ?.innerText?.replace(/\s+/g, " ")
                .trim() === expected,
            normal(item.title)
          );
        }
        await page.locator(".vta-skip").click();
        for (
          let i = 0;
          global.enabled.journeySteps && i < global.journeySteps.order.length;
          i++
        ) {
          const id = global.journeySteps.order[i];
          await page
            .getByRole("button", {
              name: `Show step ${i + 1}: ${global.journeySteps.items[id].title}`,
              exact: true,
            })
            .click();
          await page.waitForFunction(
            (expected) =>
              document
                .querySelector(`button[aria-label="${expected}"]`)
                ?.getAttribute("aria-current") === "true",
            `Show step ${i + 1}: ${global.journeySteps.items[id].title}`
          );
        }
        for (const id of global.industries.order) {
          const item = global.industries.items[id];
          await page
            .getByRole("button", { name: item.title, exact: true })
            .click();
          assert.equal(
            await page
              .getByRole("button", { name: item.title, exact: true })
              .getAttribute("aria-expanded"),
            "true"
          );
        }
        for (const id of global.faq.order) {
          const item = global.faq.items[id];
          const trigger = page
            .locator(".vtfq-trig")
            .filter({ hasText: item.q });
          if ((await trigger.getAttribute("aria-expanded")) !== "true")
            await trigger.click();
          assert.equal(await trigger.getAttribute("aria-expanded"), "true");
          await page.getByText(item.a, { exact: true }).waitFor();
        }
        assert.equal(
          await page.locator(".vt-copy .vt-btn-outline").getAttribute("href"),
          "/get-a-free-demo"
        );
        assert.equal(
          await page.locator(".cta-btn-primary").getAttribute("href"),
          "/get-a-quote"
        );
        assert.equal(
          await page.locator(".cta-btn-ghost").getAttribute("href"),
          "/get-a-free-demo"
        );
        assert.ok(
          !(await page.locator("main").innerText()).includes(
            "zero battery drain"
          )
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth
          ),
          false
        );
        await page.locator("#video-telematics").scrollIntoViewIfNeeded();
        await page.screenshot({
          path: path.join(output, `global-showcase-${width}-${motion}.png`),
        });
        if (motion === "reduce")
          for (const market of ["qa", "sa", "kw", "om"]) {
            await page.goto(origin + `/${market}/service/video-telematics`, {
              waitUntil: "networkidle",
            });
            assert.equal(
              await page.locator("h1").innerText(),
              legacy.hero.heading
            );
            assert.ok((await page.title()).includes(legacy.seo.title));
            assert.equal(
              await page
                .locator("meta[name=description]")
                .getAttribute("content"),
              legacy.seo.description
            );
            assert.equal(await page.locator(".vtfq-item").count(), 15);
            assert.equal(
              await page
                .locator("#video-features,#video-in-action,#why-choose-video")
                .count(),
              0
            );
            assert.equal(
              await page.locator(".vta-rail-name").nth(6).innerText(),
              "Texting on a Phone"
            );
            assert.equal(
              await page
                .locator(".vt-copy .vt-btn-primary")
                .getAttribute("href"),
              `/${market}/get-a-quote`
            );
            assert.equal(
              await page.locator(".cta-btn-ghost").getAttribute("href"),
              `/${market}/get-a-free-demo`
            );
            assert.ok(
              !(await page.locator("main").innerText()).includes(
                "Your approved"
              )
            );
            assert.equal(
              await page.evaluate(
                () => document.documentElement.scrollWidth > innerWidth
              ),
              false
            );
            if (market === "qa")
              await page.screenshot({
                path: path.join(output, `qa-original-${width}.png`),
              });
          }
        assert.deepEqual(errors, []);
        results.push({ width, motion, passed: true });
        await context.close();
      }
    console.log(
      JSON.stringify({
        passed: true,
        profiles: results,
        analytics: "blocked",
        cms: "synthetic read-only fixture",
      })
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
