// Isolated, invented content. Never imported by production code.
const image = {
  src: "/blog/fleet-tracking.webp",
  alt: "Fixture fleet image",
  width: 1800,
  height: 1214,
  caption: "Fixture image caption",
};
const category = {
  id: "fixture-blog",
  name: "Blog",
  slug: "blog",
  description: null,
  sortOrder: 0,
  allowedFormats: ["article"],
};
const publishedAt = "2025-01-10T10:00:00.000Z";
function card(slug = "fixture-article", banner = image) {
  return {
    id: "id-" + slug,
    market: "global",
    slug,
    title: "Fixture article " + slug,
    excerpt: "An isolated market blog fixture.",
    format: "article",
    category,
    publishedAt,
    readingMinutes: 4,
    banner,
  };
}
const content = [
  {
    type: "heading",
    level: 2,
    html: "Introduction",
    anchor: "same",
    tocLabel: "Start here",
  },
  {
    type: "p",
    html: 'Text with <b>bold</b>, <strong>strong</strong>, <i>italic</i>, <em>emphasis</em>, line<br>break, x<sup>2</sup> and H<sub>2</sub>O. <a href="https://example.com/path?x=1&amp;y=2">External</a> <a href="/contact">Contact</a>.',
  },
  { type: "heading", level: 3, html: "Nested detail", anchor: "same" },
  {
    type: "quote",
    html: "A <b>quoted</b> observation.",
    cite: "Fixture author",
  },
  { type: "ul", style: "check", items: ["Checked one", "Checked two"] },
  { type: "ul", style: "bullet", items: ["Bullet one", "Bullet two"] },
  { type: "ol", items: ["First action", "Second action"] },
  { type: "image", image },
  {
    type: "table",
    caption: "Fixture table caption",
    head: ["Metric", "Value"],
    rows: [["Efficiency", "<b>Improved</b>"]],
  },
  {
    type: "split",
    mediaSide: "left",
    tone: "tint",
    kicker: "Image split",
    media: { kind: "image", image },
    blocks: [
      { type: "heading", level: 2, html: "Split heading", anchor: "same" },
      { type: "p", html: "Image split copy." },
    ],
  },
  {
    type: "split",
    mediaSide: "right",
    tone: "plain",
    kicker: "Table split",
    media: {
      kind: "table",
      table: {
        caption: "Split table caption",
        head: ["Feature", "Benefit"],
        rows: [["Tracking", "Visibility"]],
      },
    },
    blocks: [
      { type: "heading", level: 2, html: "Hidden from ToC", hideFromToc: true },
      { type: "p", html: "Table split copy." },
    ],
  },
  {
    type: "overlay",
    align: "right",
    kicker: "Overlay kicker",
    image,
    blocks: [
      { type: "heading", level: 2, html: "Overlay heading" },
      { type: "p", html: "Overlay copy." },
    ],
    cta: { label: "Request a quote", href: "/get-a-quote" },
  },
  {
    type: "overlay",
    align: "left",
    image,
    blocks: [{ type: "p", html: "Left overlay without a CTA." }],
  },
];
function detail(slug = "fixture-article", banner = image) {
  return {
    ...card(slug, banner),
    updatedAt: "2025-02-01T10:00:00.000Z",
    contentVersion: 2,
    author: { name: "Fixture writer", role: "Editor", avatar: image },
    summary: { heading: "Summary", text: "A fixture summary.", icon: "truck" },
    seo: {
      title: "Fixture SEO title",
      description: "Fixture SEO description",
      keywords: ["fixture"],
    },
    content: structuredClone(content),
  };
}
function list(items, page = 1, limit = 12, total = items.length) {
  return {
    success: true,
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
module.exports = { image, category, card, detail, list, content };
