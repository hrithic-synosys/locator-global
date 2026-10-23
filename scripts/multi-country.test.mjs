import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const nodeRequire = createRequire(import.meta.url);
const cache = new Map();
const testProcess = { env: { SITE_ENV: 'development', NEXT_PUBLIC_SITE_URL: 'https://locator.ae' } };
function load(filename) {
  const file = path.resolve(filename);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports, URL, process: testProcess, require: id => {
    if (id.startsWith('.') || id.startsWith('@/')) {
      const target = id.startsWith('@/') ? path.resolve('src', id.slice(2)) : path.resolve(path.dirname(file), id);
      return load(`${target}.ts`);
    }
    return nodeRequire(id);
  } }, { filename: file });
  return exports;
}

const { countries, countryCodes, isCountryCode, resolveCountry } = load('src/config/countries.ts');
const { countryPath, stripCountry, switchCountryPath } = load('src/lib/country/paths.ts');

test('only the five intended markets exist; flags are real local assets', () => {
  assert.deepEqual([...countryCodes], ['global', 'sa', 'qa', 'kw', 'om']);
  for (const code of countryCodes) assert.ok(fs.existsSync(`public${countries[code].flag}`));
  for (const code of ['ae', 'uae', 'bh', 'bahrain', 'toString', '__proto__']) assert.equal(isCountryCode(code), false);
  assert.equal(resolveCountry('/qa/contact?campaign=1').code, 'qa');
  assert.equal(resolveCountry('/qatar').code, 'global');
});

test('country paths preserve query/hash, avoid duplicate prefixes and leave non-page URLs alone', () => {
  for (const code of countryCodes) {
    const prefix = countries[code].prefix;
    assert.equal(countryPath('/', code), prefix || '/');
    assert.equal(countryPath('/contact?campaign=one#form', code), `${prefix}/contact?campaign=one#form`);
    assert.equal(countryPath('/?campaign=one#form', code), prefix ? `${prefix}?campaign=one#form` : '/?campaign=one#form');
    assert.equal(countryPath(countryPath('/contact', code), code), `${prefix}/contact`);
    for (const href of ['#form', '?sort=date', '//example.com/contact', 'https://example.com/contact', 'tel:+971123', 'mailto:info@locator.ae', '/api/contact', '/_next/image?url=x', '/flags/qatar.svg', '/file.pdf', '/sitemap.xml']) {
      assert.equal(countryPath(href, code), href);
    }
  }
  assert.equal(countryPath('/qa/contact', 'kw'), '/qa/contact');
  assert.equal(switchCountryPath('/qa/contact?campaign=1#form', 'kw'), '/kw/contact?campaign=1#form');
  assert.equal(switchCountryPath('/qa?campaign=1#form', 'global'), '/?campaign=1#form');
  assert.equal(stripCountry('/global/contact'), '/contact');
  assert.equal(stripCountry('/software'), '/software');
});

test('section overrides fall back field by field without mutating defaults', () => {
  const { mergeContent, getPageContent } = load('src/content/resolve.ts');
  const defaults = { hero: { heading: 'Original', image: '/original.webp' }, cards: [1, 2] };
  const result = mergeContent(defaults, { hero: { heading: 'Qatar' }, cards: [3] });
  assert.equal(result.hero.heading, 'Qatar');
  assert.equal(result.hero.image, '/original.webp');
  assert.deepEqual(result.cards, [3]);
  assert.equal(defaults.hero.heading, 'Original');
  assert.equal(getPageContent('home', 'qa'), undefined);
  const { globalContent } = load('src/content/global.ts');
  const { qaContent } = load('src/content/countries/qa.ts');
  globalContent.home = { hero: defaults.hero };
  qaContent.home = { hero: { heading: 'Only Qatar' } };
  assert.equal(getPageContent('home', 'qa').hero.heading, 'Only Qatar');
  for (const country of ['global', 'sa', 'kw', 'om']) assert.equal(getPageContent('home', country).hero.heading, 'Original');
  delete globalContent.home;
  delete qaContent.home;
});

test('exclusive routes require explicit ownership and never fall back across markets', () => {
  const { exclusivePages, getExclusivePage } = load('src/content/exclusive-pages.ts');
  assert.equal(getExclusivePage('/qatar-compliance', 'qa'), undefined);
  exclusivePages['/qatar-compliance'] = { markets: ['qa'], metadata: {}, load: async () => ({ default: () => null }) };
  assert.ok(getExclusivePage('/qatar-compliance', 'qa'));
  for (const code of ['global', 'sa', 'kw', 'om']) assert.equal(getExclusivePage('/qatar-compliance', code), undefined);
  assert.equal(getExclusivePage('toString', 'qa'), undefined);
  delete exclusivePages['/qatar-compliance'];
});

