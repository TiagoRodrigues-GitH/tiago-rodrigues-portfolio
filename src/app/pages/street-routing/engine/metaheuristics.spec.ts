import { describe, expect, it } from 'vitest';
import { dijkstra } from './exact-search';
import { DESTINATION, ORIGIN, grid } from './grid.fixture';
import { antColony, geneticAlgorithm, removeLoops, simulatedAnnealing } from './metaheuristics';
import { CandidateTrace, candidateAt } from './search-trace';
import { buildGraph, edgeBetween, pathCost } from './street-graph';

const g = buildGraph(grid());
const s = ORIGIN;
const t = DESTINATION;
const isValid = (path: number[]) => path[0] === s && path[path.length - 1] === t && path.every((v, i) => i === 0 || edgeBetween(g, path[i - 1], v) >= 0);
const ga = { population: 20, generations: 20, crossoverRate: 0.8, mutationRate: 0.2, tournament: 3, seed: 7 };

describe('metaheuristics', () => {
  const optimum = dijkstra(g, s, t).cost;
  const runs = [
    antColony(g, s, t, { ants: 10, iterations: 15, alpha: 1, beta: 2, evaporation: 0.1, seed: 7 }),
    geneticAlgorithm(g, s, t, ga),
    simulatedAnnealing(g, s, t, { temperature: 300, cooling: 0.99, iterations: 300, seed: 7 }),
  ];

  it('return valid routes, never shorter than the optimum', () => {
    for (const r of runs) {
      expect(isValid(r.path), r.algorithm).toBe(true);
      expect(r.cost).toBeGreaterThanOrEqual(optimum - 1e-9);
      expect(pathCost(g, r.path)).toBeCloseTo(r.cost, 6);
    }
  });

  it('record every route evaluated, and the best one so far never gets worse', () => {
    for (const r of runs) {
      const trace = r.trace as CandidateTrace;
      expect(trace.kind).toBe('candidates');
      expect(trace.cost.length).toBe(r.expanded);
      let previous = Infinity;
      for (let i = 0; i < trace.best.length; i++) {
        const b = trace.best[i];
        if (b < 0) continue;
        expect(trace.cost[b]).toBeLessThanOrEqual(previous);
        previous = trace.cost[b];
      }
      expect(candidateAt(trace, trace.best[trace.best.length - 1])).toEqual(r.path);
    }
  });

  it('are repeatable with the same seed', () => {
    expect(geneticAlgorithm(g, s, t, ga).cost).toBe(runs[1].cost);
  });

  it('remove loops from a route', () => {
    expect(removeLoops([1, 2, 3, 2, 4, 5, 4, 6])).toEqual([1, 2, 4, 6]);
  });
});
