import { describe, expect, it } from 'vitest';
import { DESTINATION, ORIGIN, grid } from './engine/grid.fixture';
import { ORDER, buildGraph, dijkstra, runAlgorithm } from './routing-engine';

/** The facade re-exports the engine; the algorithms themselves are tested in engine/*.spec.ts. */
describe('routing engine facade', () => {
  const g = buildGraph(grid());

  it('runs every algorithm of the catalogue through one entry point', () => {
    const optimum = dijkstra(g, ORIGIN, DESTINATION).cost;
    for (const key of ORDER) {
      const r = runAlgorithm(g, key, ORIGIN, DESTINATION, { iterations: 10, generations: 10, saIterations: 300 });
      expect(r.path[0], key).toBe(ORIGIN);
      expect(r.path[r.path.length - 1], key).toBe(DESTINATION);
      expect(r.cost, key).toBeGreaterThanOrEqual(optimum - 1e-9);
      expect(r.expanded, key).toBeGreaterThan(0);
    }
  });
});
