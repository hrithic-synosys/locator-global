// Read-only HTTP verification against `npm start -- --port 3100`.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin = process.env.TEST_ORIGIN || 'http://localhost:3100';
const markets = ['', '/sa', '/qa', '/kw', '/om'];
const manifest = JSON.parse(fs.readFileSync('.next/prerender-manifest.json', 'utf8'));
const sharedRoutes = Object.keys(manifest.routes)
  .filter(path => path === '/global' || path.startsWith('/global/'))
  .map(path => path.slice('/global'.length) || '/');
assert.ok(sharedRoutes.length > 0, 'Build the application before testing routes');
let checks = 0;
async function request(path, status = 200) {
  const response = await fetch(origin + path, { redirect: 'manual', signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, status, path);
  checks++;
  return { response, html: await response.text() };
}
for (const prefix of markets) {
  for (const route of sharedRoutes) {
    const path = prefix + (route === '/' ? '' : route) || '/';
    const { response, html } = await request(path + '?test=country');
    assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], `https://locatorglobal.com${path === '/' ? '' : path}`, `${path} canonical`);
    assert.ok(html.includes('<meta name="robots" content="noindex, follow"'), `${path} robots`);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, follow');
    assert.ok(html.includes(`href="${prefix}/contact"`), `${path} navigation`);
    assert.ok(!html.includes('href="/global'), `${path} internal URL leak`);
    const flag = prefix === '/qa' ? 'Qatar' : prefix === '/sa' ? 'Saudi Arabia' : prefix === '/kw' ? 'Kuwait' : prefix === '/om' ? 'Oman' : 'Global';
    assert.ok(html.includes(`alt="${flag}"`), `${path} server-rendered flag`);
    assert.ok(!html.includes('GTM-W99N62T') && !html.includes('embed.tawk.to/5ed23f408ee2956d73a601e9'), 'copied UAE tracking must never load');
  }
  const { response } = await request(`${prefix}/contact.html?campaign=one`, 308);
  assert.equal(response.headers.get('location'), `${prefix}/contact?campaign=one`);
}
for (const route of ['/ae', '/uae', '/bh', '/bahrain', '/xx', '/global', '/global/contact', '/qa/non-existing-page', '/kw/qatar-compliance', '/qa/qatar-compliance', '/qa/api/contact', '/qa/qa', '/qa/about/newsroom/blog/non-existing', '/om/service/tracking-devices/non-existing', '/sa/industries/non-existing']) await request(route, 404);
const { html: sitemap } = await request('/sitemap.xml');
assert.ok(!sitemap.includes('<loc>'), 'unfinished markets must not be advertised');
const { html: robots } = await request('/robots.txt');
assert.ok(!robots.includes('Sitemap:'), 'unfinished sitemap must not be advertised');
await request('/flags/qatar.svg');
await request('/api/contact', 405);
console.log(`Passed ${checks} HTTP checks, including all market flags, metadata, dynamic pages, redirects, 404s and API isolation.`);
