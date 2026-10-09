/**
 * Graph searches that build a route node by node from a frontier: Dijkstra (1959), A* (Hart, Nilsson & Raphael
 * 1968) and its weighted form (Pohl 1970), greedy best-first search, bidirectional Dijkstra, breadth-first search,
 * the label-correcting Bellman-Ford-Moore algorithm (Bellman 1958; Moore 1959) and ALT, A* with landmarks and the
 * triangle inequality (Goldberg & Harrelson 2005). Every one records a {@link SearchTrace} for the animation and
 * follows the street directions (out-edges forwards, in-edges for a backward search).
 */

import { RouteResult, SearchRecorder } from './search-trace';
import { StreetGraph, pathCost, straightLine } from './street-graph';

export class MinHeap {
  private keys: number[] = [];
  private items: number[] = [];

  get size(): number {
    return this.items.length;
  }

  peekKey(): number {
    return this.keys.length ? this.keys[0] : Infinity;
  }

  push(item: number, key: number): void {
    this.keys.push(key);
    this.items.push(item);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.keys[parent] <= key) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  pop(): [number, number] {
    const top: [number, number] = [this.items[0], this.keys[0]];
    const lastItem = this.items.pop()!;
    const lastKey = this.keys.pop()!;
    if (this.items.length) {
      this.items[0] = lastItem;
      this.keys[0] = lastKey;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let s = i;
        if (l < this.keys.length && this.keys[l] < this.keys[s]) s = l;
        if (r < this.keys.length && this.keys[r] < this.keys[s]) s = r;
        if (s === i) break;
        this.swap(i, s);
        i = s;
      }
    }
    return top;
  }

  private swap(a: number, b: number): void {
    [this.keys[a], this.keys[b]] = [this.keys[b], this.keys[a]];
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
  }
}

function unwind(parent: Int32Array, target: number): number[] {
  const path: number[] = [];
  for (let v = target; v >= 0; v = parent[v]) path.push(v);
  return path.reverse();
}

function result(name: string, path: number[], cost: number, t0: number, rec: SearchRecorder): RouteResult {
  return { algorithm: name, path, cost: path.length ? cost : Infinity, expanded: rec.steps, ms: performance.now() - t0, trace: rec.finish() };
}

/**
 * Best-first search on f = g + h (Dijkstra: h = 0; A*: h = straight line, admissible and consistent, so the route
 * is the shortest; ALT: landmark bound) or on f = h alone (greedy). A node is expanded once.
 */
function bestFirst(g: StreetGraph, s: number, t: number, name: string, h: (v: number) => number, greedy = false): RouteResult {
  const t0 = performance.now();
  const rec = new SearchRecorder();
  const dist = new Float64Array(g.n).fill(Infinity);
  const parent = new Int32Array(g.n).fill(-1);
  const done = new Uint8Array(g.n);
  const heap = new MinHeap();
  dist[s] = 0;
  heap.push(s, h(s));
  while (heap.size) {
    const [v] = heap.pop();
    if (done[v]) continue;
    done[v] = 1;
    rec.expand(v, dist[v]);
    if (v === t) break;
    for (let k = g.adjStart[v]; k < g.adjStart[v + 1]; k++) {
      const u = g.adjTo[k];
      const nd = dist[v] + g.adjLen[k];
      if (!done[u] && nd < dist[u]) {
        dist[u] = nd;
        parent[u] = v;
        heap.push(u, greedy ? h(u) : nd + h(u));
        rec.relax(g.adjEdge[k], u);
      } else {
        rec.relax(g.adjEdge[k], -1);
      }
    }
  }
  const found = dist[t] < Infinity;
  return result(name, found ? unwind(parent, t) : [], dist[t], t0, rec);
}

export const dijkstra = (g: StreetGraph, s: number, t: number): RouteResult => bestFirst(g, s, t, 'dijkstra', () => 0);

/** weight 1: exact; weight w > 1: at most w times the shortest length (Pohl 1970), usually far fewer expansions. */
export const astar = (g: StreetGraph, s: number, t: number, weight = 1): RouteResult =>
  bestFirst(g, s, t, 'astar', (v) => weight * straightLine(g, v, t));

export const greedyBestFirst = (g: StreetGraph, s: number, t: number): RouteResult =>
  bestFirst(g, s, t, 'greedy', (v) => straightLine(g, v, t), true);

/** Dijkstra from both ends, alternating; the backward search follows in-edges. Stops when the two frontiers'
 * smallest keys add up to at least the best meeting cost found so far (no unexpanded pair can do better). */
