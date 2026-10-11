import { Component, ElementRef, Input, ViewChild, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LabDataService, MODEL_NAMES, NhtsaData, NhtsaSample } from './lab-data';
import { ClassifierData, ComplaintClassifier, SearchLanguage } from './lab-engine';
import { LabTranslations } from './lab-i18n';
import { TRIAGE_I18N, TriageText } from './triage/triage-content';
import { Suggest, TriageWizardComponent } from './triage/triage-wizard.component';

/**
 * Defect complaint triage: the guided wizard, backed by a TF-IDF + logistic regression classifier that runs in the browser (loaded on first
 * use, 1.1 MB; English plus machine-translated Portuguese and German training data), and held-out complaints with
 * every model's prediction (collapsed; any of them can be sent to the wizard), shown in the page language (hand translations; the models classified the English original).
 */
@Component({
  selector: 'app-defect-triage',
  imports: [TriageWizardComponent],
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
  @Input({ required: true }) locale: SearchLanguage = 'pt';

  @ViewChild(TriageWizardComponent) private wizard?: TriageWizardComponent;
  @ViewChild(TriageWizardComponent, { read: ElementRef }) private wizardHost?: ElementRef<HTMLElement>;

  get triage(): TriageText {
    return TRIAGE_I18N[this.locale];
  }

  /** The guided triage asks the browser classifier to rank the classes of a description. */
  readonly suggest: Suggest = async (text) => {
    const classifier = await this.ensureClassifier();
    if (!classifier) return null;
    const { probabilities, knownTerms } = classifier.classify(text);
    if (!knownTerms) return [];
    return classifier.labels.map((label, i) => ({ label, p: probabilities[i] })).sort((a, b) => b.p - a.p);
  };

  readonly classNameOf = (label: string): string => this.className(label);

  readonly filter = signal('');
  private readonly classifier = signal<ComplaintClassifier | null>(null);
  private readonly metrics = signal<ClassifierData['metrics'] | null>(null);
  /** Complaints shown in their English original instead of the translation. */
  readonly originals = signal(new Set<string>());

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

  get browserModelNote(): string {
    const m = this.metrics();
    if (!m) {
      return '';
    }
    const f1 = (lang: string) => this.number(m.byLanguage?.[lang]?.macroF1 ?? (lang === 'en' ? m.macroF1Eval : NaN), 3);
    return this.t.browserModel.replace('{en}', f1('en')).replace('{pt}', f1('pt')).replace('{de}', f1('de'));
  }

  /** A complaint in the page language, or its English original when the visitor asked for it. */
  sampleText(sample: NhtsaSample): string {
    return this.originals().has(sample.text.en) ? sample.text.en : sample.text[this.locale];
  }

  sampleLang(sample: NhtsaSample): string {
    return this.originals().has(sample.text.en) || this.locale === 'en' ? 'en' : this.lang;
  }

  toggleOriginal(sample: NhtsaSample): void {
    const next = new Set(this.originals());
    if (!next.delete(sample.text.en)) {
      next.add(sample.text.en);
    }
    this.originals.set(next);
  }

  /** A sample complaint goes into the triage as a description to analyse. */
  trySample(sample: NhtsaSample): void {
    this.wizard?.prefill(this.sampleText(sample));
    this.wizardHost?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  private number(value: number, digits: number): string {
    return new Intl.NumberFormat(this.lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  }

  private async ensureClassifier(): Promise<ComplaintClassifier | null> {
    if (this.classifier()) {
      return this.classifier();
    }
    try {
      const model = await firstValueFrom(this.lab.classifier());
      this.classifier.set(new ComplaintClassifier(model));
      this.metrics.set(model.metrics);
      return this.classifier();
    } catch {
      return null;
    }
  }
}
