import { Component, Input, signal } from '@angular/core';
import { HomeTranslations, Locale } from '../../services/i18n.service';

const HORIZON = 90;
const BOTTOM = 320;
const SLOPE = 125 / (BOTTOM - HORIZON);

/** What each numbered callout explains: horizon, anchor rows, selected cells, fitted lane. */
const CALLOUTS: Record<Locale, string[]> = {
  pt: [
    'Horizonte: acima dele não há faixa a procurar',
    'Linhas de referência: a imagem só é lida nessas linhas',
    'Em cada linha, o modelo escolhe uma célula por faixa (classificação)',
    'Os pontos escolhidos, ligados, formam a faixa detectada',
  ],
  en: [
    'Horizon: there are no lanes to look for above it',
    'Reference rows: the image is read only along these rows',
    'On each row, the model picks one cell per lane (classification)',
    'Joined together, the chosen points form the detected lane',
  ],
  de: [
    'Horizont: darüber gibt es keine Fahrspur zu suchen',
    'Referenzzeilen: Das Bild wird nur entlang dieser Zeilen gelesen',
    'In jeder Zeile wählt das Modell eine Zelle pro Spur (Klassifikation)',
    'Verbunden ergeben die gewählten Punkte die erkannte Spur',
  ],
};

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
  @Input() locale: Locale = 'pt';

  readonly rows = [130, 160, 190, 220, 250, 280, 310].map((y) => {
    const offset = (y - HORIZON) * SLOPE;
    return { y, left: 295 - offset, right: 305 + offset };
  });

  readonly leftLane = this.polyline('left');
  readonly rightLane = this.polyline('right');

  readonly balloons = [
    { n: 1, x: 114, y: 76 },
    { n: 2, x: 588, y: 145 },
    { n: 3, x: 452, y: 296 },
    { n: 4, x: 166, y: 184 },
  ];

  readonly active = signal<number | null>(null);
  /** Last callout pointed at: the floating label keeps its text while it fades out. */
  readonly shown = signal(0);

  get callouts(): string[] {
    return CALLOUTS[this.locale];
  }

  point(index: number): void {
    this.active.set(index);
    this.shown.set(index);
  }

  private polyline(side: 'left' | 'right'): string {
    return this.rows.map((row) => `${row[side].toFixed(1)},${row.y}`).join(' ');
  }
}
