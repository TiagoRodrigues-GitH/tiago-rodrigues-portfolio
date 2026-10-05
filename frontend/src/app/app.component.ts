import { Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild, computed, signal } from '@angular/core';
import { DOCUMENT, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { ActivatedRouteSnapshot, NavigationEnd, Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';
import { I18nService, Locale, PageKey, ShellTranslations } from './services/i18n.service';
import { IMAGE_CREDITS } from './content/credits';
import { SeoService } from './services/seo.service';
import { AnalyticsService } from './services/analytics.service';
import { langQueryFor } from './services/locale';

const LANG_KEY = 'preferred_lang';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly email = 'tiagorodrigues@alunos.utfpr.edu.br';
  readonly emailUser = this.email.split('@')[0];
  readonly emailDomain = this.email.split('@')[1];
  readonly linkedInUrl = 'https://www.linkedin.com/in/tiagorodriguesde/';
  readonly githubUrl = 'https://github.com/TiagoRodrigues-GitH';
  readonly year = new Date().getFullYear();
  readonly credits = IMAGE_CREDITS;
  readonly navItems: Array<{ path: string; key: keyof ShellTranslations['nav'] }> = [
    { path: '/', key: 'home' },
    { path: '/projects', key: 'projects' },
    { path: '/about', key: 'about' },
    { path: '/contact', key: 'contact' },
  ];

  readonly lang = signal<Locale>('pt');
  readonly menuOpen = signal(false);
  readonly langQuery = computed(() => langQueryFor(this.lang()));
  /** Footer image credits (disclosure; closed content is `hidden`, so its links are not focusable). */
  readonly creditsOpen = signal(false);

  @ViewChild('mainContent') private mainContent?: ElementRef<HTMLElement>;
  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;

  private readonly isBrowser: boolean;
  private lastPath: string | null = null;
  private pathChanged = true;

  constructor(
    private router: Router,
    public i18n: I18nService,
    private seo: SeoService,
    private analytics: AnalyticsService,
    private viewportScroller: ViewportScroller,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Read ?lang= before the first render so the header never flashes in the default language.
    const initialLang = new URLSearchParams(this.document.location?.search ?? '').get('lang');
    this.lang.set(this.i18n.getLocale(initialLang));
    this.document.documentElement.lang = this.i18n.option(this.lang()).htmlLang;

    this.viewportScroller.setOffset(() => [0, (this.document.querySelector('.site-header')?.clientHeight ?? 72) + 16]);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.onNavigationEnd(event.urlAfterRedirects));

    this.router.events
      .pipe(filter((event): event is Scroll => event instanceof Scroll))
      .subscribe((event) => this.onScroll(event));
  }

  get t(): ShellTranslations {
    return this.i18n.shell[this.lang()];
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  setLanguage(language: Locale): void {
    this.rememberLanguage(language);
    const tree = this.router.parseUrl(this.router.url);
    const { lang: _previous, ...rest } = tree.queryParams;
    tree.queryParams = language === 'pt' ? rest : { ...rest, lang: language };
    this.router.navigateByUrl(tree);
  }

  /** In-page anchors break under <base href>, so the skip link moves focus itself. */
  skipToMain(event: Event): void {
    event.preventDefault();
    this.mainContent?.nativeElement.focus();
    this.mainContent?.nativeElement.scrollIntoView();
  }

  backToTop(): void {
    if (!this.isBrowser) {
      return;
    }
    this.document.defaultView?.scrollTo({ top: 0 });
    this.document.querySelector<HTMLElement>('.brand')?.focus({ preventScroll: true });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.menuButton?.nativeElement.focus();
    }
  }

  private onNavigationEnd(url: string): void {
    const tree = this.router.parseUrl(url);
    const requested = tree.queryParams['lang'] ?? null;

    // Old links with ?lang=pt: Portuguese is the default, so drop the parameter (one URL per page).
    if (requested === 'pt' && this.isBrowser) {
      const { lang: _pt, ...rest } = tree.queryParams;
      tree.queryParams = rest;
      this.router.navigateByUrl(tree, { replaceUrl: true });
      return;
    }

    // First visit without ?lang: the visitor's earlier choice, else the browser language.
    if (this.lastPath === null && requested === null && this.isBrowser) {
      const preferred = this.preferredLocale();
      if (preferred !== 'pt') {
        tree.queryParams = { ...tree.queryParams, lang: preferred };
        this.router.navigateByUrl(tree, { replaceUrl: true });
        return;
      }
    }

    const locale = this.i18n.getLocale(requested);
    this.lang.set(locale);
    this.menuOpen.set(false);
    this.document.documentElement.lang = this.i18n.option(locale).htmlLang;
    const page = this.currentPage();
    const path = url.split(/[?#]/)[0];
    this.seo.update({
      path,
      locale,
      title: this.t.titles[page],
      description: this.t.descriptions[page],
      index: page !== 'login' && page !== 'admin',
    });

    // Move focus to the new page for keyboard and screen-reader users (not on language switches).
    this.pathChanged = path !== this.lastPath;
    if (this.pathChanged) {
      this.analytics.trackPageView(path, locale);
    }
    if (this.lastPath !== null && this.pathChanged && this.isBrowser) {
      setTimeout(() => this.mainContent?.nativeElement.focus({ preventScroll: true }));
    }
    this.lastPath = path;
  }

  /** Back/forward restores the position, anchors scroll into view, a new page starts at the top. */
  private onScroll(event: Scroll): void {
    if (event.position) {
      this.viewportScroller.scrollToPosition(event.position);
    } else if (event.anchor) {
      this.viewportScroller.scrollToAnchor(event.anchor);
    } else if (this.pathChanged) {
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  private currentPage(): PageKey {
    let route: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    return (route?.data['page'] as PageKey | undefined) ?? 'home';
  }

  private rememberLanguage(language: Locale): void {
    try {
      this.document.defaultView?.localStorage.setItem(LANG_KEY, language);
    } catch {
      // Storage blocked: the choice simply is not remembered.
    }
  }

  private preferredLocale(): Locale {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(LANG_KEY);
      if (stored === 'pt' || stored === 'en' || stored === 'de') {
        return stored;
      }
    } catch {
      // Storage blocked: fall back to the browser language.
    }
    const languages = this.document.defaultView?.navigator.languages ?? [];
    for (const language of languages) {
      const code = language.slice(0, 2).toLowerCase();
      if (code === 'pt' || code === 'en' || code === 'de') {
        return code;
      }
    }
    return 'pt';
  }
}
