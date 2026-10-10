/**
 * Data shapes of assets/patent-stats/rankings.json (scripts/patent-stats/build_patent_rankings.py) and the pure
 * geometry of the line chart, free of Angular so it can be unit-tested.
 */

export interface YearMeta {
  published: boolean;
  listSize?: number;
  /** Count of the last entry of the published list: a company missing that year had at most this many. */
  cutoff?: number;
  total?: number | null;
  source?: string;
  page?: string;
}

export interface RankedCompany {
  name: string;
  publishedNames: string[];
  values: Record<string, number | null>;
  ranks: Record<string, number | null>;
}

export interface RankingView {
  id: 'br-nonresidents' | 'br-residents' | 'epo';
  office: string;
  years: Record<string, YearMeta>;
  companies: RankedCompany[];
}

export interface RankingsData {
  generated: string;
  years: number[];
  views: RankingView[];
}

/** Categorical palette (validated: adjacent CVD ΔE ≥ 9.1, normal-vision ΔE ≥ 19.6 on white); fixed order. */
export const SERIES_COLOURS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
export const MAX_SERIES = SERIES_COLOURS.length;

/** The next "nice" number at or above v (1, 2, 2.5 or 5 times a power of ten). */
export function niceMax(v: number): number {
  if (!(v > 0)) return 1;
  const power = 10 ** Math.floor(Math.log10(v));
  return ([1, 2, 2.5, 5, 10].find((m) => m * power >= v) ?? 10) * power;
}

export function ticks(max: number, count = 5): number[] {
  return Array.from({ length: count + 1 }, (_, i) => (max * i) / count);
}

export interface Frame {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function xOf(frame: Frame, years: number[]): (year: number) => number {
  const inner = frame.width - frame.left - frame.right;
  const step = years.length > 1 ? inner / (years.length - 1) : 0;
  return (year) => frame.left + (years.indexOf(year) * step || 0);
}

export function yOf(frame: Frame, max: number): (value: number) => number {
  const inner = frame.height - frame.top - frame.bottom;
  return (value) => frame.top + inner * (1 - value / max);
}

/** Runs of consecutive years with a value: a line never bridges a year without data. */
export function runs(years: number[], values: Record<string, number | null>): Array<Array<[number, number]>> {
  const out: Array<Array<[number, number]>> = [];
  let current: Array<[number, number]> = [];
  for (const year of years) {
    const v = values[String(year)];
    if (v == null) {
      if (current.length) out.push(current);
      current = [];
    } else {
      current.push([year, v]);
    }
  }
  if (current.length) out.push(current);
  return out;
}

/** Colours follow the company, not its position: freeing a slot never repaints the companies still shown. */
export class ColourSlots {
  private readonly owner = new Map<string, number>();

  assign(name: string): string | null {
    if (!this.owner.has(name)) {
      const used = new Set(this.owner.values());
      const free = SERIES_COLOURS.findIndex((_, i) => !used.has(i));
      if (free < 0) return null;
      this.owner.set(name, free);
    }
    return SERIES_COLOURS[this.owner.get(name)!];
  }

  release(name: string): void {
    this.owner.delete(name);
  }

  colour(name: string): string | null {
    const i = this.owner.get(name);
    return i === undefined ? null : SERIES_COLOURS[i];
  }
}
