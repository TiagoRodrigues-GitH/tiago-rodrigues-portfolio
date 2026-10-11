/**
 * What an algorithm did, step by step, recorded while it runs so that the page can replay it at any speed without
 * running it again (the computation never waits for the drawing). Two kinds:
 *
 * - `search` (Dijkstra, A*, ...): one step per node taken from the frontier, with the edges it evaluated and the
 *   neighbours those edges put on the frontier;
 * - `candidates` (metaheuristics): one step per complete route evaluated, with the best route found so far.
 *
 * Typed arrays keep a trace of a million steps in a few megabytes and can be moved out of a Web Worker for free.
 */

export interface SearchTrace {
  kind: 'search';
  /** Node expanded at each step; for the backward half of a bidirectional search, -(node + 1). */
  settled: Int32Array;
  /** Distance label of that node when it was expanded (metres from the origin, or to the destination). */
  label: Float64Array;
  /** Edges evaluated at step i: relaxEdge[relaxStart[i] .. relaxStart[i + 1]). */
  relaxStart: Int32Array;
  relaxEdge: Int32Array;
  /** Node that edge put on the frontier (or moved to a better place in it), -1 if it improved nothing. */
  relaxPush: Int32Array;
}

export interface CandidateTrace {
  kind: 'candidates';
  /** Route evaluated at step i: nodes[start[i] .. start[i + 1]) (empty if the attempt found no route). */
  start: Int32Array;
  nodes: Int32Array;
  cost: Float64Array;
  /** Step whose route is the best one after step i, -1 while no route has been found. */
  best: Int32Array;
}

export type Trace = SearchTrace | CandidateTrace;

export interface RouteResult {
  algorithm: string;
  path: number[]; // nodes from origin to destination ([] if no route was found)
  cost: number; // metres (Infinity if no route)
  expanded: number; // steps of the trace: nodes expanded, or routes evaluated
  ms: number;
  trace: Trace;
}

/** A growable Int32Array or Float64Array. */
class Growable<T extends Int32Array | Float64Array> {
  private data: T;
  length = 0;

  constructor(private readonly make: (size: number) => T) {
    this.data = make(1024);
  }

  push(value: number): void {
    if (this.length === this.data.length) {
      const bigger = this.make(this.data.length * 2);
      bigger.set(this.data);
      this.data = bigger;
    }
    this.data[this.length++] = value;
  }

  toArray(): T {
    return this.data.slice(0, this.length) as T;
  }
}

const ints = () => new Growable((n) => new Int32Array(n));
const floats = () => new Growable((n) => new Float64Array(n));

export class SearchRecorder {
  private readonly settled = ints();
  private readonly label = floats();
  private readonly relaxStart = ints();
  private readonly relaxEdge = ints();
  private readonly relaxPush = ints();

  get steps(): number {
    return this.settled.length;
  }

  /** Starts a step: `node` leaves the frontier (`backward`: by the search from the destination). */
  expand(node: number, label: number, backward = false): void {
    this.settled.push(backward ? -node - 1 : node);
    this.label.push(label);
    this.relaxStart.push(this.relaxEdge.length);
  }

  /** The current step evaluated `edge`; `pushed` is the node it put on the frontier, or -1. */
  relax(edge: number, pushed: number): void {
    this.relaxEdge.push(edge);
    this.relaxPush.push(pushed);
  }

  finish(): SearchTrace {
    this.relaxStart.push(this.relaxEdge.length);
    return {
      kind: 'search',
      settled: this.settled.toArray(),
      label: this.label.toArray(),
      relaxStart: this.relaxStart.toArray(),
      relaxEdge: this.relaxEdge.toArray(),
      relaxPush: this.relaxPush.toArray(),
    };
  }
}

export class CandidateRecorder {
  private readonly start = ints();
  private readonly nodes = ints();
  private readonly cost = floats();
  private readonly best = ints();
  private bestStep = -1;
  private bestCost = Infinity;

  get steps(): number {
    return this.cost.length;
  }

  /** One route evaluated ([] = the attempt found none). */
  evaluate(path: number[], cost: number): void {
    const step = this.cost.length;
    this.start.push(this.nodes.length);
    for (const v of path) this.nodes.push(v);
    this.cost.push(path.length ? cost : Infinity);
    if (path.length && cost < this.bestCost) {
      this.bestCost = cost;
      this.bestStep = step;
    }
    this.best.push(this.bestStep);
  }

  finish(): CandidateTrace {
    this.start.push(this.nodes.length);
    return { kind: 'candidates', start: this.start.toArray(), nodes: this.nodes.toArray(), cost: this.cost.toArray(), best: this.best.toArray() };
  }
}

/** Route evaluated at a step of a candidate trace. */
export function candidateAt(trace: CandidateTrace, step: number): number[] {
  return Array.from(trace.nodes.subarray(trace.start[step], trace.start[step + 1]));
}

export function traceSteps(trace: Trace): number {
  return trace.kind === 'search' ? trace.settled.length : trace.cost.length;
}

/** Typed arrays of a trace, to move it out of a Web Worker without copying. */
export function transferables(trace: Trace): ArrayBuffer[] {
  const arrays = trace.kind === 'search'
    ? [trace.settled, trace.label, trace.relaxStart, trace.relaxEdge, trace.relaxPush]
    : [trace.start, trace.nodes, trace.cost, trace.best];
  return arrays.map((a) => a.buffer as ArrayBuffer);
}
