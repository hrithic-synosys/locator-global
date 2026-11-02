/* eslint-disable @typescript-eslint/no-require-imports -- Isolated local browser checks. */
const assert = require("node:assert/strict"),
  fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { loader } = require("./helpers/cms-test-loader.cjs");
const { getFleetTelematicsContent: get } = loader().load(
  "src/content/pages/fleet-telematics/resolve.ts"
);
const origin = process.env.FLEET_TEST_ORIGIN;
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || ""))
  throw Error("Use the isolated local fixture");
const out = ".verification/fleet-content-browser";
fs.mkdirSync(out, { recursive: true });
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
          route.request().url().startsWith(origin) &&
          !route
            .request()
            .url()
            .match(/\.(mp4|webm)(\?|$)/)
            ? route.continue()
            : route.fulfill({ body: "" })
        );
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        const response = await page.goto(origin + "/service/fleet-telematics", {
          waitUntil: "domcontentloaded",
        });
        assert.equal(response.status(), 200);
        await page.waitForFunction(() =>
          Object.keys(document.querySelector(".bf-arrow") || {}).some((k) =>
            k.startsWith("__reactProps")
          )
        );
        await page.evaluate(() => document.fonts.ready);
        const c = get("global");
        assert.equal(await page.locator("h1").innerText(), c.hero.heading);
        assert.equal(
          await page.locator("meta[name=description]").getAttribute("content"),
          c.seo.description
        );
        assert.equal(
          await page.locator("link[rel=canonical]").getAttribute("href"),
          "https://locatorglobal.com/service/fleet-telematics"
        );
        assert.equal(
          await page
            .getByRole("link", { name: "Explore Solutions", exact: true })
            .getAttribute("href"),
          "#fleet-telematics"
        );
        await page.screenshot({ path: out + `/hero-${width}-${motion}.png` });
        const benefits = page.locator("#benefits");
        assert.equal(await benefits.locator(".bf-item").count(), 10);
        for (let i = 0; i < c.benefits.order.length; i++) {
          const item = c.benefits.items[c.benefits.order[i]];
          assert.equal(
            normal(
              await benefits.locator(".bf-item.on .bf-acc-desc").innerText()
            ),
            item.label + ". " + item.short
          );
          if (i < 9)
            await benefits
              .getByRole("button", { name: "Next", exact: true })
              .click();
        }
        assert.equal(
          await benefits
            .getByRole("button", { name: "Next", exact: true })
            .isDisabled(),
          true
        );
        await benefits.screenshot({
          path: out + `/features-${width}-${motion}.png`,
        });
        assert.equal(
          await page.locator("#fleet-telematics .fts-fcard").count(),
          6
        );
        const top = await page
          .locator("#industries")
          .evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
        for (let i = 0; i < c.industries.order.length; i++) {
          await page.evaluate(
            (y) => {
              document.documentElement.style.scrollSnapType = "none";
              window.scrollTo({ top: y, behavior: "instant" });
            },
            top + i * 900
          );
          await page.waitForFunction(
            (t) =>
              document.querySelector("#industries .ind-industry-title")?.textContent.trim() ===
              t,
            c.industries.items[c.industries.order[i]].title
          );
          assert.equal(
            normal(
              await page.locator("#industries .ind-stagger > p").innerText()
            ),
            c.industries.items[c.industries.order[i]].desc
          );
        }
        assert.equal(
          await page.locator("#industries .ind-vehicle-tag").count(),
          c.industries.items.school.vehicles.length
        );
        await page
          .locator("#industries")
          .screenshot({ path: out + `/industries-${width}-${motion}.png` });
        assert.equal(await page.locator(".proc-card").count(), 4);
        assert.equal(await page.locator(".swc-row").count(), 4);
        assert.equal(await page.locator(".dc-stats").count(), 0);
        for (const id of c.videoTelematics.order) {
          const item = c.videoTelematics.items[id];
          const button = page
            .locator(".dc-panel")
            .getByText(item.title, { exact: true })
            .first();
          await button.click();
          assert.equal(
            await page
              .getByRole("button", { name: item.title, exact: true })
              .getAttribute("aria-expanded"),
            "true"
          );
        }
        assert.equal(
          await page
            .getByRole("link", {
              name: "Explore Video Telematics",
              exact: true,
            })
            .getAttribute("href"),
          "/service/video-telematics"
        );
        // Photo paths are checked on disk; native lazy decode timing is outside this content regression.
        await page
          .locator("#dashcam")
          .screenshot({ path: out + `/video-${width}-${motion}.png` });
        assert.equal(await page.locator(".sfq-item").count(), 6);
        for (const id of c.faq.order) {
          const item = c.faq.items[id];
          const button = page.locator(".sfq-trig").filter({ hasText: item.q });
          if ((await button.getAttribute("aria-expanded")) !== "true")
            await button.click();
          assert.equal(await button.getAttribute("aria-expanded"), "true");
          assert.ok(
            (await page.locator(".sfq-item.on .sfq-ans").innerText()).includes(
              item.a
            )
          );
        }
        await page.locator(".sfq-cat").filter({ hasText: "Coverage" }).click();
        assert.equal(await page.locator(".sfq-item").count(), 1);
        assert.equal(
          await page
            .getByRole("heading", { name: c.finalCta.heading, exact: true })
            .count(),
          1
        );
        const body = await page.locator("main").innerText();
        for (const unwanted of [
          "Keywords:",
          "under 48 hours",
          "UAE businesses served",
          "confirm numbers and units",
        ])
          assert.ok(!body.includes(unwanted), unwanted);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1
          ),
          "horizontal overflow"
        );
        assert.deepEqual(errors, []);
        results.push({ width, motion, passed: true });
        for (const market of width === 1440 && motion === "reduce"
          ? ["qa", "sa", "kw", "om"]
          : []) {
          assert.equal(
            (
              await page.goto(
                origin + "/" + market + "/service/fleet-telematics",
                { waitUntil: "domcontentloaded" }
              )
            ).status(),
            200
          );
          assert.equal(await page.locator(".sfq-item").count(), 11);
          assert.equal(await page.locator(".swc-row").count(), 3);
          assert.equal(await page.locator(".dc-stats").count(), 1);
          assert.ok(
            (await page.locator("main").innerText()).includes(
              "UAE businesses served"
            )
          );
          assert.equal(
            await page.locator("link[rel=canonical]").getAttribute("href"),
            "https://locatorglobal.com/" + market + "/service/fleet-telematics"
          );
        }
        await context.close();
      }
    fs.writeFileSync(out + "/results.json", JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
