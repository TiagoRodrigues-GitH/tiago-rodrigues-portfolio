import { Component, computed, inject, signal } from '@angular/core';
import { I18nService, HomeTranslations } from '../../services/i18n.service';
import { injectLangQuery, injectLocale } from '../../services/locale';
import { BlueprintKind, BlueprintPart, blueprintParts } from '../../shared/blueprint-figure/blueprint-parts';
import { getPortfolioProjects } from '../../shared/portfolio-projects';
import { ARTICLES, Article } from '../../content/articles';

const WORDS_PER_MINUTE = 200;

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private readonly i18n = inject(I18nService);

  readonly locale = injectLocale();
  readonly langQuery = injectLangQuery(this.locale);
  readonly projects = computed(() => getPortfolioProjects(this.locale()));
  readonly articles = computed(() => ARTICLES[this.locale()]);
  readonly chassis = 'assets/images/blueprints/chassis.webp';

  /** Open disclosures (chapter text, reference lists). Closed content carries `hidden`,
   *  so its links are neither focusable nor announced until it is opened. */
  private readonly open = signal<ReadonlySet<string>>(new Set());

  get chassisAlt(): string {
    return this.i18n.projects[this.locale()].figureAlt;
  }

  parts(kind: BlueprintKind): BlueprintPart[] {
    return blueprintParts(kind, this.locale());
  }

  isOpen(id: string): boolean {
    return this.open().has(id);
  }

  toggle(id: string): void {
    this.open.update((current) => {
      const next = new Set(current);
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });
  }

  get t(): HomeTranslations {
    return this.i18n.home[this.locale()];
  }

  get newTab(): string {
    return this.i18n.shell[this.locale()].newTab;
  }

  readingTime(article: Article): number {
    const words = [article.lede, ...article.paragraphs].join(' ').split(/\s+/).length;
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  }

  displayUrl(url: string): string {
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  }
}
