import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Locale } from './i18n.service';

/** Public address of the site (GitHub Pages project site). */
export const SITE_URL = 'https://tiagorodrigues-gith.github.io/tiago-rodrigues-portfolio';

const OG_LOCALE: Record<Locale, string> = { pt: 'pt_BR', en: 'en_US', de: 'de_DE' };
const HREFLANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en', de: 'de' };

/**
 * Title, description, canonical URL, hreflang alternates and Open Graph tags per page.
 * Runs at build time too (prerendering), so crawlers and link previews get them without JavaScript.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(page: { path: string; locale: Locale; title: string; description: string; index: boolean }): void {
    const path = page.path === '/' ? '/' : `${page.path.replace(/\/$/, '')}/`;
    const canonical = page.locale === 'pt' ? `${SITE_URL}${path}` : `${SITE_URL}${path}?lang=${page.locale}`;

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'robots', content: page.index ? 'index, follow' : 'noindex, nofollow' });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALE[page.locale] });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });

    this.link('canonical', canonical);
    for (const locale of Object.keys(HREFLANG) as Locale[]) {
      const href = locale === 'pt' ? `${SITE_URL}${path}` : `${SITE_URL}${path}?lang=${locale}`;
      this.link('alternate', href, HREFLANG[locale]);
    }
    this.link('alternate', `${SITE_URL}${path}`, 'x-default');
  }

  private link(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let el = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!el) {
      el = this.document.createElement('link');
      el.setAttribute('rel', rel);
      if (hreflang) {
        el.setAttribute('hreflang', hreflang);
      }
      this.document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }
}
