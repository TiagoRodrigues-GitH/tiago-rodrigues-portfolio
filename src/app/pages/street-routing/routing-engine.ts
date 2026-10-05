/**
 * Path-finding on a city street graph, in the browser (no server).
 *
 * Every algorithm has the same signature and returns a {@link RouteResult} with a trace for the animation:
 * exact searches record the order in which they settle nodes; metaheuristics record their best route after every
 * iteration. Distances are metres; the heuristic is the straight-line distance on a local equirectangular
 * projection, which never overestimates the street distance, so A* with weight 1 stays exact.
 *
 * Algorithms: Dijkstra (1959), A* (Hart, Nilsson and Raphael 1968), bidirectional Dijkstra, greedy best-first
 * search, ant colony optimisation (Dorigo et al. 1996), a genetic algorithm with common-node crossover and
 * simulated annealing (Kirkpatrick et al. 1983).
 */

export interface GraphPayload {
  municipality: { code: number; name: string };
  nodes: number[]; // lon, lat, lon, lat, ...
  edges: number[]; // u, v, length in decimetres, name index, ...
  lines: number[][]; // one polyline (lon, lat, ...) per edge
  names: string[];
  /** Edges that are estimated links between parts of the network, not IBGE streets. */
  bridged?: number[];
}

export interface StreetGraph {
  n: number;
  lon: Float64Array;
  lat: Float64Array;
  x: Float64Array; // metres east of the city centre
  y: Float64Array; // metres north of the city centre
  adjStart: Int32Array; // CSR: neighbours of v are adjTo[adjStart[v] .. adjStart[v+1])
  adjTo: Int32Array;
  adjLen: Float64Array;
  adjEdge: Int32Array;
  edgeU: Int32Array;
  edgeV: Int32Array;
  edgeLen: Float64Array;
  edgeName: Int32Array;
  lines: number[][];
  names: string[];
}

export interface RouteResult {
  algorithm: string;
  path: number[]; // nodes from source to target ([] if no route was found)
  cost: number; // metres (Infinity if no route)
  expanded: number; // nodes settled (exact) or route evaluations (metaheuristics)
  ms: number;
  /** Exact searches: settled nodes in order (negative = settled by the backward search). */
  visits?: Int32Array;
  /** Metaheuristics: best route after each iteration. */
  iterations?: number[][];
}

const EARTH_M_PER_DEG = 111_320;

export function buildGraph(p: GraphPayload): StreetGraph {
  const n = p.nodes.length / 2;
  const lon = new Float64Array(n);
  const lat = new Float64Array(n);
  let lon0 = 0;
  let lat0 = 0;
  for (let i = 0; i < n; i++) {
    lon[i] = p.nodes[2 * i];
    lat[i] = p.nodes[2 * i + 1];
    lon0 += lon[i] / n;
    lat0 += lat[i] / n;
  }
  const kx = EARTH_M_PER_DEG * Math.cos((lat0 * Math.PI) / 180);
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    x[i] = (lon[i] - lon0) * kx;
    y[i] = (lat[i] - lat0) * EARTH_M_PER_DEG;
  }
  const m = p.edges.length / 4;
  const edgeU = new Int32Array(m);
  const edgeV = new Int32Array(m);
  const edgeLen = new Float64Array(m);
  const edgeName = new Int32Array(m);
  const degree = new Int32Array(n + 1);
  for (let e = 0; e < m; e++) {
    edgeU[e] = p.edges[4 * e];
    edgeV[e] = p.edges[4 * e + 1];
    edgeLen[e] = p.edges[4 * e + 2] / 10;
    edgeName[e] = p.edges[4 * e + 3];
    degree[edgeU[e] + 1]++;
    degree[edgeV[e] + 1]++;
  }
  const adjStart = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) adjStart[i + 1] = adjStart[i] + degree[i + 1];
  const fill = adjStart.slice(0, n);
  const adjTo = new Int32Array(2 * m);
  const adjLen = new Float64Array(2 * m);
  const adjEdge = new Int32Array(2 * m);
  for (let e = 0; e < m; e++) {
    for (const [a, b] of [
      [edgeU[e], edgeV[e]],
      [edgeV[e], edgeU[e]],
    ]) {
      const k = fill[a]++;
      adjTo[k] = b;
      adjLen[k] = edgeLen[e];
      adjEdge[k] = e;
    }
  }
  return { n, lon, lat, x, y, adjStart, adjTo, adjLen, adjEdge, edgeU, edgeV, edgeLen, edgeName, lines: p.lines, names: p.names };
}

