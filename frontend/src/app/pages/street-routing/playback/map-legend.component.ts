import { Component, Input } from '@angular/core';
import { LegendText } from '../street-i18n';

type LegendKey = keyof LegendText;

const MAP_ITEMS: LegendKey[] = ['street', 'evaluated', 'frontier', 'visited', 'backward', 'candidate', 'best', 'route', 'link', 'origin', 'destination'];
const DEMO_ITEMS: LegendKey[] = ['street', 'oneway', 'evaluated', 'frontier', 'visited', 'backward', 'candidate', 'best', 'route', 'origin', 'destination'];

/** What each colour and shape of a replay means; every state differs by shape too (line, dash, ring, dot). */
@Component({
  selector: 'app-map-legend',
  template: `
    <div class="lg">
      <p class="lg-title mono-label">{{ title }}</p>
      <ul class="lg-list">
        @for (key of items; track key) {
          <li><span [class]="'lg-sw lg-' + key" aria-hidden="true"></span>{{ text[key] }}</li>
        }
      </ul>
    </div>
  `,
  styleUrls: ['./map-legend.css'],
})
export class MapLegendComponent {
  @Input({ required: true }) text!: LegendText;
  @Input({ required: true }) title = '';
  @Input() variant: 'map' | 'demo' = 'map';

  get items(): LegendKey[] {
    return this.variant === 'map' ? MAP_ITEMS : DEMO_ITEMS;
  }
}
