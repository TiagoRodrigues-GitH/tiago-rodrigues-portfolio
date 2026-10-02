import { Component, ElementRef, Input, ViewChild, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LabDataService, MODEL_NAMES, NhtsaData, NhtsaSample } from './lab-data';
import { Classification, ComplaintClassifier } from './lab-engine';
import { LabTranslations } from './lab-i18n';

/**
 * Defect complaint triage: a TF-IDF + logistic regression classifier that runs in the browser (loaded on first
 * use, 0.8 MB), and held-out complaints with every model's prediction.
 */
@Component({
  selector: 'app-defect-triage',
  templateUrl: './defect-triage.html',
  styleUrls: ['./defect-triage.css'],
})
export class DefectTriageComponent {
  private readonly lab = inject(LabDataService);
  private readonly dataSignal = signal<NhtsaData | null>(null);

  @Input({ required: true }) set data(value: NhtsaData | null) {
    this.dataSignal.set(value);
  }
  @Input({ required: true }) t!: LabTranslations;
  @Input({ required: true }) lang = 'pt-BR';

  @ViewChild('description') private description?: ElementRef<HTMLTextAreaElement>;

  readonly text = signal('');
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly result = signal<Classification | null>(null);
  readonly filter = signal('');
  private readonly classifier = signal<ComplaintClassifier | null>(null);
  private readonly macroF1 = signal<number | null>(null);

  readonly labels = computed(() => this.dataSignal()?.labels ?? []);
  /** How many complaints are shown; the list grows on request instead of filling several screens. */
  readonly shown = signal(6);

  /** Complaints of the chosen class, or of all classes in turn (one of each, then the next round). */
  private readonly matching = computed(() => {
    const filter = this.filter();
    const samples = this.dataSignal()?.samples ?? [];
    if (filter) {
      return samples.filter((sample) => sample.label === filter);
    }
    const byClass = this.labels().map((label) => samples.filter((sample) => sample.label === label));
    const rounds = Math.max(0, ...byClass.map((list) => list.length));
    return Array.from({ length: rounds }, (_, i) => byClass.map((list) => list[i])).flat().filter((s) => !!s);
  });
  readonly samples = computed(() => this.matching().slice(0, this.shown()));
  readonly remaining = computed(() => this.matching().length - this.samples().length);

  chooseFilter(label: string): void {
    this.filter.set(label);
    this.shown.set(6);
  }

  /** Classes sorted by probability, for the bar chart. */
  readonly ranking = computed(() => {
    const result = this.result();
    const classifier = this.classifier();
    if (!result || !classifier) {
      return [];
    }
    return classifier.labels
      .map((label, i) => ({ label, p: result.probabilities[i] }))
      .sort((a, b) => b.p - a.p);
  });

  get browserModelNote(): string {
    const f1 = this.macroF1();
    return f1 === null ? '' : this.t.browserModel.replace('{f1}', this.number(f1, 3));
  }

  async classify(event?: Event): Promise<void> {
    event?.preventDefault();
    if (!this.text().trim()) {
      return;
    }
    const classifier = await this.ensureClassifier();
    if (classifier) {
      this.result.set(classifier.classify(this.text()));
    }
  }

  useText(text: string): void {
    this.text.set(text);
    this.description?.nativeElement.focus();
    void this.classify();
  }

  trySample(sample: NhtsaSample): void {
    this.useText(sample.text);
    this.description?.nativeElement.scrollIntoView({ block: 'center' });
  }

  className(label: string): string {
    return this.t.classes[label] ?? label;
  }

  predictorName(key: string): string {
    if (key === 'tfidf') {
      return this.t.baselines['tfidf'];
    }
    const [model, stage] = key.split('/');
    return `${MODEL_NAMES[model] ?? model} · ${this.t.stages[stage] ?? stage}`;
  }

  predictors(sample: NhtsaSample): Array<{ key: string; label: string }> {
    return Object.entries(sample.predictions).map(([key, label]) => ({ key, label }));
  }

  percent(p: number): string {
    return new Intl.NumberFormat(this.lang, { style: 'percent', maximumFractionDigits: 0 }).format(p);
  }

  private number(value: number, digits: number): string {
    return new Intl.NumberFormat(this.lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  }

  private async ensureClassifier(): Promise<ComplaintClassifier | null> {
    if (this.classifier()) {
      return this.classifier();
    }
    this.loading.set(true);
    this.failed.set(false);
    try {
      const model = await firstValueFrom(this.lab.classifier());
      this.classifier.set(new ComplaintClassifier(model));
      this.macroF1.set(model.metrics.macroF1Eval);
      return this.classifier();
    } catch {
      this.failed.set(true);
      return null;
    } finally {
      this.loading.set(false);
    }
  }
}
