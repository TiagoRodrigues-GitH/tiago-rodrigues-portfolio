import { GraphPayload } from './street-graph';

/**
 * A size x size street grid with ~100 m blocks and a wall at column 6 with two gaps, so routes must detour.
 * `oneway(a, b)`: streets to make one-way, drivable from a to b only.
 */
export function grid(size = 12, oneway: (a: number, b: number) => boolean = () => false): GraphPayload {
  const nodes: number[] = [];
  const edges: number[] = [];
  const lines: number[][] = [];
  const directed: number[] = [];
  const id = (r: number, c: number) => r * size + c;
  const step = 0.0009; // ~100 m
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) nodes.push(-51.16 + c * step, -23.31 + r * step);
  const add = (a: number, b: number, dm: number) => {
    if (oneway(b, a)) [a, b] = [b, a];
    if (oneway(a, b)) directed.push(edges.length / 4);
    edges.push(a, b, dm, 0);
    lines.push([nodes[2 * a], nodes[2 * a + 1], nodes[2 * b], nodes[2 * b + 1]]);
  };
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      const blocked = c === 6 && r > 1 && r < size - 2; // a wall with two gaps
      if (c + 1 < size && !blocked) add(id(r, c), id(r, c + 1), 1000);
      if (r + 1 < size) add(id(r, c), id(r + 1, c), 1000);
    }
  return { municipality: { code: 0, name: 'grid' }, nodes, edges, lines, names: ['Rua'], oneway: directed };
}

export const SIZE = 12;
export const ORIGIN = 5 * SIZE + 1;
export const DESTINATION = 6 * SIZE + 10;
