/**
 * The algorithms offered on the page, as a registry: the order of the selector, the tunable parameters with their
 * ranges, and how to run each one. Texts (names, descriptions, complexity) live in the i18n file under the same keys.
 */

import { alt, astar, bellmanFord, bidirectionalDijkstra, breadthFirst, dijkstra, greedyBestFirst } from './exact-search';
import { antColony, geneticAlgorithm, simulatedAnnealing } from './metaheuristics';
import { RouteResult } from './search-trace';
import { StreetGraph } from './street-graph';

export type AlgorithmKey =
  | 'dijkstra' | 'astar' | 'alt' | 'bidirectional' | 'bellmanFord' | 'bfs' | 'greedy' | 'ants' | 'genetic' | 'annealing';

export interface ParamSpec {
  key: string;
  min: number;
  max: number;
  step: number;
}

export type Params = Record<string, number>;

export interface AlgorithmEntry {
  /** Shortest route guaranteed (with the default parameters). */
  exact: boolean;
  params: ParamSpec[];
  run(g: StreetGraph, s: number, t: number, p: Params): RouteResult;
}

const SEED: ParamSpec = { key: 'seed', min: 1, max: 99, step: 1 };

export const ALGORITHMS: Record<AlgorithmKey, AlgorithmEntry> = {
  dijkstra: { exact: true, params: [], run: (g, s, t) => dijkstra(g, s, t) },
  astar: { exact: true, params: [{ key: 'weight', min: 1, max: 5, step: 0.5 }], run: (g, s, t, p) => astar(g, s, t, p['weight']) },
  alt: { exact: true, params: [], run: (g, s, t) => alt(g, s, t) },
  bidirectional: { exact: true, params: [], run: (g, s, t) => bidirectionalDijkstra(g, s, t) },
  bellmanFord: { exact: true, params: [], run: (g, s, t) => bellmanFord(g, s, t) },
  bfs: { exact: false, params: [], run: (g, s, t) => breadthFirst(g, s, t) },
  greedy: { exact: false, params: [], run: (g, s, t) => greedyBestFirst(g, s, t) },
  ants: {
    exact: false,
    params: [
      { key: 'ants', min: 5, max: 60, step: 5 }, { key: 'iterations', min: 5, max: 100, step: 5 },
      { key: 'alpha', min: 0, max: 3, step: 0.25 }, { key: 'beta', min: 0, max: 5, step: 0.25 },
      { key: 'evaporation', min: 0.01, max: 0.5, step: 0.01 }, SEED,
    ],
    run: (g, s, t, p) => antColony(g, s, t, { ants: p['ants'], iterations: p['iterations'], alpha: p['alpha'], beta: p['beta'], evaporation: p['evaporation'], seed: p['seed'] }),
  },
  genetic: {
    exact: false,
    params: [
      { key: 'population', min: 10, max: 100, step: 10 }, { key: 'generations', min: 10, max: 150, step: 10 },
      { key: 'mutationRate', min: 0, max: 1, step: 0.05 }, SEED,
    ],
    run: (g, s, t, p) => geneticAlgorithm(g, s, t, { population: p['population'], generations: p['generations'], crossoverRate: 0.8, mutationRate: p['mutationRate'], tournament: 3, seed: p['seed'] }),
  },
  annealing: {
    exact: false,
    params: [
      { key: 'temperature', min: 50, max: 3000, step: 50 }, { key: 'cooling', min: 0.9, max: 0.999, step: 0.001 },
      { key: 'saIterations', min: 200, max: 5000, step: 100 }, SEED,
    ],
    run: (g, s, t, p) => simulatedAnnealing(g, s, t, { temperature: p['temperature'], cooling: p['cooling'], iterations: p['saIterations'], seed: p['seed'] }),
  },
};

/** Order of the selector: exact searches first, then heuristic, then stochastic ones. */
export const ORDER: AlgorithmKey[] = ['dijkstra', 'astar', 'alt', 'bidirectional', 'bellmanFord', 'bfs', 'greedy', 'ants', 'genetic', 'annealing'];

export const DEFAULT_PARAMS: Params = {
  weight: 1, ants: 20, iterations: 40, alpha: 1, beta: 2, evaporation: 0.1, seed: 1,
  population: 40, generations: 60, mutationRate: 0.2, temperature: 500, cooling: 0.995, saIterations: 2000,
};

export function runAlgorithm(g: StreetGraph, key: AlgorithmKey, s: number, t: number, p: Params = DEFAULT_PARAMS): RouteResult {
  return ALGORITHMS[key].run(g, s, t, { ...DEFAULT_PARAMS, ...p });
}

/** The shortest-route guarantee depends on the parameters for A* (weight 1 only). */
export function isExact(key: AlgorithmKey, p: Params): boolean {
  return key === 'astar' ? (p['weight'] ?? 1) === 1 : ALGORITHMS[key].exact;
}