export function straightLine(g: StreetGraph, a: number, b: number): number {
  return Math.hypot(g.x[a] - g.x[b], g.y[a] - g.y[b]);
}

/** Bounding box [west, south, east, north] of the nodes, in degrees. */
export function graphBounds(g: StreetGraph): [number, number, number, number] {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (let v = 0; v < g.n; v++) {
    w = Math.min(w, g.lon[v]);
    e = Math.max(e, g.lon[v]);
    s = Math.min(s, g.lat[v]);
    n = Math.max(n, g.lat[v]);
  }
  return [w, s, e, n];
}

/** Nearest node to a clicked point (linear scan: fast enough for ~10^5 nodes on a click). */
export function nearestNode(g: StreetGraph, lon: number, lat: number): number {
  const kx = Math.cos((lat * Math.PI) / 180);
  let best = -1;
  let bestD = Infinity;
  for (let i = 0; i < g.n; i++) {
    const d = ((g.lon[i] - lon) * kx) ** 2 + (g.lat[i] - lat) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

export function pathCost(g: StreetGraph, path: number[]): number {
  let cost = 0;
  for (let i = 1; i < path.length; i++) {
    const w = edgeBetween(g, path[i - 1], path[i]);
    if (w < 0) return Infinity;
    cost += g.adjLen[w];
  }
  return cost;
}

/** Index into adj* of the shortest edge a -> b, or -1. */
export function edgeBetween(g: StreetGraph, a: number, b: number): number {
  let best = -1;
  for (let k = g.adjStart[a]; k < g.adjStart[a + 1]; k++) {
    if (g.adjTo[k] === b && (best < 0 || g.adjLen[k] < g.adjLen[best])) best = k;
  }
  return best;
}

// ------------------------------------------------------------------ priority queue

class MinHeap {
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

// ------------------------------------------------------------------ exact and heuristic searches

/** Best-first search with priority g + w*h (Dijkstra: w = 0; A*: w = 1; weighted A*: w > 1). */
function bestFirst(g: StreetGraph, s: number, t: number, w: number, name: string, greedy = false): RouteResult {
  const t0 = performance.now();
  const dist = new Float64Array(g.n).fill(Infinity);
  const parent = new Int32Array(g.n).fill(-1);
  const done = new Uint8Array(g.n);
  const visits: number[] = [];
  const heap = new MinHeap();
  dist[s] = 0;
  heap.push(s, 0);
  while (heap.size) {
    const [v] = heap.pop();
    if (done[v]) continue;
    done[v] = 1;
    visits.push(v);
    if (v === t) break;
    for (let k = g.adjStart[v]; k < g.adjStart[v + 1]; k++) {
      const u = g.adjTo[k];
      const nd = dist[v] + g.adjLen[k];
      if (!done[u] && nd < dist[u]) {
        dist[u] = nd;
        parent[u] = v;
        const h = w > 0 ? straightLine(g, u, t) : 0;
        heap.push(u, greedy ? h : nd + w * h);
      }
    }
  }
  const found = dist[t] < Infinity;
  return {
    algorithm: name,
    path: found ? unwind(parent, t) : [],
    cost: dist[t],
    expanded: visits.length,
    ms: performance.now() - t0,
    visits: Int32Array.from(visits),
  };
}

export const dijkstra = (g: StreetGraph, s: number, t: number): RouteResult => bestFirst(g, s, t, 0, 'dijkstra');
export const astar = (g: StreetGraph, s: number, t: number, weight = 1): RouteResult =>
  bestFirst(g, s, t, weight, 'astar');
export const greedyBestFirst = (g: StreetGraph, s: number, t: number): RouteResult =>
  bestFirst(g, s, t, 1, 'greedy', true);

/** Dijkstra from both ends, alternating; stops when the two frontiers' smallest keys add up to at least the best
 * meeting cost found so far (no unsettled pair can then give a shorter route). */
export function bidirectionalDijkstra(g: StreetGraph, s: number, t: number): RouteResult {
  const t0 = performance.now();
  const dist = [new Float64Array(g.n).fill(Infinity), new Float64Array(g.n).fill(Infinity)];
  const parent = [new Int32Array(g.n).fill(-1), new Int32Array(g.n).fill(-1)];
  const done = [new Uint8Array(g.n), new Uint8Array(g.n)];
  const heaps = [new MinHeap(), new MinHeap()];
  const visits: number[] = [];
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
      visits.push(side === 0 ? v : -v - 1);
      for (let k = g.adjStart[v]; k < g.adjStart[v + 1]; k++) {
        const u = g.adjTo[k];
        const nd = dist[side][v] + g.adjLen[k];
        if (nd < dist[side][u]) {
          dist[side][u] = nd;
          parent[side][u] = v;
          heaps[side].push(u, nd);
        }
        const through = dist[side][v] + g.adjLen[k] + dist[1 - side][u];
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
  return { algorithm: 'bidirectional', path, cost: path.length ? pathCost(g, path) : Infinity, expanded: visits.length, ms: performance.now() - t0, visits: Int32Array.from(visits) };
}

// ------------------------------------------------------------------ metaheuristics

/** Deterministic pseudo-random generator (mulberry32), so a run can be repeated with the same seed. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Remove cycles: keep the last occurrence of every node. */
export function removeLoops(path: number[]): number[] {
  const out: number[] = [];
  const index = new Map<number, number>();
  for (const v of path) {
    const seen = index.get(v);
    if (seen !== undefined) {
      for (let i = seen + 1; i < out.length; i++) index.delete(out[i]);
      out.length = seen + 1;
    } else {
      index.set(v, out.length);
      out.push(v);
    }
  }
  return out;
}

/**
 * A self-avoiding random walk from a to b biased towards b (the ants' memory of visited nodes, Dorigo & Stutzle
 * 2004): the next unvisited node is drawn with probability proportional to exp(-greed * (h(next) - h(current)) /
 * scale), and a node without unvisited neighbours is left by backtracking. It is a randomised depth-first search,
 * so it reaches b whenever b is connected to a (a plain biased walk stays trapped in front of a river or a long
 * block); the walk is a simple path. Returns [] only if b cannot be reached.
 */
function biasedWalk(g: StreetGraph, a: number, b: number, random: () => number, greed: number, pheromone?: Float64Array, alpha = 1, beta = 2): number[] {
  const scale = 50; // metres
  const maxSteps = 2 * g.n + 1; // a depth-first search moves along each tree edge at most twice
  const visited = new Uint8Array(g.n);
  const walk = [a];
  visited[a] = 1;
  const weights: number[] = [];
  const options: number[] = [];
  for (let step = 0; step < maxSteps && walk.length && walk[walk.length - 1] !== b; step++) {
    const v = walk[walk.length - 1];
    weights.length = 0;
    options.length = 0;
    let total = 0;
    for (let k = g.adjStart[v]; k < g.adjStart[v + 1]; k++) {
      const u = g.adjTo[k];
      if (visited[u]) continue;
      const gain = (straightLine(g, v, b) - straightLine(g, u, b)) / scale;
      let wgt = Math.exp(Math.max(-30, Math.min(30, greed * gain)));
      if (pheromone) wgt = pheromone[g.adjEdge[k]] ** alpha * wgt ** beta;
      weights.push(wgt);
      options.push(u);
      total += wgt;
    }
    if (!options.length) {
      walk.pop(); // dead end: back to the previous node
      continue;
    }
    let r = random() * total;
    let i = 0;
    while (i < options.length - 1 && (r -= weights[i]) > 0) i++;
    visited[options[i]] = 1;
    walk.push(options[i]);
  }
  return walk.length && walk[walk.length - 1] === b ? walk : [];
}

export interface AntParams {
  ants: number;
  iterations: number;
  alpha: number; // weight of the pheromone
  beta: number; // weight of the heuristic (closeness to the target)
  evaporation: number;
  seed: number;
}

export function antColony(g: StreetGraph, s: number, t: number, p: AntParams): RouteResult {
  const t0 = performance.now();
  const random = rng(p.seed);
  const tau = new Float64Array(g.edgeLen.length).fill(1);
  let best: number[] = [];
  let bestCost = Infinity;
  const iterations: number[][] = [];
  let evaluations = 0;
  for (let it = 0; it < p.iterations; it++) {
    const routes: Array<[number[], number]> = [];
    for (let ant = 0; ant < p.ants; ant++) {
      const path = biasedWalk(g, s, t, random, 1, tau, p.alpha, p.beta);
      evaluations++;
      if (path.length) routes.push([path, pathCost(g, path)]);
    }
    for (let e = 0; e < tau.length; e++) tau[e] = Math.max(1e-3, tau[e] * (1 - p.evaporation));
    for (const [path, cost] of routes) {
      if (cost < bestCost) {
        bestCost = cost;
        best = path;
      }
      const deposit = (straightLine(g, s, t) + 1) / cost; // ~1 for a near-straight route
      for (let i = 1; i < path.length; i++) tau[g.adjEdge[edgeBetween(g, path[i - 1], path[i])]] += deposit;
    }
    iterations.push(best);
  }
  return { algorithm: 'ants', path: best, cost: bestCost, expanded: evaluations, ms: performance.now() - t0, iterations };
}

export interface GeneticParams {
  population: number;
  generations: number;
  crossoverRate: number;
  mutationRate: number;
  tournament: number;
  seed: number;
}

/** Replace the part of the route between two random positions by a new biased walk. */
function mutate(g: StreetGraph, path: number[], random: () => number): number[] {
  if (path.length < 3) return path;
  const i = Math.floor(random() * (path.length - 2));
  const j = i + 2 + Math.floor(random() * (path.length - i - 2));
  const detour = biasedWalk(g, path[i], path[Math.min(j, path.length - 1)], random, 0.6);
  return detour.length ? removeLoops([...path.slice(0, i), ...detour, ...path.slice(Math.min(j, path.length - 1) + 1)]) : path;
}

/** Common-node crossover: the head of one parent up to a node they share, the tail of the other after it. */
function crossover(a: number[], b: number[], random: () => number): number[] {
  const inB = new Map(b.map((v, i) => [v, i] as [number, number]));
  const common = a.map((v, i) => [i, inB.get(v)] as [number, number | undefined]).filter(([, j]) => j !== undefined);
  if (common.length <= 2) return a;
  const [i, j] = common[1 + Math.floor(random() * (common.length - 2))] as [number, number];
  return removeLoops([...a.slice(0, i), ...b.slice(j)]);
}

export function geneticAlgorithm(g: StreetGraph, s: number, t: number, p: GeneticParams): RouteResult {
  const t0 = performance.now();
  const random = rng(p.seed);
  let population: Array<[number[], number]> = [];
  let evaluations = 0;
  for (let tries = 0; population.length < p.population && tries < 10 * p.population; tries++) {
    const path = biasedWalk(g, s, t, random, 0.8);
    evaluations++;
    if (path.length) population.push([path, pathCost(g, path)]);
  }
  if (!population.length) return { algorithm: 'genetic', path: [], cost: Infinity, expanded: evaluations, ms: performance.now() - t0, iterations: [] };
  const pick = (): number[] => {
    let best = population[Math.floor(random() * population.length)];
    for (let k = 1; k < p.tournament; k++) {
      const c = population[Math.floor(random() * population.length)];
      if (c[1] < best[1]) best = c;
    }
    return best[0];
  };
  const iterations: number[][] = [];
  for (let gen = 0; gen < p.generations; gen++) {
    population.sort((x, y) => x[1] - y[1]);
    const next = population.slice(0, 2); // elitism
    while (next.length < population.length) {
      let child = random() < p.crossoverRate ? crossover(pick(), pick(), random) : pick();
      if (random() < p.mutationRate) child = mutate(g, child, random);
      evaluations++;
      next.push([child, pathCost(g, child)]);
    }
    population = next;
    iterations.push(population.reduce((a, b) => (b[1] < a[1] ? b : a))[0]);
  }
  const [best, cost] = population.reduce((a, b) => (b[1] < a[1] ? b : a));
  return { algorithm: 'genetic', path: best, cost, expanded: evaluations, ms: performance.now() - t0, iterations };
}

export interface AnnealingParams {
  temperature: number; // metres of extra length accepted with probability 1/e at the start
  cooling: number;
  iterations: number;
  seed: number;
}

export function simulatedAnnealing(g: StreetGraph, s: number, t: number, p: AnnealingParams): RouteResult {
  const t0 = performance.now();
  const random = rng(p.seed);
  let current = biasedWalk(g, s, t, random, 1);
  for (let tries = 0; !current.length && tries < 50; tries++) current = biasedWalk(g, s, t, random, 1);
  if (!current.length) return { algorithm: 'annealing', path: [], cost: Infinity, expanded: 0, ms: performance.now() - t0, iterations: [] };
  let currentCost = pathCost(g, current);
  let best = current;
  let bestCost = currentCost;
  let temp = p.temperature;
  const iterations: number[][] = [];
  const every = Math.max(1, Math.floor(p.iterations / 100));
  for (let it = 0; it < p.iterations; it++) {
    const candidate = mutate(g, current, random);
    const cost = pathCost(g, candidate);
    if (cost < currentCost || random() < Math.exp((currentCost - cost) / Math.max(temp, 1e-9))) {
      current = candidate;
      currentCost = cost;
      if (cost < bestCost) {
        best = candidate;
        bestCost = cost;
      }
    }
    temp *= p.cooling;
    if (it % every === 0) iterations.push(best);
  }
  return { algorithm: 'annealing', path: best, cost: bestCost, expanded: p.iterations, ms: performance.now() - t0, iterations };
}
