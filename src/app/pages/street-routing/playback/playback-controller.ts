import { signal } from '@angular/core';
import { DEFAULT_SPEED_LEVEL, PlaybackClock, PlayerDelta, SPEEDS, SearchPlayer } from '../engine/search-player';
import { RouteResult } from '../engine/search-trace';

/** Draws a replay: the map of a city, or the diagram of the one-way demo. */
export interface TraceRenderer {
  /** Removes every mark of a previous replay. */
  reset(): void;
  apply(delta: PlayerDelta): void;
  /** The replay ended: draw the route found (or nothing, when there is none). */
  finish(result: RouteResult): void;
}

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'done';

export interface PlaybackProgress {
  step: number;
  total: number;
  visited: number;
  frontier: number;
  edges: number;
  /** Distance label of the last node expanded, or the best length so far (metres). */
  label: number;
  kind: 'search' | 'candidates';
}

const EMPTY: PlaybackProgress = { step: 0, total: 0, visited: 0, frontier: 0, edges: 0, label: NaN, kind: 'search' };

/**
 * Play, pause, step, restart and speed of a replay. The algorithm has already finished (in the worker); this only
 * decides how many recorded steps to draw per animation frame, so drawing can never slow the computation down.
 */
export class PlaybackController {
  readonly status = signal<PlaybackStatus>('idle');
  readonly progress = signal<PlaybackProgress>(EMPTY);
  readonly speed = signal(DEFAULT_SPEED_LEVEL);
  readonly result = signal<RouteResult | null>(null);

  private player: SearchPlayer | null = null;
  private renderer: TraceRenderer | null = null;
  private readonly clock = new PlaybackClock();
  private frame = 0;
  private last = 0;

  /** Defaults to the browser's animation frames; on the server (prerendering) there are none and nothing plays. */
  constructor(
    private readonly requestFrame: (cb: (now: number) => void) => number =
      (cb) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(cb) : 0),
    private readonly cancelFrame: (id: number) => void =
      (id) => (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame(id) : undefined),
  ) {}

  get stepsPerSecond(): number {
    return SPEEDS[this.speed()];
  }

  load(result: RouteResult, player: SearchPlayer, renderer: TraceRenderer, autoplay = true): void {
    this.stop();
    if (this.renderer && this.renderer !== renderer) this.renderer.reset(); // a renderer of another graph
    this.player = player;
    this.renderer = renderer;
    this.result.set(result);
    renderer.reset();
    this.clock.reset();
    this.publish();
    this.status.set('paused');
    if (player.total === 0) this.advance(0); // nothing to replay (no route reachable, or origin = destination)
    else if (autoplay) this.play();
  }

  play(): void {
    if (!this.player) return;
    if (this.player.done) {
      this.restart();
      return;
    }
    this.status.set('playing');
    this.last = 0;
    this.cancelFrame(this.frame);
    this.frame = this.requestFrame(this.tick);
  }

  pause(): void {
    if (this.status() !== 'playing') return;
    this.stop();
    this.status.set('paused');
  }

  toggle(): void {
    if (this.status() === 'playing') this.pause();
    else this.play();
  }

  /** One step forward, paused (to read what a single expansion does). */
  stepOnce(): void {
    if (!this.player || this.player.done) return;
    this.pause();
    this.advance(1);
  }

  restart(): void {
    if (!this.player || !this.renderer) return;
    this.stop();
    this.player.reset();
    this.renderer.reset();
    this.clock.reset();
    this.publish();
    this.status.set('paused');
    this.play();
  }

  skipToEnd(): void {
    if (!this.player || this.player.done) return;
    this.stop();
    this.advance(this.player.total);
  }

  setSpeed(level: number): void {
    this.clock.setLevel(level);
    this.speed.set(Math.max(0, Math.min(SPEEDS.length - 1, Math.round(level))));
  }

  /** Forgets the replay and its drawing. */
  clear(): void {
    this.stop();
    this.renderer?.reset();
    this.player = null;
    this.renderer = null;
    this.result.set(null);
    this.progress.set(EMPTY);
    this.status.set('idle');
  }

  private stop(): void {
    this.cancelFrame(this.frame);
    this.frame = 0;
  }

  private readonly tick = (now: number): void => {
    const elapsed = this.last ? now - this.last : 0;
    this.last = now;
    const steps = this.clock.tick(elapsed);
    if (steps) this.advance(steps);
    if (this.status() === 'playing') this.frame = this.requestFrame(this.tick);
  };

  private advance(n: number): void {
    const player = this.player!;
    this.renderer!.apply(player.advance(n));
    this.publish();
    if (player.done) {
      this.stop();
      this.status.set('done');
      this.renderer!.finish(this.result()!);
    }
  }

  private publish(): void {
    const p = this.player;
    if (!p) return;
    this.progress.set({
      step: p.step, total: p.total, visited: p.visitedSize, frontier: p.frontierSize, edges: p.evaluatedEdges,
      label: p.label, kind: p.trace.kind,
    });
  }
}
