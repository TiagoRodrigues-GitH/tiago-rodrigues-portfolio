/**
 * Trilha da Capivara: game logic with no DOM, so it can be unit-tested and replayed with a fixed seed.
 *
 * The capybara walks on a grid leading a line of pups. Each Brazilian fruit it eats adds a pup and points.
 * From the second level on, a jaguar prowls the field: it steps towards the capybara every other tick,
 * with some randomness, and touching any part of the family ends the game. So do the river banks (the border)
 * and the capybara's own pups.
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Cell {
  x: number;
  y: number;
}

export type FruitKind = 'acai' | 'caju' | 'jabuticaba';

export interface Fruit {
  cell: Cell;
  kind: FruitKind;
}

export type GameOverCause = 'bank' | 'pups' | 'jaguar' | null;

export interface GameState {
  readonly width: number;
  readonly height: number;
  /** Head first; every following cell is a pup. */
  readonly family: readonly Cell[];
  readonly direction: Direction;
  /** Turn requested by the player, applied on the next step (one turn per step). */
  readonly queued: Direction | null;
  readonly fruit: Fruit;
  readonly jaguar: Cell | null;
  readonly score: number;
  readonly eaten: number;
  readonly level: number;
  readonly alive: boolean;
  readonly cause: GameOverCause;
  readonly tick: number;
  /** Seed of the pseudo-random generator (mulberry32), advanced on every draw. */
  readonly seed: number;
}

export const FRUIT_POINTS: Record<FruitKind, number> = { acai: 10, caju: 20, jabuticaba: 30 };
/** Fruits per level; the speed grows with the level. */
export const FRUITS_PER_LEVEL = 5;
/** The jaguar appears from this level on. */
export const JAGUAR_LEVEL = 2;

const STEP: Record<Direction, Cell> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const OPPOSITE: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };

/** mulberry32: small, fast and reproducible; returns [value in [0,1), next seed]. */
export function random(seed: number): [number, number] {
  const next = (seed + 0x6d2b79f5) >>> 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}

const same = (a: Cell, b: Cell): boolean => a.x === b.x && a.y === b.y;
const inside = (c: Cell, w: number, h: number): boolean => c.x >= 0 && c.y >= 0 && c.x < w && c.y < h;

/** Milliseconds between steps for a level: 150 ms at level 1, 10 ms faster per level, never below 70 ms. */
export function stepInterval(level: number): number {
  return Math.max(70, 150 - (level - 1) * 10);
}

function placeFruit(width: number, height: number, blocked: readonly Cell[], seed: number): [Fruit, number] {
  const free: Cell[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!blocked.some((c) => c.x === x && c.y === y)) free.push({ x, y });
    }
  }
  let r: number;
  [r, seed] = random(seed);
  const cell = free[Math.floor(r * free.length)] ?? { x: 0, y: 0 };
  [r, seed] = random(seed);
  const kind: FruitKind = r < 0.6 ? 'acai' : r < 0.9 ? 'caju' : 'jabuticaba';
  return [{ cell, kind }, seed];
}

export function createGame(width = 20, height = 20, seed = 1): GameState {
  const cy = Math.floor(height / 2);
  const family: Cell[] = [{ x: 5, y: cy }, { x: 4, y: cy }, { x: 3, y: cy }];
  const [fruit, next] = placeFruit(width, height, family, seed >>> 0);
  return {
    width, height, family, direction: 'right', queued: null, fruit, jaguar: null,
    score: 0, eaten: 0, level: 1, alive: true, cause: null, tick: 0, seed: next,
  };
}

/** Queue a turn; reversing onto the first pup is ignored. */
export function turn(state: GameState, direction: Direction): GameState {
  if (!state.alive || direction === OPPOSITE[state.direction] || direction === state.direction) return state;
  return { ...state, queued: direction };
}

/** The jaguar enters at the corner farthest from the capybara. */
function spawnJaguar(state: GameState): Cell {
  const corners: Cell[] = [
    { x: 0, y: 0 }, { x: state.width - 1, y: 0 }, { x: 0, y: state.height - 1 }, { x: state.width - 1, y: state.height - 1 },
  ];
  const head = state.family[0];
  const dist = (c: Cell) => Math.abs(c.x - head.x) + Math.abs(c.y - head.y);
  return corners.reduce((best, c) => (dist(c) > dist(best) ? c : best));
}

/** One jaguar step: towards the capybara on the longer axis, but a random side step one time in four. */
function moveJaguar(jaguar: Cell, target: Cell, state: GameState, seed: number): [Cell, number] {
  let r: number;
  [r, seed] = random(seed);
  const dx = Math.sign(target.x - jaguar.x);
  const dy = Math.sign(target.y - jaguar.y);
  let move: Cell;
  if (r < 0.25) {
    const options = [STEP.up, STEP.down, STEP.left, STEP.right];
    move = options[Math.floor((r / 0.25) * options.length)];
  } else if (Math.abs(target.x - jaguar.x) >= Math.abs(target.y - jaguar.y)) {
    move = { x: dx, y: 0 };
  } else {
    move = { x: 0, y: dy };
  }
  const next = { x: jaguar.x + move.x, y: jaguar.y + move.y };
  if (!inside(next, state.width, state.height) || same(next, state.fruit.cell)) return [jaguar, seed];
  return [next, seed];
}

/** Advance the game by one tick. */
export function step(state: GameState): GameState {
  if (!state.alive) return state;
  const direction = state.queued ?? state.direction;
  const head = state.family[0];
  const nextHead = { x: head.x + STEP[direction].x, y: head.y + STEP[direction].y };
  const tick = state.tick + 1;

  if (!inside(nextHead, state.width, state.height)) {
    return { ...state, direction, queued: null, alive: false, cause: 'bank', tick };
  }
  const eats = same(nextHead, state.fruit.cell);
  // The last pup moves away this tick unless the family grows, so its cell is free.
  const body = eats ? state.family : state.family.slice(0, -1);
  if (body.some((c) => same(c, nextHead))) {
    return { ...state, direction, queued: null, alive: false, cause: 'pups', tick };
  }
  const family = [nextHead, ...body];

  let { seed, fruit, score, eaten, level, jaguar } = state;
  if (eats) {
    score += FRUIT_POINTS[fruit.kind] * level;
    eaten += 1;
    level = 1 + Math.floor(eaten / FRUITS_PER_LEVEL);
    [fruit, seed] = placeFruit(state.width, state.height, jaguar ? [...family, jaguar] : family, seed);
  }

  if (level >= JAGUAR_LEVEL) {
    if (!jaguar) {
      jaguar = spawnJaguar({ ...state, family });
    } else if (tick % 2 === 0) {
      [jaguar, seed] = moveJaguar(jaguar, nextHead, { ...state, fruit }, seed);
    }
    if (family.some((c) => same(c, jaguar!))) {
      return { ...state, family, direction, queued: null, fruit, jaguar, score, eaten, level, alive: false, cause: 'jaguar', tick, seed };
    }
  }

  return { ...state, family, direction, queued: null, fruit, jaguar, score, eaten, level, tick, seed };
}
