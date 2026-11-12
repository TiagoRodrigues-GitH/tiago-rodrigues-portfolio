import {
  Component, ElementRef, OnDestroy, ViewChild, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectLangQuery, injectLocale } from '../../services/locale';
import {
  Cell, Direction, FRUIT_POINTS, FruitKind, GameState, JAGUAR_LEVEL, createGame, step, stepInterval, turn,
} from './capivara-engine';
import { CAPIVARA_TEXT } from './capivara-i18n';

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

  private ctx: CanvasRenderingContext2D | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private touchStart: { x: number; y: number } | null = null;
  private readonly onKey = (event: KeyboardEvent) => this.handleKey(event);
  private readonly onResize = () => this.setupCanvas();

  constructor() {
    afterNextRender(() => {
      this.best.set(this.readBest());
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
    this.state.update((s) => turn(s, direction));
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
    this.start();
    this.draw();
  }

  private stop(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }

  private schedule(): void {
    this.stop();
    this.timer = setTimeout(() => this.tick(), stepInterval(this.state().level));
  }

  private tick(): void {
    const before = this.state();
    const after = step(before);
    this.state.set(after);
    if (after.eaten > before.eaten) this.announcement.set(`${this.t().score}: ${after.score}`);
    if (!before.jaguar && after.jaguar) this.announcement.set(this.t().jaguarWarning);
    if (!after.alive) {
      this.phase.set('over');
      if (after.score > this.best()) {
        this.best.set(after.score);
        this.writeBest(after.score);
      }
      this.announcement.set(`${this.t().over[after.cause ?? 'bank']} ${this.t().score}: ${after.score}.`);
      this.draw();
      return;
    }
    this.draw();
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
    const ratio = Math.min(2, this.document.defaultView?.devicePixelRatio ?? 1);
    canvas.width = Math.round(size * ratio);
    canvas.height = Math.round(size * ratio);
    this.ctx = canvas.getContext('2d');
    this.ctx?.setTransform((size * ratio) / 480, 0, 0, (size * ratio) / 480, 0, 0);
    this.draw();
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const s = this.state();
    const cell = 480 / s.width;
    this.drawField(ctx, s, cell);
    this.drawFruit(ctx, s.fruit.cell, s.fruit.kind, cell);
    for (let i = s.family.length - 1; i >= 1; i--) this.drawPup(ctx, s.family[i], cell);
    this.drawCapybara(ctx, s.family[0], s.direction, cell);
    if (s.jaguar) this.drawJaguar(ctx, s.jaguar, cell);
    if (this.phase() !== 'running') this.drawOverlay(ctx, s);
  }

  private drawField(ctx: CanvasRenderingContext2D, s: GameState, cell: number): void {
    for (let y = 0; y < s.height; y++) {
      for (let x = 0; x < s.width; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? COLOR.grassA : COLOR.grassB;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    // A faint yellow lozenge and blue circle in the middle of the field, after the flag's colours.
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = COLOR.yellow;
    ctx.beginPath();
    ctx.moveTo(240, 40);
    ctx.lineTo(450, 240);
    ctx.lineTo(240, 440);
    ctx.lineTo(30, 240);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = COLOR.blue;
    ctx.beginPath();
    ctx.arc(240, 240, 85, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // River banks: blue water inside a yellow edge.
    ctx.lineWidth = 6;
    ctx.strokeStyle = COLOR.river;
    ctx.strokeRect(3, 3, 474, 474);
    ctx.lineWidth = 2;
    ctx.strokeStyle = COLOR.yellow;
    ctx.strokeRect(7, 7, 466, 466);
  }

  private center(c: Cell, cell: number): [number, number] {
    return [c.x * cell + cell / 2, c.y * cell + cell / 2];
  }

  private drawFruit(ctx: CanvasRenderingContext2D, c: Cell, kind: FruitKind, cell: number): void {
    const [cx, cy] = this.center(c, cell);
    const r = cell * 0.18;
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

  private drawPup(ctx: CanvasRenderingContext2D, c: Cell, cell: number): void {
    const [cx, cy] = this.center(c, cell);
    ctx.fillStyle = COLOR.pup;
    ctx.beginPath();
    ctx.ellipse(cx, cy, cell * 0.36, cell * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLOR.capybaraDark;
    ctx.beginPath();
    ctx.arc(cx - cell * 0.14, cy - cell * 0.22, cell * 0.07, 0, Math.PI * 2);
    ctx.arc(cx + cell * 0.14, cy - cell * 0.22, cell * 0.07, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawCapybara(ctx: CanvasRenderingContext2D, c: Cell, direction: Direction, cell: number): void {
    const [cx, cy] = this.center(c, cell);
    const angle = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[direction];
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    // Body
    ctx.fillStyle = COLOR.capybara;
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

  private drawJaguar(ctx: CanvasRenderingContext2D, c: Cell, cell: number): void {
    const [cx, cy] = this.center(c, cell);
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
    ctx.fillStyle = 'rgba(0, 39, 118, 0.72)';
    ctx.fillRect(40, 170, 400, 140);
    ctx.strokeStyle = COLOR.yellow;
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 170, 400, 140);
    ctx.fillStyle = COLOR.yellow;
    ctx.textAlign = 'center';
    ctx.font = '700 30px system-ui, sans-serif';
    const title = phase === 'over' ? `${t.score}: ${s.score}` : phase === 'paused' ? t.paused : t.title;
    ctx.fillText(title, 240, 228);
    ctx.fillStyle = COLOR.white;
    ctx.font = '500 16px system-ui, sans-serif';
    const line = phase === 'over' ? t.over[s.cause ?? 'bank'] : t.ready;
    this.wrap(ctx, line, 240, 262, 360, 20);
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
