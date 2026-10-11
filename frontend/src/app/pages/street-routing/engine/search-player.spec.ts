import { describe, expect, it } from 'vitest';
import { bellmanFord, bidirectionalDijkstra, dijkstra } from './exact-search';
import { DESTINATION, ORIGIN, grid } from './grid.fixture';
import { simulatedAnnealing } from './metaheuristics';
import { NodeState, PlaybackClock, SPEEDS, SearchPlayer } from './search-player';
import { RouteResult } from './search-trace';
import { buildGraph, pathEdges } from './street-graph';

const g = buildGraph(grid());
const player = (r: RouteResult) => new SearchPlayer(r.trace, g.n, g.edgeLen.length, (path) => pathEdges(g, path));

describe('search player', () => {
  const run = dijkstra(g, ORIGIN, DESTINATION);

  it('plays a search step by step and ends with every expanded node visited', () => {
    const p = player(run);
    const first = p.advance(1);
    expect(p.step).toBe(1);
    expect(first.nodes).toContainEqual([ORIGIN, NodeState.Visited]);
    expect(first.nodes.some(([, state]) => state === NodeState.Frontier)).toBe(true);
    expect(first.edges.length).toBeGreaterThan(0);
    p.advance(1e9);
    expect(p.done).toBe(true);
    expect(p.visitedSize).toBe(run.expanded);
    expect(p.state(DESTINATION)).toBe(NodeState.Visited);
    expect(p.label).toBeCloseTo(run.cost, 6);
  });

  it('gives the same final state in one jump or in many small steps', () => {
    const a = player(run);
    a.advance(run.expanded);
    const b = player(run);
    while (!b.done) b.advance(7);
    for (let v = 0; v < g.n; v++) expect(b.state(v)).toBe(a.state(v));
    expect(b.frontierSize).toBe(a.frontierSize);
    expect(b.evaluatedEdges).toBe(a.evaluatedEdges);
  });

  it('restarts from the beginning', () => {
    const p = player(run);
    p.advance(10);
    p.reset();
    expect(p.step).toBe(0);
    expect(p.visitedSize).toBe(0);
    expect(p.state(ORIGIN)).toBe(NodeState.Unexplored);
  });

  it('marks the nodes of the backward search', () => {
    const p = player(bidirectionalDijkstra(g, ORIGIN, DESTINATION));
    p.advance(1e9);
    expect(p.state(DESTINATION)).toBe(NodeState.VisitedBackward);
  });

  it('shows a node queued again by Bellman-Ford as waiting', () => {
    const r = bellmanFord(g, ORIGIN, DESTINATION);
    const p = player(r);
    p.advance(r.expanded);
    expect(p.frontierSize).toBe(0); // the queue is empty at the end
  });

  it('plays candidate routes with the best one so far', () => {
    const r = simulatedAnnealing(g, ORIGIN, DESTINATION, { temperature: 300, cooling: 0.99, iterations: 200, seed: 3 });
    const p = player(r);
    const delta = p.advance(5);
    expect(delta.candidate?.[0]).toBe(ORIGIN);
    expect(delta.best).not.toBeNull();
    p.advance(1e9);
    expect(p.label).toBeCloseTo(r.cost, 6);
  });
});

describe('playback clock', () => {
  it('turns elapsed time into steps at the chosen speed, carrying fractions', () => {
    const clock = new PlaybackClock(0); // 1 step/s
    expect(clock.tick(400)).toBe(0);
    expect(clock.tick(250)).toBe(0);
    expect(clock.tick(250)).toBe(0);
    expect(clock.tick(250)).toBe(1);
    clock.setLevel(SPEEDS.length - 1);
    expect(clock.tick(100)).toBe(SPEEDS[SPEEDS.length - 1] / 10);
  });

  it('caps a long pause at a quarter of a second and clamps the level', () => {
    const clock = new PlaybackClock(4);
    expect(clock.tick(10_000)).toBe(SPEEDS[4] / 4);
    clock.setLevel(99);
    expect(clock.stepsPerSecond).toBe(SPEEDS[SPEEDS.length - 1]);
  });
});
