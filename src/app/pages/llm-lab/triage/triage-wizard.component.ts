import { Component, ElementRef, Input, ViewChild, computed, signal } from '@angular/core';
import { TriageText } from './triage-content';
import {
  Answer, CATEGORIES, CATEGORY_OF_CLASS, CLASS_OF, EMPTY_STATE, MainCategory, QuestionKey, StepKey, TriageState, ValidationError,
  prune, steps, urgent, validate, visibleQuestions,
} from './triage-flow';

export interface ClassScore {
  label: string;
  p: number;
}

/** Classes of the browser classifier for a text, most likely first; [] when no word is known, null when it could not load. */
export type Suggest = (text: string) => Promise<ClassScore[] | null>;

/** Line icons (24×24, stroke) of each category. */
const ICONS: Record<MainCategory, string> = {
  brakes: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6M18.5 5.5l-3 3M5 12h1',
  airbags: 'M12 4a3 3 0 1 0 0 6a3 3 0 1 0 0-6M5 21v-4a7 7 0 0 1 14 0v4M8 21v-3M16 21v-3',
  electrical: 'M13 2L4 14h7l-1 8l9-12h-7l1-8',
  structure: 'M3 16v-4l3-5h12l3 5v4H3M3 12h18M7 16v3M17 16v3M9 7v5M15 7v5',
  other: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  unknown: 'M4 5h16v11H9l-5 4V5M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.4M12 14.5v.5',
};

/**
 * Guided triage of a defect complaint, one decision per screen: the part of the vehicle (or a free description),
 * what happened, quick yes/no questions, an optional description, and a result with the classifier's ranking.
 * Taps advance on their own; every answer can be changed from the result. Nothing leaves the browser.
 */
@Component({
  selector: 'app-triage-wizard',
  templateUrl: './triage-wizard.html',
  styleUrls: ['./triage-wizard.css'],
})
export class TriageWizardComponent {
  @Input({ required: true }) t!: TriageText;
  @Input({ required: true }) lang = 'pt-BR';
  @Input({ required: true }) suggest!: Suggest;
  /** Display name of a classifier label (AIR BAGS, ...), in the page language. */
  @Input({ required: true }) className: (label: string) => string = (l) => l;
  /** Quality of the browser classifier, shown under its ranking. */
  @Input() modelNote = '';
  @ViewChild('stepHeading') private heading?: ElementRef<HTMLElement>;

  readonly icons = ICONS;
  readonly categories = CATEGORIES;
  readonly answers: Answer[] = ['yes', 'no', 'unsure'];
  readonly state = signal<TriageState>(EMPTY_STATE);
  readonly index = signal(0);
  /** Current question inside the questions step. */
  readonly qIndex = signal(0);
  readonly errors = signal<ValidationError[]>([]);
  readonly ranking = signal<ClassScore[] | null>(null);
  readonly analysing = signal(false);
  readonly noWords = signal(false);
  readonly failed = signal(false);
  readonly showExamples = signal(false);
  readonly showWhy = signal(false);
  /** Bars start empty and grow once the result is on screen. */
  readonly grown = signal(false);

  readonly steps = computed(() => steps(this.state()));
  readonly step = computed<StepKey>(() => this.steps()[Math.min(this.index(), this.steps().length - 1)]);
  readonly questions = computed(() => visibleQuestions(this.state()));
  readonly question = computed<QuestionKey | null>(() => this.questions()[this.qIndex()] ?? null);
  readonly urgent = computed(() => urgent(this.state()));
  readonly category = computed(() => this.state().category);
  readonly top = computed(() => this.ranking()?.[0] ?? null);
  /** Category used for evidence: the chosen one, or the suggested one for "not sure". */
  readonly effective = computed<MainCategory | null>(() => {
    const c = this.category();
    if (c !== 'unknown') return c;
    const top = this.top();
    return top ? (CATEGORY_OF_CLASS[top.label] ?? 'other') : 'unknown';
  });
  readonly detailText = computed(() => {
    const c = this.category();
    return c ? this.t.categories[c].details.find((d) => d.key === this.state().detail) ?? null : null;
  });
  /** Share of the flow already done, for the progress bar (the questions step advances per question). */
  readonly done = computed(() => {
    const last = this.steps().length - 1;
    const inQuestions = this.step() === 'questions' && this.questions().length ? this.qIndex() / this.questions().length : 0;
    return Math.min(1, (this.index() + inQuestions) / last);
  });
  readonly donePct = computed(() => Math.round(this.done() * 100));

