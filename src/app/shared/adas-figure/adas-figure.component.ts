import { Component, Input } from '@angular/core';
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

  get parts(): string[] {
    const l = this.labels;
    return [l.camera, l.radar, l.rearRadar, l.ultrasonic, l.ecu, l.bus];
  }
}
