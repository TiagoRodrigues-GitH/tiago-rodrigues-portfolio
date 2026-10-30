/**
 * Point clouds for the home hero. Each shape is sampled into exactly `count` points, so the
 * renderer can morph point i of one shape into point i of the next:
 *
 *   0 neural network  →  1 automotive computer vision  →  2 embedded circuit  →  3 software architecture
 *
 * Every point is [x, y, z, tag]: tag 1 marks highlighted parts drawn in gold (activations,
 * the detection box, the processor die, data flow between layers). Coordinates fit roughly in
 * x ∈ [-1.3, 1.3], y ∈ [-0.85, 0.85], z ∈ [-0.7, 0.7]. Generation is deterministic (seeded).
 */

export type Vec3 = [number, number, number];

interface Stroke {
  points: Vec3[];
  tag: number;
  /** Relative density multiplier (points per unit length). */
  weight?: number;
  /** Random scatter radius around the stroke. */
  jitter?: number;
}

export const SHAPE_COUNT = 4;

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function line(a: Vec3, b: Vec3): Vec3[] {
  return [a, b];
}

function rect(x0: number, y0: number, x1: number, y1: number, z = 0): Vec3[] {
  return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z], [x0, y0, z]];
}

/** Rectangle lying in the x-z plane at height y. */
function plane(x0: number, z0: number, x1: number, z1: number, y: number): Vec3[] {
  return [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [x0, y, z0]];
}

function circle(cx: number, cy: number, r: number, z = 0, from = 0, to = Math.PI * 2, steps = 28): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = from + ((to - from) * i) / steps;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
  }
  return pts;
}

function quad(p0: Vec3, c: Vec3, p1: Vec3, steps = 10): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push([
      u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
      u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
      u * u * p0[2] + 2 * u * t * c[2] + t * t * p1[2],
    ]);
  }
  return pts;
}

/** Samples `count` points along the strokes, proportionally to length × weight. */
export function sampleStrokes(strokes: Stroke[], count: number, rand: () => number): Float32Array {
  const segments: Array<{ a: Vec3; b: Vec3; len: number; tag: number; jitter: number }> = [];
  for (const stroke of strokes) {
    for (let i = 1; i < stroke.points.length; i++) {
      const a = stroke.points[i - 1];
      const b = stroke.points[i];
      const len = dist(a, b) * (stroke.weight ?? 1);
      if (len > 0) {
        segments.push({ a, b, len, tag: stroke.tag, jitter: stroke.jitter ?? 0.006 });
      }
    }
  }
  const total = segments.reduce((sum, s) => sum + s.len, 0);
  const out = new Float32Array(count * 4);
  // Cumulative lengths for O(log n) lookup.
  const cumulative: number[] = [];
  let acc = 0;
  for (const s of segments) {
    acc += s.len;
    cumulative.push(acc);
  }
  for (let i = 0; i < count; i++) {
    // Stratified sampling keeps the density even along the strokes.
    const target = ((i + rand()) / count) * total;
    let lo = 0;
    let hi = cumulative.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const s = segments[lo];
    const t = rand();
    const j = s.jitter;
    out[i * 4] = s.a[0] + (s.b[0] - s.a[0]) * t + (rand() - 0.5) * j * 2;
    out[i * 4 + 1] = s.a[1] + (s.b[1] - s.a[1]) * t + (rand() - 0.5) * j * 2;
    out[i * 4 + 2] = s.a[2] + (s.b[2] - s.a[2]) * t + (rand() - 0.5) * j * 2;
    out[i * 4 + 3] = s.tag;
  }
  return out;
}

/** Shuffles points in place (Fisher–Yates on vec4s) so morphs travel across the scene. */
function shuffle(points: Float32Array, rand: () => number): Float32Array {
  const n = points.length / 4;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    for (let k = 0; k < 4; k++) {
      const tmp = points[i * 4 + k];
      points[i * 4 + k] = points[j * 4 + k];
      points[j * 4 + k] = tmp;
    }
  }
  return points;
}

/* ---------- 0 · Neural network: five fully connected layers ---------- */

function neuralNetwork(): Stroke[] {
  const layers = [4, 7, 9, 7, 4];
  const nodes: Vec3[][] = layers.map((size, li) => {
    const x = -1.2 + (2.4 * li) / (layers.length - 1);
    return Array.from({ length: size }, (_, j) => {
      const y = size === 1 ? 0 : -0.72 + (1.44 * j) / (size - 1);
      const z = Math.sin(j * 1.7 + li) * 0.28;
      return [x, y, z] as Vec3;
    });
  });
  const strokes: Stroke[] = [];
  for (let li = 0; li < nodes.length - 1; li++) {
    for (const a of nodes[li]) {
      for (const b of nodes[li + 1]) {
        strokes.push({ points: line(a, b), tag: 0, weight: 0.55, jitter: 0.004 });
      }
    }
  }
  nodes.forEach((layer, li) =>
    layer.forEach((n, j) =>
      // Neurons are dense rings; a few "activated" ones glow gold.
      strokes.push({ points: circle(n[0], n[1], 0.045, n[2]), tag: (li * 7 + j * 3) % 5 === 0 ? 1 : 0, weight: 9, jitter: 0.01 }),
    ),
  );
  return strokes;
}

