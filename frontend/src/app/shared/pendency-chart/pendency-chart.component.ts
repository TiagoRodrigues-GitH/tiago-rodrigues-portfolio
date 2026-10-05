import { Component, Input, signal } from '@angular/core';
import { Locale } from '../../services/i18n.service';

/** WIPO, World Intellectual Property Indicators 2017 (annex S2) and 2025 (fig. A48): months to final decision. */
const DATA = [
  { key: 'br', y2016: 95.4, y2024: 38.4 },
  { key: 'us', y2016: 22.6, y2024: 29.5 },
  { key: 'epo', y2016: 23.3, y2024: 24.9 },
  { key: 'cn', y2016: 22.0, y2024: 15.5 },
  { key: 'jp', y2016: 15.0, y2024: 12.9 },
] as const;

const TEXT: Record<Locale, { title: string; names: Record<string, string>; source: string; decimal: string; months: string }> = {
  pt: {
    title: 'Tempo médio até a decisão final de um pedido de patente (meses)',
    names: { br: 'Brasil (INPI)', us: 'EUA (USPTO)', epo: 'Europa (EPO)', cn: 'China (CNIPA)', jp: 'Japão (JPO)' },
    source: 'Fonte: OMPI, World Intellectual Property Indicators 2017 e 2025. Contagem a partir do pedido de exame (ou do depósito).',
    decimal: ',',
    months: 'meses',
  },
  en: {
    title: 'Average time to a final decision on a patent application (months)',
    names: { br: 'Brazil (INPI)', us: 'US (USPTO)', epo: 'Europe (EPO)', cn: 'China (CNIPA)', jp: 'Japan (JPO)' },
    source: 'Source: WIPO, World Intellectual Property Indicators 2017 and 2025. Counted from the examination request (or filing).',
    decimal: '.',
    months: 'months',
  },
  de: {
    title: 'Mittlere Dauer bis zur Entscheidung über Patentanmeldungen (Monate)',
    names: { br: 'Brasilien (INPI)', us: 'USA (USPTO)', epo: 'Europa (EPA)', cn: 'China (CNIPA)', jp: 'Japan (JPO)' },
    source: 'Quelle: WIPO, World Intellectual Property Indicators 2017 und 2025. Gezählt ab Prüfungsantrag (oder Anmeldung).',
    decimal: ',',
    months: 'Monate',
  },
};

/**
 * Bar chart of patent pendency; the bars grow as the chart scrolls into view (CSS only).
 * Pointing at an office highlights its bars and shows the 2016 → 2024 change.
 */
@Component({
  selector: 'app-pendency-chart',
  standalone: false,
  templateUrl: './pendency-chart.component.html',
  styleUrls: ['./pendency-chart.component.css'],
})
export class PendencyChartComponent {
  @Input({ required: true }) locale!: Locale;
  @Input({ required: true }) description!: string;

  readonly ticks = [0, 25, 50, 75, 100];
  readonly x0 = 70;
  readonly x1 = 930;
  readonly top = 90;
  readonly base = 430;
  readonly barWidth = 46;
  readonly groupWidth = (this.x1 - this.x0) / DATA.length;

  readonly active = signal<number | null>(null);
  /** Last office pointed at: the floating label keeps its text while it fades out. */
  readonly shown = signal(0);

  point(index: number): void {
    this.active.set(index);
    this.shown.set(index);
  }

  /** "95,4 → 38,4 meses (−60%)": the 2016 → 2024 change for one office. */
  change(index: number): string {
    const d = DATA[index];
    const pct = Math.round(((d.y2024 - d.y2016) / d.y2016) * 100);
    const sign = pct > 0 ? '+' : pct < 0 ? '−' : '';
    return `${this.fmt(d.y2016)} → ${this.fmt(d.y2024)} ${this.t.months} (${sign}${Math.abs(pct)}%)`;
  }

  get t() {
    return TEXT[this.locale];
  }

  get bars() {
    const group = (this.x1 - this.x0) / DATA.length;
    return DATA.map((d, i) => {
      const cx = this.x0 + group * (i + 0.5);
      return {
        name: this.t.names[d.key],
        cx,
        old: { x: cx - this.barWidth - 4, y: this.y(d.y2016), h: this.base - this.y(d.y2016), label: this.fmt(d.y2016) },
        now: { x: cx + 4, y: this.y(d.y2024), h: this.base - this.y(d.y2024), label: this.fmt(d.y2024) },
        i,
      };
    });
  }

  y(value: number): number {
    return this.base - ((this.base - this.top) * value) / 100;
  }

  private fmt(value: number): string {
    return value.toFixed(1).replace('.', this.t.decimal);
  }
}
