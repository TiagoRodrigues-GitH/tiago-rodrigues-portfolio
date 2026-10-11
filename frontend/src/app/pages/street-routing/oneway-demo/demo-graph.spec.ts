import { describe, expect, it } from 'vitest';
import { dijkstra } from '../engine/exact-search';
import { buildGraph, edgeBetween } from '../engine/street-graph';
import { demoId, demoPayload, demoStreets } from './demo-graph';

describe('one-way demo grid', () => {
  const directed = buildGraph(demoPayload(true));
  const undirected = buildGraph(demoPayload(false));
  const from = demoId(2, 0);
  const to = demoId(2, 5);

  it('has one-way and two-way streets', () => {
    const streets = demoStreets();
    expect(streets.length).toBe(5 * 5 + 4 * 6); // 5 rows of 5 blocks, 6 columns of 4 blocks
    expect(streets.some((s) => s.oneway)).toBe(true);
    expect(streets.some((s) => !s.oneway)).toBe(true);
    expect(directed.directed).toBe(true);
    expect(undirected.directed).toBe(false);
  });

  it('row 2 runs westwards only', () => {
    expect(edgeBetween(directed, demoId(2, 3), demoId(2, 2))).toBeGreaterThanOrEqual(0);
    expect(edgeBetween(directed, demoId(2, 2), demoId(2, 3))).toBe(-1);
  });

  it('respecting the one-way streets forces a detour', () => {
    expect(dijkstra(undirected, from, to).cost).toBeCloseTo(500, 6);
    expect(dijkstra(directed, from, to).cost).toBeCloseTo(700, 6);
  });
});
