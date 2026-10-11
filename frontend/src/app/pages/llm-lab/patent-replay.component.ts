import { Component, Input, computed, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Localized, MODEL_NAMES, PatentAnswer, PatentData, PatentItem } from './lab-data';
import { Bm25, SearchHit, SearchLanguage } from './lab-engine';
import { LabTranslations } from './lab-i18n';

/**
 * The patent assistant as a replay: the visitor's question is matched (BM25, in the page language) to the held-out
 * test questions, and the page shows what the models really answered in the evaluation, next to the reference and
 * the no-LLM baseline. The data is Portuguese; English and German pages show translations with the original a click
 * away (questions translated by hand, passages and answers by machine).
 */
@Component({
  selector: 'app-patent-replay',
  imports: [NgTemplateOutlet],
  templateUrl: './patent-replay.html',
  styleUrls: ['./patent-replay.css'],
})
export class PatentReplayComponent {
  private readonly dataSignal = signal<PatentData | null>(null);
  private readonly localeSignal = signal<SearchLanguage>('pt');

  @Input({ required: true }) set data(value: PatentData | null) {
    this.dataSignal.set(value);
    if (value && !this.selectedId()) {
      // Open on the question closest to the author's field, so the first view is a complete example.
      const adas = value.items.find((item) => item.category === 'software_adas') ?? value.items[0];
      this.selectedId.set(adas?.id ?? null);
    }
  }
  @Input({ required: true }) set locale(value: SearchLanguage) {
    this.localeSignal.set(value);
    this.hits.set(null);
  }
  @Input({ required: true }) t!: LabTranslations;
  @Input({ required: true }) lang = 'pt-BR';

  readonly query = signal('');
  readonly hits = signal<SearchHit[] | null>(null);
  readonly selectedId = signal<string | null>(null);
  /** English and German pages: show the Portuguese original instead of the translation. */
  readonly showOriginal = signal(false);
  private readonly chosenModel = signal<string | null>(null);

  readonly translated = computed(() => this.localeSignal() !== 'pt');
  readonly items = computed(() => this.dataSignal()?.items ?? []);
  private readonly index = computed(() => {
    const locale = this.localeSignal();
    return new Bm25(this.items().map((item) => item.question[locale]), locale);
  });

  /** Test questions grouped by source, in order of first appearance. */
  readonly groups = computed(() => {
    const groups = new Map<string, PatentItem[]>();
    for (const item of this.items()) {
      groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
    }
    return [...groups].map(([category, items]) => ({ category, items }));
  });

  readonly selected = computed(() => this.items().find((item) => item.id === this.selectedId()) ?? null);

  /** Language models with answers for the selected question (base and fine-tuned). */
  readonly models = computed(() => {
    const keys = Object.keys(this.selected()?.answers ?? {}).filter((key) => key.includes('/'));
    return [...new Set(keys.map((key) => key.split('/')[0]))];
  });

  readonly model = computed(() => {
    const models = this.models();
    const chosen = this.chosenModel();
    return chosen && models.includes(chosen) ? chosen : (models[0] ?? null);
  });

  /** Language of the texts in the answer card (for screen readers and hyphenation). */
  readonly textLang = computed(() => (this.showOriginal() || !this.translated() ? 'pt-BR' : this.lang));

  /** A question in the page language (used in lists and search results). */
  question(item: PatentItem): string {
    return item.question[this.localeSignal()];
  }

  /** A text of the answer card: the translation, or the Portuguese original when asked for. */
  text(value: Localized): string {
    return this.showOriginal() ? value.pt : value[this.localeSignal()];
  }

  modelName(key: string): string {
    return MODEL_NAMES[key] ?? key;
  }

  answer(item: PatentItem, key: string): PatentAnswer | null {
    return item.answers[key] ?? null;
  }

  search(event?: Event): void {
    event?.preventDefault();
    const hits = this.index().search(this.query(), 3);
    this.hits.set(hits);
    if (hits.length) {
      this.selectedId.set(this.items()[hits[0].index].id);
    }
  }

  ask(question: string): void {
    this.query.set(question);
    this.search();
  }

  select(id: string): void {
    this.selectedId.set(id || null);
  }

  chooseModel(key: string): void {
    this.chosenModel.set(key);
  }

  score(value: number | null | undefined): string {
    return value == null ? '–' : new Intl.NumberFormat(this.lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  percent(value: number | null | undefined): string {
    return value == null ? '–' : new Intl.NumberFormat(this.lang, { style: 'percent', maximumFractionDigits: 0 }).format(value);
  }

  category(key: string): string {
    return this.t.categories[key] ?? key;
  }
}
