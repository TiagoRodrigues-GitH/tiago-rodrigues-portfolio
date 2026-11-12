import {
  FRUIT_POINTS, FRUITS_PER_LEVEL, GameState, JAGUAR_LEVEL, createGame, random, step, stepInterval, turn,
} from './capivara-engine';

/** A game with the fruit placed by hand, to drive the scenario. */
function withFruit(state: GameState, x: number, y: number, kind: 'acai' | 'caju' | 'jabuticaba' = 'acai'): GameState {
  return { ...state, fruit: { cell: { x, y }, kind } };
}

describe('Trilha da Capivara engine', () => {
  it('is reproducible for the same seed', () => {
    expect(createGame(20, 20, 42)).toEqual(createGame(20, 20, 42));
    const [a] = random(7);
    const [b] = random(7);
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(1);
  });

  it('starts with the capybara and two pups, facing right, fruit on a free cell', () => {
    const g = createGame(20, 20, 3);
    expect(g.family.length).toBe(3);
    expect(g.direction).toBe('right');
    expect(g.family.some((c) => c.x === g.fruit.cell.x && c.y === g.fruit.cell.y)).toBe(false);
  });

  it('moves one cell per step and keeps its length without fruit', () => {
    let g = withFruit(createGame(20, 20, 1), 0, 0);
    g = step(g);
    expect(g.family[0]).toEqual({ x: 6, y: 10 });
    expect(g.family.length).toBe(3);
  });

  it('ignores a turn straight back onto the pups', () => {
    const g = turn(createGame(), 'left');
    expect(g.queued).toBeNull();
  });

  it('applies a queued turn on the next step', () => {
    let g = withFruit(createGame(20, 20, 1), 0, 0);
    g = step(turn(g, 'up'));
    expect(g.direction).toBe('up');
    expect(g.family[0]).toEqual({ x: 5, y: 9 });
  });

  it('eating a fruit adds a pup and points times the level', () => {
    let g = withFruit(createGame(20, 20, 1), 6, 10, 'caju');
    g = step(g);
    expect(g.family.length).toBe(4);
    expect(g.score).toBe(FRUIT_POINTS.caju);
    expect(g.eaten).toBe(1);
    expect(g.family.some((c) => c.x === g.fruit.cell.x && c.y === g.fruit.cell.y)).toBe(false);
  });

  it('levels up every few fruits and speeds up', () => {
    let g = createGame(40, 40, 1);
    for (let i = 0; i < FRUITS_PER_LEVEL; i++) {
      const head = g.family[0];
      g = step(withFruit(g, head.x + 1, head.y));
    }
    expect(g.level).toBe(2);
    expect(stepInterval(2)).toBeLessThan(stepInterval(1));
    expect(stepInterval(50)).toBe(70);
  });

  it('the jaguar appears from its level on, far from the capybara', () => {
    let g: GameState = { ...createGame(20, 20, 1), eaten: FRUITS_PER_LEVEL * (JAGUAR_LEVEL - 1) - 1 };
    g = step(withFruit(g, 6, 10));
    expect(g.level).toBe(JAGUAR_LEVEL);
    expect(g.jaguar).not.toBeNull();
    const d = Math.abs(g.jaguar!.x - g.family[0].x) + Math.abs(g.jaguar!.y - g.family[0].y);
    expect(d).toBeGreaterThan(10);
  });

  it('the river bank ends the game', () => {
    let g = withFruit(createGame(8, 8, 1), 0, 0);
    for (let i = 0; i < 10 && g.alive; i++) g = step(g);
    expect(g.alive).toBe(false);
    expect(g.cause).toBe('bank');
  });

  it('running into a pup ends the game', () => {
    const g: GameState = {
      ...withFruit(createGame(20, 20, 1), 0, 0),
      family: [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 6, y: 5 }, { x: 7, y: 5 }],
      direction: 'left',
      queued: 'down',
    };
    // down from (5,5) is (5,6), the first pup
    const end = step(g);
    expect(end.alive).toBe(false);
    expect(end.cause).toBe('pups');
  });

  it('the jaguar catching the family ends the game', () => {
    const g: GameState = { ...withFruit(createGame(20, 20, 1), 0, 0), level: JAGUAR_LEVEL, jaguar: { x: 6, y: 10 } };
    const end = step(g);
    expect(end.alive).toBe(false);
    expect(end.cause).toBe('jaguar');
  });

  it('does nothing once the game is over', () => {
    const over: GameState = { ...createGame(), alive: false, cause: 'bank' };
    expect(step(over)).toBe(over);
    expect(turn(over, 'up')).toBe(over);
  });
});
