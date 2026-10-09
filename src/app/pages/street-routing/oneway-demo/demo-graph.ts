import { GraphPayload } from '../engine/street-graph';

/**
 * A fictitious 6 x 5 street grid (100 m blocks) for the one-way demo, laid out like a downtown: rows 1 and 2 run
 * one-way to the west, row 3 one-way to the east, columns 1 and 4 one-way to the south and column 3 one-way to the
 * north; the outer streets and the others are two-way. Not a real place: the page says so next to it.
 */
export const DEMO_COLS = 6;
export const DEMO_ROWS = 5;
const STEP_DEG = 0.0009; // ~100 m

export const demoId = (row: number, col: number): number => row * DEMO_COLS + col;

/** Driving direction of the street between two adjacent intersections: [from, to], or null when two-way. */
function direction(a: [number, number], b: [number, number]): [number, number] | null {
  const [r, c] = a;
  if (a[0] === b[0]) {
    if (r === 1 || r === 2) return [demoId(r, Math.max(c, b[1])), demoId(r, Math.min(c, b[1]))]; // westwards
    if (r === 3) return [demoId(r, Math.min(c, b[1])), demoId(r, Math.max(c, b[1]))]; // eastwards
  } else {
    const top = Math.min(r, b[0]);
    const bottom = Math.max(r, b[0]);
    if (c === 1 || c === 4) return [demoId(top, c), demoId(bottom, c)]; // southwards
    if (c === 3) return [demoId(bottom, c), demoId(top, c)]; // northwards
  }
  return null;
}

export interface DemoStreet {
  u: number;
  v: number;
  oneway: boolean;
}

/** Streets of the grid, each one-way street stored in its driving direction (u -> v). */
export function demoStreets(): DemoStreet[] {
  const streets: DemoStreet[] = [];
  for (let r = 0; r < DEMO_ROWS; r++) {
    for (let c = 0; c < DEMO_COLS; c++) {
      for (const [nr, nc] of [[r, c + 1], [r + 1, c]]) {
        if (nr >= DEMO_ROWS || nc >= DEMO_COLS) continue;
        const dir = direction([r, c], [nr, nc]);
        streets.push(dir ? { u: dir[0], v: dir[1], oneway: true } : { u: demoId(r, c), v: demoId(nr, nc), oneway: false });
      }
    }
  }
  return streets;
}

/** The demo grid as a graph payload; `respectOneway` false makes every street two-way. */
export function demoPayload(respectOneway: boolean): GraphPayload {
  const nodes: number[] = [];
  for (let r = 0; r < DEMO_ROWS; r++) for (let c = 0; c < DEMO_COLS; c++) nodes.push(c * STEP_DEG, -r * STEP_DEG);
  const streets = demoStreets();
  return {
    municipality: { code: 'demo', name: 'demo' },
    nodes,
    edges: streets.flatMap((s) => [s.u, s.v, 1000, 0]),
    lines: streets.map((s) => [nodes[2 * s.u], nodes[2 * s.u + 1], nodes[2 * s.v], nodes[2 * s.v + 1]]),
    names: [''],
    oneway: respectOneway ? streets.flatMap((s, i) => (s.oneway ? [i] : [])) : [],
  };
}
