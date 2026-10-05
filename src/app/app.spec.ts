import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { I18nService, Locale } from './services/i18n.service';
import { ARTICLES } from './content/articles';
import { getPortfolioProjects } from './shared/portfolio-projects';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders an accessible language switcher', () => {
    const buttons = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.lang-switch button'));
    expect(buttons.map((button) => button.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'PT Português',
      'EN English',
      'DE Deutsch',
    ]);
    expect(buttons.map((button) => button.getAttribute('lang'))).toEqual(['pt-BR', 'en', 'de']);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('offers a skip link and a focusable main landmark', () => {
    expect(compiled.querySelector('.skip-link')?.getAttribute('href')).toBe('#main-content');
    expect(compiled.querySelector('main#main-content')?.getAttribute('tabindex')).toBe('-1');
  });

  it('exposes the mobile menu state to assistive technology', () => {
    const toggle = compiled.querySelector<HTMLButtonElement>('.menu-toggle')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('Portfolio content', () => {
  const locales: Locale[] = ['pt', 'en', 'de'];
  const i18n = new I18nService();

  it('keeps every language in sync', () => {
    for (const locale of locales) {
      expect(ARTICLES[locale].length).toBe(ARTICLES.pt.length);
      ARTICLES[locale].forEach((article, index) => {
        expect(article.paragraphs.length).toBe(ARTICLES.pt[index].paragraphs.length);
        expect(article.references.length).toBe(ARTICLES.pt[index].references.length);
      });
      expect(getPortfolioProjects(locale).map((p) => p.id)).toEqual(getPortfolioProjects('pt').map((p) => p.id));
    }
  });

  it('does not mention vehicle manufacturers or their brands', () => {
    const content = JSON.stringify([
      ARTICLES,
      locales.map((locale) => getPortfolioProjects(locale)),
      i18n.shell,
      i18n.home,
      i18n.projects,
      i18n.contact,
      i18n.about,
    ]);
    const brands = /\b(bmw|volkswagen|vw|audi|porsche|mercedes|daimler|honda|toyota|ford|fiat|stellantis|renault|hyundai|kia|nissan|tesla|volvo|chevrolet|gm|nash|briggs)\b/i;
    expect(content).not.toMatch(brands);
  });
});
