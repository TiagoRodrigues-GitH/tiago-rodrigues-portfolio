import { Component, Input, afterNextRender, signal } from '@angular/core';

export interface ResultBar {
  label: string;
  detail: string;
  value: number; // 0..1
  baseline: boolean;
}

/**
 * Horizontal bars of one score per model (0 to 1), growing in once they are drawn; the numbers are printed, so
 * the chart needs no legend, and the table below it remains the full record.
 */
@Component({
  selector: 'app-result-bars',
  template: `
    <figure class="rb">
      <figcaption class="rb-title">{{ title }}</figcaption>
      <ul class="rb-list">
        @for (bar of bars; track bar.label + bar.detail) {
          <li [class.baseline]="bar.baseline">
            <span class="rb-label">{{ bar.label }} <small>{{ bar.detail }}</small></span>
            <span class="rb-track" aria-hidden="true"><span class="rb-fill" [style.width.%]="grown() ? bar.value * 100 : 0"></span></span>
            <span class="rb-value">{{ format(bar.value) }}</span>
          </li>
        }
      </ul>
    </figure>
  `,
  styles: [`
    .rb { margin: 0 0 1.25rem; }
    .rb-title { margin-bottom: 0.6rem; font-weight: 600; }
    .rb-list { display: grid; gap: 0.45rem; margin: 0; padding: 0; list-style: none; }
    .rb-list li { display: grid; grid-template-columns: minmax(9rem, 14rem) 1fr 3.5rem; gap: 0.6rem; align-items: center; font-size: 0.9rem; }
    .rb-label small { display: block; color: var(--text-muted); font-size: 0.78rem; }
    .rb-track { height: 0.8rem; border-radius: 4px; background: var(--surface-muted); overflow: hidden; }
    .rb-fill { display: block; height: 100%; border-radius: 0 4px 4px 0; background: var(--accent); transition: width 900ms cubic-bezier(.2,.7,.2,1); }
    .baseline .rb-fill { background: var(--border-input); }
    .rb-value { font-family: var(--font-mono); text-align: right; }
    @media (max-width: 560px) { .rb-list li { grid-template-columns: 1fr 3.2rem; } .rb-track { grid-column: 1 / -1; grid-row: 2; } }
    @media (prefers-reduced-motion: reduce) { .rb-fill { transition: none; } }
  `],
})
export class ResultBarsComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) bars: ResultBar[] = [];
  @Input() lang = 'pt-BR';
  readonly grown = signal(false);

  constructor() {
    afterNextRender(() => requestAnimationFrame(() => this.grown.set(true)));
  }

  format(v: number): string {
    return new Intl.NumberFormat(this.lang, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(v);
  }
}
