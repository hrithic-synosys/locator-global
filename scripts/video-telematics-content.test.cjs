/* eslint-disable @typescript-eslint/no-require-imports -- Node regression tests. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { renderToStaticMarkup } = require("react-dom/server");
const { loader } = require("./helpers/cms-test-loader.cjs");
const l = loader();
const { getVideoTelematicsContent, validateVideoTelematics } = l.load(
  "src/content/pages/video-telematics/resolve.ts"
);
const { resolveMarketContent } = l.load(
  "src/content/resolve-market-content.ts"
);
const plain = (value) => JSON.parse(JSON.stringify(value));

test("all four countries retain the complete pre-migration content and never inherit Global or Qatar draft copy", () => {
  const legacy = require("./fixtures/video-telematics-legacy.json");
  legacy.showcase.items.cargoProtection.icon = "cost"; // Original dollar-sign SVG.
  for (const market of ["qa", "sa", "kw", "om"]) {
    const copy = plain(getVideoTelematicsContent(market));
    const { finalCta, ...page } = copy;
    assert.deepEqual(page, legacy);
    assert.equal(finalCta.heading, "Put your whole fleet on ");
    assert.equal(finalCta.trustItems.length, 3);
    assert.ok(!JSON.stringify(copy).includes("Your approved"));
  }
});

test("Global implements all PDF sections, counts, exact copy and market metadata", async () => {
  const copy = getVideoTelematicsContent("global");
  assert.equal(
    copy.hero.heading,
    "AI-Powered Fleet Dash Cameras & MDVR Safety Systems"
  );
  assert.equal(copy.seo.title, "Video Telematics & AI Dashcams | LOCATOR");
  assert.equal(copy.enabled.introFeatures, false);
  assert.equal(copy.driverAlerts.order.length, 8);
  assert.equal(copy.showcase.order.length, 4);
  assert.equal(copy.enabled.journeySteps, false);
  assert.equal(copy.industries.order.length, 5);
  assert.equal(copy.enabled.whyChoose, false);
  assert.equal(copy.faq.order.length, 15);
  assert.equal(copy.finalCta.paragraphs.length, 1);
  assert.equal(copy.finalCta.trustItems.length, 0);
  assert.equal(copy.driverAlerts.items.phoneUse.title, "Texting on\na Phone");
  assert.equal(copy.driverAlerts.items.phoneUse.description, undefined);
  assert.equal(
    copy.driverAlerts.detectionLabel,
    "AI Detection · Driver Behaviour Monitoring"
  );
  assert.equal(copy.enabled.description, true);
  assert.equal(copy.description.paragraphs.length, 2);
  assert.equal(copy.blogs.heading, "Insights from the Road");
  assert.ok(
    copy.faq.items.parkingConsumption.a.startsWith(
      "Yes, power consumption may vary"
    )
  );
  assert.equal(copy.hero.secondaryCta.href, "/get-a-free-demo");
  assert.ok(
    copy.sectionOrder.includes("video") && copy.sectionOrder.includes("blogs")
  );
  const { marketMetadata } = l.load("src/lib/country/metadata.ts");
  for (const market of ["global", "qa", "sa", "kw", "om"]) {
    const data = getVideoTelematicsContent(market);
    const metadata = marketMetadata(
      { title: data.seo.title, description: data.seo.description },
      market,
      "/service/video-telematics"
    );
    assert.equal(
      metadata.alternates.canonical,
      "https://locatorglobal.com" +
        (market === "global" ? "" : "/" + market) +
        "/service/video-telematics"
    );
  }
});

test("market overrides merge fields and keyed cards, replace arrays, and cannot mutate shared content", () => {
  const shared = {
    hero: { heading: "Shared", paragraphs: ["a", "b"] },
    cards: { one: { title: "One", description: "Shared description" } },
  };
  const overrides = {
    global: { hero: { heading: "Global" } },
    qa: {
      hero: { paragraphs: ["Qatar"] },
      cards: { one: { title: "Qatar card" } },
    },
  };
  const qa = resolveMarketContent(shared, overrides, "qa");
  assert.equal(qa.hero.heading, "Shared");
  assert.deepEqual(plain(qa.hero.paragraphs), ["Qatar"]);
  assert.equal(qa.cards.one.description, "Shared description");
  qa.cards.one.description = "mutation";
  assert.equal(shared.cards.one.description, "Shared description");
  const first = getVideoTelematicsContent("global");
  first.hero.paragraphs[0] = "mutation";
  assert.ok(
    !getVideoTelematicsContent("global").hero.paragraphs.includes("mutation")
  );
  assert.throws(() => getVideoTelematicsContent("ae"));
  const invalid = getVideoTelematicsContent("global");
  invalid.driverAlerts.order.push("unknown-card");
  assert.throws(() => validateVideoTelematics(invalid));
});

test("all configured images exist and implementation guidance/placeholders are not published", () => {
  const copy = getVideoTelematicsContent("global");
  const images = [
    copy.hero.image,
    copy.showcase.image,
    ...copy.driverAlerts.order.map((id) => copy.driverAlerts.items[id].image),
    ...copy.industries.order.map((id) => copy.industries.items[id].image),
    ...copy.journeySteps.order.map((id) => copy.journeySteps.items[id].image),
  ];
  for (const image of images) assert.ok(fs.existsSync("public" + image), image);
  const text = JSON.stringify(copy);
  for (const unwanted of [
    "Your approved",
    "Implementation note",
    "As you scroll, reveal each",
    "Use the existing animated showcase",
    "Use a scroll-triggered sequence",
  ])
    assert.ok(!text.includes(unwanted));
});

test("Global blog editorial copy remains visible for empty and unavailable CMS feeds without changing default callers", async () => {
  const copy = getVideoTelematicsContent("global");
  for (const fetchImpl of [
    async () =>
      Response.json({
        success: true,
        items: [],
        pagination: { page: 1, limit: 3, total: 0, pages: 0 },
      }),
    async () => new Response("{}", { status: 503 }),
  ]) {
    const View = loader({ fetchImpl }).load(
      "src/components/software/SoftwareBlog.tsx"
    ).default;
    const html = renderToStaticMarkup(
      await View({ market: "global", content: copy.blogs })
    );
    assert.ok(html.includes("Insights from the Road"));
    assert.ok(html.includes(copy.blogs.paragraphs[0]));
    assert.ok(html.includes('href="/about/newsroom/blog"'));
    assert.ok(html.includes('role="status"'));
    const old = renderToStaticMarkup(await View({ market: "qa" }));
    assert.ok(!old.includes("Insights from the Road"));
  }
});
