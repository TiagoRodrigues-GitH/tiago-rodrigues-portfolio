/**
 * Replays a recorded {@link Trace} step by step, independently of any drawing: `advance(n)` returns only what changed
 * (nodes whose state changed, edges evaluated for the first time, the route under evaluation), so a renderer can
 * update a map incrementally. `PlaybackClock` turns elapsed time into a number of steps at the chosen speed.
 */

import { SearchTrace, Trace, candidateAt, traceSteps } from './search-trace';

export const NodeState = {
  Unexplored: 0,
  Frontier: 1, // waiting to be expanded
  Visited: 2, // expanded by the search from the origin
  VisitedBackward: 3, // expanded by the search from the destination (bidirectional)
} as const;
export type NodeState = (typeof NodeState)[keyof typeof NodeState];

export interface PlayerDelta {
  nodes: Array<[number, NodeState]>;
  edges: number[];
  /** Candidate traces: the route evaluated at the last step played, and the best one so far. */
  candidate: number[] | null;
  best: number[] | null;
}

export class SearchPlayer {
  private position = 0;
  private visited = new Uint8Array(0); // 0, Visited or VisitedBackward
  private frontier = new Uint8Array(0);
  private edgeSeen = new Uint8Array(0);
  private frontierCount = 0;
  private visitedCount = 0;
  private edgeCount = 0;
  private lastLabel = NaN;

  /** `nodes`, `edges`: sizes of the graph; `edgesOf`: edge indices of a route (candidate traces). */
  constructor(
    readonly trace: Trace,
    private readonly nodes: number,
    private readonly edges: number,
    private readonly edgesOf: (path: number[]) => number[],
  ) {
    this.reset();
  }

  get step(): number {
    return this.position;
  }
  get total(): number {
    return traceSteps(this.trace);
  }
  get done(): boolean {
    return this.position >= this.total;
  }
  get frontierSize(): number {
    return this.frontierCount;
  }
  get visitedSize(): number {
    return this.visitedCount;
  }
  get evaluatedEdges(): number {
    return this.edgeCount;
  }
  /** Distance label of the last node expanded (searches) or the best length so far (candidates). */
  get label(): number {
    return this.lastLabel;
  }

  reset(): void {
    this.position = 0;
    this.visited = new Uint8Array(this.nodes);
    this.frontier = new Uint8Array(this.nodes);
    this.edgeSeen = new Uint8Array(this.edges);
    this.frontierCount = this.visitedCount = this.edgeCount = 0;
    this.lastLabel = NaN;
  }

  /** Plays up to `n` more steps. */
  advance(n: number): PlayerDelta {
    const end = Math.min(this.total, this.position + Math.max(0, Math.floor(n)));
    const touched = new Set<number>();
    const edges: number[] = [];
    let candidate: number[] | null = null;
    let best: number[] | null = null;
    const markEdge = (e: number) => {
      if (!this.edgeSeen[e]) {
        this.edgeSeen[e] = 1;
        this.edgeCount++;
        edges.push(e);
      }
    };
    if (this.trace.kind === 'search') {
      for (; this.position < end; this.position++) this.playSearchStep(this.trace, this.position, touched, markEdge);
    } else if (end > this.position) {
      const trace = this.trace;
      for (; this.position < end; this.position++) {
        for (const e of this.edgesOf(candidateAt(trace, this.position))) markEdge(e);
      }
      candidate = candidateAt(trace, end - 1);
      const b = trace.best[end - 1];
      best = b >= 0 ? candidateAt(trace, b) : null;
      this.lastLabel = b >= 0 ? trace.cost[b] : NaN;
    }
    return { nodes: [...touched].map((v) => [v, this.state(v)] as [number, NodeState]), edges, candidate, best };
  }

  private playSearchStep(trace: SearchTrace, i: number, touched: Set<number>, markEdge: (e: number) => void): void {
    const raw = trace.settled[i];
    const backward = raw < 0;
    const v = backward ? -raw - 1 : raw;
    if (this.frontier[v]) {
      this.frontier[v] = 0;
      this.frontierCount--;
    }
    if (!this.visited[v]) this.visitedCount++;
    this.visited[v] = backward ? NodeState.VisitedBackward : NodeState.Visited;
    this.lastLabel = trace.label[i];
    touched.add(v);
    for (let r = trace.relaxStart[i]; r < trace.relaxStart[i + 1]; r++) {
      markEdge(trace.relaxEdge[r]);
      const u = trace.relaxPush[r];
      if (u >= 0 && !this.frontier[u]) {
        this.frontier[u] = 1;
        this.frontierCount++;
        touched.add(u);
      }
    }
  }

  /** Waiting in the frontier wins over visited: Bellman-Ford can queue a node again after expanding it. */
  state(v: number): NodeState {
    return this.frontier[v] ? NodeState.Frontier : (this.visited[v] as NodeState);
  }
}

/** Speeds offered by the page, in steps per second; a step is one node expanded or one route evaluated. */
export const SPEEDS = [1, 3, 10, 30, 100, 300, 1000, 5000] as const;
export const DEFAULT_SPEED_LEVEL = 5; // 300 steps/s: a typical A* run in Londrina lasts a few seconds

export class PlaybackClock {
  private carry = 0;

  constructor(private level = DEFAULT_SPEED_LEVEL) {}

  get stepsPerSecond(): number {
    return SPEEDS[this.level];
  }

  setLevel(level: number): void {
    this.level = Math.max(0, Math.min(SPEEDS.length - 1, Math.round(level)));
  }

  /** Steps due after `ms` milliseconds (fractions carry over, so slow speeds still advance). A long pause (tab in
   * the background) counts as at most a quarter of a second, so the replay does not jump ahead. */
  tick(ms: number): number {
    this.carry += (Math.min(ms, 250) / 1000) * this.stepsPerSecond;
    const steps = Math.floor(this.carry);
    this.carry -= steps;
    return steps;
  }

  reset(): void {
    this.carry = 0;
  }
}
