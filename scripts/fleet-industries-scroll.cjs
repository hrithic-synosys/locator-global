/* eslint-disable @typescript-eslint/no-require-imports -- Local scroll-layout regression. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { loader } = require("./helpers/cms-test-loader.cjs");
const { getFleetTelematicsContent } = loader().load(
  "src/content/pages/fleet-telematics/resolve.ts"
);
const origin = process.env.FLEET_TEST_ORIGIN;
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || ""))
  throw Error("Use the isolated local fixture");
const out = ".verification/fleet-industries-restored";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH,
  });
  const results = [];
  try {
    for (const [width, height, motion] of [
      [1440, 900, "reduce"],
      [1440, 900, "no-preference"],
      [390, 844, "reduce"],
      [390, 667, "no-preference"],
      [320, 568, "reduce"],
      [896, 414, "reduce"],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height },
        reducedMotion: motion,
      });
      await context.route("**/*", (route) =>
        route.request().url().startsWith(origin) &&
        !/\.(mp4|webm)(\?|$)/.test(route.request().url())
          ? route.continue()
          : route.fulfill({ body: "" })
      );
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      assert.equal(
        (
          await page.goto(origin + "/service/fleet-telematics", {
            waitUntil: "domcontentloaded",
          })
        ).status(),
        200
      );
      await page.waitForFunction(() =>
        document.documentElement.style.scrollSnapType.startsWith("y")
      );
      await page.evaluate(() => document.fonts.ready);
      const c = getFleetTelematicsContent("global").industries;
      assert.equal(
        await page.locator("#industries > header").count(),
        0,
        "no separate heading/spacer before the pinned scene"
      );
      assert.equal(
        await page.locator("#industries .ind-panel > .ind-overview").count(),
        0
      );
      const top = await page
        .locator("#industries")
        .evaluate((element) => element.getBoundingClientRect().top + scrollY);
      assert.equal(
        await page
          .locator("#industries")
          .evaluate((element) => element.offsetHeight),
        height * c.order.length
      );
      for (let i = 0; i < c.order.length; i++) {
        await page.evaluate(
          (y) => {
            document.documentElement.style.scrollSnapType = "none";
            window.scrollTo({ top: y, behavior: "instant" });
          },
          top + i * height
        );
        const title = c.items[c.order[i]].title;
        await page.waitForFunction(
          (title) =>
            document
              .querySelector("#industries .ind-industry-title")
              ?.textContent.trim() === title,
          title
        );
        await page
          .locator("#industries .ind-stagger")
          .evaluate((element) =>
            Promise.all(
              [...element.children]
                .flatMap((child) => child.getAnimations())
                .map((animation) => animation.finished)
            )
          );
        const layout = await page.locator("#industries").evaluate((element) => {
          const box = (selector) => {
            const r = element.querySelector(selector).getBoundingClientRect();
            return { top: r.top, bottom: r.bottom };
          };
          return {
            eyebrow: box(".ind-industry-eyebrow"),
            assets: box(".ind-vehicle-tag:last-child"),
            title: box(".ind-industry-title"),
            description: box(".ind-stagger > p"),
            skip: box(".ind-skip"),
          };
        });
        assert.ok(
          layout.eyebrow.top >= 64,
          JSON.stringify({ width, height, i, layout })
        );
        assert.ok(
          layout.assets.bottom <= layout.skip.top,
          JSON.stringify({ width, height, i, layout })
        );
        assert.equal(
          (await page.locator(".ind-industry-eyebrow").textContent()).trim(),
          "GPS Fleet Services"
        );
        assert.equal(
          await page.locator(".ind-stagger > p").innerText(),
          c.items[c.order[i]].desc
        );
        assert.deepEqual(
          await page.locator(".ind-vehicle-tag").allTextContents(),
          JSON.parse(JSON.stringify(c.items[c.order[i]].vehicles))
        );
        if ([0, 5, 11].includes(i))
          await page.screenshot({
            path: out + `/${width}-${height}-${motion}-${i}.png`,
          });
      }
      // Exercise a real wheel transition with the original native snap behavior.
      await page.evaluate((y) => {
        document.documentElement.style.scrollSnapType = "y proximity";
        window.scrollTo({ top: y, behavior: "instant" });
      }, top);
      await page.waitForFunction(
        (title) =>
          document.querySelector(".ind-industry-title")?.textContent.trim() ===
          title,
        c.items[c.order[0]].title
      );
      await page.mouse.move(width / 2, height / 2);
      await page.mouse.wheel(0, height);
      await page.waitForFunction(
        (title) =>
          document.querySelector(".ind-industry-title")?.textContent.trim() ===
          title,
        c.items[c.order[1]].title
      );
      assert.equal(await page.locator(".ind-overview").count(), 0);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1
        )
      );
      assert.deepEqual(errors, []);
      if (width === 1440 && motion === "reduce") {
        await page.goto(origin + "/qa/service/fleet-telematics", {
          waitUntil: "domcontentloaded",
        });
        assert.equal(await page.locator(".ind-overview").count(), 0);
        assert.equal(await page.locator(".ind-has-intro").count(), 0);
        assert.equal(
          await page
            .locator(".ind-industry-title")
            .evaluate((element) => element.tagName),
          "H2"
        );
      }
      results.push({
        width,
        height,
        motion,
        slides: c.order.length,
        passed: true,
      });
      await context.close();
    }
    fs.writeFileSync(out + "/results.json", JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
