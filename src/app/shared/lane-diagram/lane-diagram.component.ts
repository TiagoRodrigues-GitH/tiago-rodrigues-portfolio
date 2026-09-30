import { Component, Input } from '@angular/core';
import { HomeTranslations } from '../../services/i18n.service';

const HORIZON = 90;
const BOTTOM = 320;
const SLOPE = 125 / (BOTTOM - HORIZON);

/** Road in perspective with row anchors: on each row, one cell per lane is selected (UFLD-style). */
@Component({
  selector: 'app-lane-diagram',
  standalone: false,
  templateUrl: './lane-diagram.component.html',
  styleUrls: ['./lane-diagram.component.css'],
})
export class LaneDiagramComponent {
  @Input({ required: true }) labels!: HomeTranslations['laneDiagram'];
  @Input({ required: true }) description!: string;

  readonly rows = [130, 160, 190, 220, 250, 280, 310].map((y) => {
    const offset = (y - HORIZON) * SLOPE;
    return { y, left: 295 - offset, right: 305 + offset };
  });

  readonly leftLane = this.polyline('left');
  readonly rightLane = this.polyline('right');

  private polyline(side: 'left' | 'right'): string {
    return this.rows.map((row) => `${row[side].toFixed(1)},${row.y}`).join(' ');
  }
}
