/**
 * Path-finding on a city street graph, in the browser (no server). Facade over `engine/`, kept so that existing
 * imports of this module still work:
 *
 * - `engine/street-graph`: the graph (out- and in-edges, one-way streets) and geometry helpers;
 * - `engine/exact-search`: Dijkstra, A*, ALT, bidirectional Dijkstra, Bellman-Ford-Moore, BFS, greedy search;
 * - `engine/metaheuristics`: ant colony, genetic algorithm, simulated annealing;
 * - `engine/search-trace`: the step-by-step record each algorithm leaves for the animation;
 * - `engine/search-player`: replays a record at any speed, independently of the drawing;
 * - `engine/algorithm-catalog`: the registry of algorithms and parameters used by the page.
 */

export * from './engine/street-graph';
export * from './engine/search-trace';
export * from './engine/exact-search';
export * from './engine/metaheuristics';
export * from './engine/algorithm-catalog';
