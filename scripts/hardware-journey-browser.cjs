/* eslint-disable @typescript-eslint/no-require-imports -- Local interaction regression. */
const assert = require("node:assert/strict"),
  fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { loader } = require("./helpers/cms-test-loader.cjs");
const { getTrackingDevicesContent } = loader().load(
  "src/content/pages/tracking-devices/resolve.ts"
);
const content = getTrackingDevicesContent("global").journey;
const origin = process.env.DEVICES_TEST_ORIGIN;
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || ""))
  throw Error("Use the isolated local fixture");
const out = ".verification/hardware-journey";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH,
  });
  const results = [];
  const ready = async (page, index) =>
    page.waitForFunction(
      (index) =>
        document
          .querySelectorAll("#hardware-journey [role=tab]")
          [index]?.getAttribute("aria-selected") === "true",
      index
    );
  const geometry = async (page) =>
    page.locator("#hardware-journey").evaluate((root) => {
      const frame = root.querySelector(".hw-frame");
      return {
        top: scrollY + root.getBoundingClientRect().top - 64,
        range: root.offsetHeight - frame.offsetHeight,
      };
    });
  const gotoIndex = async (page, index) => {
    const g = await geometry(page);
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      g.top + (g.range * index) / 3
    );
    await ready(page, index);
  };
  try {
    for (const [width, height, motion] of [
      [1440, 900, "reduce"],
      [1440, 900, "no-preference"],
      [1024, 768, "reduce"],
      [390, 844, "reduce"],
      [390, 667, "no-preference"],
      [320, 568, "reduce"],
      [896, 414, "reduce"],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height },
        reducedMotion: motion,
      });
      await context.route("**/*", (r) =>
        r.request().url().startsWith(origin)
          ? r.continue()
          : r.fulfill({ body: "" })
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
      const desktop = width > 900 && height > 760,
        root = page.locator("#hardware-journey"),
        tabs = root.getByRole("tab");
      await page.waitForFunction(
        () =>
          document.querySelector("#hardware-journey")?.dataset.scrollDriven !==
          undefined
      );
      assert.equal(
        await root.getAttribute("data-scroll-driven"),
        String(desktop)
      );
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await tabs.count(), 4);
      if (desktop) {
        for (const index of [0, 1, 2, 3, 2, 1, 0]) {
          await gotoIndex(page, index);
          assert.equal(await root.getByRole("tabpanel").count(), 1);
          const panel = root.getByRole("tabpanel");
          assert.equal(
            await panel.locator("h3").innerText(),
            content.items[content.order[index]].title
          );
          assert.equal(
            await panel.locator("p").innerText(),
            content.items[content.order[index]].description
          );
          assert.ok(
            await panel.evaluate((panel) => {
              const text = panel
                  .querySelector(".hw-copy p")
                  .getBoundingClientRect(),
                footer = panel
                  .closest(".hw-scene")
                  .querySelector(".hw-footer")
                  .getBoundingClientRect();
              return text.top >= 64 && text.bottom <= footer.top;
            }),
            "desktop copy clipped"
          );
          assert.ok((await root.locator(".hw-header").boundingBox()).y >= 64);
          if ([0, 3].includes(index)) {
            await panel.evaluate((element) =>
              Promise.all(
                element.getAnimations().map((animation) => animation.finished)
              )
            );
            await page.evaluate(
              () =>
                new Promise((resolve) =>
                  requestAnimationFrame(() => requestAnimationFrame(resolve))
                )
            );
            await page.screenshot({
              path: out + `/${width}-${height}-${motion}-stage-${index}.png`,
            });
          }
        }
        const g = await geometry(page);
        await page.mouse.move(width / 2, height / 2);
        await page.mouse.wheel(0, g.range / 3);
        await ready(page, 1);
        await page.mouse.wheel(0, -g.range / 3);
        await ready(page, 0);
        for (const index of [1, 3, 2]) await tabs.nth(index).click();
        await ready(page, 2);
        await page.waitForFunction(
          (target) => Math.abs(scrollY - target) < 2,
          g.top + (g.range * 2) / 3
        );
        await gotoIndex(page, 0);
      } else {
        await root.locator(".hw-tabs").scrollIntoViewIfNeeded();
        const baseline = await page.evaluate(() => ({
          y: scrollY,
          height: document.querySelector("#hardware-journey").offsetHeight,
        }));
        for (const index of [1, 3, 2, 0, 3]) {
          await tabs.nth(index).click();
          await ready(page, index);
          const next = await page.evaluate(() => ({
            y: scrollY,
            height: document.querySelector("#hardware-journey").offsetHeight,
          }));
          assert.ok(
            Math.abs(next.y - baseline.y) < 2,
            "mobile tab jumped the page"
          );
          assert.equal(
            next.height,
            baseline.height,
            "mobile stage caused a layout jump"
          );
          assert.equal(await root.getByRole("tabpanel").count(), 1);
        }
        await root
          .getByRole("tabpanel")
          .evaluate((element) =>
            Promise.all(
              element.getAnimations().map((animation) => animation.finished)
            )
          );
        await root.locator(".hw-scene").screenshot({
          path: out + `/${width}-${height}-${motion}-scene.png`,
        });
        await tabs.nth(0).click();
        await ready(page, 0);
      }
      await tabs.nth(0).focus();
      await page.keyboard.press("End");
      await ready(page, 3);
      await page.keyboard.press("Home");
      await ready(page, 0);
      await page.keyboard.press("ArrowRight");
      await ready(page, 1);
      await page.keyboard.press("ArrowLeft");
      await ready(page, 0);
      assert.equal(
        await root
          .getByRole("link", { name: content.cta.label })
          .getAttribute("href"),
        "/contact"
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1
        )
      );
      if (width <= 1280) {
        const intro = await root.locator(".hw-header > div").boundingBox();
        assert.ok(
          intro.x + intro.width <= width - 70,
          "introduction overlaps contact controls"
        );
      }
      if (width === 1440 && motion === "reduce") {
        await gotoIndex(page, 2);
        await page.setViewportSize({ width: 390, height: 667 });
        await page.waitForFunction(
          () =>
            document.querySelector("#hardware-journey").dataset.scrollDriven ===
            "false"
        );
        await tabs.nth(3).click();
        await ready(page, 3);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForFunction(
          () =>
            document.querySelector("#hardware-journey").dataset.scrollDriven ===
            "true"
        );
        await gotoIndex(page, 1);
      }
      assert.deepEqual(errors, []);
      results.push({
        width,
        height,
        motion,
        mode: desktop ? "scroll" : "tabs",
        passed: true,
      });
      await context.close();
    }
    const fallback = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
    });
    const page = await fallback.newPage();
    await page.goto(origin + "/service/tracking-devices", {
      waitUntil: "domcontentloaded",
    });
    assert.equal(
      await page.locator("#hardware-journey").getByRole("tabpanel").count(),
      4
    );
    for (const id of content.order)
      assert.equal(await page.locator(`#hw-panel-${id} p`).isVisible(), true);
    await fallback.close();
    results.push({ mode: "no JavaScript", passed: true });
    fs.writeFileSync(out + "/results.json", JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
