import { Component, Input, afterNextRender, computed, inject, signal } from '@angular/core';
import { LabDataService } from '../lab-data';
import { StatsText } from './guide-content';
import { LINKS } from './guide-links';
import { ColourSlots, Frame, MAX_SERIES, RankedCompany, RankingView, RankingsData, niceMax, runs, ticks, xOf, yOf } from './stats-chart';

type ViewId = RankingView['id'] | 'cn';
const VIEW_ORDER: ViewId[] = ['br-nonresidents', 'br-residents', 'epo', 'cn'];
const DEFAULT_SHOWN = 5;
const FRAME: Frame = { width: 720, height: 340, left: 58, right: 24, top: 16, bottom: 34 };

/**
 * Top patent applicants per office and year, from official lists only: a line chart of the companies the
 * visitor picks (up to eight), with a tooltip per year, and the full table of the ten companies below it.
 * Years without a published list (2026) are shaded, never drawn as zero.
 */
@Component({
  selector: 'app-patent-stats',
  templateUrl: './patent-stats.html',
  styleUrls: ['./patent-stats.css'],
})
export class PatentStatsComponent {
  private readonly lab = inject(LabDataService);

  @Input({ required: true }) t!: StatsText;
  @Input({ required: true }) lang = 'pt-BR';

  readonly links = LINKS;
  readonly frame = FRAME;
  readonly viewOrder = VIEW_ORDER;
  readonly data = signal<RankingsData | null>(null);
  readonly failed = signal(false);
  readonly viewId = signal<ViewId>('br-nonresidents');
  readonly hoverYear = signal<number | null>(null);
  /** Companies shown, per view (the choice is kept when switching views). */
  private readonly shown = signal<Record<string, string[]>>({});
  private readonly slots = new Map<string, ColourSlots>();

  readonly view = computed(() => this.data()?.views.find((v) => v.id === this.viewId()) ?? null);
  readonly years = computed(() => this.data()?.years ?? []);
  readonly selected = computed(() => {
    const v = this.view();
    if (!v) return [];
    const names = this.shown()[v.id] ?? v.companies.slice(0, DEFAULT_SHOWN).map((c) => c.name);
    return v.companies.filter((c) => names.includes(c.name));
  });

  readonly yMax = computed(() => niceMax(Math.max(1, ...this.selected().flatMap((c) => Object.values(c.values).map((v) => v ?? 0)))));
  readonly yTicks = computed(() => ticks(this.yMax(), 5));
  readonly x = computed(() => xOf(FRAME, this.years()));
  readonly y = computed(() => yOf(FRAME, this.yMax()));
  readonly unpublished = computed(() => this.years().filter((year) => !this.view()?.years[String(year)]?.published));
  readonly step = computed(() => (FRAME.width - FRAME.left - FRAME.right) / Math.max(1, this.years().length - 1));

  readonly lines = computed(() => {
    const x = this.x();
    const y = this.y();
    return this.selected().map((c) => ({
      name: c.name,
      colour: this.colour(c.name),
      paths: runs(this.years(), c.values).map((run) => run.map(([year, v], i) => `${i ? 'L' : 'M'}${x(year).toFixed(1)},${y(v).toFixed(1)}`).join(' ')),
      points: runs(this.years(), c.values).flat().map(([year, v]) => ({ year, cx: x(year), cy: y(v) })),
    }));
  });

  constructor() {
    afterNextRender(() => {
      this.lab.rankings().subscribe({ next: (d) => this.data.set(d), error: () => this.failed.set(true) });
    });
  }

  chooseView(id: ViewId): void {
    this.viewId.set(id);
    this.hoverYear.set(null);
  }

  isShown(c: RankedCompany): boolean {
    return this.selected().some((s) => s.name === c.name);
  }

  canAdd(): boolean {
    return this.selected().length < MAX_SERIES;
  }

  toggle(c: RankedCompany): void {
    const v = this.view()!;
    const current = this.selected().map((s) => s.name);
    let next: string[];
    if (current.includes(c.name)) {
      next = current.filter((n) => n !== c.name);
      this.slotsOf(v.id).release(c.name);
    } else if (current.length < MAX_SERIES) {
      next = [...current, c.name];
    } else {
      return;
    }
    this.shown.set({ ...this.shown(), [v.id]: next });
  }

  colour(name: string): string {
    const v = this.view();
    return (v && this.slotsOf(v.id).assign(name)) ?? '#6a82ab';
  }

  private slotsOf(id: string): ColourSlots {
    if (!this.slots.has(id)) this.slots.set(id, new ColourSlots());
    return this.slots.get(id)!;
  }

  number(n: number): string {
    return n.toLocaleString(this.lang);
  }

  /** A table cell or tooltip value: the number, "at most N" when off the list, or "no data". */
  cell(c: RankedCompany, year: number): { text: string; title: string; missing: boolean } {
    const meta = this.view()?.years[String(year)];
    const v = c.values[String(year)];
    if (!meta?.published) return { text: '—', title: this.t.notPublished, missing: true };
    if (v == null) return { text: `≤ ${this.number(meta.cutoff ?? 0)}`, title: this.t.notListed.replace('{n}', this.number(meta.cutoff ?? 0)), missing: true };
    const rank = c.ranks[String(year)];
    return { text: this.number(v), title: rank ? `${this.t.rank} ${rank}` : '', missing: false };
  }

  /** Accessible summary of one year (the focusable column of the chart). */
  yearLabel(year: number): string {
    const values = this.selected().map((c) => {
      const cell = this.cell(c, year);
      return `${c.name}: ${cell.missing ? cell.title : cell.text}`;
    });
    return `${year}. ${values.join('; ')}`;
  }

  onPointer(event: PointerEvent, svg: Element): void {
    const box = svg.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * FRAME.width;
    const years = this.years();
    const i = Math.round((px - FRAME.left) / this.step());
    this.hoverYear.set(i >= 0 && i < years.length ? years[i] : null);
  }

  /** Tooltip position as a share of the chart width, kept inside the frame. */
  tipLeft(year: number): number {
    return Math.min(78, Math.max(4, (this.x()(year) / FRAME.width) * 100 - 11));
  }

  sources(): Array<{ year: string; url: string }> {
    const v = this.view();
    return v ? Object.entries(v.years).filter(([, m]) => m.published && m.source).map(([year, m]) => ({ year, url: m.source! })) : [];
  }
}
