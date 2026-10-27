/* eslint-disable @typescript-eslint/no-require-imports -- Isolated Node fixture tools. */
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bytes = (value) => JSON.stringify(value, null, 2) + "\n";
function current(root, market) {
  return JSON.parse(fs.readFileSync(path.join(root, market, "current.json")));
}
function activate(root, market, releaseId) {
  const manifest = fs.readFileSync(
    path.join(root, market, "releases", releaseId, "manifest.json")
  );
  const revision = JSON.parse(manifest).revision;
  const pointer = {
    schemaVersion: 1,
    market,
    releaseId,
    revision,
    manifestSha256: hash(manifest),
    activatedAt: "2026-01-03T00:00:00.000Z",
  };
  const name = path.join(root, market, "current.json");
  fs.writeFileSync(name + ".test-tmp", bytes(pointer));
  fs.renameSync(name + ".test-tmp", name);
  return pointer;
}
// Operates ONLY on a caller-owned test copy of the actual CMS release tree.
function rewriteMedia(root, origin) {
  for (const market of ["ae", "global", "sa", "qa", "kw", "om"]) {
    const pointer = current(root, market);
    for (const releaseId of fs.readdirSync(
      path.join(root, market, "releases")
    )) {
      const dir = path.join(root, market, "releases", releaseId);
      const filename = path.join(dir, "manifest.json");
      const manifest = JSON.parse(fs.readFileSync(filename));
      for (const name of Object.keys(manifest.files)) {
        const target = path.join(dir, name);
        const rewritten = fs
          .readFileSync(target, "utf8")
          .replaceAll("http://localhost:5100", origin);
        fs.writeFileSync(target, rewritten);
        manifest.files[name] = hash(rewritten);
      }
      manifest.media = JSON.parse(
        JSON.stringify(manifest.media).replaceAll(
          "http://localhost:5100",
          origin
        )
      );
      fs.writeFileSync(filename, bytes(manifest));
    }
    activate(root, market, pointer.releaseId);
  }
}
function publishNewGlobal(root) {
  const old = current(root, "global");
  const source = path.join(root, "global", "releases", old.releaseId);
  const releaseId = "r000000000003-test-global-new-article";
  const dir = path.join(root, "global", "releases", releaseId);
  fs.cpSync(source, dir, { recursive: true });
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json")));
  const catalogue = JSON.parse(
    fs.readFileSync(path.join(dir, "catalogue.json"))
  );
  const oldEntry = catalogue.items[0];
  const entry = structuredClone(oldEntry);
  entry.id = "eeeeeeeeeeeeeeeeeeeeeeee";
  entry.slug = "new-after-start";
  entry.editorialRevision = hash("test new article");
  entry.publicUrl =
    "https://locatorglobal.com/about/newsroom/blog/new-after-start";
  entry.modifiedAt = "2026-01-03T00:00:00.000Z";
  entry.card.id = entry.id;
  entry.card.slug = entry.slug;
  entry.card.title = "New article activated without rebuilding";
  entry.relatedIds = [oldEntry.id];
  catalogue.items.push(entry);
  const article = JSON.parse(
    fs.readFileSync(path.join(dir, `articles/${oldEntry.id}.json`))
  );
  const newer = {
    ...article,
    editorialRevision: entry.editorialRevision,
    publicUrl: entry.publicUrl,
    modifiedAt: entry.modifiedAt,
    relatedIds: entry.relatedIds,
    article: { ...article.article, ...entry.card, updatedAt: entry.modifiedAt },
  };
  article.article.title = "Existing article edited after startup";
  article.article.seo.title = "Updated SEO after startup";
  article.article.content.push({
    type: "p",
    html: "Updated article body after startup.",
  });
  article.modifiedAt = entry.modifiedAt;
  article.article.updatedAt = entry.modifiedAt;
  article.editorialRevision = hash("test edited article");
  oldEntry.card.title = article.article.title;
  oldEntry.modifiedAt = entry.modifiedAt;
  oldEntry.editorialRevision = article.editorialRevision;
  const documents = {
    "catalogue.json": catalogue,
    "redirects.json": JSON.parse(
      fs.readFileSync(path.join(dir, "redirects.json"))
    ),
    "removals.json": JSON.parse(
      fs.readFileSync(path.join(dir, "removals.json"))
    ),
    [`articles/${oldEntry.id}.json`]: article,
    [`articles/${entry.id}.json`]: newer,
  };
  manifest.releaseId = releaseId;
  manifest.revision = 3;
  manifest.articleCount = 2;
  manifest.sourceHash = hash("test modified source");
  manifest.files = {};
  for (const [filename, document] of Object.entries(documents)) {
    document.releaseId = releaseId;
    document.revision = 3;
    const content = bytes(document);
    fs.writeFileSync(path.join(dir, filename), content);
    manifest.files[filename] = hash(content);
  }
  fs.writeFileSync(path.join(dir, "manifest.json"), bytes(manifest));
  activate(root, "global", releaseId);
}
function publishFirstOman(root) {
  const source = path.join(
    root,
    "kw",
    "releases",
    current(root, "kw").releaseId
  );
  const releaseId = "r000000000003-test-om-first-article";
  const dir = path.join(root, "om", "releases", releaseId);
  fs.mkdirSync(path.join(dir, "articles"), { recursive: true });
  const manifest = JSON.parse(
    fs.readFileSync(path.join(source, "manifest.json"))
  );
  const catalogue = JSON.parse(
    fs.readFileSync(path.join(source, "catalogue.json"))
  );
  const entry = catalogue.items[0];
  const article = JSON.parse(
    fs.readFileSync(path.join(source, `articles/${entry.id}.json`))
  );
  entry.id = "dddddddddddddddddddddddd";
  entry.slug = "first-oman-article";
  entry.card.id = entry.id;
  entry.card.slug = entry.slug;
  entry.card.market = "om";
  entry.card.title = "First Oman article after empty release";
  entry.publicUrl =
    "https://locatorglobal.com/om/about/newsroom/blog/first-oman-article";
  entry.relatedIds = [];
  entry.editorialRevision = hash("first Oman source");
  article.article = { ...article.article, ...entry.card };
  article.publicUrl = entry.publicUrl;
  article.relatedIds = [];
  article.editorialRevision = entry.editorialRevision;
  const documents = {
    "catalogue.json": catalogue,
    "redirects.json": { entries: [] },
    "removals.json": { entries: [] },
    [`articles/${entry.id}.json`]: article,
  };
  manifest.files = {};
  manifest.articleCount = 1;
  manifest.sourceHash = entry.editorialRevision;
  for (const [name, document] of Object.entries(documents)) {
    Object.assign(document, {
      schemaVersion: 1,
      market: "om",
      revision: 3,
      releaseId,
    });
    const content = bytes(document);
    fs.writeFileSync(path.join(dir, name), content);
    manifest.files[name] = hash(content);
  }
  Object.assign(manifest, { market: "om", revision: 3, releaseId });
  fs.writeFileSync(path.join(dir, "manifest.json"), bytes(manifest));
  activate(root, "om", releaseId);
}
module.exports = {
  current,
  activate,
  rewriteMedia,
  publishNewGlobal,
  publishFirstOman,
};
