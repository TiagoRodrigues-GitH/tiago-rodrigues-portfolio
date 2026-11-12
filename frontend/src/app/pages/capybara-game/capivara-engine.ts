/**
 * Trilha da Capivara: game logic with no DOM, so it can be unit-tested and replayed with a fixed seed.
 *
 * The capybara walks on a grid leading a line of pups. Each Brazilian fruit it eats adds a pup and points.
 * The field has no walls: leaving one side brings the family in on the opposite side.
 * From level 2 a jaguar prowls the field (it steps towards the capybara every other tick, with some
 * randomness); from level 5 rocks and fallen logs appear, a few more on every level. Touching the jaguar,
 * an obstacle or the capybara's own pups ends the game.
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

export type GameOverCause = 'rock' | 'pups' | 'jaguar' | null;

/** Player-chosen pace; the game still speeds up gently with the level. */
export type Speed = 'slow' | 'normal' | 'fast';

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
  /** Rocks and logs (from OBSTACLE_LEVEL on). */
  readonly obstacles: readonly Cell[];
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
/** Obstacles appear from this level on. */
export const OBSTACLE_LEVEL = 5;
/** Obstacles on the field at a level (0 before OBSTACLE_LEVEL, then 3, 5, 7 … up to 15). */
export function obstacleCount(level: number): number {
  return level < OBSTACLE_LEVEL ? 0 : Math.min(15, 3 + 2 * (level - OBSTACLE_LEVEL));
}

const SPEED: Record<Speed, { start: number; perLevel: number; min: number }> = {
  slow: { start: 200, perLevel: 6, min: 120 },
  normal: { start: 150, perLevel: 6, min: 85 },
  fast: { start: 110, perLevel: 5, min: 60 },
};

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
const wrap = (v: number, n: number): number => ((v % n) + n) % n;

/** Milliseconds between steps: depends on the chosen pace, a few ms faster per level, with a floor. */
export function stepInterval(level: number, speed: Speed = 'normal'): number {
  const s = SPEED[speed];
  return Math.max(s.min, s.start - (level - 1) * s.perLevel);
}

function freeCells(width: number, height: number, blocked: readonly Cell[]): Cell[] {
  const taken = new Set(blocked.map((c) => c.y * width + c.x));
  const free: Cell[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!taken.has(y * width + x)) free.push({ x, y });
    }
  }
  return free;
}

function placeFruit(width: number, height: number, blocked: readonly Cell[], seed: number): [Fruit, number] {
  const free = freeCells(width, height, blocked);
  let r: number;
  [r, seed] = random(seed);
  const cell = free[Math.floor(r * free.length)] ?? { x: 0, y: 0 };
  [r, seed] = random(seed);
  const kind: FruitKind = r < 0.6 ? 'acai' : r < 0.9 ? 'caju' : 'jabuticaba';
  return [{ cell, kind }, seed];
}

/** Cells the capybara will cross in the next few steps: obstacles never appear there. */
function safetyLane(head: Cell, direction: Direction, width: number, height: number, length = 4): Cell[] {
  const lane: Cell[] = [];
  for (let i = 1; i <= length; i++) {
    lane.push({ x: wrap(head.x + STEP[direction].x * i, width), y: wrap(head.y + STEP[direction].y * i, height) });
  }
  return lane;
}

/** Adds obstacles until the level's count is reached, away from the family, the fruit, the jaguar and the path ahead. */
function addObstacles(state: GameState, family: readonly Cell[], direction: Direction, fruit: Fruit, jaguar: Cell | null,
                      level: number, seed: number): [Cell[], number] {
  const obstacles = [...state.obstacles];
  const head = family[0];
  const near = (c: Cell) => Math.abs(c.x - head.x) + Math.abs(c.y - head.y) <= 2;
  const blocked = [...family, ...obstacles, fruit.cell, ...(jaguar ? [jaguar] : []), ...safetyLane(head, direction, state.width, state.height)];
  const free = freeCells(state.width, state.height, blocked).filter((c) => !near(c));
  while (obstacles.length < obstacleCount(level) && free.length) {
    let r: number;
    [r, seed] = random(seed);
    const [cell] = free.splice(Math.floor(r * free.length), 1);
    obstacles.push(cell);
  }
  return [obstacles, seed];
}

