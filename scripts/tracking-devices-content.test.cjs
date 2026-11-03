/* eslint-disable @typescript-eslint/no-require-imports -- Local content regression. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { loader } = require("./helpers/cms-test-loader.cjs");
const l = loader();
const { getTrackingDevicesContent: get, validateTrackingDevices: validate } =
  l.load("src/content/pages/tracking-devices/resolve.ts");
const { DEVICES } = l.load(
  "src/components/service/tracking-devices/devices-data.ts"
);
const plain = (value) => JSON.parse(JSON.stringify(value));
test("all country catalogues, original product links and detail data remain unchanged", () => {
  const original = plain(DEVICES);
  for (const market of ["qa", "sa", "kw", "om"]) {
    const c = get(market);
    assert.deepEqual(c.sectionOrder, ["hero", "catalog", "finalCta"]);
    assert.equal(c.hero.heading, "The hardware behind\nevery Locator install.");
    assert.equal(c.hero.eyebrowStyle, "large");
    assert.equal(c.catalog.fullDescriptions, false);
    assert.deepEqual(
      plain(c.catalog.order.map((id) => c.catalog.items[id])),
      original
    );
    assert.equal(c.seo.absoluteTitle, false);
    assert.equal(c.seo.title, "Tracking Devices & Accessories — Service");
    assert.equal(c.enabled.journey, false);
    assert.equal(c.enabled.faq, false);
  }
  get("global");
  assert.deepEqual(plain(DEVICES), original);
});
test("Global preserves all nine catalogue targets, fuel availability and exact approved metadata", () => {
  const c = get("global");
  assert.deepEqual(c.catalog.order, plain(DEVICES.map((d) => d.slug)));
  assert.equal(c.catalog.order.length, 9);
  assert.equal(c.catalog.fullDescriptions, true);
  assert.equal(c.hero.eyebrowStyle, "compact");
  assert.equal(c.hero.heading, "GPS Tracking Devices & IoT Accessories");
  assert.equal(c.catalog.items.fmb120.linkLabel, "View FMB120 details");
  assert.equal(c.catalog.items["fuel-sensor"].comingSoon, true);
  assert.equal(c.catalog.items["fuel-sensor"].body, "Coming shortly.");
  assert.match(c.catalog.items["fuel-sensor"].tagline, /Monitor fuel levels/);
  assert.equal(c.journey.order.length, 4);
  assert.equal(c.whyChoose.order.length, 5);
  assert.equal(c.faq.order.length, 8);
  assert.equal(c.seo.title, "GPS Tracking Devices & Accessories UAE | LOCATOR");
  assert.equal(c.seo.absoluteTitle, true);
  assert.match(c.faq.items.gcc.a, /should be confirmed/);
  assert.match(c.faq.items.sensors.a, /current availability before ordering/);
  assert.deepEqual(c.finalCta.trustItems, []);
  for (const image of [
    c.hero.image,
    ...c.catalog.order.map((id) => c.catalog.items[id].image),
    ...c.journey.order.map((id) => c.journey.items[id].image),
  ])
    assert.ok(fs.existsSync("public" + image), image);
  const json = JSON.stringify(c);
  for (const note of [
    "Confirm before publishing",
    "Animation guidance:",
    "Search intent",
    "Keep the current nine",
  ])
    assert.ok(!json.includes(note));
});
test("invalid products, changed slugs and malformed content fail clearly; results are isolated", () => {
  const bad = get("global");
  bad.catalog.items.fmb120.slug = "different";
  assert.throws(() => validate(bad), /detail link/);
  const order = get("global");
  order.journey.order.push("missing");
  assert.throws(() => validate(order), /journey order/);
  const faq = get("global");
  faq.faq.items.gcc.cat = "missing";
  assert.throws(() => validate(faq), /FAQ category/);
  const duplicate = get("global");
  duplicate.sectionOrder.push("hero");
  assert.throws(() => validate(duplicate), /section order/);
  const clean = get("global");
  clean.catalog.items.fmb120.tagline = "mutation";
  assert.notEqual(get("global").catalog.items.fmb120.tagline, "mutation");
  assert.throws(() => get("ae"), /Unsupported/);
});