export function bidirectionalDijkstra(g: StreetGraph, s: number, t: number): RouteResult {
  const t0 = performance.now();
  const rec = new SearchRecorder();
  const dist = [new Float64Array(g.n).fill(Infinity), new Float64Array(g.n).fill(Infinity)];
  const parent = [new Int32Array(g.n).fill(-1), new Int32Array(g.n).fill(-1)];
  const done = [new Uint8Array(g.n), new Uint8Array(g.n)];
  const heaps = [new MinHeap(), new MinHeap()];
  const arcs = [
    { start: g.adjStart, to: g.adjTo, len: g.adjLen, edge: g.adjEdge },
    { start: g.inStart, to: g.inFrom, len: g.inLen, edge: g.inEdge },
  ];
  dist[0][s] = 0;
  dist[1][t] = 0;
  heaps[0].push(s, 0);
  heaps[1].push(t, 0);
  let best = s === t ? 0 : Infinity;
  let meet = s === t ? s : -1;
  let side = 0;
  while (heaps[0].size && heaps[1].size && heaps[0].peekKey() + heaps[1].peekKey() < best) {
    const [v] = heaps[side].pop();
    if (!done[side][v]) {
      done[side][v] = 1;
      rec.expand(v, dist[side][v], side === 1);
      const a = arcs[side];
      for (let k = a.start[v]; k < a.start[v + 1]; k++) {
        const u = a.to[k];
        const nd = dist[side][v] + a.len[k];
        const improved = nd < dist[side][u];
        if (improved) {
          dist[side][u] = nd;
          parent[side][u] = v;
          heaps[side].push(u, nd);
        }
        rec.relax(a.edge[k], improved ? u : -1);
        const through = nd + dist[1 - side][u];
        if (through < best) {
          best = through;
          meet = u;
        }
      }
    }
    side = 1 - side;
  }
  let path: number[] = [];
  if (meet >= 0) {
    const forward = unwind(parent[0], meet);
    const backward = unwind(parent[1], meet).reverse().slice(1);
    path = [...forward, ...backward];
  }
  return result('bidirectional', path, pathCost(g, path), t0, rec);
}

/** Breadth-first search: the route with the fewest street segments, whatever their length. O(V + E). */
export function breadthFirst(g: StreetGraph, s: number, t: number): RouteResult {
  const t0 = performance.now();
  const rec = new SearchRecorder();
  const parent = new Int32Array(g.n).fill(-1);
  const seen = new Uint8Array(g.n);
  const metres = new Float64Array(g.n);
  const queue = new Int32Array(g.n);
  let head = 0;
  let tail = 0;
  queue[tail++] = s;
  seen[s] = 1;
  while (head < tail) {
    const v = queue[head++];
    rec.expand(v, metres[v]);
    if (v === t) break;
    for (let k = g.adjStart[v]; k < g.adjStart[v + 1]; k++) {
      const u = g.adjTo[k];
      if (!seen[u]) {
        seen[u] = 1;
        parent[u] = v;
        metres[u] = metres[v] + g.adjLen[k];
        queue[tail++] = u;
        rec.relax(g.adjEdge[k], u);
      } else {
        rec.relax(g.adjEdge[k], -1);
      }
    }
  }
  const path = seen[t] ? unwind(parent, t) : [];
  return result('bfs', path, pathCost(g, path), t0, rec);
}

/**
 * Bellman-Ford-Moore: a FIFO queue of nodes whose distance improved; a node can be expanded many times, and the
 * search only ends when no distance improves (it cannot stop at the destination). Allows negative lengths
 * (none here) and detects negative cycles; worst case O(V * E).
 */
