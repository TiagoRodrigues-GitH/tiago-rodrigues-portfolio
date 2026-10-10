import { Component, Input } from '@angular/core';
import { MODEL_NAMES, NhtsaData, NhtsaRow, PatentData, PatentRow } from './lab-data';
import { LabTranslations } from './lab-i18n';

/** Benchmark table of one study (triage or patents); models still in the GPU queue are listed as such. */
@Component({
  selector: 'app-lab-results',
  templateUrl: './lab-results.html',
  styleUrls: ['./lab-results.css'],
})
export class LabResultsComponent {
  @Input({ required: true }) show: 'nhtsa' | 'patents' = 'nhtsa';
  @Input() patents: PatentData | null = null;
  @Input() nhtsa: NhtsaData | null = null;
  @Input({ required: true }) t!: LabTranslations;
  @Input({ required: true }) lang = 'pt-BR';
  @Input() notes: string[] = [];

  name(row: PatentRow | NhtsaRow): string {
    return row.stage === 'baseline' ? (this.t.baselines[row.model] ?? row.model) : (MODEL_NAMES[row.model] ?? row.model);
  }

  stage(row: PatentRow | NhtsaRow): string {
    return this.t.stages[row.stage] ?? row.stage;
  }

  status(row: PatentRow | NhtsaRow): string {
    return this.t.status[row.status] ?? row.status;
  }

  score(value: number | null | undefined): string {
    return value == null ? '–' : new Intl.NumberFormat(this.lang, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);
  }

  percent(value: number | null | undefined): string {
    return value == null ? '–' : new Intl.NumberFormat(this.lang, { style: 'percent', maximumFractionDigits: 0 }).format(value);
  }

  speed(value: number | null | undefined): string {
    return value == null ? '–' : new Intl.NumberFormat(this.lang, { maximumFractionDigits: value < 10 ? 1 : 0 }).format(value);
  }
}
