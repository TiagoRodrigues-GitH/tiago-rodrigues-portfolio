import { describe, expect, it } from 'vitest';
import { ALGORITHMS, ORDER, isExact, runAlgorithm } from './algorithm-catalog';
import { alt, astar, bellmanFord, bidirectionalDijkstra, breadthFirst, dijkstra, distancesFrom, greedyBestFirst } from './exact-search';
import { DESTINATION, ORIGIN, SIZE, grid } from './grid.fixture';
import { SearchTrace } from './search-trace';
import { StreetGraph, buildGraph, edgeBetween, graphBounds, nearestNode, pathCost } from './street-graph';

const g = buildGraph(grid());
const s = ORIGIN;
const t = DESTINATION;

function isValid(graph: StreetGraph, path: number[], from = s, to = t): boolean {
  return path[0] === from && path[path.length - 1] === to && path.every((v, i) => i === 0 || edgeBetween(graph, path[i - 1], v) >= 0);
}

describe('exact searches', () => {
  const exact = dijkstra(g, s, t);

  it('Dijkstra, A*, ALT, bidirectional Dijkstra and Bellman-Ford agree on the shortest route', () => {
    expect(isValid(g, exact.path)).toBe(true);
    for (const r of [astar(g, s, t), alt(g, s, t), bidirectionalDijkstra(g, s, t), bellmanFord(g, s, t)]) {
      expect(isValid(g, r.path), r.algorithm).toBe(true);
      expect(r.cost, r.algorithm).toBeCloseTo(exact.cost, 6);
    }
  });

  it('A* and ALT expand fewer nodes than Dijkstra; Bellman-Ford cannot stop early', () => {
    expect(astar(g, s, t).expanded).toBeLessThanOrEqual(exact.expanded);
    expect(alt(g, s, t).expanded).toBeLessThanOrEqual(exact.expanded);
    expect(bellmanFord(g, s, t).expanded).toBeGreaterThanOrEqual(g.n);
  });

  it('weighted A*, greedy search and BFS give valid routes, never shorter than the optimum', () => {
    for (const r of [astar(g, s, t, 3), greedyBestFirst(g, s, t), breadthFirst(g, s, t)]) {
      expect(isValid(g, r.path), r.algorithm).toBe(true);
      expect(r.cost).toBeGreaterThanOrEqual(exact.cost - 1e-9);
      expect(pathCost(g, r.path)).toBeCloseTo(r.cost, 6);
    }
  });

  it('BFS minimises the number of street segments', () => {
    expect(breadthFirst(g, s, t).path.length).toBeLessThanOrEqual(exact.path.length);
  });

  it('records one trace step per expansion, with the evaluated edges', () => {
    const trace = exact.trace as SearchTrace;
    expect(trace.kind).toBe('search');
    expect(trace.settled.length).toBe(exact.expanded);
    expect(trace.settled[0]).toBe(s);
    expect(trace.settled[trace.settled.length - 1]).toBe(t);
    expect(trace.relaxStart.length).toBe(trace.settled.length + 1);
    expect(trace.relaxEdge.length).toBe(trace.relaxStart[trace.settled.length]);
    // labels of a Dijkstra run never decrease
    expect(trace.label.every((d, i) => i === 0 || d >= trace.label[i - 1] - 1e-9)).toBe(true);
  });

  it('the backward half of a bidirectional search is marked in its trace', () => {
    const trace = bidirectionalDijkstra(g, s, t).trace as SearchTrace;
    expect([...trace.settled].some((v) => v < 0)).toBe(true);
    expect([...trace.settled].some((v) => v >= 0)).toBe(true);
  });

  it('origin equal to destination gives a route of one node and length 0 for every algorithm', () => {
    for (const key of ORDER) {
      const r = runAlgorithm(g, key, s, s);
      expect(r.path, key).toEqual([s]);
      expect(r.cost, key).toBe(0);
    }
  });

  it('the registry marks which algorithms guarantee the shortest route', () => {
    expect(ORDER.filter((k) => isExact(k, {}))).toEqual(['dijkstra', 'astar', 'alt', 'bidirectional', 'bellmanFord']);
    expect(isExact('astar', { weight: 2 })).toBe(false);
    expect(Object.keys(ALGORITHMS).sort()).toEqual([...ORDER].sort());
  });
});

describe('one-way streets', () => {
  // Row 5 is one-way westwards: the origin (row 5) can no longer drive east along it.
  const westOnRow5 = (a: number, b: number) => Math.floor(a / SIZE) === 5 && Math.floor(b / SIZE) === 5 && b === a - 1;
  const d = buildGraph(grid(SIZE, westOnRow5));

  it('one-way edges are usable in one direction only', () => {
    expect(d.directed).toBe(true);
    expect(edgeBetween(d, 5 * SIZE + 3, 5 * SIZE + 2)).toBeGreaterThanOrEqual(0);
    expect(edgeBetween(d, 5 * SIZE + 2, 5 * SIZE + 3)).toBe(-1);
  });

  it('every algorithm respects the direction and the exact ones still agree', () => {
    const exact = dijkstra(d, s, t);
    expect(exact.cost).toBeGreaterThanOrEqual(dijkstra(g, s, t).cost);
    for (const key of ORDER) {
      const r = runAlgorithm(d, key, s, t, { iterations: 10, generations: 10, saIterations: 200 });
      expect(isValid(d, r.path), key).toBe(true);
      if (isExact(key, {})) expect(r.cost, key).toBeCloseTo(exact.cost, 6);
    }
  });

  it('a route may exist one way and not the other', () => {
    // a single one-way street out of a cul-de-sac: node 0 can leave, nobody can enter
    const trap = buildGraph({
      municipality: { code: 0, name: 'trap' }, names: [''],
      nodes: [-51, -23, -50.999, -23, -50.998, -23],
      edges: [0, 1, 1000, 0, 1, 2, 1000, 0],
      lines: [[-51, -23, -50.999, -23], [-50.999, -23, -50.998, -23]],
      oneway: [0],
    });
    expect(dijkstra(trap, 0, 2).cost).toBeCloseTo(200, 6);
    for (const key of ORDER) {
      const r = runAlgorithm(trap, key, 2, 0, { iterations: 5, generations: 5, saIterations: 200 });
      expect(r.path, key).toEqual([]);
      expect(r.cost, key).toBe(Infinity);
    }
  });

  it('backward distances follow in-edges', () => {
    const to = distancesFrom(d, t, true);
    const from = distancesFrom(d, s);
    expect(to[s]).toBeCloseTo(from[t], 6);
  });
});

describe('graph helpers', () => {
  it('encloses every node and snaps clicks to the nearest node', () => {
    const [w, s0, e, n] = graphBounds(g);
    expect([w, s0]).toEqual([-51.16, -23.31]);
    expect(e).toBeCloseTo(-51.16 + 11 * 0.0009, 9);
    expect(n).toBeCloseTo(-23.31 + 11 * 0.0009, 9);
    expect(nearestNode(g, g.lon[s] + 0.00001, g.lat[s])).toBe(s);
  });
});
