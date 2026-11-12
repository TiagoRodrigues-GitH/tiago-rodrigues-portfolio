import {
  Component, ElementRef, OnDestroy, ViewChild, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectLangQuery, injectLocale } from '../../services/locale';
import {
  Cell, Direction, FRUIT_POINTS, FruitKind, GameState, JAGUAR_LEVEL, OBSTACLE_LEVEL, Speed, createGame, step, stepInterval, turn,
} from './capivara-engine';
import { CAPIVARA_TEXT } from './capivara-i18n';
import { SpriteName, loadSprites } from './capivara-sprites';

const SPEED_KEY = 'trilha-da-capivara:ritmo';
const OPPOSITE: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };

/** Colours of the Brazilian flag, plus the field and the animals. */
const COLOR = {
  green: '#009c3b',
  yellow: '#ffdf00',
  blue: '#002776',
  white: '#ffffff',
  grassA: '#0b8f3e',
  grassB: '#088437',
  river: '#1f6fb2',
  capybara: '#8a5a33',
  capybaraDark: '#5e3b1f',
  pup: '#a5703f',
  jaguar: '#e8a23a',
  spot: '#3a2812',
  acai: '#4b1d52',
  caju: '#e8562a',
  cajuNut: '#9b8770',
  jabuticaba: '#2a0e2d',
};

/** Logical canvas is 480 × 480: a river margin of 24 px around a 432 px field. */
const MARGIN = 24;
const PLAY = 480 - 2 * MARGIN;

const BEST_KEY = 'trilha-da-capivara:recorde';
/** 16 × 16 cells: big enough to see the animals on a phone. */
const GRID = 16;
const KEYS: Record<string, Direction> = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
};

type Phase = 'ready' | 'running' | 'paused' | 'over';

/**
 * "Trilha da Capivara": a snake-like game with a Brazilian theme. The rules live in capivara-engine.ts;
 * this component only draws the state on a canvas and turns keys, buttons and swipes into turns.
 */
@Component({
  selector: 'app-capybara-game',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './capybara-game.html',
  styleUrls: ['./capybara-game.css'],
})
export class CapybaraGameComponent implements OnDestroy {
  @ViewChild('board') private boardRef?: ElementRef<HTMLCanvasElement>;

  private readonly document = inject(DOCUMENT);
  readonly locale = injectLocale();
  readonly langQuery = injectLangQuery(this.locale);
  readonly t = computed(() => CAPIVARA_TEXT[this.locale()]);
  readonly fruitKinds: FruitKind[] = ['acai', 'caju', 'jabuticaba'];
  readonly points = FRUIT_POINTS;

  readonly state = signal<GameState>(createGame(GRID, GRID, 1));
  readonly phase = signal<Phase>('ready');
  readonly best = signal(0);
  /** Short message for screen readers (aria-live). */
  readonly announcement = signal('');
  readonly speed = signal<Speed>('normal');
  readonly speeds: Speed[] = ['slow', 'normal', 'fast'];

  private ctx: CanvasRenderingContext2D | null = null;
  private sprites: Partial<Record<SpriteName, HTMLImageElement>> = {};
  private spritesReady = false;
  /** State before the last step and when that step happened: animals glide between cells. */
  private previous: GameState | null = null;
  private lastStepAt = 0;
  private frame: number | null = null;
  /** Turns pressed faster than the game steps (at most two), applied one per step. */
  private turnBuffer: Direction[] = [];
  /** Which way the capybara looks while walking up or down (keeps the last horizontal heading). */
  private facing: 'left' | 'right' = 'right';
  /** The field (grass, river, lily pads) changes only on resize, so it is drawn once and copied every frame. */
  private field: HTMLCanvasElement | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private touchStart: { x: number; y: number } | null = null;
  private readonly onKey = (event: KeyboardEvent) => this.handleKey(event);
  private readonly onResize = () => this.setupCanvas();

