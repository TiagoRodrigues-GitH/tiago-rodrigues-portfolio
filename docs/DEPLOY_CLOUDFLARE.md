# Deploy on Cloudflare Pages

Cloudflare Pages (free plan) serves the site from the root of its own address, so
`robots.txt` and `sitemap.xml` are found where crawlers look for them, and it sends the
security headers in `public/_headers` (CSP, X-Frame-Options, X-Content-Type-Options,
Referrer-Policy, Permissions-Policy, HSTS) as real HTTP headers. GitHub Pages can do neither.

## One-time setup (Cloudflare dashboard)

1. **Workers & Pages → Create → Pages → Connect to Git** → choose
   `TiagoRodrigues-GitH/tiago-rodrigues-portfolio`, production branch `main`.
2. Build settings:
   - Framework preset: *None*
   - Build command: `npm run build:cloudflare`
   - Build output directory: `dist/tiago-rodrigues-portfolio/browser`
   - Environment variable: `NODE_VERSION` = `20`
3. Save and deploy. The site appears at `https://<project-name>.pages.dev`
   (or add a custom domain under *Custom domains*).

## Point the site's own links to the new address

Canonical URLs, hreflang, Open Graph, JSON-LD, the sitemap and robots.txt contain the public
address. After the first deploy, run once and push:

```bash
node scripts/set-site-url.mjs https://<project-name>.pages.dev
git commit -am "Site address: Cloudflare Pages" && git push
```

## What the build does

- `ng build --configuration production,cloudflare`: same production build, base href `/`
  instead of `/tiago-rodrigues-portfolio/`.
- Copies `index.csr.html` to `404.html` (unknown URLs).
- `public/_redirects`: `/login` and `/admin` are served by the client-side shell; legacy
  `/projects/:id` and `/language/:lang` URLs redirect.

## GitHub Pages

The GitHub Actions workflow keeps publishing to GitHub Pages on every push to `main`. Once the
Cloudflare address is live and `set-site-url.mjs` has run, the canonical tags point search
engines to Cloudflare; the GitHub Pages copy can stay as a mirror or the workflow can be
disabled (Actions → *Deploy to GitHub Pages* → *Disable workflow*).

## If the backend is deployed

Add its origin to `connect-src` in both `src/index.html` (meta tag) and `public/_headers`, and set
`apiUrl` in `src/environments/environment.prod.ts`.
