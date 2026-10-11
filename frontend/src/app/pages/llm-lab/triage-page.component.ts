import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';
import { injectLangQuery, injectLocale } from '../../services/locale';
import { DefectTriageComponent } from './defect-triage.component';
import { LabDataService, MODEL_NAMES, NhtsaData } from './lab-data';
import { LAB_I18N } from './lab-i18n';
import { LabResultsComponent } from './lab-results.component';
import { PROJECT_PAGES } from './project-pages-i18n';
import { ResultBar, ResultBarsComponent } from './result-bars.component';

/** Project 01: defect complaint triage (guided triage, browser classifier, real test complaints, benchmark). */
@Component({
  selector: 'app-triage-page',
  imports: [RouterLink, DefectTriageComponent, LabResultsComponent, ResultBarsComponent],
  templateUrl: './triage-page.html',
  styleUrls: ['./llm-lab.css'],
})
export class TriagePageComponent {
  private readonly data = inject(LabDataService);
  private readonly i18n = inject(I18nService);

  readonly locale = injectLocale();
  readonly langQuery = injectLangQuery(this.locale);
  readonly t = computed(() => LAB_I18N[this.locale()]);
  readonly page = computed(() => PROJECT_PAGES[this.locale()].triage);
  readonly lang = computed(() => this.i18n.option(this.locale()).htmlLang);
  readonly nhtsa = signal<NhtsaData | null>(null);
  readonly failed = signal(false);

  readonly sections = computed(() => [
    { id: 'demo', label: this.page().demoTitle },
    { id: 'results', label: this.t().resultsTitle },
    { id: 'method', label: this.t().methodTitle },
  ]);

  /** Macro-F1 on 2014-2024 of every finished model, best first. */
  readonly bars = computed<ResultBar[]>(() => {
    const t = this.t();
    return (this.nhtsa()?.rows ?? [])
      .filter((r) => r.status === 'done' && r.macroF1Eval != null)
      .map((r) => ({
        label: r.stage === 'baseline' ? (t.baselines[r.model] ?? r.model) : (MODEL_NAMES[r.model] ?? r.model),
        detail: t.stages[r.stage] ?? r.stage,
        value: r.macroF1Eval!,
        baseline: r.stage === 'baseline',
      }))
      .sort((a, b) => b.value - a.value);
  });

  constructor() {
    afterNextRender(() => {
      this.data.nhtsa().subscribe({ next: (d) => this.nhtsa.set(d), error: () => this.failed.set(true) });
    });
  }
}
