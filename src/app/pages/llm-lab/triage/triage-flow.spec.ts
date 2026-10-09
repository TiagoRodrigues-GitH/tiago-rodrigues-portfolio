import { describe, expect, it } from 'vitest';
import { CATEGORY_OF_CLASS, CLASS_OF, EMPTY_STATE, TriageState, prune, steps, urgent, validate, visibleQuestions } from './triage-flow';

const state = (s: Partial<TriageState>): TriageState => ({ ...EMPTY_STATE, ...s });

describe('triage flow', () => {
  it('maps every category to a classifier label and back', () => {
    for (const [category, label] of Object.entries(CLASS_OF)) expect(CATEGORY_OF_CLASS[label]).toBe(category);
  });

  it('who knows the category picks a detail; who does not describes the problem first', () => {
    expect(steps(state({ category: 'airbags' }))).toEqual(['category', 'detail', 'questions', 'describe', 'review']);
    expect(steps(state({ category: 'unknown' }))).toEqual(['category', 'describe', 'questions', 'review']);
  });

  it('asks about injuries only after a crash or a fire', () => {
    expect(visibleQuestions(state({ category: 'airbags' }))).toEqual(['crash', 'warningLight']);
    expect(visibleQuestions(state({ category: 'airbags', answers: { crash: 'yes' } }))).toEqual(['crash', 'warningLight', 'injury']);
    expect(visibleQuestions(state({ category: 'electrical', answers: { fire: 'yes' } }))).toContain('injury');
  });

  it('reports what is missing before moving on', () => {
    expect(validate('category', EMPTY_STATE)).toEqual(['chooseCategory']);
    expect(validate('detail', state({ category: 'brakes' }))).toEqual(['chooseDetail']);
    expect(validate('questions', state({ category: 'airbags', answers: { crash: 'no' } }))).toEqual(['answerAll']);
    expect(validate('questions', state({ category: 'airbags', answers: { crash: 'no', warningLight: 'unsure' } }))).toEqual([]);
    expect(validate('describe', state({ category: 'brakes' }))).toEqual([]); // optional when the category is known
    expect(validate('describe', state({ category: 'unknown', description: 'short' }))).toEqual(['describeUnknown']);
  });

  it('drops answers that no longer apply when an earlier answer changes', () => {
    const changed = prune(state({ category: 'airbags', answers: { crash: 'no', warningLight: 'yes', injury: 'yes' } }));
    expect(changed.answers).toEqual({ crash: 'no', warningLight: 'yes' });
  });

  it('shows the safety notice for fire, injury or a brake pedal failing while driving', () => {
    expect(urgent(state({ category: 'electrical', answers: { fire: 'yes' } }))).toBe(true);
    expect(urgent(state({ category: 'brakes', detail: 'pedal', answers: { moving: 'yes' } }))).toBe(true);
    expect(urgent(state({ category: 'brakes', detail: 'noise', answers: { moving: 'yes' } }))).toBe(false);
  });
});
