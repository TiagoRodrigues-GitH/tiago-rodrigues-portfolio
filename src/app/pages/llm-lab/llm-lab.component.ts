import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { I18nService } from '../../services/i18n.service';
import { injectLangQuery, injectLocale } from '../../services/locale';
import { DefectTriageComponent } from './defect-triage.component';
import { LabDataService, NhtsaData, PatentData } from './lab-data';
import { LAB_I18N } from './lab-i18n';
import { LabResultsComponent } from './lab-results.component';
import { PatentReplayComponent } from './patent-replay.component';

/**
 * Demo of project 02 (compact LLMs): replays the real test answers of the patent assistant, classifies defect
 * complaints in the browser and shows the benchmark tables. Standalone and lazy-loaded; the data files are
 * fetched in the browser only, so the prerendered page carries the text and the data arrives after hydration.
 */
@Component({
  selector: 'app-llm-lab',
  imports: [RouterLink, PatentReplayComponent, DefectTriageComponent, LabResultsComponent],
  templateUrl: './llm-lab.html',
  styleUrls: ['./llm-lab.css'],
})
export class LlmLabComponent {
  private readonly data = inject(LabDataService);
  private readonly i18n = inject(I18nService);

  readonly locale = injectLocale();
  readonly langQuery = injectLangQuery(this.locale);
  readonly t = computed(() => LAB_I18N[this.locale()]);
  readonly lang = computed(() => this.i18n.option(this.locale()).htmlLang);

  readonly patents = signal<PatentData | null>(null);
  readonly nhtsa = signal<NhtsaData | null>(null);
  readonly failed = signal(false);

  readonly updated = computed(() => {
    const iso = this.patents()?.generated;
    if (!iso) {
      return '';
    }
    const date = new Intl.DateTimeFormat(this.lang(), { dateStyle: 'long' }).format(new Date(`${iso}T12:00:00`));
    return this.t().updated.replace('{date}', date);
  });

  readonly sections = computed(() => [
    { id: 'patents', label: this.t().patentsTitle },
    { id: 'triage', label: this.t().triageTitle },
    { id: 'results', label: this.t().resultsTitle },
    { id: 'method', label: this.t().methodTitle },
  ]);

  constructor() {
    afterNextRender(() => {
      forkJoin([this.data.patents(), this.data.nhtsa()]).subscribe({
        next: ([patents, nhtsa]) => {
          this.patents.set(patents);
          this.nhtsa.set(nhtsa);
        },
        error: () => this.failed.set(true),
      });
    });
  }
}
