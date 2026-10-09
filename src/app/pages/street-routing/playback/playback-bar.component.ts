import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SPEEDS } from '../engine/search-player';
import { StreetTranslations } from '../street-i18n';
import { PlaybackProgress, PlaybackStatus } from './playback-controller';

/**
 * Run, play/pause, single step, restart, skip to the end and speed of a replay, with its progress. Stateless: the
 * page (or the one-way demo) owns the PlaybackController and passes its signals in.
 */
@Component({
  selector: 'app-playback-bar',
  templateUrl: './playback-bar.html',
  styleUrls: ['./playback-bar.css'],
})
export class PlaybackBarComponent {
  @Input({ required: true }) t!: StreetTranslations;
  @Input({ required: true }) locale = 'pt-BR';
  @Input({ required: true }) status: PlaybackStatus = 'idle';
  @Input({ required: true }) progress!: PlaybackProgress;
  @Input({ required: true }) speed = 0;
  @Input() computing = false;
  @Input() canRun = false;
  @Input() idPrefix = 'sr';

  @Output() readonly run = new EventEmitter<void>();
  @Output() readonly toggle = new EventEmitter<void>();
  @Output() readonly step = new EventEmitter<void>();
  @Output() readonly restart = new EventEmitter<void>();
  @Output() readonly skip = new EventEmitter<void>();
  @Output() readonly speedChange = new EventEmitter<number>();

  readonly maxLevel = SPEEDS.length - 1;

  get loaded(): boolean {
    return this.status !== 'idle';
  }

  get toggleLabel(): string {
    if (this.status === 'playing') return this.t.pause;
    if (this.status === 'done') return this.t.replay;
    return this.progress.step > 0 ? this.t.resume : this.t.play;
  }

  get toggleIcon(): string {
    return this.status === 'playing' ? '❚❚' : this.status === 'done' ? '↻' : '▶';
  }

  speedText(level: number): string {
    return this.t.speedValue.replace('{n}', SPEEDS[level].toLocaleString(this.locale));
  }

  number(n: number): string {
    return n.toLocaleString(this.locale);
  }

  get progressText(): string {
    return this.t.progress.replace('{step}', this.number(this.progress.step)).replace('{total}', this.number(this.progress.total));
  }

  get labelText(): string {
    const m = this.progress.label;
    if (!Number.isFinite(m)) return '';
    const value = `${(m / 1000).toLocaleString(this.locale, { maximumFractionDigits: 2 })} km`;
    return `${this.progress.kind === 'search' ? this.t.labelSearch : this.t.labelBest}: ${value}`;
  }
}