export function bellmanFord(g: StreetGraph, s: number, t: number): RouteResult {
  const t0 = performance.now();
  const rec = new SearchRecorder();
  const dist = new Float64Array(g.n).fill(Infinity);
  const parent = new Int32Array(g.n).fill(-1);
  const inQueue = new Uint8Array(g.n);
  const expansions = new Int32Array(g.n);
  const queue = new Int32Array(g.n + 1); // circular; a node is at most once in the queue
  let head = 0;
  let size = 0;
  const enqueue = (v: number) => {
    queue[(head + size++) % queue.length] = v;
    inQueue[v] = 1;
  };
  dist[s] = 0;
  enqueue(s);
  while (size) {
    const v = queue[head];
    head = (head + 1) % queue.length;
    size--;
    inQueue[v] = 0;
    if (++expansions[v] > g.n) break; // a negative cycle (impossible with lengths >= 0); stop defensively
    rec.expand(v, dist[v]);
    for (let k = g.adjStart[v]; k < g.adjStart[v + 1]; k++) {
      const u = g.adjTo[k];
      const nd = dist[v] + g.adjLen[k];
      if (nd < dist[u]) {
        dist[u] = nd;
        parent[u] = v;
        if (!inQueue[u]) enqueue(u);
        rec.relax(g.adjEdge[k], u);
      } else {
        rec.relax(g.adjEdge[k], -1);
      }
    }
  }
  const found = dist[t] < Infinity;
  return result('bellmanFord', found ? unwind(parent, t) : [], dist[t], t0, rec);
}

// ------------------------------------------------------------------ ALT

/** Distances from `s` to every node (`reverse`: from every node to `s`, over in-edges). */
export function distancesFrom(g: StreetGraph, s: number, reverse = false): Float64Array {
  const start = reverse ? g.inStart : g.adjStart;
  const to = reverse ? g.inFrom : g.adjTo;
  const len = reverse ? g.inLen : g.adjLen;
  const dist = new Float64Array(g.n).fill(Infinity);
  const heap = new MinHeap();
  dist[s] = 0;
  heap.push(s, 0);
  while (heap.size) {
    const [v, d] = heap.pop();
    if (d > dist[v]) continue;
    for (let k = start[v]; k < start[v + 1]; k++) {
      const nd = d + len[k];
      if (nd < dist[to[k]]) {
        dist[to[k]] = nd;
        heap.push(to[k], nd);
      }
    }
  }
  return dist;
}

export interface Landmarks {
  nodes: number[];
  /** fromL[i * n + v] = distance landmark i -> v; toL[i * n + v] = distance v -> landmark i. */
  fromL: Float32Array;
  toL: Float32Array;
}

const landmarkCache = new WeakMap<StreetGraph, Landmarks>();
/** Float32 rounding of the stored distances (< 1 cm at 100 km): subtracted so that the bound stays admissible. */
const ROUNDING_M = 0.01;

/** `count` landmarks by farthest-point selection (Goldberg & Harrelson 2005): each new landmark is the node
 * farthest from the ones already chosen, so they spread to the edges of the network. Computed once per graph. */
export function landmarks(g: StreetGraph, count = 8): Landmarks {
  const cached = landmarkCache.get(g);
  if (cached) return cached;
  const k = Math.min(count, g.n);
  const fromL = new Float32Array(k * g.n);
  const toL = new Float32Array(k * g.n);
  const nearest = new Float64Array(g.n).fill(Infinity);
  const nodes: number[] = [];
  const seed = distancesFrom(g, 0);
  let next = argmaxFinite(seed);
  for (let i = 0; i < k; i++) {
    nodes.push(next);
    const from = distancesFrom(g, next);
    const to = g.directed ? distancesFrom(g, next, true) : from;
    fromL.set(from, i * g.n);
    toL.set(to, i * g.n);
    for (let v = 0; v < g.n; v++) nearest[v] = Math.min(nearest[v], from[v]);
    next = argmaxFinite(nearest);
  }
  const out = { nodes, fromL, toL };
  landmarkCache.set(g, out);
  return out;
}

function argmaxFinite(values: Float64Array): number {
  let best = 0;
  for (let v = 1; v < values.length; v++) {
    if (Number.isFinite(values[v]) && (!Number.isFinite(values[best]) || values[v] > values[best])) best = v;
  }
  return best;
}

/** Triangle inequality: d(v, t) >= d(L, t) - d(L, v) and d(v, t) >= d(v, L) - d(t, L), for every landmark L. */
export function altBound(g: StreetGraph, lm: Landmarks, v: number, t: number): number {
  let h = 0;
  for (let i = 0; i < lm.nodes.length; i++) {
    const o = i * g.n;
    const a = lm.fromL[o + t] - lm.fromL[o + v];
    const b = lm.toL[o + v] - lm.toL[o + t];
    if (Number.isFinite(a) && a > h) h = a;
    if (Number.isFinite(b) && b > h) h = b;
  }
  return Math.max(0, h - ROUNDING_M);
}

export function alt(g: StreetGraph, s: number, t: number, count = 8): RouteResult {
  const lm = landmarks(g, count);
  return bestFirst(g, s, t, 'alt', (v) => altBound(g, lm, v, t));
}