test('metadata preserves copy, scopes canonical/OG, defaults to noindex and emits no hreflang', () => {
  const { marketMetadata } = load('src/lib/country/metadata.ts');
  const { indexing, canIndex } = load('src/config/indexing.ts');
  const original = { title: 'Existing title', description: 'Existing copy', openGraph: { type: 'article', images: ['/original.webp'] } };
  for (const code of countryCodes) {
    const metadata = marketMetadata(original, code, '/contact');
    assert.equal(metadata.title, original.title);
    assert.equal(metadata.description, original.description);
    assert.equal(metadata.alternates.canonical, `https://locatorglobal.com${countries[code].prefix}/contact`);
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    assert.equal(metadata.openGraph.type, 'article');
    assert.equal(metadata.robots.index, false);
    assert.equal(metadata.alternates.languages, undefined);
  }
  indexing.qa.pages = ['/contact'];
  assert.equal(canIndex('qa', '/contact'), false, 'preview cannot become indexable');
  testProcess.env.SITE_ENV = 'production';
  assert.equal(canIndex('qa', '/contact'), true);
  assert.equal(canIndex('qa', '/'), false);
  assert.equal(canIndex('kw', '/contact'), false);
  indexing.qa.pages = [];
  testProcess.env.SITE_ENV = 'development';
});

test('proxy rewrites only global page URLs and preserves queries; API/assets stay at root', () => {
  const { proxy } = load('src/proxy.ts');
  const { NextRequest } = nodeRequire('next/server');
  const response = proxy(new NextRequest('https://locatorglobal.com/contact?campaign=one'));
  assert.equal(response.headers.get('x-middleware-rewrite'), 'https://locatorglobal.com/global/contact?campaign=one');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, follow');
  for (const route of ['/qa/contact', '/api/contact', '/_next/image', '/flags/qatar.svg', '/sitemap.xml']) {
    assert.equal(proxy(new NextRequest(`https://locatorglobal.com${route}`)).headers.get('x-middleware-rewrite'), null);
  }
  assert.equal(proxy(new NextRequest('https://locatorglobal.com/global/contact')).headers.get('x-middleware-rewrite'), 'https://locatorglobal.com/global/__unavailable__');
});

test('sitemap and robots advertise only explicitly ready real market pages', () => {
  const sitemap = load('src/app/sitemap.ts').default;
  const robots = load('src/app/robots.ts').default;
  const { indexing } = load('src/config/indexing.ts');
  assert.equal(sitemap().length, 0);
  assert.equal(robots().sitemap, undefined);
  indexing.qa.pages = ['/contact'];
  testProcess.env.SITE_ENV = 'production';
  const entries = sitemap();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].url, 'https://locatorglobal.com/qa/contact');
  assert.equal(robots().sitemap, 'https://locatorglobal.com/sitemap.xml');
  indexing.qa.ready = true;
  for (const entry of sitemap()) {
    assert.ok(entry.url.startsWith('https://locatorglobal.com/qa'));
    assert.ok(!/\/(?:ae|bh|global)(?:\/|$)/.test(new URL(entry.url).pathname));
  }
  indexing.qa.ready = false;
  indexing.qa.pages = [];
  testProcess.env.SITE_ENV = 'development';
});

test('global regulatory navigation is one link; all countries temporarily share four entries', () => {
  const { getRegulatoryNavigation, isRegulatoryNavigationActive } = load('src/config/regulatory.ts');
  assert.equal(getRegulatoryNavigation('global').kind, 'link');
  assert.equal(getRegulatoryNavigation('global').label, 'Regulatory');
  assert.equal(getRegulatoryNavigation('global').items.length, 0);
  for (const code of ['qa', 'kw', 'om', 'sa']) {
    const menu = getRegulatoryNavigation(code);
    assert.equal(menu.kind, 'dropdown');
    assert.deepEqual([...menu.items.map(item => countryPath(item.href, code))], [`/${code}/shahin`, `/${code}/asateel-certified-obu`, `/${code}/securepath`, `/${code}/securepath-premium`]);
    assert.equal(isRegulatoryNavigationActive(code, '/shahin'), true);
    assert.equal(isRegulatoryNavigationActive(code, '/regulatory'), true);
    assert.equal(isRegulatoryNavigationActive(code, '/software'), false);
  }
});

