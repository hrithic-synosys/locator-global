/* eslint-disable @typescript-eslint/no-require-imports -- Isolated local browser checks. */
const assert = require("node:assert/strict"),
  fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { loader } = require("./helpers/cms-test-loader.cjs");
const { getTrackingDevicesContent: get } = loader().load(
  "src/content/pages/tracking-devices/resolve.ts"
);
const origin = process.env.DEVICES_TEST_ORIGIN;
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || ""))
  throw Error("Use the isolated local fixture");
const out = ".verification/tracking-devices/browser";
fs.mkdirSync(out, { recursive: true });
const normal = (t) => t.replace(/\s+/g, " ").trim();
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH,
  });
  const results = [];
  try {
    for (const [width, motion] of [
      [1440, "reduce"],
      [1440, "no-preference"],
      [390, "reduce"],
      [390, "no-preference"],
      [320, "reduce"],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: motion,
      });
      await context.route("**/*", (route) =>
        route.request().url().startsWith(origin)
          ? route.continue()
          : route.fulfill({ body: "" })
      );
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      assert.equal(
        (
          await page.goto(origin + "/service/tracking-devices", {
            waitUntil: "domcontentloaded",
          })
        ).status(),
        200
      );
      await page.waitForFunction(() =>
        Object.keys(document.querySelector(".dv-stage") || {}).some((key) =>
          key.startsWith("__reactProps")
        )
      );
      await page.evaluate(() => document.fonts.ready);
      const c = get("global");
      assert.equal(await page.title(), c.seo.title);
      assert.equal(await page.locator("h1").innerText(), c.hero.heading);
      assert.equal(
        await page.locator("meta[name=description]").getAttribute("content"),
        c.seo.description
      );
      assert.equal(
        await page.locator("link[rel=canonical]").getAttribute("href"),
        "https://locatorglobal.com/service/tracking-devices"
      );
      assert.equal(
        await page.locator('meta[property="og:title"]').getAttribute("content"),
        c.seo.title
      );
      assert.equal(
        normal(await page.locator(".si-hero .si-eyebrow").textContent()),
        c.hero.eyebrow
      );
      await page.screenshot({ path: out + `/hero-${width}-${motion}.png` });
      assert.equal(await page.locator(".dv-item").count(), 9);
      assert.equal(await page.locator(".dv-thumb").count(), 9);
      const stage = page.locator(".dv-stage");
      await page.locator(".dv-thumb").first().click();
      await stage.focus();
      for (let i = 0; i < c.catalog.order.length; i++) {
        const id = c.catalog.order[i],
          item = c.catalog.items[id],
          active = page.locator('.dv-item[data-pos="0"]');
        await page.waitForFunction(
          (name) =>
            document.querySelector('.dv-item[data-pos="0"] .dv-name')
              ?.textContent === name,
          item.name
        );
        await page.waitForFunction(() =>
          [
            ...document.querySelectorAll('.dv-item[data-pos="0"] [data-anim]'),
          ].every((e) => Number(getComputedStyle(e).opacity) > 0.99)
        );
        assert.equal(await active.locator(".dv-tag").innerText(), item.tagline);
        assert.equal(
          await active
            .locator(".dv-tag")
            .evaluate((e) => e.scrollHeight <= e.clientHeight + 1),
          true,
          "description clipped: " + id
        );
        assert.ok(
          await active
            .locator(".dv-shot")
            .evaluate((e) => e.getBoundingClientRect().height > 80),
          "image squeezed out: " + id
        );
        assert.ok(
          await active.evaluate((element) => {
            const card = element
              .querySelector(".dv-card")
              .getBoundingClientRect();
            const controls = element
              .querySelector(".dv-panel-b")
              .getBoundingClientRect();
            return controls.bottom <= card.bottom - 8;
          }),
          "product controls clipped: " + id
        );
        assert.deepEqual(
          await active.locator(".dv-spec-v").allTextContents(),
          JSON.parse(
            JSON.stringify((item.specs || []).slice(0, 2).map((s) => s.value))
          )
        );
        if (item.comingSoon) {
          assert.equal(await active.locator("a.dv-cta").count(), 0);
          assert.equal(
            await active.locator(".dv-soon").innerText(),
            "Coming shortly"
          );
        } else
          assert.equal(
            await active.locator("a.dv-cta").getAttribute("href"),
            "/service/tracking-devices/" + id
          );
        if ([0, 5, 8].includes(i))
          await stage.screenshot({
            path: out + `/card-${id}-${width}-${motion}.png`,
          });
        if (i === 0) {
          await active
            .getByRole("button", { name: `View ${item.name} image` })
            .click();
          await page.getByRole("dialog").waitFor({ state: "visible" });
          await page.keyboard.press("Escape");
          await page.getByRole("dialog").waitFor({ state: "hidden" });
          await stage.focus();
        }
        if (i < 8) await page.keyboard.press("ArrowRight");
      }
      assert.equal(await page.locator(".swc-row").count(), 5);
      assert.equal(
        await page.locator("#hardware-journey [data-journey-step]").count(),
        4
      );
      for (const [i, id] of c.journey.order.entries()) {
        const item = c.journey.items[id];
        await page
          .getByRole("tab", {
            name: `Show step ${i + 1}: ${item.title}`,
            exact: true,
          })
          .click();
        await page.waitForFunction(
          (id) =>
            document
              .querySelector(`[data-journey-step="${id}"]`)
              ?.getAttribute("data-active") === "true",
          id
        );
        assert.equal(
          await page.locator(`[data-journey-step="${id}"] p`).innerText(),
          item.description
        );
      }
      assert.equal(
        await page
          .getByRole("link", { name: c.journey.cta.label, exact: true })
          .getAttribute("href"),
        "/contact"
      );
      assert.equal(await page.locator("#faq .sfq-item").count(), 8);
      for (const id of c.faq.order) {
        const item = c.faq.items[id],
          row = page.locator(".sfq-item").filter({ hasText: item.q }),
          trigger = row.locator(".sfq-trig");
        if ((await trigger.getAttribute("aria-expanded")) !== "true") {
          await trigger.focus();
          await page.keyboard.press("Enter");
        }
        assert.equal(await trigger.getAttribute("aria-expanded"), "true");
        assert.equal(await row.locator(".sfq-ans").textContent(), item.a);
      }
      await page.locator(".sfq-cat").filter({ hasText: "Deployment" }).click();
      assert.equal(await page.locator(".sfq-item").count(), 3);
      await page
        .locator(".sfq-cat")
        .filter({ hasText: "All questions" })
        .click();
      assert.equal(await page.locator(".sfq-item").count(), 8);
      assert.equal(
        await page
          .getByRole("heading", { name: c.finalCta.heading, exact: true })
          .count(),
        1
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1
        ),
        "horizontal overflow"
      );
      const body = await page.locator("main").innerText();
      for (const note of [
        "Confirm before publishing",
        "Animation guidance:",
        "Search intent",
        "Keep the current nine",
      ])
        assert.ok(!body.includes(note));
      for (const [selector, name] of [
        ["#hardware-journey", "journey"],
        [".swc-grid", "why-choose"],
        ["#faq", "faq"],
      ]) {
        const section = page.locator(selector);
        for (const reveal of await section.locator("[data-reveal]").all()) {
          await reveal.scrollIntoViewIfNeeded();
          await page.waitForFunction(
            (e) => Number(getComputedStyle(e).opacity) > 0.99,
            await reveal.elementHandle()
          );
        }
        await section.screenshot({
          path: out + `/${name}-${width}-${motion}.png`,
        });
      }
      assert.deepEqual(errors, []);
      if (width === 1440 && motion === "reduce") {
        for (const id of c.catalog.order)
          assert.equal(
            (
              await page.request.get(origin + "/service/tracking-devices/" + id)
            ).status(),
            200
          );
        for (const market of ["qa", "sa", "kw", "om"]) {
          assert.equal(
            (
              await page.goto(
                origin + "/" + market + "/service/tracking-devices",
                { waitUntil: "domcontentloaded" }
              )
            ).status(),
            200
          );
          const old = get(market);
          assert.equal(
            normal(await page.locator("h1").innerText()),
            normal(old.hero.heading)
          );
          assert.equal(await page.locator(".dv-item").count(), 9);
          assert.equal(await page.locator(".dv-expanded").count(), 0);
          assert.equal(await page.locator("#hardware-journey").count(), 0);
          assert.equal(await page.locator("#faq").count(), 0);
          assert.equal(
            await page.locator('.dv-item[data-pos="0"] .dv-name').innerText(),
            "FMB120"
          );
          assert.equal(
            await page
              .locator('.dv-item[data-pos="0"] a.dv-cta')
              .getAttribute("href"),
            "/" + market + "/service/tracking-devices/fmb120"
          );
          assert.equal(
            await page
              .locator("meta[name=description]")
              .getAttribute("content"),
            old.seo.description
          );
        }
      }
      results.push({ width, motion, passed: true });
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