/* ---------- 1 · Automotive computer vision: car, lanes and a detection box ---------- */

/** Car profile traced from the ADAS sensor drawing (SVG units 960×400), normalised. */
function carProfile(z: number): Vec3[][] {
  const P = (x: number, y: number): Vec3 => [(x - 458) / 300, -(y - 210) / 300, z];
  const body: Vec3[] = [
    P(150, 258), P(146, 214),
    ...quad(P(146, 214), P(148, 190), P(178, 180), 6),
    P(260, 168),
    ...quad(P(260, 168), P(316, 122), P(384, 114), 8),
    P(522, 112),
    ...quad(P(522, 112), P(559, 114), P(594, 150), 8),
    P(614, 168),
    ...quad(P(614, 168), P(704, 176), P(748, 190), 8),
    ...quad(P(748, 190), P(768, 198), P(770, 222), 5),
    P(768, 250),
    ...quad(P(768, 250), P(766, 260), P(754, 262), 4),
    P(694, 262),
  ];
  const frontArch = circle((644 - 458) / 300, -(262 - 210) / 300, 50 / 300, z, 0, Math.PI, 14);
  const mid: Vec3[] = [P(594, 262), P(294, 262)];
  const rearArch = circle((244 - 458) / 300, -(262 - 210) / 300, 50 / 300, z, 0, Math.PI, 14);
  const tail: Vec3[] = [P(194, 262), P(154, 262), P(150, 258)];
  const windows: Vec3[] = [
    P(286, 170), ...quad(P(286, 170), P(330, 132), P(388, 126), 8), P(516, 124),
    ...quad(P(516, 124), P(544, 126), P(574, 156), 8), P(584, 168), P(286, 170),
  ];
  return [body, frontArch, mid, rearArch, tail, windows];
}

function automotiveVision(): Stroke[] {
  const strokes: Stroke[] = [];
  for (const path of carProfile(0.22)) strokes.push({ points: path, tag: 0, weight: 1.4 });
  for (const path of carProfile(-0.22)) strokes.push({ points: path, tag: 0, weight: 0.7 });
  // Wheels on both sides.
  for (const z of [0.22, -0.22]) {
    for (const cx of [(244 - 458) / 300, (644 - 458) / 300]) {
      strokes.push({ points: circle(cx, -(262 - 210) / 300, 40 / 300, z), tag: 0, weight: 1.6 });
    }
  }
  // Lane markings on the ground, receding into depth.
  const ground = -0.32;
  for (const x of [-0.95, 0.95]) {
    strokes.push({ points: line([x, ground, 0.75], [x * 0.35, ground, -0.7]), tag: 0, weight: 1.2, jitter: 0.008 });
  }
  for (let k = 0; k < 6; k++) {
    const z0 = 0.7 - k * 0.24;
    strokes.push({ points: line([0, ground, z0], [0, ground, z0 - 0.12]), tag: 0, weight: 1.5 });
  }
  // Detection box with corner brackets (gold) and the camera's field of view.
  const box = { x0: -1.12, y0: -0.42, x1: 1.12, y1: 0.42 };
  const c = 0.16;
  const corners: Vec3[][] = [
    [[box.x0, box.y0 + c, 0.25], [box.x0, box.y0, 0.25], [box.x0 + c, box.y0, 0.25]],
    [[box.x1 - c, box.y0, 0.25], [box.x1, box.y0, 0.25], [box.x1, box.y0 + c, 0.25]],
    [[box.x1, box.y1 - c, 0.25], [box.x1, box.y1, 0.25], [box.x1 - c, box.y1, 0.25]],
    [[box.x0 + c, box.y1, 0.25], [box.x0, box.y1, 0.25], [box.x0, box.y1 - c, 0.25]],
  ];
  for (const corner of corners) strokes.push({ points: corner, tag: 1, weight: 3 });
  strokes.push({ points: rect(box.x0, box.y0, box.x1, box.y1, 0.25), tag: 1, weight: 0.35 });
  const cam: Vec3 = [(566 - 458) / 300, -(140 - 210) / 300, 0.22];
  strokes.push({ points: line(cam, [1.3, 0.62, 0.1]), tag: 0, weight: 0.6 });
  strokes.push({ points: line(cam, [1.3, -0.3, 0.1]), tag: 0, weight: 0.6 });
  return strokes;
}

/* ---------- 2 · Embedded circuit: processor, pins, traces and vias ---------- */

