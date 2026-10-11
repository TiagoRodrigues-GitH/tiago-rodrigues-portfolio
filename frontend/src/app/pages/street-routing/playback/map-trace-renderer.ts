import { PlayerDelta } from '../engine/search-player';
import { RouteResult } from '../engine/search-trace';
import { StreetGraph, routeCoordinates } from '../engine/street-graph';
import { MapView } from '../map-view';
import { TraceRenderer } from './playback-controller';

/** Draws a replay on the city map: node and street states as feature-state, routes as lines. */
export class MapTraceRenderer implements TraceRenderer {
  constructor(private readonly map: MapView, private readonly graph: StreetGraph) {}

  reset(): void {
    this.map.clearTrace();
    this.map.setRoute(null);
  }

  apply(delta: PlayerDelta): void {
    this.map.setNodeStates(delta.nodes);
    this.map.markEvaluated(delta.edges);
    if (delta.candidate) this.map.setCandidate(routeCoordinates(this.graph, delta.candidate));
    if (delta.best) this.map.setBest(routeCoordinates(this.graph, delta.best));
  }

  finish(result: RouteResult): void {
    this.map.setCandidate(null);
    this.map.setBest(null);
    this.map.setRoute(result.path.length > 1 ? routeCoordinates(this.graph, result.path) : null);
  }
}