  progress(): string {
    return this.t.progress.replace('{n}', String(this.index() + 1)).replace('{total}', String(this.steps().length));
  }

  percent(p: number): string {
    return new Intl.NumberFormat(this.lang, { style: 'percent', maximumFractionDigits: 0 }).format(p);
  }

  /** The text agrees with the chosen category (only meaningful when one was chosen). */
  agrees(): boolean {
    const top = this.top();
    const c = this.category();
    return !!top && !!c && c !== 'unknown' && CLASS_OF[c] === top.label;
  }

  chooseCategory(c: MainCategory): void {
    const changed = c !== this.category();
    this.state.set(prune({ ...this.state(), category: c, detail: changed ? null : this.state().detail }));
    if (changed) this.ranking.set(null);
    this.go(this.index() + 1);
  }

  chooseDetail(key: string): void {
    this.state.set({ ...this.state(), detail: key });
    this.go(this.index() + 1);
  }

  /** An answer moves on to the next question, or to the next step after the last one. */
  answer(q: QuestionKey, a: Answer): void {
    this.state.set(prune({ ...this.state(), answers: { ...this.state().answers, [q]: a } }));
    this.showWhy.set(false);
    const next = this.questions().indexOf(q) + 1;
    if (next < this.questions().length) {
      this.qIndex.set(next);
      this.focusHeading();
    } else {
      this.next();
    }
  }

  describe(text: string): void {
    this.state.set({ ...this.state(), description: text });
    this.errors.set([]);
    this.noWords.set(false);
  }

  /** Analyse the description and move on; stay when the classifier knows none of its words. */
  async analyse(): Promise<void> {
    const text = this.state().description.trim();
    const problems = validate('describe', this.state());
    if (problems.length || !text) {
      this.errors.set(problems.length ? problems : ['describeUnknown']);
      return;
    }
    this.analysing.set(true);
    try {
      const ranking = await this.suggest(text);
      this.failed.set(ranking === null);
      this.noWords.set(ranking?.length === 0);
      this.ranking.set(ranking?.length ? ranking : null);
    } finally {
      this.analysing.set(false);
    }
    if (this.ranking()) this.next();
  }

  /** Skip the optional description. */
  skip(): void {
    this.ranking.set(null);
    this.next();
  }

  useSuggestion(): void {
    const top = this.top();
    if (!top) return;
    const c = CATEGORY_OF_CLASS[top.label] ?? 'other';
    this.state.set(prune({ ...this.state(), category: c, detail: null }));
    this.edit('detail');
  }

  /** Start from a complaint text (a sample of the dataset): the description step of "not sure". */
  prefill(text: string): void {
    this.state.set({ ...EMPTY_STATE, category: 'unknown', description: text });
    this.ranking.set(null);
    this.go(this.steps().indexOf('describe'));
  }

  next(): void {
    const problems = validate(this.step(), this.state());
    this.errors.set(problems);
    if (!problems.length) this.go(this.index() + 1);
  }

  back(): void {
    if (this.step() === 'questions' && this.qIndex() > 0) {
      this.qIndex.set(this.qIndex() - 1);
      this.showWhy.set(false);
      this.focusHeading();
    } else {
      this.go(this.index() - 1, true);
    }
  }

  /** From the result: jump to the step (and question) that holds an answer. */
  edit(step: StepKey, q?: QuestionKey): void {
    this.go(this.steps().indexOf(step));
    if (q) this.qIndex.set(Math.max(0, this.questions().indexOf(q)));
  }

  restart(): void {
    this.state.set(EMPTY_STATE);
    this.ranking.set(null);
    this.go(0);
  }

  private go(i: number, fromEnd = false): void {
    this.index.set(Math.max(0, Math.min(this.steps().length - 1, i)));
    this.qIndex.set(fromEnd && this.step() === 'questions' ? Math.max(0, this.questions().length - 1) : 0);
    this.errors.set([]);
    this.noWords.set(false);
    this.failed.set(false);
    this.showExamples.set(false);
    this.showWhy.set(false);
    this.grown.set(false);
    if (this.step() === 'review') setTimeout(() => this.grown.set(true), 30);
    this.focusHeading();
  }

  /** After the new screen is rendered, move focus to its heading so keyboard and screen-reader users follow. */
  private focusHeading(): void {
    setTimeout(() => this.heading?.nativeElement.focus({ preventScroll: true }), 0);
  }
}
