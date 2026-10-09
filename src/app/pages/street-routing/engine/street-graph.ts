/**
 * The street graph used by every algorithm: compressed sparse rows (CSR) of the edges leaving each node and of the
 * edges arriving at it, so a search can run forwards (from the origin) or backwards (from the destination, over
 * edges taken against their direction). A two-way street is one edge usable both ways; a one-way street is usable
 * only from `u` to `v`. Distances are metres.
 */

export interface GraphPayload {
  municipality: { code: number | string; name: string };
  nodes: number[]; // lon, lat, lon, lat, ...
  edges: number[]; // u, v, length in decimetres, name index, ...
  lines: number[][]; // one polyline (lon, lat, ...) per edge
  names: string[];
  /** Edges that are estimated links between parts of the network, not IBGE streets. */
  bridged?: number[];
  /** Edges that may only be driven from u to v (none in the IBGE data, which carry no direction). */
  oneway?: number[];
}

export interface StreetGraph {
  n: number;
  lon: Float64Array;
  lat: Float64Array;
  x: Float64Array; // metres east of the centre of the graph
  y: Float64Array; // metres north of the centre of the graph
  /** Out-edges of v: adjTo[adjStart[v] .. adjStart[v+1]), with their length and edge index. */
  adjStart: Int32Array;
  adjTo: Int32Array;
  adjLen: Float64Array;
  adjEdge: Int32Array;
  /** In-edges of v: inFrom[inStart[v] .. inStart[v+1]). Same as the out-edges when no street is one-way. */
  inStart: Int32Array;
  inFrom: Int32Array;
  inLen: Float64Array;
  inEdge: Int32Array;
  edgeU: Int32Array;
  edgeV: Int32Array;
  edgeLen: Float64Array;
  edgeName: Int32Array;
  oneway: Uint8Array;
  directed: boolean;
  lines: number[][];
  names: string[];
}

const EARTH_M_PER_DEG = 111_320;

interface Csr {
  start: Int32Array;
  to: Int32Array;
  len: Float64Array;
  edge: Int32Array;
}

/** CSR of arcs (from[i] -> to[i]) grouped by `from`. */
function csr(n: number, from: Int32Array, to: Int32Array, len: Float64Array, edge: Int32Array): Csr {
  const start = new Int32Array(n + 1);
  for (const a of from) start[a + 1]++;
  for (let i = 0; i < n; i++) start[i + 1] += start[i];
  const fill = start.slice(0, n);
  const out = { start, to: new Int32Array(from.length), len: new Float64Array(from.length), edge: new Int32Array(from.length) };
  for (let i = 0; i < from.length; i++) {
    const k = fill[from[i]]++;
    out.to[k] = to[i];
    out.len[k] = len[i];
    out.edge[k] = edge[i];
  }
  return out;
}

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
  const oneway = new Uint8Array(m);
  for (const e of p.oneway ?? []) oneway[e] = 1;
  let arcs = 0;
  for (let e = 0; e < m; e++) {
    edgeU[e] = p.edges[4 * e];
    edgeV[e] = p.edges[4 * e + 1];
    edgeLen[e] = p.edges[4 * e + 2] / 10;
    edgeName[e] = p.edges[4 * e + 3];
    arcs += oneway[e] ? 1 : 2;
  }
  // every usable direction of every edge, as an arc
  const from = new Int32Array(arcs);
  const to = new Int32Array(arcs);
  const len = new Float64Array(arcs);
  const edge = new Int32Array(arcs);
  let a = 0;
  for (let e = 0; e < m; e++) {
    from[a] = edgeU[e];
    to[a] = edgeV[e];
    len[a] = edgeLen[e];
    edge[a++] = e;
    if (!oneway[e]) {
      from[a] = edgeV[e];
      to[a] = edgeU[e];
      len[a] = edgeLen[e];
      edge[a++] = e;
    }
  }
  const out = csr(n, from, to, len, edge);
  const inn = csr(n, to, from, len, edge);
  return {
    n, lon, lat, x, y,
    adjStart: out.start, adjTo: out.to, adjLen: out.len, adjEdge: out.edge,
    inStart: inn.start, inFrom: inn.to, inLen: inn.len, inEdge: inn.edge,
    edgeU, edgeV, edgeLen, edgeName, oneway, directed: oneway.some((o) => o === 1),
    lines: p.lines, names: p.names,
  };
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

/** Nearest node to a clicked point (linear scan: a few milliseconds for ~10^5 nodes, once per click). */
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

/** Index into adj* of the shortest arc a -> b allowed by the street directions, or -1. */
export function edgeBetween(g: StreetGraph, a: number, b: number): number {
  let best = -1;
  for (let k = g.adjStart[a]; k < g.adjStart[a + 1]; k++) {
    if (g.adjTo[k] === b && (best < 0 || g.adjLen[k] < g.adjLen[best])) best = k;
  }
  return best;
}

/** Length of a route in metres; Infinity if two consecutive nodes are not joined in that direction. */
export function pathCost(g: StreetGraph, path: number[]): number {
  let cost = 0;
  for (let i = 1; i < path.length; i++) {
    const k = edgeBetween(g, path[i - 1], path[i]);
    if (k < 0) return Infinity;
    cost += g.adjLen[k];
  }
  return cost;
}

/** Coordinates [lon, lat] along the streets of a route, each edge's polyline oriented in the driving direction. */
export function routeCoordinates(g: StreetGraph, path: number[]): number[][] {
  const coords: number[][] = [];
  for (let i = 1; i < path.length; i++) {
    const k = edgeBetween(g, path[i - 1], path[i]);
    if (k < 0) continue;
    const line = g.lines[g.adjEdge[k]];
    const pts = Array.from({ length: line.length / 2 }, (_, j) => [line[2 * j], line[2 * j + 1]]);
    const a = path[i - 1];
    const last = pts[pts.length - 1];
    const startsAtA = Math.hypot(pts[0][0] - g.lon[a], pts[0][1] - g.lat[a]) <= Math.hypot(last[0] - g.lon[a], last[1] - g.lat[a]);
    coords.push(...(startsAtA ? pts : pts.reverse()).slice(coords.length ? 1 : 0));
  }
  return coords;
}

/** Connected part of every node (edges taken both ways): two nodes of different parts have no route. */
export function components(g: StreetGraph): Int32Array {
  const parent = Int32Array.from({ length: g.n }, (_, i) => i);
  const find = (a: number): number => {
    while (parent[a] !== a) a = parent[a] = parent[parent[a]];
    return a;
  };
  for (let e = 0; e < g.edgeU.length; e++) parent[find(g.edgeU[e])] = find(g.edgeV[e]);
  const label = new Int32Array(g.n);
  for (let v = 0; v < g.n; v++) label[v] = find(v);
  return label;
}

/** Edge indices of a route (for drawing it street by street). */
export function pathEdges(g: StreetGraph, path: number[]): number[] {
  const edges: number[] = [];
  for (let i = 1; i < path.length; i++) {
    const k = edgeBetween(g, path[i - 1], path[i]);
    if (k >= 0) edges.push(g.adjEdge[k]);
  }
  return edges;
}
