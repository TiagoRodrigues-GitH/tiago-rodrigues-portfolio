import { Component, Input } from '@angular/core';

export type ProjectFigureKind = 'fleet' | 'llm';

/**
 * Animated blueprint schematics for project cards, in the style of the ADAS figure:
 * outlines draw in once (under 3 s, WCAG 2.2.2) and replay on hover; nothing moves with
 * prefers-reduced-motion. Decorative strokes only; the meaning is in the label (alt text).
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

  /** Rows of the database cylinder (fleet) and pins of the chip (llm), for staggered reveals. */
  readonly dbRows = [0, 1, 2, 3];
  readonly pins = [0, 1, 2, 3, 4, 5];
}
