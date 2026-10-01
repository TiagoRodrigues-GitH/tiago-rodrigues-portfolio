import { Component, Input } from '@angular/core';
import { Locale } from '../../services/i18n.service';

/** WIPO, World Intellectual Property Indicators 2017 (annex S2) and 2025 (fig. A48): months to final decision. */
const DATA = [
  { key: 'br', y2016: 95.4, y2024: 38.4 },
  { key: 'us', y2016: 22.6, y2024: 29.5 },
  { key: 'epo', y2016: 23.3, y2024: 24.9 },
  { key: 'cn', y2016: 22.0, y2024: 15.5 },
  { key: 'jp', y2016: 15.0, y2024: 12.9 },
] as const;

const TEXT: Record<Locale, { title: string; names: Record<string, string>; source: string; decimal: string }> = {
  pt: {
    title: 'Tempo médio até a decisão final de um pedido de patente (meses)',
    names: { br: 'Brasil (INPI)', us: 'EUA (USPTO)', epo: 'Europa (EPO)', cn: 'China (CNIPA)', jp: 'Japão (JPO)' },
    source: 'Fonte: OMPI, World Intellectual Property Indicators 2017 e 2025. Contagem a partir do pedido de exame (ou do depósito).',
    decimal: ',',
  },
  en: {
    title: 'Average time to a final decision on a patent application (months)',
    names: { br: 'Brazil (INPI)', us: 'US (USPTO)', epo: 'Europe (EPO)', cn: 'China (CNIPA)', jp: 'Japan (JPO)' },
    source: 'Source: WIPO, World Intellectual Property Indicators 2017 and 2025. Counted from the examination request (or filing).',
    decimal: '.',
  },
  de: {
    title: 'Mittlere Dauer bis zur Entscheidung über Patentanmeldungen (Monate)',
    names: { br: 'Brasilien (INPI)', us: 'USA (USPTO)', epo: 'Europa (EPA)', cn: 'China (CNIPA)', jp: 'Japan (JPO)' },
    source: 'Quelle: WIPO, World Intellectual Property Indicators 2017 und 2025. Gezählt ab Prüfungsantrag (oder Anmeldung).',
    decimal: ',',
  },
};

/** Bar chart of patent pendency; the bars grow as the chart scrolls into view (CSS only). */
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