test('removing a Qatar entry blocks its route and leaves every other market unchanged', () => {
  const { regulatoryNavigation, isRegulatoryPageAvailable } = load('src/config/regulatory.ts');
  const { requireRegulatoryPage } = load('src/lib/country/regulatory.ts');
  const { proxy } = load('src/proxy.ts');
  const { NextRequest } = nodeRequire('next/server');
  const original = regulatoryNavigation.qa;
  try {
    regulatoryNavigation.qa = { ...original, items: original.items.filter(item => item.id !== 'shahin') };
    assert.equal(isRegulatoryPageAvailable('qa', '/shahin'), false);
    assert.throws(() => requireRegulatoryPage('qa', '/shahin'), error => error.digest?.includes('404'));
    assert.equal(proxy(new NextRequest('https://locatorglobal.com/qa/shahin')).headers.get('x-middleware-rewrite'), 'https://locatorglobal.com/qa/__unavailable__');
    for (const code of ['kw', 'om', 'sa']) assert.equal(isRegulatoryPageAvailable(code, '/shahin'), true);
    assert.equal(isRegulatoryPageAvailable('global', '/shahin'), false);
  } finally { regulatoryNavigation.qa = original; }
});

test('regulatory placeholders stay out of indexing and sitemap even when a whole market is enabled', () => {
  const { indexing, canIndex } = load('src/config/indexing.ts');
  const { regulatoryNavigation } = load('src/config/regulatory.ts');
  const { marketMetadata } = load('src/lib/country/metadata.ts');
  const sitemap = load('src/app/sitemap.ts').default;
  const original = regulatoryNavigation.qa;
  indexing.qa.ready = true;
  indexing.global.ready = true;
  testProcess.env.SITE_ENV = 'production';
  try {
    assert.equal(canIndex('global', '/regulatory'), true);
    assert.equal(canIndex('global', '/shahin'), false);
    for (const path of ['/regulatory', '/shahin', '/asateel-certified-obu', '/securepath', '/securepath-premium']) {
      assert.equal(canIndex('qa', path), false);
      assert.equal(marketMetadata({ title: 'Existing title' }, 'qa', path).robots.index, false);
      assert.ok(!sitemap().some(entry => entry.url === `https://locatorglobal.com/qa${path}`));
    }
    regulatoryNavigation.qa = { ...original, items: original.items.map(item => item.id === 'shahin' ? { ...item, ready: true, seo: { title: 'Reviewed Qatar title', description: 'Reviewed Qatar description' } } : item) };
    assert.equal(canIndex('qa', '/shahin'), true);
    const metadata = marketMetadata({ title: 'Old title' }, 'qa', '/shahin');
    assert.equal(metadata.title, 'Reviewed Qatar title');
    assert.equal(metadata.openGraph.description, 'Reviewed Qatar description');
    assert.ok(sitemap().some(entry => entry.url === 'https://locatorglobal.com/qa/shahin'));
  } finally {
    indexing.qa.ready = false;
    indexing.global.ready = false;
    regulatoryNavigation.qa = original;
    testProcess.env.SITE_ENV = 'development';
  }
});

test('new regulatory exclusive pages require both a country menu entry and route registration', () => {
  const { regulatoryNavigation, isRegulatoryPageAvailable } = load('src/config/regulatory.ts');
  const { exclusivePages, getExclusivePage } = load('src/content/exclusive-pages.ts');
  const original = regulatoryNavigation.qa;
  const path = '/regulatory/qa-reviewed-page';
  try {
    assert.equal(isRegulatoryPageAvailable('qa', path), false);
    exclusivePages[path] = { section: 'regulatory', markets: ['qa'], metadata: {}, load: async () => ({ default: () => null }) };
    assert.equal(getExclusivePage(path, 'qa'), undefined);
    regulatoryNavigation.qa = { ...original, items: [{ id: 'qa-reviewed-page', label: 'Reviewed page', href: path, ready: false }] };
    assert.ok(getExclusivePage(path, 'qa'));
    for (const code of ['global', 'kw', 'om', 'sa']) assert.equal(getExclusivePage(path, code), undefined);
    regulatoryNavigation.qa = { ...original, items: [] };
    assert.equal(getExclusivePage(path, 'qa'), undefined, 'removing the menu entry revokes the route');
  } finally { regulatoryNavigation.qa = original; delete exclusivePages[path]; }
});
