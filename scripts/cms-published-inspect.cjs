/* eslint-disable @typescript-eslint/no-require-imports -- Read-only local diagnostic. */
// Uses the same reader as Next; never exports, activates or repairs CMS data.
const { loader } = require("./helpers/cms-test-loader.cjs");
const root = process.argv[2] || process.env.LOCATOR_PUBLISHED_ROOT;
if (!root) {
  console.error(
    "Set LOCATOR_PUBLISHED_ROOT or pass an absolute publication root."
  );
  process.exitCode = 1;
} else {
  const { pinRelease } = loader({
    env: {
      NEXT_PUBLIC_SITE_URL:
        process.env.NEXT_PUBLIC_SITE_URL || "https://locatorglobal.com",
    },
  }).load("src/lib/cms-blog/publication/store.ts");
  (async () => {
    const results = [];
    for (const market of ["global", "sa", "qa", "kw", "om"]) {
      try {
        const release = await pinRelease(root, market);
        results.push({
          market,
          state: "ready",
          revision: release.pointer.revision,
          articles: release.catalogue.items.length,
          urls: release.catalogue.items.map((e) => e.publicUrl),
        });
      } catch {
        results.push({ market, state: "unavailable", status: 503 });
        process.exitCode = 1;
      }
    }
    console.log(JSON.stringify(results, null, 2));
  })().catch(() => {
    console.error("Cannot inspect publication store");
    process.exitCode = 1;
  });
}
