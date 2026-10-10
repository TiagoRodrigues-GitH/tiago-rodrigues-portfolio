import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';
import { injectLangQuery, injectLocale } from '../../services/locale';
import { LabDataService, MODEL_NAMES, PatentData } from './lab-data';
import { LAB_I18N } from './lab-i18n';
import { LabResultsComponent } from './lab-results.component';
import { GUIDE_I18N } from './patent-guide/guide-content';
import { PatentGuideComponent } from './patent-guide/patent-guide.component';
import { PatentReplayComponent } from './patent-replay.component';
import { PROJECT_PAGES } from './project-pages-i18n';
import { ResultBar, ResultBarsComponent } from './result-bars.component';

/** Project 02: patent assistant (assistant replay inside the patent guide, statistics, benchmark). */
@Component({
  selector: 'app-patent-page',
  imports: [RouterLink, PatentGuideComponent, PatentReplayComponent, LabResultsComponent, ResultBarsComponent],
  templateUrl: './patent-page.html',
  styleUrls: ['./llm-lab.css'],
})
export class PatentPageComponent {
  private readonly data = inject(LabDataService);
  private readonly i18n = inject(I18nService);

  readonly locale = injectLocale();
  readonly langQuery = injectLangQuery(this.locale);
  readonly t = computed(() => LAB_I18N[this.locale()]);
  readonly guide = computed(() => GUIDE_I18N[this.locale()]);
  readonly page = computed(() => PROJECT_PAGES[this.locale()].patents);
  readonly lang = computed(() => this.i18n.option(this.locale()).htmlLang);
  readonly patents = signal<PatentData | null>(null);
  readonly failed = signal(false);

  readonly sections = computed(() => [
    { id: 'demo', label: this.page().demoTitle },
    { id: 'results', label: this.t().resultsTitle },
    { id: 'method', label: this.t().methodTitle },
  ]);

  /** ROUGE-L of every evaluated answer set, best first. */
  readonly bars = computed<ResultBar[]>(() => {
    const t = this.t();
    return (this.patents()?.rows ?? [])
      .filter((r) => r.status === 'done' && r.qaRougeL != null)
      .map((r) => ({
        label: r.stage === 'baseline' ? (t.baselines[r.model] ?? r.model) : (MODEL_NAMES[r.model] ?? r.model),
        detail: t.stages[r.stage] ?? r.stage,
        value: r.qaRougeL!,
        baseline: r.stage === 'baseline',
      }))
      .sort((a, b) => b.value - a.value);
  });

  constructor() {
    afterNextRender(() => {
      this.data.patents().subscribe({ next: (d) => this.patents.set(d), error: () => this.failed.set(true) });
    });
  }
}
