import { Component, computed, inject } from '@angular/core';
import { I18nService, HomeTranslations } from '../../services/i18n.service';
import { injectLocale } from '../../services/locale';
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
  readonly projects = computed(() => getPortfolioProjects(this.locale()));
  readonly articles = computed(() => ARTICLES[this.locale()]);
  readonly chassis = 'assets/images/blueprints/chassis.webp';

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
