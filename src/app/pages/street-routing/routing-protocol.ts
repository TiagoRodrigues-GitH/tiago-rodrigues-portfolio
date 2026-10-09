/**
 * Messages between the page and the routing worker, and the request handler shared by the worker and by the
 * in-page fallback (browsers or tests without Web Workers): both compute exactly the same way.
 */

import { AlgorithmKey, Params, runAlgorithm } from './engine/algorithm-catalog';
import { dijkstra } from './engine/exact-search';
import { RouteResult, transferables } from './engine/search-trace';
import { GraphPayload, StreetGraph, buildGraph } from './engine/street-graph';

export type RoutingRequest =
  | { id: number; type: 'load'; area: string; url: string }
  | { id: number; type: 'run'; area: string; key: AlgorithmKey; s: number; t: number; params: Params; optimum: boolean };

export type RoutingReply =
  | { id: number; type: 'loaded' }
  | { id: number; type: 'result'; result: RouteResult; optimum: number | null }
  | { id: number; type: 'error'; message: string };

type Reply = (reply: RoutingReply, transfer: Transferable[]) => void;

const graphs = new Map<string, Promise<StreetGraph>>();

async function fetchGraph(url: string): Promise<StreetGraph> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return buildGraph((await response.json()) as GraphPayload);
}

/** Keeps the graphs of the areas loaded in this session (switching back to a city is instant). */
export async function handleRoutingRequest(req: RoutingRequest, reply: Reply, load: (url: string) => Promise<StreetGraph> = fetchGraph): Promise<void> {
  try {
    if (req.type === 'load') {
      if (!graphs.has(req.area)) graphs.set(req.area, load(req.url));
      try {
        await graphs.get(req.area);
      } catch (err) {
        graphs.delete(req.area); // let a later attempt retry
        throw err;
      }
      reply({ id: req.id, type: 'loaded' }, []);
      return;
    }
    const pending = graphs.get(req.area);
    if (!pending) throw new Error(`graph ${req.area} not loaded`);
    const g = await pending;
    const result = runAlgorithm(g, req.key, req.s, req.t, req.params);
    const optimum = req.optimum ? (req.key === 'dijkstra' ? result.cost : dijkstra(g, req.s, req.t).cost) : null;
    reply({ id: req.id, type: 'result', result, optimum }, transferables(result.trace));
  } catch (err) {
    reply({ id: req.id, type: 'error', message: err instanceof Error ? err.message : String(err) }, []);
  }
}
