import { Component, Input, signal } from '@angular/core';
import { HomeTranslations } from '../../services/i18n.service';

/** Blueprint side view of a generic (brand-free) vehicle with its ADAS sensor layout. */
@Component({
  selector: 'app-adas-figure',
  standalone: false,
  templateUrl: './adas-figure.component.html',
  styleUrls: ['./adas-figure.component.css'],
})
export class AdasFigureComponent {
  @Input({ required: true }) labels!: HomeTranslations['figure'];

  /** Part under the pointer (list item or callout): highlights it on the drawing. Visual only. */
  readonly active = signal<number | null>(null);

  readonly balloons = [
    { n: 1, x: 650, y: 56 },
    { n: 2, x: 872, y: 340 },
    { n: 3, x: 70, y: 150 },
    { n: 4, x: 80, y: 350 },
    { n: 5, x: 476, y: 356 },
    { n: 6, x: 330, y: 356 },
  ];

  get parts(): string[] {
    const l = this.labels;
    return [l.camera, l.radar, l.rearRadar, l.ultrasonic, l.ecu, l.bus];
  }
}
