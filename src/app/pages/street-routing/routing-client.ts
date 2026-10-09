/**
 * Promise API over the routing worker. Only the latest run of a page matters: a result that arrives after a newer
 * request (the visitor changed the algorithm while a long run was computing) is reported as stale and dropped.
 */

import { AlgorithmKey, Params } from './engine/algorithm-catalog';
import { RouteResult } from './engine/search-trace';
import { RoutingReply, RoutingRequest, handleRoutingRequest } from './routing-protocol';

export interface RunOutcome {
  result: RouteResult;
  /** Shortest length (Dijkstra), when asked for, to measure how far a heuristic is from it. */
  optimum: number | null;
}

export class StaleRunError extends Error {}

type Pending = { resolve: (reply: RoutingReply) => void };
type RequestBody = RoutingRequest extends infer R ? (R extends RoutingRequest ? Omit<R, 'id'> : never) : never;

export class RoutingClient {
  private nextId = 1;
  private latestRun = 0;
  private readonly pending = new Map<number, Pending>();
  private readonly worker: Worker | null;

  constructor() {
    this.worker = typeof Worker === 'undefined' ? null : new Worker(new URL('./routing.worker', import.meta.url), { type: 'module' });
    this.worker?.addEventListener('message', ({ data }: MessageEvent<RoutingReply>) => {
      this.pending.get(data.id)?.resolve(data);
      this.pending.delete(data.id);
    });
  }

  async load(area: string, url: string): Promise<void> {
    const reply = await this.send({ type: 'load', area, url });
    if (reply.type === 'error') throw new Error(reply.message);
  }

  async run(area: string, key: AlgorithmKey, s: number, t: number, params: Params, optimum: boolean): Promise<RunOutcome> {
    const reply = await this.send({ type: 'run', area, key, s, t, params, optimum });
    if (reply.type === 'error') throw new Error(reply.message);
    if (reply.id !== this.latestRun) throw new StaleRunError();
    if (reply.type !== 'result') throw new Error('unexpected reply');
    return { result: reply.result, optimum: reply.optimum };
  }

  dispose(): void {
    this.worker?.terminate();
    this.pending.clear();
  }

  private send(body: RequestBody): Promise<RoutingReply> {
    const req = { ...body, id: this.nextId++ } as RoutingRequest;
    if (req.type === 'run') this.latestRun = req.id;
    return new Promise((resolve) => {
      if (this.worker) {
        this.pending.set(req.id, { resolve });
        this.worker.postMessage(req);
      } else {
        // no Web Worker: same handler on the page, after a frame so that "Computing…" can be drawn first
        setTimeout(() => void handleRoutingRequest(req, (reply) => resolve(reply)), 30);
      }
    });
  }
}
