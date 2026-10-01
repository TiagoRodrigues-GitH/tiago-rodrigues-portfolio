import { Component, Input, signal } from '@angular/core';
import { BlueprintPart } from './blueprint-parts';

/**
 * A raster blueprint drawing made interactive in the style of the ADAS figure: numbered
 * callouts over the drawing, an optional parts list, and pointing at a part (callout or
 * list item) highlights it while the rest dims. Visual only; the alt text carries the content.
 */
@Component({
  selector: 'app-blueprint-figure',
  standalone: false,
  templateUrl: './blueprint-figure.component.html',
  styleUrls: ['./blueprint-figure.component.css'],
})
export class BlueprintFigureComponent {
  @Input({ required: true }) src!: string;
  @Input({ required: true }) width!: number;
  @Input({ required: true }) height!: number;
  @Input({ required: true }) alt!: string;
  @Input() parts: BlueprintPart[] = [];
  @Input() legend = false;
  /** How the image fills its box: 'contain' (whole drawing) or 'cover-top' (cards cropped from the top). */
  @Input() fit: 'contain' | 'cover-top' = 'contain';
  /** Draw the blueprint frame (registration marks) around the drawing; off inside cards that are frames. */
  @Input() framed = true;

  readonly active = signal<number | null>(null);

  get aspect(): string {
    return this.fit === 'contain' ? 'xMidYMid meet' : 'xMidYMin slice';
  }

  get radius(): number {
    return Math.round(Math.min(this.width, this.height) * 0.045);
  }
}
