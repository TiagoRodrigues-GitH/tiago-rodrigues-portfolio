import { Component, ElementRef, Input, ViewChild, computed, signal } from '@angular/core';
import { TriageText } from './triage-content';
import {
  Answer, CATEGORIES, CATEGORY_OF_CLASS, CLASS_OF, EMPTY_STATE, MainCategory, QuestionKey, StepKey, TriageState, ValidationError,
  prune, steps, urgent, validate, visibleQuestions,
} from './triage-flow';

/** Top class of the browser classifier for a text, or null when it could not run. */
export type Suggest = (text: string) => Promise<{ label: string; p: number } | null>;

/**
 * Guided triage of a defect complaint: category, situation, follow-up questions, free description with the
 * classifier's suggestion, and a review where every answer can be changed. Nothing leaves the browser.
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
  @ViewChild('stepHeading') private heading?: ElementRef<HTMLElement>;

  readonly categories = CATEGORIES;
  readonly answers: Answer[] = ['yes', 'no', 'unsure'];
  readonly state = signal<TriageState>(EMPTY_STATE);
  readonly index = signal(0);
  readonly errors = signal<ValidationError[]>([]);
  readonly suggestion = signal<{ label: string; p: number } | null>(null);
  readonly suggesting = signal(false);

  readonly steps = computed(() => steps(this.state()));
  readonly step = computed<StepKey>(() => this.steps()[Math.min(this.index(), this.steps().length - 1)]);
  readonly questions = computed(() => visibleQuestions(this.state()));
  readonly urgent = computed(() => urgent(this.state()));
  readonly category = computed(() => this.state().category);
  /** Category used for evidence and the model class: the chosen one, or the suggested one for "not sure". */
  readonly effective = computed<MainCategory | null>(() => {
    const c = this.category();
    if (c !== 'unknown') return c;
    const s = this.suggestion();
    return s ? (CATEGORY_OF_CLASS[s.label] ?? 'other') : 'unknown';
  });
  readonly detailText = computed(() => {
    const c = this.category();
    return c ? this.t.categories[c].details.find((d) => d.key === this.state().detail) ?? null : null;
  });

  progress(): string {
    return this.t.progress
      .replace('{n}', String(this.index() + 1))
      .replace('{total}', String(this.steps().length))
      .replace('{name}', this.t.stepNames[this.step()]);
  }

  chooseCategory(c: MainCategory): void {
    const changed = c !== this.category();
    this.state.set(prune({ ...this.state(), category: c, detail: changed ? null : this.state().detail }));
    if (changed) this.suggestion.set(null);
    this.errors.set([]);
  }

  chooseDetail(key: string): void {
    this.state.set({ ...this.state(), detail: key });
    this.errors.set([]);
  }

  answer(q: QuestionKey, a: Answer): void {
    this.state.set(prune({ ...this.state(), answers: { ...this.state().answers, [q]: a } }));
    this.errors.set([]);
  }

  describe(text: string): void {
    this.state.set({ ...this.state(), description: text });
    this.errors.set([]);
  }

  async askSuggestion(): Promise<void> {
    const text = this.state().description.trim();
    if (!text) return;
    this.suggesting.set(true);
    try {
      this.suggestion.set(await this.suggest(text));
    } finally {
      this.suggesting.set(false);
    }
  }

  useSuggestion(): void {
    const s = this.suggestion();
    if (s) this.chooseCategory(CATEGORY_OF_CLASS[s.label] ?? 'other');
  }

  modelClass(): string {
    const c = this.effective();
    return c && c !== 'unknown' ? this.className(CLASS_OF[c]) : '—';
  }

  suggestionText(): string {
    const s = this.suggestion();
    if (!s) return '';
    const p = new Intl.NumberFormat(this.lang, { style: 'percent', maximumFractionDigits: 0 }).format(s.p);
    return this.t.suggestion.replace('{label}', this.className(s.label)).replace('{p}', p);
  }

  agrees(): boolean {
    const s = this.suggestion();
    const c = this.category();
    return !!s && !!c && c !== 'unknown' && CLASS_OF[c] === s.label;
  }

  async next(): Promise<void> {
    const problems = validate(this.step(), this.state());
    this.errors.set(problems);
    if (problems.length) return;
    // who does not know the category gets the suggestion when leaving the description
    if (this.step() === 'describe' && (this.category() === 'unknown' || !this.suggestion()) && this.state().description.trim()) {
      await this.askSuggestion();
    }
    this.go(this.index() + 1);
  }

  back(): void {
    this.go(this.index() - 1);
  }

  /** From the review: jump to the step that holds an answer. */
  edit(step: StepKey): void {
    this.go(this.steps().indexOf(step));
  }

  restart(): void {
    this.state.set(EMPTY_STATE);
    this.suggestion.set(null);
    this.go(0);
  }

  private go(i: number): void {
    this.index.set(Math.max(0, Math.min(this.steps().length - 1, i)));
    this.errors.set([]);
    // after the new step is rendered, move focus to its heading so keyboard and screen-reader users follow
    setTimeout(() => this.heading?.nativeElement.focus(), 0);
  }
}