function embeddedCircuit(): Stroke[] {
  const strokes: Stroke[] = [];
  const zBoard = -0.05;
  strokes.push({ points: rect(-1.25, -0.78, 1.25, 0.78, zBoard), tag: 0, weight: 0.6 });
  // Processor package and die.
  strokes.push({ points: rect(-0.34, -0.34, 0.34, 0.34, 0.06), tag: 0, weight: 2.2 });
  strokes.push({ points: rect(-0.17, -0.17, 0.17, 0.17, 0.09), tag: 1, weight: 3.2 });
  strokes.push({ points: line([-0.17, 0, 0.09], [0.17, 0, 0.09]), tag: 1, weight: 2 });
  strokes.push({ points: line([0, -0.17, 0.09], [0, 0.17, 0.09]), tag: 1, weight: 2 });
  // Pins and Manhattan traces to the board edge, ending in vias.
  const pins = 6;
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < pins; i++) {
      const t = -0.27 + (0.54 * i) / (pins - 1);
      const dir = [[1, 0], [0, 1], [-1, 0], [0, -1]][side];
      const along = [[0, 1], [1, 0], [0, 1], [1, 0]][side];
      const px = dir[0] * 0.34 + along[0] * t;
      const py = dir[1] * 0.34 + along[1] * t;
      const pinEnd: Vec3 = [px + dir[0] * 0.07, py + dir[1] * 0.07, 0.03];
      strokes.push({ points: line([px, py, 0.05], pinEnd), tag: 0, weight: 3 });
      const reach = 0.22 + ((i * 37 + side * 11) % 5) * 0.12;
      const bend = (i % 2 === 0 ? 1 : -1) * 0.05 * ((i % 3) + 1);
      // Every point of the trace stays on the board (x ±1.18, y ±0.72).
      const onBoard = (x: number, y: number): Vec3 => [Math.max(-1.18, Math.min(1.18, x)), Math.max(-0.72, Math.min(0.72, y)), zBoard];
      const mid = onBoard(pinEnd[0] + dir[0] * reach, pinEnd[1] + dir[1] * reach);
      const corner = onBoard(mid[0] + along[0] * bend, mid[1] + along[1] * bend);
      const end = onBoard(corner[0] + dir[0] * 0.22, corner[1] + dir[1] * 0.22);
      strokes.push({ points: [pinEnd, mid, corner, end], tag: 0, weight: 1.1, jitter: 0.004 });
      strokes.push({ points: circle(end[0], end[1], 0.022, zBoard, 0, Math.PI * 2, 10), tag: i % 3 === 0 ? 1 : 0, weight: 4 });
    }
  }
  // Two passive components and a memory chip.
  strokes.push({ points: rect(0.62, 0.38, 0.92, 0.55, 0.02), tag: 0, weight: 1.6 });
  strokes.push({ points: rect(-0.95, -0.58, -0.62, -0.36, 0.02), tag: 0, weight: 1.6 });
  strokes.push({ points: rect(-1.05, 0.3, -0.7, 0.62, 0.03), tag: 0, weight: 1.6 });
  return strokes;
}

/* ---------- 3 · Software architecture: three layers of modules and their flows ---------- */

function softwareArchitecture(): Stroke[] {
  const strokes: Stroke[] = [];
  const levels = [0.5, 0, -0.5];
  const modules = [3, 4, 2];
  const boxes: Vec3[][] = [];
  levels.forEach((y, li) => {
    strokes.push({ points: plane(-1.15, -0.55, 1.15, 0.55, y), tag: 0, weight: 0.7 });
    const n = modules[li];
    const row: Vec3[] = [];
    for (let i = 0; i < n; i++) {
      const x = -0.9 + (1.8 * (i + 0.5)) / n;
      strokes.push({ points: plane(x - 0.18, -0.2, x + 0.18, 0.2, y + 0.02), tag: 0, weight: 2.2 });
      row.push([x, y + 0.02, 0]);
    }
    boxes.push(row);
  });
  // Data flow between adjacent layers (gold).
  for (let li = 0; li < boxes.length - 1; li++) {
    for (const a of boxes[li]) {
      for (const b of boxes[li + 1]) {
        if (Math.abs(a[0] - b[0]) < 0.75) {
          strokes.push({ points: line(a, b), tag: 1, weight: 1.1, jitter: 0.003 });
        }
      }
    }
  }
  return strokes;
}

/**
 * Returns the four shapes as vec4 arrays (x, y, z, tag) of identical length, plus one random
 * value per point used by the shader to stagger and colour the morph.
 */
export function buildScene(count: number, seed = 20261030): { shapes: Float32Array[]; random: Float32Array } {
  const rand = mulberry32(seed);
  const builders = [neuralNetwork, automotiveVision, embeddedCircuit, softwareArchitecture];
  const shapes = builders.map((build) => shuffle(sampleStrokes(build(), count, rand), rand));
  const random = new Float32Array(count);
  for (let i = 0; i < count; i++) random[i] = rand();
  return { shapes, random };
}
