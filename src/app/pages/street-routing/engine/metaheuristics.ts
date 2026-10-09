/**
 * Stochastic route optimisers: ant colony optimisation (Dorigo, Maniezzo & Colorni 1996), a genetic algorithm with
 * common-node crossover, and simulated annealing (Kirkpatrick, Gelatt & Vecchi 1983). None guarantees the shortest
 * route; they are shown because the same machinery handles objectives an exact search cannot (several criteria,
 * soft constraints). Each records every route it evaluates ({@link CandidateTrace}) and follows street directions.
 */

import { CandidateRecorder, RouteResult } from './search-trace';
import { StreetGraph, edgeBetween, pathCost, straightLine } from './street-graph';

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
 * so it reaches b whenever b can be reached from a; the walk is a simple path. Returns [] only if b is unreachable.
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

/** Whether b can be reached from a (one breadth-first pass): when it cannot, the stochastic searches stop at once
 * instead of exploring the origin's whole part of the network once per walk. */
export function reachable(g: StreetGraph, a: number, b: number): boolean {
  const seen = new Uint8Array(g.n);
  const queue = new Int32Array(g.n);
  let head = 0;
  let tail = 0;
  queue[tail++] = a;
  seen[a] = 1;
  while (head < tail) {
    const v = queue[head++];
    if (v === b) return true;
    for (let k = g.adjStart[v]; k < g.adjStart[v + 1]; k++) {
      if (!seen[g.adjTo[k]]) {
        seen[g.adjTo[k]] = 1;
        queue[tail++] = g.adjTo[k];
      }
    }
  }
  return false;
}

function finish(name: string, best: number[], cost: number, t0: number, rec: CandidateRecorder): RouteResult {
  return { algorithm: name, path: best, cost: best.length ? cost : Infinity, expanded: rec.steps, ms: performance.now() - t0, trace: rec.finish() };
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
  const rec = new CandidateRecorder();
  if (!reachable(g, s, t)) return finish('ants', [], Infinity, t0, rec);
  const random = rng(p.seed);
  const tau = new Float64Array(g.edgeLen.length).fill(1);
  let best: number[] = [];
  let bestCost = Infinity;
  for (let it = 0; it < p.iterations; it++) {
    const routes: Array<[number[], number]> = [];
    for (let ant = 0; ant < p.ants; ant++) {
      const path = biasedWalk(g, s, t, random, 1, tau, p.alpha, p.beta);
      const cost = path.length ? pathCost(g, path) : Infinity;
      rec.evaluate(path, cost);
      if (path.length) routes.push([path, cost]);
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
  }
  return finish('ants', best, bestCost, t0, rec);
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
  const j = Math.min(i + 2 + Math.floor(random() * (path.length - i - 2)), path.length - 1);
  const detour = biasedWalk(g, path[i], path[j], random, 0.6);
  return detour.length ? removeLoops([...path.slice(0, i), ...detour, ...path.slice(j + 1)]) : path;
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
  const rec = new CandidateRecorder();
  if (!reachable(g, s, t)) return finish('genetic', [], Infinity, t0, rec);
  const random = rng(p.seed);
  let population: Array<[number[], number]> = [];
  for (let tries = 0; population.length < p.population && tries < 10 * p.population; tries++) {
    const path = biasedWalk(g, s, t, random, 0.8);
    const cost = path.length ? pathCost(g, path) : Infinity;
    rec.evaluate(path, cost);
    if (path.length) population.push([path, cost]);
  }
  if (!population.length) return finish('genetic', [], Infinity, t0, rec);
  const pick = (): number[] => {
    let best = population[Math.floor(random() * population.length)];
    for (let k = 1; k < p.tournament; k++) {
      const c = population[Math.floor(random() * population.length)];
      if (c[1] < best[1]) best = c;
    }
    return best[0];
  };
  for (let gen = 0; gen < p.generations; gen++) {
    population.sort((x, y) => x[1] - y[1]);
    const next = population.slice(0, 2); // elitism
    while (next.length < population.length) {
      let child = random() < p.crossoverRate ? crossover(pick(), pick(), random) : pick();
      if (random() < p.mutationRate) child = mutate(g, child, random);
      const cost = pathCost(g, child);
      rec.evaluate(child, cost);
      next.push([child, cost]);
    }
    population = next;
  }
  const [best, cost] = population.reduce((a, b) => (b[1] < a[1] ? b : a));
  return finish('genetic', best, cost, t0, rec);
}

export interface AnnealingParams {
  temperature: number; // metres of extra length accepted with probability 1/e at the start
  cooling: number;
  iterations: number;
  seed: number;
}

export function simulatedAnnealing(g: StreetGraph, s: number, t: number, p: AnnealingParams): RouteResult {
  const t0 = performance.now();
  const rec = new CandidateRecorder();
  if (!reachable(g, s, t)) return finish('annealing', [], Infinity, t0, rec);
  const random = rng(p.seed);
  let current: number[] = [];
  for (let tries = 0; !current.length && tries < 50; tries++) {
    current = biasedWalk(g, s, t, random, 1);
    rec.evaluate(current, current.length ? pathCost(g, current) : Infinity);
  }
  if (!current.length) return finish('annealing', [], Infinity, t0, rec);
  let currentCost = pathCost(g, current);
  let best = current;
  let bestCost = currentCost;
  let temp = p.temperature;
  for (let it = 0; it < p.iterations; it++) {
    const candidate = mutate(g, current, random);
    const cost = pathCost(g, candidate);
    rec.evaluate(candidate, cost);
    if (cost < currentCost || random() < Math.exp((currentCost - cost) / Math.max(temp, 1e-9))) {
      current = candidate;
      currentCost = cost;
      if (cost < bestCost) {
        best = candidate;
        bestCost = cost;
      }
    }
    temp *= p.cooling;
  }
  return finish('annealing', best, bestCost, t0, rec);
}
