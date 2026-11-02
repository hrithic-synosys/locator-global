/* eslint-disable @typescript-eslint/no-require-imports -- Local content regressions. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { loader } = require("./helpers/cms-test-loader.cjs");
const l = loader();
const { getTaskManagerContent: get, validateTaskManager: validate } = l.load(
  "src/content/pages/task-manager/resolve.ts"
);
const plain = (value) => JSON.parse(JSON.stringify(value));

test("Task Manager keeps all country defaults isolated from new Global sections and copy", () => {
  for (const market of ["qa", "sa", "kw", "om"]) {
    const c = get(market);
    assert.deepEqual(plain(c.sectionOrder), [
      "hero",
      "introduction",
      "modules",
    ]);
    assert.equal(c.hero.heading, "Task Manager");
    assert.equal(c.hero.accent, "Task");
    assert.equal(c.hero.eyebrowStyle, "large");
    assert.equal(c.hero.primaryCta.label, "Get a Free Quote");
    assert.equal(c.hero.secondaryCta.label, "Get a Free Demo");
    assert.equal(c.introduction.listStyle, "chips");
    assert.deepEqual(plain(c.introduction.items), [
      "FMCG delivery vans",
      "Logistics trucks",
      "Facility service cars",
      "Healthcare fleets",
      "Sales executive vehicles",
    ]);
    assert.match(
      c.introduction.paragraphs[0],
      /Integration with CRM\/ERP ensures real-time sync/
    );
    assert.equal(c.enabled.faq, false);
    assert.equal(c.enabled.finalCta, false);
    assert.equal(c.seo.title, "Task Manager — Service");
    assert.equal(c.seo.absoluteTitle, false);
  }
});

test("Global implements complete PDF structure, distinct CTA labels and qualified integration/coverage copy", () => {
  const c = get("global");
  assert.equal(c.hero.heading, "Smart Task Management for Field Teams");
  assert.equal(c.hero.eyebrowStyle, "compact");
  assert.equal(
    c.whyChoose.items.central.desc,
    "Manage jobs and task statuses from one dashboard."
  );
  assert.equal(c.faq.items.gcc.cat, "coverage");
  assert.equal(c.introduction.items.length, 6);
  for (const [section, count] of [
    ["benefits", 4],
    ["tools", 2],
    ["industries", 5],
    ["whyChoose", 5],
    ["faq", 8],
  ])
    assert.equal(c[section].order.length, count);
  assert.equal(c.hero.secondaryCta.label, "Book a Demo");
  assert.equal(c.finalCta.secondaryCta.label, "Book a Live Demo");
  assert.equal(c.tools.cta.href, "#task-manager");
  assert.equal(c.hero.primaryCta.href, "/get-a-quote");
  assert.equal(c.finalCta.secondaryCta.href, "/get-a-free-demo");
  assert.deepEqual(plain(c.finalCta.trustItems), []);
  assert.match(
    c.faq.items.integration.a,
    /Confirm compatibility with your existing system/
  );
  assert.match(c.faq.items.gcc.a, /Confirm country-specific availability/);
  for (const asset of [c.hero.image, c.tools.image, c.industries.image])
    assert.ok(fs.existsSync("public" + asset), asset);
  const { marketMetadata } = l.load("src/lib/country/metadata.ts");
  const metadata = marketMetadata(
    { title: { absolute: c.seo.title }, description: c.seo.description },
    "global",
    "/service/task-manager"
  );
  assert.equal(
    metadata.title.absolute,
    "Field Task Management Software | LOCATOR"
  );
  assert.equal(
    metadata.alternates.canonical,
    "https://locatorglobal.com/service/task-manager"
  );
  assert.ok(!JSON.stringify(c).includes("Keyword strategy:"));
});

test("Task Manager rejects broken card orders and invalid markets without mutating another result", () => {
  const c = get("global");
  c.industries.order.push("missing");
  assert.throws(() => validate(c), /industries order/);
  const duplicate = get("global");
  duplicate.sectionOrder.push("hero");
  assert.throws(() => validate(duplicate), /section order/);
  assert.throws(() => get("ae"), /Unsupported/);
  const accent = get("global");
  accent.hero.accent = "Missing";
  assert.throws(() => validate(accent), /accent/);
  const category = get("global");
  category.faq.items.gcc.cat = "missing";
  assert.throws(() => validate(category), /FAQ category/);
  const icon = get("global");
  icon.whyChoose.items.central.assetIndex = 99;
  assert.throws(() => validate(icon), /reason icon/);
  assert.equal(get("global").industries.order.length, 5);
  assert.equal(get("om").hero.heading, "Task Manager");
});
