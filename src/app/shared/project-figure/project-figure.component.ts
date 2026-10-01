import { Component, Input, signal } from '@angular/core';
import { Locale } from '../../services/i18n.service';

export type ProjectFigureKind = 'fleet' | 'llm';

/** What each numbered callout points at, per figure and language. */
const CALLOUTS: Record<ProjectFigureKind, Record<Locale, string[]>> = {
  fleet: {
    pt: ['Carro de passeio (classe Passeio)', 'Veículo de carga (classe Carga)', 'Ficha do veículo: placa Mercosul e atributos', 'Repositório de veículos (BDVeiculos)'],
    en: ['Passenger car (Passeio class)', 'Cargo vehicle (Carga class)', 'Vehicle record: Mercosur plate and attributes', 'Vehicle repository (BDVeiculos)'],
    de: ['Pkw (Klasse Passeio)', 'Lastfahrzeug (Klasse Carga)', 'Fahrzeugdatenblatt: Mercosur-Kennzeichen und Attribute', 'Fahrzeug-Repository (BDVeiculos)'],
  },
  llm: {
    pt: ['Documentos técnicos: normas e diagnóstico', 'Modelo compacto quantizado (INT8) em hardware embarcado', 'Resposta para o técnico ou engenheiro'],
    en: ['Technical documents: standards and diagnostics', 'Compact quantised model (INT8) on embedded hardware', 'Answer for the technician or engineer'],
    de: ['Technische Dokumente: Normen und Diagnose', 'Kompaktes quantisiertes Modell (INT8) auf Embedded-Hardware', 'Antwort für Techniker oder Ingenieur'],
  },
};

/**
 * Animated blueprint schematics for project cards, in the style of the ADAS figure:
 * outlines draw in once (under 3 s, WCAG 2.2.2) and replay on hover; nothing moves with
 * prefers-reduced-motion. Pointing at a numbered callout highlights its part and names it.
 * Decorative strokes only; the meaning is in the label (alt text).
 */
@Component({
  selector: 'app-project-figure',
  standalone: false,
  templateUrl: './project-figure.component.html',
  styleUrls: ['./project-figure.component.css'],
})
export class ProjectFigureComponent {
  @Input({ required: true }) kind!: ProjectFigureKind;
  @Input({ required: true }) label!: string;
  @Input() locale: Locale = 'pt';

  /** Rows of the database cylinder (fleet) and pins of the chip (llm), for staggered reveals. */
  readonly dbRows = [0, 1, 2, 3];
  readonly pins = [0, 1, 2, 3, 4, 5];

  readonly active = signal<number | null>(null);
  /** Last callout pointed at: the floating label keeps its text while it fades out. */
  readonly shown = signal(0);

  get callouts(): string[] {
    return CALLOUTS[this.kind][this.locale];
  }

  point(index: number): void {
    this.active.set(index);
    this.shown.set(index);
  }
}