  constructor() {
    afterNextRender(() => {
      this.best.set(this.readBest());
      this.speed.set(this.readSpeed());
      this.sprites = loadSprites(this.document, () => {
        this.spritesReady = true;
        this.draw();
      });
      this.setupCanvas();
      this.document.addEventListener('keydown', this.onKey);
      this.document.defaultView?.addEventListener('resize', this.onResize);
      this.announcement.set(this.t().ready);
    });
  }

  ngOnDestroy(): void {
    this.stop();
    this.document.removeEventListener('keydown', this.onKey);
    this.document.defaultView?.removeEventListener('resize', this.onResize);
  }

  // ---- controls -----------------------------------------------------------------------------------------

  primary(): void {
    switch (this.phase()) {
      case 'ready': this.start(); break;
      case 'running': this.pause(); break;
      case 'paused': this.resume(); break;
      case 'over': this.restart(); break;
    }
  }

  primaryLabel(): string {
    const t = this.t();
    return { ready: t.start, running: t.pause, paused: t.resume, over: t.restart }[this.phase()];
  }

  press(direction: Direction): void {
    if (this.phase() === 'ready') this.start();
    else if (this.phase() === 'paused') this.resume();
    const s = this.state();
    if (s.queued === null && this.turnBuffer.length === 0) {
      this.state.set(turn(s, direction));
      return;
    }
    // A turn is already waiting for the next step: keep this one for the step after (tight U-turns).
    const last = this.turnBuffer[this.turnBuffer.length - 1] ?? s.queued ?? s.direction;
    if (this.turnBuffer.length < 2 && direction !== last && direction !== OPPOSITE[last]) {
      this.turnBuffer.push(direction);
    }
  }

  setSpeed(speed: Speed): void {
    this.speed.set(speed);
    try {
      localStorage.setItem(SPEED_KEY, speed);
    } catch {
      /* storage disabled */
    }
  }

  private readSpeed(): Speed {
    try {
      const v = localStorage.getItem(SPEED_KEY);
      return v === 'slow' || v === 'fast' ? v : 'normal';
    } catch {
      return 'normal';
    }
  }

  onPointerDown(event: PointerEvent): void {
    this.touchStart = { x: event.clientX, y: event.clientY };
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.touchStart) return;
    const dx = event.clientX - this.touchStart.x;
    const dy = event.clientY - this.touchStart.y;
    this.touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    this.press(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }

