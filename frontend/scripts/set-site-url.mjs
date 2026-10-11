// Point every absolute URL of the site (canonical, hreflang, Open Graph, JSON-LD, sitemap,
// robots.txt, llms.txt) to a new public address, e.g. after moving to Cloudflare Pages:
//
//   node scripts/set-site-url.mjs https://tiago-rodrigues.pages.dev
//
// Run it once, commit, push. It replaces whatever address is currently in seo.service.ts.
import { readFileSync, writeFileSync } from 'node:fs';

const next = (process.argv[2] ?? '').replace(/\/+$/, '');
if (!/^https:\/\/[^/]+(\/[^/]+)*$/.test(next)) {
  console.error('usage: node scripts/set-site-url.mjs https://your-site.example');
  process.exit(1);
}

const seo = 'src/app/services/seo.service.ts';
const current = readFileSync(seo, 'utf8').match(/export const SITE_URL = '([^']+)'/)?.[1];
if (!current) {
  console.error(`SITE_URL not found in ${seo}`);
  process.exit(1);
}

// Paths in robots.txt are relative to the host: drop the old base path, add the new one.
const pathOf = (url) => new URL(url).pathname.replace(/\/+$/, '');
const files = [seo, 'src/index.html', 'public/sitemap.xml', 'public/robots.txt', 'public/llms.txt'];
for (const file of files) {
  let text = readFileSync(file, 'utf8').split(current).join(next);
  if (file.endsWith('robots.txt')) {
    text = text.replace(/^Disallow: .*\/(admin|login)$/gm, (_line, page) => `Disallow: ${pathOf(next)}/${page}`);
  }
  writeFileSync(file, text);
  console.log(`updated ${file}`);
}
console.log(`${current} -> ${next}`);
