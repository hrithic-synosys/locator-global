/* eslint-disable @typescript-eslint/no-require-imports -- Manual local fixture regression. */
// Requires a local test server with mocked Siteverify and loopback-only mail.
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = process.env.FORM_TEST_ORIGIN,
  control = process.env.FORM_TEST_CONTROL;
if (
  !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin || "") ||
  !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(control || "")
)
  throw Error("Local fixture origins required");
const widget = `(()=>{const widgets=new Map(),removed=[];let n=0;const salt=crypto.randomUUID();window.__securityFixture={widgets,removed};window.turnstile={render(el,options){const id=String(++n);const button=document.createElement('button');button.type='button';button.textContent='Complete test security check';button.onclick=()=>options.callback('token-'+options.action+'-'+salt+'-'+id);el.appendChild(button);widgets.set(id,{el,options});return id;},remove(id){const item=widgets.get(id);if(item){removed.push(item.options);item.el.replaceChildren();}widgets.delete(id);}};window[new URL(document.currentScript.src).searchParams.get('onload')]();})();`;
const setMode = (provider = "pass", mail = "pass") =>
  fetch(control + "/mode", {
    method: "POST",
    body: JSON.stringify({ provider, mail }),
  });
const stats = async () => (await fetch(control + "/stats")).json();
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH,
  });
  let checks = 0;
  try {
    async function setup(route, width = 1440, failScript = false) {
      const context = await browser.newContext({
        viewport: { width, height: 950 },
        reducedMotion: "reduce",
      });
      await context.addInitScript(() => {
        window.dataLayer = [];
      });
      let requests = 0;
      await context.route("**/*", (r) => {
        if (
          r
            .request()
            .url()
            .startsWith(origin + "/")
        )
          return r.continue();
        if (
          r
            .request()
            .url()
            .startsWith("https://challenges.cloudflare.com/turnstile/v0/api.js")
        ) {
          requests++;
          if (failScript && requests === 1) return r.abort();
          return r.fulfill({
            contentType: "application/javascript",
            body: widget,
          });
        }
        return r.fulfill({ contentType: "text/plain", body: "" });
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(origin + route, { waitUntil: "networkidle" });
      return { page, context, errors, requests: () => requests };
    }
    const field = (p, a) => p.locator('[data-turnstile-action="' + a + '"]');
    const form = (p, a) => p.locator("form").filter({ has: field(p, a) });
    const complete = async (p, a) =>
      field(p, a)
        .getByRole("button", {
          name: "Complete test security check",
          exact: true,
        })
        .click();
    async function tokensCleared(p, a) {
      await p.waitForFunction(
        (a) =>
          document.querySelector('[data-turnstile-action="' + a + '"] input')
            ?.value === "",
        a
      );
    }
    const events = (p) =>
      p.evaluate(() =>
        window.dataLayer.filter((e) => e.event === "locator_lead_submitted")
      );
    async function fillRequired(target) {
      for (const el of await target.locator("input[required]").all()) {
        const type = await el.getAttribute("type");
        if (type === "checkbox") await el.check();
        else if (type === "file") continue;
        else
          await el.fill(
            type === "email"
              ? "fixture@example.invalid"
              : type === "number"
                ? "3"
                : "Test enquiry"
          );
      }
    }
    for (const [route, action, success] of [
      ["/contact", "contact", "Message received"],
      ["/get-a-quote", "quote", "Request received"],
      ["/get-a-free-demo", "demo", "Your demo is booked"],
    ]) {
      const t = await setup(route);
      const f = form(t.page, action);
      await complete(t.page, action);
      await fillRequired(f);
      if (action === "contact") {
        await f.locator("[name=topic]").selectOption("Sales & pricing");
        await f.locator("[name=message]").fill("Synthetic test only");
      }
      if (action === "demo") await t.page.locator(".db-slot").first().click();
      await setMode("reject");
      const before = (await stats()).accepted;
      await f.locator("button[type=submit]").click();
      await f.getByRole("alert").waitFor();
      await tokensCleared(t.page, action);
      assert.equal((await stats()).accepted, before);
      assert.deepEqual(await events(t.page), []);
      await setMode();
      await complete(t.page, action);
      await f.locator("button[type=submit]").click();
      await t.page
        .getByRole("heading", { name: success, exact: true })
        .waitFor();
      assert.equal((await stats()).accepted, before + 1);
      await t.page.waitForTimeout(200);
      assert.deepEqual(
        (await events(t.page)).map((e) => e.form_type),
        [action]
      );
      await t.page.setViewportSize({ width: 1100, height: 900 });
      await t.page.waitForTimeout(100);
      assert.equal((await events(t.page)).length, 1);
      assert.deepEqual(t.errors, []);
      await t.context.close();
      checks += 4;
    }
    const footer = await setup("/contact");
    await footer.page.locator("footer").scrollIntoViewIfNeeded();
    await complete(footer.page, "quick_contact");
    const ff = form(footer.page, "quick_contact");
    for (const [name, value] of Object.entries({
      name: "Footer fixture",
      email: "fixture@example.invalid",
      phone: "+971500000000",
      message: "Synthetic message",
    }))
      await ff.locator("[name=" + name + "]").fill(value);
    await setMode("reject");
    await ff.locator("button[type=submit]").click();
    await ff
      .getByText("We could not verify your security check.", { exact: false })
      .waitFor();
    assert.equal((await events(footer.page)).length, 0);
    await setMode();
    await complete(footer.page, "quick_contact");
    await ff.locator("button[type=submit]").click();
    await ff.getByText("Message sent", { exact: false }).waitFor();
    await footer.page.waitForTimeout(200);
    assert.deepEqual(
      (await events(footer.page)).map((e) => e.form_type),
      ["contact"]
    );
    await footer.context.close();
    checks += 2;
    for (const width of [390, 1440]) {
      const t = await setup("/qa/about/career/sales-executive", width);
      assert.equal(await field(t.page, "career_application").count(), 0);
      await t.page
        .getByRole("tab", { name: "Application", exact: true })
        .click();
      const f = form(t.page, "career_application");
      const submit = f.locator("button[type=submit]");
      assert.equal(await submit.isDisabled(), true);
      await complete(t.page, "career_application");
      await f.locator("[name=firstName]").fill("Career");
      await f.locator("[name=lastName]").fill("Fixture");
      await f.locator("[name=email]").fill("career@example.invalid");
      await f.locator("[name=phone]").fill("500000000");
      await f.locator("[name=onsite]").fill("Yes");
      await f.locator("[name=salary]").fill("Synthetic salary");
      await f.locator(".jd-yn-row").getByText("Yes", { exact: true }).click();
      await f
        .locator("[name=resume]")
        .setInputFiles({
          name: "resume.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("Synthetic resume"),
        });
      await t.page.evaluate(() => {
        const w = [...window.__securityFixture.widgets.values()].find(
          (w) => w.options.action === "career_application"
        );
        window.__oldCareer = w.options;
        w.options["expired-callback"]();
      });
      await tokensCleared(t.page, "career_application");
      assert.equal(await submit.isDisabled(), true);
      await field(t.page, "career_application")
        .getByRole("button", { name: "Retry security check" })
        .click();
      await complete(t.page, "career_application");
      await t.page.getByRole("tab", { name: "Overview", exact: true }).click();
      assert.equal(await field(t.page, "career_application").count(), 0);
      await t.page
        .getByRole("tab", { name: "Application", exact: true })
        .click();
      await t.page.evaluate(() =>
        window.__oldCareer.callback("removed-widget-token")
      );
      assert.equal(await submit.isDisabled(), true);
      assert.equal(
        await f.locator("[name=resume]").evaluate((el) => el.files[0].name),
        "resume.pdf"
      );
      assert.equal(await f.locator("[name=firstName]").inputValue(), "Career");
      await complete(t.page, "career_application");
      for (const [provider, mail] of [
        ["reject", "pass"],
        ["pass", "fail"],
      ]) {
        await setMode(provider, mail);
        await submit.click();
        await f.getByRole("alert").waitFor();
        await tokensCleared(t.page, "career_application");
        assert.equal(await submit.isDisabled(), true);
        assert.equal(
          await f.locator("[name=firstName]").inputValue(),
          "Career"
        );
        assert.equal(
          await f.locator("[name=resume]").evaluate((el) => el.files[0].name),
          "resume.pdf"
        );
        assert.equal(
          await f.locator("[name=screening][value=yes]").isChecked(),
          true
        );
        await complete(t.page, "career_application");
      }
      await setMode();
      const before = (await stats()).accepted;
      await f.evaluate((el) => {
        el.requestSubmit();
        el.requestSubmit();
      });
      await t.page
        .getByRole("heading", { name: "Application received", exact: true })
        .waitFor();
      assert.equal((await stats()).accepted, before + 1);
      assert.equal(
        (await events(t.page)).length,
        0,
        "No new career conversion event invented"
      );
      assert.deepEqual(t.errors, []);
      await t.page.locator('.jd-success').scrollIntoViewIfNeeded();
      if (process.env.PERFORMANCE_ARTIFACT_DIR)
        await t.page.screenshot({
          path: path.join(
            process.env.PERFORMANCE_ARTIFACT_DIR,
            "career-success-" + width + ".png"
          ),
        });
      await t.context.close();
      checks += 8;
    }
    const retry = await setup("/about/career/sales-executive", 390, true);
    await retry.page
      .getByRole("tab", { name: "Application", exact: true })
      .click();
    await field(retry.page, "career_application")
      .getByRole("button", { name: "Retry security check" })
      .click();
    await complete(retry.page, "career_application");
    assert.equal(
      await form(retry.page, "career_application")
        .locator("button[type=submit]")
        .isDisabled(),
      false
    );
    assert.equal(retry.requests(), 2);
    await retry.context.close();
    checks++;
    console.log(
      JSON.stringify({
        checks,
        externalAnalytics: "blocked",
        email: "loopback fixture only",
        cloudflare: "mocked",
        conversionEvents:
          "existing contact/quote/demo and footer exactly once, rejection zero",
      })
    );
  } finally {
    await browser.close();
    await setMode();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