  private handleKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    const direction = KEYS[event.key];
    if (direction && this.phase() !== 'over') {
      event.preventDefault();
      this.press(direction);
    } else if (event.key === ' ') {
      event.preventDefault();
      this.primary();
    } else if (event.key === 'Enter' && this.phase() === 'over') {
      event.preventDefault();
      this.restart();
    }
  }

  // ---- game loop ----------------------------------------------------------------------------------------

  private start(): void {
    this.phase.set('running');
    this.announcement.set('');
    this.schedule();
  }

  private pause(): void {
    this.stop();
    this.phase.set('paused');
    this.announcement.set(this.t().paused);
    this.draw();
  }

  private resume(): void {
    this.phase.set('running');
    this.announcement.set('');
    this.schedule();
  }

  private restart(): void {
    this.stop();
    this.state.set(createGame(GRID, GRID, (Date.now() >>> 0) || 1));
    this.previous = null;
    this.turnBuffer = [];
    this.facing = 'right';
    this.start();
    this.draw();
  }

  private stop(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    if (this.frame !== null) this.document.defaultView?.cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  private interval(): number {
    return stepInterval(this.state().level, this.speed());
  }

  private schedule(): void {
    this.stop();
    this.lastStepAt = performance.now();
    this.timer = setTimeout(() => this.tick(), this.interval());
    this.animate();
  }

  /** Redraws every frame while running, so the animals glide from cell to cell. */
  private animate(): void {
    const win = this.document.defaultView;
    if (!win?.requestAnimationFrame) return;
    const loop = () => {
      this.draw();
      if (this.phase() === 'running') this.frame = win.requestAnimationFrame(loop);
    };
    this.frame = win.requestAnimationFrame(loop);
  }

  private tick(): void {
    const before = this.state();
    const after = step(before);
    this.previous = before;
    // Next buffered turn becomes the queued turn for the following step.
    let next = after;
    while (after.alive && this.turnBuffer.length && next.queued === null) {
      next = turn(after, this.turnBuffer.shift()!);
    }
    this.state.set(next);
    if (after.direction === 'left' || after.direction === 'right') this.facing = after.direction;
    if (after.eaten > before.eaten) this.announcement.set(`${this.t().score}: ${after.score}`);
    if (!before.jaguar && after.jaguar) this.announcement.set(this.t().jaguarWarning);
    if (before.level < OBSTACLE_LEVEL && after.level >= OBSTACLE_LEVEL) this.announcement.set(this.t().obstacleWarning);
    if (!after.alive) {
      this.stop();
      this.previous = null;
      this.phase.set('over');
      this.turnBuffer = [];
      if (after.score > this.best()) {
        this.best.set(after.score);
        this.writeBest(after.score);
      }
      this.announcement.set(`${this.t().over[after.cause ?? 'pups']} ${this.t().score}: ${after.score}.`);
      this.draw();
      return;
    }
    this.schedule();
  }

  private readBest(): number {
    try {
      return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      return 0;
    }
  }

  private writeBest(score: number): void {
    try {
      localStorage.setItem(BEST_KEY, String(score));
    } catch {
      /* private mode or storage disabled: the record lives only in this visit */
    }
  }

  // ---- drawing ------------------------------------------------------------------------------------------

  private setupCanvas(): void {
    const canvas = this.boardRef?.nativeElement;
    if (!canvas) return;
    const size = canvas.clientWidth || 480;
    const ratio = Math.min(3, this.document.defaultView?.devicePixelRatio ?? 1);
    canvas.width = Math.round(size * ratio);
    canvas.height = Math.round(size * ratio);
    this.ctx = canvas.getContext('2d');
    this.ctx?.setTransform((size * ratio) / 480, 0, 0, (size * ratio) / 480, 0, 0);
    this.field = this.document.createElement('canvas');
    this.field.width = canvas.width;
    this.field.height = canvas.height;
    const fctx = this.field.getContext('2d');
    if (fctx) {
      fctx.setTransform((size * ratio) / 480, 0, 0, (size * ratio) / 480, 0, 0);
      this.paintField(fctx);
    }
    this.draw();
  }

  /** Position between the cell of the previous step and the current one (no gliding across the wrap). */
  private glide(from: Cell | undefined, to: Cell, p: number): Cell {
    if (!from || Math.abs(from.x - to.x) > 1 || Math.abs(from.y - to.y) > 1) return to;
    return { x: from.x + (to.x - from.x) * p, y: from.y + (to.y - from.y) * p };
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const s = this.state();
    const prev = this.phase() === 'running' ? this.previous : null;
    const p = prev ? Math.min(1, (performance.now() - this.lastStepAt) / this.interval()) : 1;
    const cell = PLAY / s.width;
    ctx.clearRect(0, 0, 480, 480);
    if (this.field) ctx.drawImage(this.field, 0, 0, 480, 480);
    ctx.save();
    // Clip to the field: an animal crossing the edge disappears there and reappears on the other side.
    this.roundRect(ctx, MARGIN, MARGIN, PLAY, PLAY, 14);
    ctx.clip();
    ctx.translate(MARGIN, MARGIN);
    for (const o of s.obstacles) this.drawObstacle(ctx, o, cell);
    this.drawFruit(ctx, s.fruit.cell, s.fruit.kind, cell);
    const family = s.family.map((c, i) => this.glide(prev?.family[i] ?? prev?.family[prev.family.length - 1], c, p));
    for (let i = family.length - 1; i >= 1; i--) this.drawPup(ctx, family[i], s.family[i], s.family[i - 1], cell, i);
    this.drawCapybara(ctx, family[0], s.direction, cell);
    if (s.jaguar) this.drawJaguar(ctx, this.glide(prev?.jaguar ?? undefined, s.jaguar, p), s.family[0], cell);
    ctx.restore();
    if (this.phase() !== 'running') this.drawOverlay(ctx, s);
  }

  /** Draws a sprite centred on (cx, cy), mirrored when facing left, slightly tilted when walking up or down. */
  private sprite(ctx: CanvasRenderingContext2D, name: SpriteName, cx: number, cy: number, size: number, flip = false, tilt = 0): boolean {
    const img = this.spritesReady ? this.sprites[name] : undefined;
    if (!img) return false;
    ctx.save();
    ctx.translate(cx, cy);
    if (flip) ctx.scale(-1, 1);
    if (tilt) ctx.rotate(tilt);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
    return true;
  }

  private drawObstacle(ctx: CanvasRenderingContext2D, c: Cell, cell: number): void {
    const [cx, cy] = this.center(c, cell);
    const name: SpriteName = (c.x * 7 + c.y * 3) % 3 === 0 ? 'log' : 'rock';
    if (this.sprite(ctx, name, cx, cy, cell * 1.35)) return;
    ctx.fillStyle = '#7d848d';
    ctx.beginPath();
    ctx.ellipse(cx, cy, cell * 0.44, cell * 0.36, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /** Grass with light and blades, the flag's lozenge and circle in soft tones, a river with lily pads around it. */
  private paintField(ctx: CanvasRenderingContext2D): void {
    // River: the whole canvas, the field sits inside it.
    const water = ctx.createLinearGradient(0, 0, 480, 480);
    water.addColorStop(0, '#1b78c2');
    water.addColorStop(1, '#0d4f8f');
    ctx.fillStyle = water;
    ctx.fillRect(0, 0, 480, 480);
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 1.2;
    for (let k = 0; k < 18; k++) {
      const y = 4 + (k % 3) * 5;
      const x = (k * 53) % 460;
      for (const [ox, oy] of [[x, y], [x, 480 - y - 4], [y, x], [480 - y - 4, x]]) {
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.quadraticCurveTo(ox + 6, oy - 3, ox + 12, oy);
        ctx.stroke();
      }
    }
    // Field with a soft light in the centre.
    const grass = ctx.createRadialGradient(240, 220, 40, 240, 240, 300);
    grass.addColorStop(0, '#22b257');
    grass.addColorStop(1, '#0b7a36');
    ctx.fillStyle = grass;
    this.roundRect(ctx, MARGIN, MARGIN, PLAY, PLAY, 14);
    ctx.fill();
    // Dashed yellow edge: there are no walls, the family crosses to the other side.
    ctx.lineWidth = 3;
    ctx.strokeStyle = COLOR.yellow;
    ctx.setLineDash([10, 9]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.save();
    this.roundRect(ctx, MARGIN, MARGIN, PLAY, PLAY, 14);
    ctx.clip();
    // Faint cell grid, so turns are easy to judge.
    const cell = PLAY / GRID;
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        if ((x + y) % 2 === 0) ctx.fillRect(MARGIN + x * cell, MARGIN + y * cell, cell, cell);
      }
    }
    // Lozenge and circle in soft tones (a nod to the flag, not the flag itself).
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = COLOR.yellow;
    ctx.beginPath();
    ctx.moveTo(240, 70);
    ctx.lineTo(420, 240);
    ctx.lineTo(240, 410);
    ctx.lineTo(60, 240);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = COLOR.blue;
    ctx.beginPath();
    ctx.arc(240, 240, 78, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = COLOR.white;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(240, 330, 120, Math.PI * 1.28, Math.PI * 1.72);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // Grass blades from a fixed pattern (same on every visit).
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    ctx.strokeStyle = 'rgba(190,255,170,0.22)';
    ctx.lineWidth = 1;
    for (let k = 0; k < 260; k++) {
      const x = MARGIN + rnd() * PLAY;
      const y = MARGIN + rnd() * PLAY;
      const h = 3 + rnd() * 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rnd() - 0.5) * 3, y - h);
      ctx.stroke();
    }
    // Small flowers: yellow ipê petals scattered on the grass.
    for (let k = 0; k < 14; k++) {
      const x = MARGIN + 10 + rnd() * (PLAY - 20);
      const y = MARGIN + 10 + rnd() * (PLAY - 20);
      ctx.fillStyle = k % 3 === 0 ? '#ffd23f' : 'rgba(255,240,170,0.8)';
      for (let p = 0; p < 4; p++) {
        ctx.beginPath();
        ctx.arc(x + Math.cos((p * Math.PI) / 2) * 2, y + Math.sin((p * Math.PI) / 2) * 2, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    // Lily pads (vitória-régia) in the river corners.
    for (const [x, y, r] of [[14, 14, 11], [466, 16, 9], [16, 464, 9], [465, 465, 12], [240, 8, 6], [472, 240, 6]]) {
      ctx.fillStyle = '#2f9e44';
      ctx.beginPath();
      ctx.arc(x, y, r, 0.25, Math.PI * 2);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#7bd389';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0.25, Math.PI * 2);
      ctx.stroke();
    }
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private shadow(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number): void {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(cx + 2, cy + ry * 0.9, rx, ry * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private center(c: Cell, cell: number): [number, number] {
    return [c.x * cell + cell / 2, c.y * cell + cell / 2];
  }

  private drawFruit(ctx: CanvasRenderingContext2D, c: Cell, kind: FruitKind, cell: number): void {
    const [cx, cy] = this.center(c, cell);
    // A gentle bounce so the fruit catches the eye.
    const bob = Math.sin(performance.now() / 260) * cell * 0.05;
    if (this.sprite(ctx, kind, cx, cy + bob, cell * 1.25)) return;
    const r = cell * 0.16;
    this.shadow(ctx, cx, cy + r, r * 2, r * 1.6);
    if (kind === 'acai') {
      ctx.fillStyle = COLOR.acai;
      for (const [ox, oy] of [[-r, r * 0.4], [r, r * 0.4], [0, -r * 0.8], [0, r * 1.4]]) {
        ctx.beginPath();
        ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = COLOR.green;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 1.8);
      ctx.lineTo(cx + r * 1.2, cy - r * 3);
      ctx.stroke();
    } else if (kind === 'caju') {
      ctx.fillStyle = COLOR.caju;
      ctx.beginPath();
      ctx.ellipse(cx, cy + r * 0.6, r * 1.6, r * 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COLOR.yellow;
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.5, cy + r * 0.3, r * 0.5, r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COLOR.cajuNut;
      ctx.beginPath();
      ctx.ellipse(cx, cy - r * 1.9, r * 1.1, r * 0.6, 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = COLOR.jabuticaba;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.arc(cx - r * 0.7, cy - r * 0.7, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawPup(ctx: CanvasRenderingContext2D, c: Cell, at: Cell, ahead: Cell, cell: number, index: number): void {
    const [cx, cy] = this.center(c, cell);
    // Direction to the cell ahead; across the wrap the neighbour is on the other side, so flip the sign.
    let dx = ahead.x - at.x;
    let dy = ahead.y - at.y;
    if (Math.abs(dx) > 1) dx = -Math.sign(dx);
    if (Math.abs(dy) > 1) dy = -Math.sign(dy);
    const angle = Math.atan2(dy, dx);
    const scale = Math.max(0.62, 0.82 - index * 0.012);
    const spriteScale = Math.max(0.78, 0.94 - index * 0.012);
    const flip = dx < 0 || (dx === 0 && this.facing === 'left');
    const hop = Math.abs(Math.sin(performance.now() / 120 + index)) * cell * 0.04;
    if (this.sprite(ctx, 'pup', cx, cy - hop, cell * 1.5 * spriteScale, flip, dy * 0.25)) return;
    this.shadow(ctx, cx, cy, cell * 0.36 * scale, cell * 0.3 * scale);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    const fur = ctx.createLinearGradient(0, -cell * 0.35, 0, cell * 0.35);
    fur.addColorStop(0, '#c08a55');
    fur.addColorStop(1, '#8a5a33');
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.ellipse(-cell * 0.04, 0, cell * 0.42, cell * 0.33, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLOR.capybaraDark;
    ctx.beginPath();
    ctx.ellipse(cell * 0.3, 0, cell * 0.14, cell * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cell * 0.08, -cell * 0.27, cell * 0.07, 0, Math.PI * 2);
    ctx.arc(cell * 0.08, cell * 0.27, cell * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(cell * 0.2, -cell * 0.12, cell * 0.04, 0, Math.PI * 2);
    ctx.arc(cell * 0.2, cell * 0.12, cell * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawCapybara(ctx: CanvasRenderingContext2D, c: Cell, direction: Direction, cell: number): void {
    const [cx, cy] = this.center(c, cell);
    const angle = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[direction];
    const flip = direction === 'left' || ((direction === 'up' || direction === 'down') && this.facing === 'left');
    // Mirroring flips only x, so the same tilt raises (up) or lowers (down) the snout either way.
    const tilt = direction === 'up' ? -0.3 : direction === 'down' ? 0.3 : 0;
    const walk = this.phase() === 'running' ? Math.abs(Math.sin(performance.now() / 110)) * cell * 0.05 : 0;
    if (this.sprite(ctx, 'capybara', cx, cy - walk, cell * 1.75, flip, tilt)) return;
    this.shadow(ctx, cx, cy, cell * 0.5, cell * 0.42);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(1.1, 1.1);
    // Body
    const fur = ctx.createLinearGradient(0, -cell * 0.4, 0, cell * 0.4);
    fur.addColorStop(0, '#a8703f');
    fur.addColorStop(1, '#6f4524');
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.ellipse(-cell * 0.05, 0, cell * 0.48, cell * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Blunt snout
    ctx.fillStyle = COLOR.capybaraDark;
    ctx.beginPath();
    ctx.ellipse(cell * 0.36, 0, cell * 0.18, cell * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ears
    ctx.beginPath();
    ctx.arc(-cell * 0.1, -cell * 0.36, cell * 0.09, 0, Math.PI * 2);
    ctx.arc(-cell * 0.1, cell * 0.36, cell * 0.09, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = COLOR.white;
    ctx.beginPath();
    ctx.arc(cell * 0.14, -cell * 0.17, cell * 0.075, 0, Math.PI * 2);
    ctx.arc(cell * 0.14, cell * 0.17, cell * 0.075, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(cell * 0.16, -cell * 0.17, cell * 0.04, 0, Math.PI * 2);
    ctx.arc(cell * 0.16, cell * 0.17, cell * 0.04, 0, Math.PI * 2);
    ctx.fill();
    // A small green-and-yellow ribbon: the leader of the family
    ctx.fillStyle = COLOR.yellow;
    ctx.fillRect(-cell * 0.34, -cell * 0.06, cell * 0.14, cell * 0.12);
    ctx.fillStyle = COLOR.green;
    ctx.fillRect(-cell * 0.3, -cell * 0.03, cell * 0.06, cell * 0.06);
    ctx.restore();
  }

  private drawJaguar(ctx: CanvasRenderingContext2D, c: Cell, target: Cell, cell: number): void {
    const [cx, cy] = this.center(c, cell);
    if (this.sprite(ctx, 'jaguar', cx, cy, cell * 1.75, target.x < c.x)) return;
    this.shadow(ctx, cx, cy, cell * 0.5, cell * 0.45);
    // A soft red halo: the danger is easy to spot.
    const halo = ctx.createRadialGradient(cx, cy, cell * 0.3, cx, cy, cell * 0.95);
    halo.addColorStop(0, 'rgba(255,80,40,0.35)');
    halo.addColorStop(1, 'rgba(255,80,40,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, cell * 0.95, 0, Math.PI * 2);
    ctx.fill();
    void target;
    ctx.fillStyle = COLOR.jaguar;
    // Ears
    ctx.beginPath();
    ctx.arc(cx - cell * 0.28, cy - cell * 0.3, cell * 0.12, 0, Math.PI * 2);
    ctx.arc(cx + cell * 0.28, cy - cell * 0.3, cell * 0.12, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.beginPath();
    ctx.arc(cx, cy, cell * 0.45, 0, Math.PI * 2);
    ctx.fill();
    // Rosettes
    ctx.strokeStyle = COLOR.spot;
    ctx.lineWidth = Math.max(1, cell * 0.05);
    for (const [ox, oy] of [[-0.24, -0.08], [0.24, -0.08], [0, 0.26], [-0.16, 0.22], [0.18, 0.2]]) {
      ctx.beginPath();
      ctx.arc(cx + ox * cell, cy + oy * cell, cell * 0.07, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Eyes
    ctx.fillStyle = '#c8e35a';
    ctx.beginPath();
    ctx.arc(cx - cell * 0.13, cy - cell * 0.08, cell * 0.07, 0, Math.PI * 2);
    ctx.arc(cx + cell * 0.13, cy - cell * 0.08, cell * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.fillRect(cx - cell * 0.145, cy - cell * 0.13, cell * 0.03, cell * 0.1);
    ctx.fillRect(cx + cell * 0.115, cy - cell * 0.13, cell * 0.03, cell * 0.1);
    // Nose
    ctx.fillStyle = '#7a3b2a';
    ctx.beginPath();
    ctx.moveTo(cx - cell * 0.06, cy + cell * 0.06);
    ctx.lineTo(cx + cell * 0.06, cy + cell * 0.06);
    ctx.lineTo(cx, cy + cell * 0.13);
    ctx.closePath();
    ctx.fill();
  }

  private drawOverlay(ctx: CanvasRenderingContext2D, s: GameState): void {
    const t = this.t();
    const phase = this.phase();
    ctx.save();
    ctx.fillStyle = 'rgba(0, 20, 60, 0.35)';
    ctx.fillRect(0, 0, 480, 480);
    const panel = ctx.createLinearGradient(0, 170, 0, 310);
    panel.addColorStop(0, 'rgba(0, 49, 140, 0.95)');
    panel.addColorStop(1, 'rgba(0, 30, 90, 0.95)');
    ctx.fillStyle = panel;
    this.roundRect(ctx, 50, 168, 380, 144, 18);
    ctx.fill();
    ctx.strokeStyle = COLOR.yellow;
    ctx.lineWidth = 3;
    ctx.stroke();
    // green-yellow-blue ribbon at the top of the panel
    ctx.fillStyle = COLOR.green;
    ctx.fillRect(170, 180, 46, 5);
    ctx.fillStyle = COLOR.yellow;
    ctx.fillRect(217, 180, 46, 5);
    ctx.fillStyle = '#3d7be0';
    ctx.fillRect(264, 180, 46, 5);
    ctx.fillStyle = COLOR.yellow;
    ctx.textAlign = 'center';
    ctx.font = '700 30px system-ui, sans-serif';
    const title = phase === 'over' ? `${t.score}: ${s.score}` : phase === 'paused' ? t.paused : t.title;
    ctx.fillText(title, 240, 232);
    ctx.fillStyle = COLOR.white;
    ctx.font = '500 16px system-ui, sans-serif';
    const line = phase === 'over' ? t.over[s.cause ?? 'pups'] : t.ready;
    this.wrap(ctx, line, 240, 266, 340, 20);
    ctx.restore();
  }

  private wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number): void {
    const words = text.split(' ');
    let lineText = '';
    for (const word of words) {
      const test = lineText ? `${lineText} ${word}` : word;
      if (ctx.measureText(test).width > max && lineText) {
        ctx.fillText(lineText, x, y);
        lineText = word;
        y += lh;
      } else {
        lineText = test;
      }
    }
    if (lineText) ctx.fillText(lineText, x, y);
  }

  /** The jaguar appears from this level (shown in the instructions). */
  readonly jaguarLevel = JAGUAR_LEVEL;
}
