import { describe, expect, it } from 'vitest';
import {
  GraphPayload,
  antColony,
  astar,
  bidirectionalDijkstra,
  buildGraph,
  dijkstra,
  edgeBetween,
  geneticAlgorithm,
  graphBounds,
  greedyBestFirst,
  nearestNode,
  pathCost,
  removeLoops,
  simulatedAnnealing,
} from './routing-engine';

/** A 12 x 12 street grid, ~100 m blocks, with a few streets removed so routes must detour. */
function grid(size = 12): GraphPayload {
  const nodes: number[] = [];
  const edges: number[] = [];
  const lines: number[][] = [];
  const id = (r: number, c: number) => r * size + c;
  const step = 0.0009; // ~100 m
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) nodes.push(-51.16 + c * step, -23.31 + r * step);
  const add = (a: number, b: number, dm: number) => {
    edges.push(a, b, dm, 0);
    lines.push([nodes[2 * a], nodes[2 * a + 1], nodes[2 * b], nodes[2 * b + 1]]);
  };
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      const blocked = c === 6 && r > 1 && r < size - 2; // a wall with two gaps
      if (c + 1 < size && !blocked) add(id(r, c), id(r, c + 1), 1000);
      if (r + 1 < size) add(id(r, c), id(r + 1, c), 1000);
    }
  return { municipality: { code: 0, name: 'grid' }, nodes, edges, lines, names: ['Rua'] };
}

const g = buildGraph(grid());
const s = 5 * 12 + 1;
const t = 6 * 12 + 10;

function isValid(path: number[]): boolean {
  return path[0] === s && path[path.length - 1] === t && path.every((v, i) => i === 0 || edgeBetween(g, path[i - 1], v) >= 0);
}

describe('routing engine', () => {
  const exact = dijkstra(g, s, t);

  it('exact searches agree on the shortest route', () => {
    expect(isValid(exact.path)).toBe(true);
    for (const r of [astar(g, s, t), bidirectionalDijkstra(g, s, t)]) {
      expect(isValid(r.path)).toBe(true);
      expect(r.cost).toBeCloseTo(exact.cost, 6);
    }
    expect(astar(g, s, t).expanded).toBeLessThanOrEqual(exact.expanded);
  });

  it('weighted A* and greedy search are valid but never shorter than the optimum', () => {
    for (const r of [astar(g, s, t, 3), greedyBestFirst(g, s, t)]) {
      expect(isValid(r.path)).toBe(true);
      expect(r.cost).toBeGreaterThanOrEqual(exact.cost - 1e-9);
      expect(pathCost(g, r.path)).toBeCloseTo(r.cost, 6);
    }
  });

  it('metaheuristics return valid routes, repeatable with the same seed', () => {
    const ants = antColony(g, s, t, { ants: 10, iterations: 15, alpha: 1, beta: 2, evaporation: 0.1, seed: 7 });
    const ga = geneticAlgorithm(g, s, t, { population: 20, generations: 20, crossoverRate: 0.8, mutationRate: 0.2, tournament: 3, seed: 7 });
    const sa = simulatedAnnealing(g, s, t, { temperature: 300, cooling: 0.99, iterations: 300, seed: 7 });
    for (const r of [ants, ga, sa]) {
      expect(isValid(r.path)).toBe(true);
      expect(r.cost).toBeGreaterThanOrEqual(exact.cost - 1e-9);
      expect(r.iterations!.length).toBeGreaterThan(0);
    }
    expect(geneticAlgorithm(g, s, t, { population: 20, generations: 20, crossoverRate: 0.8, mutationRate: 0.2, tournament: 3, seed: 7 }).cost).toBe(ga.cost);
  });

  it('removes loops and snaps clicks to the nearest node', () => {
    expect(removeLoops([1, 2, 3, 2, 4, 5, 4, 6])).toEqual([1, 2, 4, 6]);
    expect(nearestNode(g, g.lon[s] + 0.00001, g.lat[s])).toBe(s);
  });
});

describe('graph bounds', () => {
  it('encloses every node of the grid', () => {
    const [w, s0, e, n] = graphBounds(g);
    expect([w, s0]).toEqual([-51.16, -23.31]);
    expect(e).toBeCloseTo(-51.16 + 11 * 0.0009, 9);
    expect(n).toBeCloseTo(-23.31 + 11 * 0.0009, 9);
  });
});
