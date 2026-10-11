import { describe, expect, it } from 'vitest';
import { ColourSlots, MAX_SERIES, SERIES_COLOURS, niceMax, runs, ticks, xOf, yOf } from './stats-chart';

describe('patent statistics chart geometry', () => {
  it('rounds the axis maximum up to a nice number', () => {
    expect(niceMax(5337)).toBe(10000);
    expect(niceMax(1134)).toBe(2000);
    expect(niceMax(225)).toBe(250);
    expect(niceMax(0)).toBe(1);
    expect(ticks(250, 5)).toEqual([0, 50, 100, 150, 200, 250]);
  });

  it('maps years and values into the frame', () => {
    const frame = { width: 700, height: 300, left: 50, right: 20, top: 10, bottom: 30 };
    const x = xOf(frame, [2020, 2021, 2022]);
    const y = yOf(frame, 100);
    expect(x(2020)).toBe(50);
    expect(x(2022)).toBe(680);
    expect(y(0)).toBe(270);
    expect(y(100)).toBe(10);
  });

  it('never draws a line across a year without data', () => {
    const years = [2020, 2021, 2022, 2023, 2024];
    expect(runs(years, { '2020': 5, '2021': null, '2022': 7, '2023': 8, '2024': null })).toEqual([[[2020, 5]], [[2022, 7], [2023, 8]]]);
  });

  it('keeps each company in its colour when another one is removed', () => {
    const slots = new ColourSlots();
    const a = slots.assign('A');
    const b = slots.assign('B');
    slots.release('A');
    expect(slots.colour('B')).toBe(b);
    expect(slots.assign('C')).toBe(a); // the freed colour is reused, B is not repainted
    for (let i = 0; i < MAX_SERIES; i++) slots.assign(`X${i}`);
    expect(slots.assign('one too many')).toBeNull();
    expect(new Set(SERIES_COLOURS).size).toBe(MAX_SERIES);
  });
});