export function createGame(width = 20, height = 20, seed = 1): GameState {
  const cy = Math.floor(height / 2);
  const family: Cell[] = [{ x: 5, y: cy }, { x: 4, y: cy }, { x: 3, y: cy }];
  const [fruit, next] = placeFruit(width, height, family, seed >>> 0);
  return {
    width, height, family, direction: 'right', queued: null, fruit, jaguar: null, obstacles: [],
    score: 0, eaten: 0, level: 1, alive: true, cause: null, tick: 0, seed: next,
  };
}

/** Queue a turn; reversing onto the first pup is ignored. */
export function turn(state: GameState, direction: Direction): GameState {
  if (!state.alive || direction === OPPOSITE[state.direction] || direction === state.direction) return state;
  return { ...state, queued: direction };
}

/** The jaguar enters at the free corner farthest from the capybara. */
function spawnJaguar(state: GameState, family: readonly Cell[]): Cell {
  const corners: Cell[] = [
    { x: 0, y: 0 }, { x: state.width - 1, y: 0 }, { x: 0, y: state.height - 1 }, { x: state.width - 1, y: state.height - 1 },
  ].filter((c) => !state.obstacles.some((o) => same(o, c)));
  const head = family[0];
  const dist = (c: Cell) => Math.abs(c.x - head.x) + Math.abs(c.y - head.y);
  return corners.reduce((best, c) => (dist(c) > dist(best) ? c : best), corners[0] ?? { x: 0, y: 0 });
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
  if (!inside(next, state.width, state.height) || same(next, state.fruit.cell) || state.obstacles.some((o) => same(o, next))) {
    return [jaguar, seed];
  }
  return [next, seed];
}

/** Advance the game by one tick. */
export function step(state: GameState): GameState {
  if (!state.alive) return state;
  const direction = state.queued ?? state.direction;
  const head = state.family[0];
  // No walls: the family comes back in on the opposite side.
  const nextHead = { x: wrap(head.x + STEP[direction].x, state.width), y: wrap(head.y + STEP[direction].y, state.height) };
  const tick = state.tick + 1;

  if (state.obstacles.some((o) => same(o, nextHead))) {
    return { ...state, direction, queued: null, alive: false, cause: 'rock', tick };
  }
  const eats = same(nextHead, state.fruit.cell);
  // The last pup moves away this tick unless the family grows, so its cell is free.
  const body = eats ? state.family : state.family.slice(0, -1);
  if (body.some((c) => same(c, nextHead))) {
    return { ...state, direction, queued: null, alive: false, cause: 'pups', tick };
  }
  const family = [nextHead, ...body];

  let { seed, fruit, score, eaten, level, jaguar, obstacles } = state;
  if (eats) {
    score += FRUIT_POINTS[fruit.kind] * level;
    eaten += 1;
    const newLevel = 1 + Math.floor(eaten / FRUITS_PER_LEVEL);
    if (newLevel !== level && obstacleCount(newLevel) > obstacles.length) {
      [obstacles, seed] = addObstacles(state, family, direction, fruit, jaguar, newLevel, seed);
    }
    level = newLevel;
    [fruit, seed] = placeFruit(state.width, state.height, [...family, ...obstacles, ...(jaguar ? [jaguar] : [])], seed);
  }

  if (level >= JAGUAR_LEVEL) {
    const field = { ...state, fruit, obstacles };
    if (!jaguar) {
      jaguar = spawnJaguar(field, family);
    } else if (tick % 2 === 0) {
      [jaguar, seed] = moveJaguar(jaguar, nextHead, field, seed);
    }
    if (family.some((c) => same(c, jaguar!))) {
      return { ...state, family, direction, queued: null, fruit, jaguar, obstacles, score, eaten, level, alive: false, cause: 'jaguar', tick, seed };
    }
  }

  return { ...state, family, direction, queued: null, fruit, jaguar, obstacles, score, eaten, level, tick, seed };
}
