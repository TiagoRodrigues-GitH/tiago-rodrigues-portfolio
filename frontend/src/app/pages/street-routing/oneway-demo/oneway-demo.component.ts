import { Component, Input, OnDestroy, afterNextRender, computed, signal } from '@angular/core';
import { AlgorithmKey, DEFAULT_PARAMS, ORDER, runAlgorithm } from '../engine/algorithm-catalog';
import { NodeState, PlayerDelta, SearchPlayer } from '../engine/search-player';
import { RouteResult } from '../engine/search-trace';
import { StreetGraph, buildGraph, pathEdges } from '../engine/street-graph';
import { MapLegendComponent } from '../playback/map-legend.component';
import { PlaybackBarComponent } from '../playback/playback-bar.component';
import { PlaybackController, TraceRenderer } from '../playback/playback-controller';
import { StreetTranslations } from '../street-i18n';
import { DEMO_COLS, DEMO_ROWS, demoId, demoPayload, demoStreets } from './demo-graph';

const GAP = 90;
const PAD = 30;

/**
 * Didactic directed graph: the same engine, player and controls as the city map, on a small fictitious grid with
 * one-way streets drawn as arrows, so the effect of edge direction on a route can be seen in a few seconds.
 */
@Component({
  selector: 'app-oneway-demo',
  imports: [PlaybackBarComponent, MapLegendComponent],
  templateUrl: './oneway-demo.html',
  styleUrls: ['./oneway-demo.css'],
})
export class OnewayDemoComponent implements OnDestroy, TraceRenderer {
  @Input({ required: true }) t!: StreetTranslations;
  @Input({ required: true }) locale = 'pt-BR';

  readonly order = ORDER;
  readonly width = PAD * 2 + GAP * (DEMO_COLS - 1);
  readonly height = PAD * 2 + GAP * (DEMO_ROWS - 1);
  readonly nodes = Array.from({ length: DEMO_ROWS * DEMO_COLS }, (_, id) => ({
    id, row: Math.floor(id / DEMO_COLS), col: id % DEMO_COLS,
    x: PAD + (id % DEMO_COLS) * GAP, y: PAD + Math.floor(id / DEMO_COLS) * GAP,
  }));
  readonly streets = demoStreets().map((s, i) => ({ ...s, i }));

  readonly respect = signal(true);
  readonly algorithm = signal<AlgorithmKey>('dijkstra');
  readonly origin = signal(demoId(2, 0));
  readonly destination = signal(demoId(2, 5));
  private picking: 'origin' | 'destination' = 'origin';

  readonly controller = new PlaybackController();
  readonly nodeStates = signal<Uint8Array>(new Uint8Array(this.nodes.length));
  readonly evaluated = signal<Set<number>>(new Set());
  readonly routeEdges = signal<Set<number>>(new Set());
  readonly bestEdges = signal<Set<number>>(new Set());
  readonly comparison = signal('');

  private readonly graphs = computed(() => ({ directed: buildGraph(demoPayload(true)), undirected: buildGraph(demoPayload(false)) }));
  private readonly graph = computed<StreetGraph>(() => (this.respect() ? this.graphs().directed : this.graphs().undirected));

  constructor() {
    this.controller.setSpeed(1); // 3 steps/s: a 30-node search lasts a few seconds
    afterNextRender(() => this.run(false));
  }

  ngOnDestroy(): void {
    this.controller.clear();
  }

  // ------------------------------------------------------------------ controls

  setRespect(value: boolean): void {
    this.respect.set(value);
    this.run();
  }

  setAlgorithm(key: string): void {
    this.algorithm.set(key as AlgorithmKey);
    this.run();
  }

  pick(node: number): void {
    if (this.picking === 'origin') {
      this.origin.set(node);
      this.picking = 'destination';
    } else {
      this.destination.set(node);
      this.picking = 'origin';
      this.run();
    }
  }

  run(autoplay = true): void {
    const g = this.graph();
    const result = runAlgorithm(g, this.algorithm(), this.origin(), this.destination(), { ...DEFAULT_PARAMS, iterations: 15, generations: 20, saIterations: 300 });
    this.compare();
    this.controller.load(result, new SearchPlayer(result.trace, g.n, g.edgeLen.length, (path) => pathEdges(g, path)), this, autoplay);
  }

  private compare(): void {
    const km = (m: number) => (Number.isFinite(m) ? `${(m / 1000).toLocaleString(this.locale, { maximumFractionDigits: 2 })} km` : this.t.noRouteShort);
    const withOneway = runAlgorithm(this.graphs().directed, 'dijkstra', this.origin(), this.destination()).cost;
    const without = runAlgorithm(this.graphs().undirected, 'dijkstra', this.origin(), this.destination()).cost;
    this.comparison.set(this.t.onewayCompare.replace('{with}', km(withOneway)).replace('{without}', km(without)));
  }

  // ------------------------------------------------------------------ TraceRenderer

  reset(): void {
    this.nodeStates.set(new Uint8Array(this.nodes.length));
    this.evaluated.set(new Set());
    this.routeEdges.set(new Set());
    this.bestEdges.set(new Set());
  }

  apply(delta: PlayerDelta): void {
    if (delta.nodes.length) {
      const states = this.nodeStates().slice();
      for (const [v, s] of delta.nodes) states[v] = s;
      this.nodeStates.set(states);
    }
    if (delta.edges.length) this.evaluated.set(new Set([...this.evaluated(), ...delta.edges]));
    if (delta.best) this.bestEdges.set(new Set(pathEdges(this.graph(), delta.best)));
  }

  finish(result: RouteResult): void {
    this.bestEdges.set(new Set());
    this.routeEdges.set(new Set(pathEdges(this.graph(), result.path)));
  }

  // ------------------------------------------------------------------ template helpers

  nodeClass(id: number): string {
    const s = this.nodeStates()[id];
    if (id === this.origin()) return 'od-node od-origin';
    if (id === this.destination()) return 'od-node od-destination';
    return s === NodeState.Frontier ? 'od-node od-frontier' : s === NodeState.Visited ? 'od-node od-visited' : s === NodeState.VisitedBackward ? 'od-node od-backward' : 'od-node';
  }

  streetClass(i: number, oneway: boolean): string {
    const parts = ['od-street'];
    if (oneway && this.respect()) parts.push('od-oneway');
    if (this.routeEdges().has(i)) parts.push('od-route');
    else if (this.bestEdges().has(i)) parts.push('od-best');
    else if (this.evaluated().has(i)) parts.push('od-evaluated');
    return parts.join(' ');
  }

  /** Polyline from u to v through the midpoint, so the arrow (marker-mid) sits in the middle of the block. */
  points(u: number, v: number): string {
    const a = this.nodes[u];
    const b = this.nodes[v];
    return `${a.x},${a.y} ${(a.x + b.x) / 2},${(a.y + b.y) / 2} ${b.x},${b.y}`;
  }

  nodeLabel(id: number): string {
    const n = this.nodes[id];
    const role = id === this.origin() ? ` · ${this.t.legend.origin}` : id === this.destination() ? ` · ${this.t.legend.destination}` : '';
    return `${n.row + 1}, ${n.col + 1}${role}`;
  }
}
