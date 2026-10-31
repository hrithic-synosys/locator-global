/* eslint-disable @typescript-eslint/no-require-imports -- Local regression tests. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { loader } = require("./helpers/cms-test-loader.cjs");
const l = loader();
const { getFleetTelematicsContent: get, validateFleetTelematics: validate } =
  l.load("src/content/pages/fleet-telematics/resolve.ts");

test("Fleet country content remains identical to the captured baseline", () => {
  const legacy = require("./fixtures/fleet-telematics-legacy.json");
  for (const market of ["qa", "sa", "kw", "om"]) {
    const { finalCta, ...content } = JSON.parse(JSON.stringify(get(market)));
    assert.deepEqual(content, legacy);
    assert.equal(finalCta.trustItems.length, 3);
  }
});
test("Global Fleet implements approved sections without unverified statistics", () => {
  const c = get("global");
  assert.equal(c.hero.label, "Fleet Telematics");
  assert.equal(c.hero.secondaryCta.href, "#fleet-telematics");
  assert.equal(c.hero.secondaryIsLink, true);
  for (const [key, count] of [
    ["benefits", 10],
    ["showcase", 6],
    ["industries", 12],
    ["process", 4],
    ["videoTelematics", 4],
    ["whyChoose", 4],
    ["faq", 6],
  ])
    assert.equal(c[key].order.length, count, key);
  assert.equal(c.benefits.items.routePlanning.label, "AI Route Optimisation");
  assert.equal(c.enabled.statistics, false);
  assert.deepEqual(c.statistics.items, []);
  assert.deepEqual(c.videoTelematics.stats, []);
  assert.deepEqual(c.process.closingParagraphs, []);
  assert.equal(c.industries.showVehicleTypes, false);
  assert.match(c.faq.items.coverage.a, /Contact the team to confirm/);
  assert.ok(
    c.sectionOrder.indexOf("videoTelematics") <
      c.sectionOrder.indexOf("whyChoose")
  );
  assert.equal(c.finalCta.paragraphs.length, 2);
  assert.deepEqual(c.finalCta.trustItems, []);
  assert.ok(c.industries.items.school.keywords.length > 0);
  assert.equal(c.seo.title, get("qa").seo.title);
  for (const section of ["industries", "videoTelematics"]) {
    for (const id of c[section].order) {
      const image = c[section].items[id].image;
      if (image) assert.ok(fs.existsSync("public" + image), image);
    }
  }
});
test("Fleet media bindings survive reordering; invalid content fails clearly; results are isolated", () => {
  const c = get("global");
  c.benefits.order.reverse();
  assert.equal(validate(c).benefits.items[c.benefits.order[0]].assetIndex, 9);
  c.benefits.items.routePlanning.assetIndex = 100;
  assert.throws(() => validate(c), /asset binding/);
  const invalid = get("global");
  invalid.whyChoose.order.push("missing");
  assert.throws(() => validate(invalid), /content order/);
  const faq = get("global");
  faq.faq.items.installation.cat = "unknown";
  assert.throws(() => validate(faq), /FAQ category/);
  assert.throws(() => get("ae"), /Unsupported/);
  assert.equal(get("global").benefits.items.routePlanning.assetIndex, 9);
});
