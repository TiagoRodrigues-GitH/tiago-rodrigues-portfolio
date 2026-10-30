import { SHAPE_COUNT, buildScene } from './scene-shapes';

describe('Hero scene shapes', () => {
  const count = 1200;
  const { shapes, random } = buildScene(count);

  it('builds four forms with one point per particle each, so they can morph into each other', () => {
    expect(shapes.length).toBe(SHAPE_COUNT);
    for (const shape of shapes) {
      expect(shape.length).toBe(count * 4);
    }
    expect(random.length).toBe(count);
  });

  it('keeps every point finite and inside the framed volume', () => {
    for (const shape of shapes) {
      for (let i = 0; i < count; i++) {
        const [x, y, z, tag] = [shape[i * 4], shape[i * 4 + 1], shape[i * 4 + 2], shape[i * 4 + 3]];
        expect(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)).toBe(true);
        expect(Math.abs(x)).toBeLessThanOrEqual(1.45);
        expect(Math.abs(y)).toBeLessThanOrEqual(1);
        expect(Math.abs(z)).toBeLessThanOrEqual(1);
        expect(tag === 0 || tag === 1).toBe(true);
      }
    }
  });

  it('highlights a minority of each form in gold', () => {
    for (const shape of shapes) {
      let gold = 0;
      for (let i = 0; i < count; i++) gold += shape[i * 4 + 3];
      expect(gold).toBeGreaterThan(0);
      expect(gold / count).toBeLessThan(0.5);
    }
  });

  it('is deterministic for a given seed', () => {
    const again = buildScene(count);
    expect(Array.from(again.shapes[2].slice(0, 40))).toEqual(Array.from(shapes[2].slice(0, 40)));
  });
});
