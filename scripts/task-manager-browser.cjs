/* eslint-disable @typescript-eslint/no-require-imports -- Isolated local browser checks. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { loader } = require("./helpers/cms-test-loader.cjs");
const { getTaskManagerContent: get } = loader().load(
  "src/content/pages/task-manager/resolve.ts"
);
const origin = process.env.TASK_TEST_ORIGIN;
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || ""))
  throw Error("Use an isolated local fixture");
const out = ".verification/task-manager/browser";
fs.mkdirSync(out, { recursive: true });
const normal = (text) => text.replace(/\s+/g, " ").trim();
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
          !/\.(mp4|webm)(\?|$)/.test(route.request().url())
            ? route.continue()
            : route.fulfill({ body: "" })
        );
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        const response = await page.goto(origin + "/service/task-manager", {
          waitUntil: "domcontentloaded",
        });
        assert.equal(response.status(), 200);
        await page.locator("#task-manager .ms-tabs").waitFor();
        await page.evaluate(() => document.fonts.ready);
        const c = get("global");
        assert.equal(await page.title(), c.seo.title);
        assert.equal(await page.locator("h1").innerText(), c.hero.heading);
        assert.equal(await page.locator("h1").count(), 1);
        assert.equal(
          await page.locator("meta[name=description]").getAttribute("content"),
          c.seo.description
        );
        assert.equal(
          await page
            .locator('meta[property="og:title"]')
            .getAttribute("content"),
          c.seo.title
        );
        assert.equal(
          await page
            .locator('meta[name="twitter:title"]')
            .getAttribute("content"),
          c.seo.title
        );
        assert.equal(
          await page.locator("link[rel=canonical]").getAttribute("href"),
          "https://locatorglobal.com/service/task-manager"
        );
        const hero = page.locator(".tm-hero");
        assert.ok(
          await hero.locator(".tm-eyebrow").evaluate((element) => {
            const style = getComputedStyle(element);
            return (
              parseFloat(style.fontSize) <= 14 &&
              element.clientHeight <= parseFloat(style.lineHeight) + 1 &&
              style.whiteSpace === "nowrap"
            );
          })
        );
        assert.equal(
          await page.locator("#task-manager .pm-feature-check").count(),
          6
        );
        assert.equal(
          await page
            .locator("#task-manager .pm-feature-list")
            .evaluate((element) => getComputedStyle(element).display),
          "grid"
        );

        assert.equal(
          await hero
            .getByRole("link", { name: "Get a Quote", exact: true })
            .getAttribute("href"),
          "/get-a-quote"
        );
        assert.equal(
          await hero
            .getByRole("link", { name: "Book a Demo", exact: true })
            .getAttribute("href"),
          "/get-a-free-demo"
        );
        await page.screenshot({ path: out + `/hero-${width}-${motion}.png` });
        assert.equal(
          await page.locator("#task-manager .pm-feature-list li").count(),
          6
        );
        const rendered = normal(await page.locator("main").textContent());
        for (const key of ["benefits", "tools", "industries", "whyChoose"]) {
          assert.ok(rendered.includes(c[key].heading));
          for (const id of c[key].order) {
            assert.ok(rendered.includes(c[key].items[id].title));
            assert.ok(
              rendered.includes(
                key === "whyChoose"
                  ? c[key].items[id].desc
                  : c[key].items[id].description
              )
            );
          }
        }
        assert.equal(await page.locator("#task-benefits article").count(), 4);
        assert.equal(await page.locator("#task-tools article").count(), 2);
        assert.equal(await page.locator("#task-industries article").count(), 5);
        assert.equal(await page.locator(".swc-row").count(), 5);
        const tabs = page.locator("#task-manager .ms-tabs");
        await tabs
          .getByRole("button", { name: "Mobile App", exact: true })
          .click();
        await page
          .locator("#task-manager .tm-phone-screen")
          .waitFor({ state: "visible" });
        assert.equal(
          normal(await tabs.locator(".active").innerText()),
          "Mobile App"
        );
        await tabs
          .getByRole("button", { name: "Web Dashboard", exact: true })
          .click();
        assert.equal(
          normal(await tabs.locator(".active").innerText()),
          "Web Dashboard"
        );
        assert.equal(
          await page
            .locator("#task-tools")
            .getByRole("link", { name: c.tools.cta.label })
            .getAttribute("href"),
          "#task-manager"
        );
        assert.equal(await page.locator("#faq .sfq-item").count(), 8);
        for (let i = 0; i < c.faq.order.length; i++) {
          const item = c.faq.items[c.faq.order[i]],
            row = page.locator("#faq .sfq-item").nth(i),
            trigger = row.locator(".sfq-trig");
          assert.equal(await row.locator(".sfq-qtext").innerText(), item.q);
          if ((await trigger.getAttribute("aria-expanded")) !== "true") {
            await trigger.focus();
            await page.keyboard.press("Enter");
          }
          assert.equal(await trigger.getAttribute("aria-expanded"), "true");
          assert.equal(await row.locator(".sfq-ans").textContent(), item.a);
        }
        const faq = page.locator("#faq");
        await faq.locator(".sfq-cat").filter({ hasText: "Coverage" }).click();
        assert.equal(await faq.locator(".sfq-item").count(), 1);
        assert.equal(
          await faq.locator(".sfq-qtext").innerText(),
          c.faq.items.gcc.q
        );
        await faq
          .locator(".sfq-cat")
          .filter({ hasText: "All questions" })
          .click();
        assert.equal(await faq.locator(".sfq-item").count(), 8);
        assert.equal(
          await page
            .getByRole("heading", { name: c.finalCta.heading, exact: true })
            .count(),
          1
        );
        assert.equal(
          await page
            .getByRole("link", {
              name: c.finalCta.secondaryCta.label,
              exact: true,
            })
            .getAttribute("href"),
          "/get-a-free-demo"
        );
        const visualText = await page.locator("main").innerText();
        for (const forbidden of [
          "Keyword strategy:",
          "Primary keyword",
          "Search intent",
          "SEO metadata",
        ])
          assert.ok(!visualText.includes(forbidden));
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1
          ),
          "horizontal overflow"
        );
        for (const [selector, name] of [
          ["#task-benefits", "benefits"],
          ["#task-tools", "tools"],
          ["#task-industries", "industries"],
          [".swc-grid", "why-choose"],
          ["#faq", "faq"],
          ["#task-manager", "introduction"],
        ]) {
          const section = page.locator(selector);
          for (const reveal of await section.locator("[data-reveal]").all()) {
            await reveal.scrollIntoViewIfNeeded();
            await page.waitForFunction(
              (element) => Number(getComputedStyle(element).opacity) > 0.99,
              await reveal.elementHandle()
            );
          }
          await section.screenshot({
            path: out + "/" + name + "-" + width + "-" + motion + ".png",
          });
        }
        if (motion === "reduce")
          await page.screenshot({
            path: out + "/full-" + width + "-" + motion + ".png",
            fullPage: true,
          });
        assert.deepEqual(errors, []);
        results.push({ width, motion, global: "passed" });
        if (motion === "reduce")
          for (const market of ["qa", "sa", "kw", "om"]) {
            assert.equal(
              (
                await page.goto(
                  origin + "/" + market + "/service/task-manager",
                  { waitUntil: "domcontentloaded" }
                )
              ).status(),
              200
            );
            const old = get(market);
            assert.equal(
              await page.locator("h1").innerText(),
              old.hero.heading
            );
            assert.equal(
              await page.locator("#task-manager .pm-suited span").count(),
              5
            );
            assert.equal(await page.locator("#faq").count(), 0);
            assert.equal(await page.locator("#task-tools").count(), 0);
            assert.equal(
              await page
                .getByRole("heading", { name: c.finalCta.heading })
                .count(),
              0
            );
            assert.equal(
              await page
                .locator("meta[name=description]")
                .getAttribute("content"),
              old.seo.description
            );
            assert.equal(
              await page.locator("link[rel=canonical]").getAttribute("href"),
              "https://locatorglobal.com/" + market + "/service/task-manager"
            );
          }
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
