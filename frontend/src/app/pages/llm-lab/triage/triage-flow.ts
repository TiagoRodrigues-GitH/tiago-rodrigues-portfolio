/**
 * The guided triage of a vehicle defect complaint, free of Angular: categories (mapped to the five classes the
 * browser classifier knows), the follow-up questions each category needs, which questions apply given earlier
 * answers, validation, and the urgency rule. Texts live in triage-content.ts under the same keys.
 */

export type MainCategory = 'brakes' | 'airbags' | 'electrical' | 'structure' | 'other' | 'unknown';
export type QuestionKey = 'moving' | 'crash' | 'fire' | 'injury' | 'warningLight' | 'detached';
export type Answer = 'yes' | 'no' | 'unsure';
export type StepKey = 'category' | 'detail' | 'questions' | 'describe' | 'review';

/** Classifier label (NHTSA component group) of each category; 'unknown' is decided from the description. */
export const CLASS_OF: Record<Exclude<MainCategory, 'unknown'>, string> = {
  brakes: 'SERVICE BRAKES',
  airbags: 'AIR BAGS',
  electrical: 'ELECTRICAL SYSTEM',
  structure: 'STRUCTURE',
  other: 'OTHER',
};

export const CATEGORY_OF_CLASS: Record<string, Exclude<MainCategory, 'unknown'>> = Object.fromEntries(
  Object.entries(CLASS_OF).map(([k, v]) => [v, k]),
) as Record<string, Exclude<MainCategory, 'unknown'>>;

export const CATEGORIES: MainCategory[] = ['brakes', 'airbags', 'electrical', 'structure', 'other', 'unknown'];

/** Follow-up questions per category, in order. */
export const QUESTIONS: Record<MainCategory, QuestionKey[]> = {
  brakes: ['moving', 'warningLight', 'crash', 'injury'],
  airbags: ['crash', 'warningLight', 'injury'],
  electrical: ['moving', 'fire', 'warningLight', 'injury'],
  structure: ['detached', 'moving', 'crash', 'injury'],
  other: ['moving', 'crash', 'fire', 'injury'],
  unknown: ['moving', 'crash', 'fire', 'injury'],
};

export interface TriageState {
  category: MainCategory | null;
  detail: string | null;
  answers: Partial<Record<QuestionKey, Answer>>;
  description: string;
}

export const EMPTY_STATE: TriageState = { category: null, detail: null, answers: {}, description: '' };

/** "Was anyone injured?" only follows a crash or a fire: asking it otherwise would presume harm. */
export function visibleQuestions(state: TriageState): QuestionKey[] {
  if (!state.category) return [];
  return QUESTIONS[state.category].filter((q) => q !== 'injury' || state.answers.crash === 'yes' || state.answers.fire === 'yes');
}

/** Steps of the flow: who does not know the category describes the problem first and gets a suggestion. */
export function steps(state: TriageState): StepKey[] {
  return state.category === 'unknown' ? ['category', 'describe', 'questions', 'review'] : ['category', 'detail', 'questions', 'describe', 'review'];
}

export type ValidationError = 'chooseCategory' | 'chooseDetail' | 'answerAll' | 'describeUnknown';

/** What is missing before leaving a step (empty when the step is complete). */
export function validate(step: StepKey, state: TriageState): ValidationError[] {
  switch (step) {
    case 'category':
      return state.category ? [] : ['chooseCategory'];
    case 'detail':
      return state.detail ? [] : ['chooseDetail'];
    case 'questions':
      return visibleQuestions(state).every((q) => state.answers[q]) ? [] : ['answerAll'];
    case 'describe':
      // the description is optional, except for who does not know the category: the suggestion needs it
      return state.category === 'unknown' && state.description.trim().length < 15 ? ['describeUnknown'] : [];
    default:
      return [];
  }
}

/** Answers that no longer apply (the injury question after "no crash, no fire") are dropped. */
export function prune(state: TriageState): TriageState {
  const keep = new Set(visibleQuestions(state));
  const answers = Object.fromEntries(Object.entries(state.answers).filter(([q]) => keep.has(q as QuestionKey)));
  return { ...state, answers };
}

/** Fire, injury, or brakes failing in a moving vehicle: show the safety notice first. */
export function urgent(state: TriageState): boolean {
  const a = state.answers;
  return a.fire === 'yes' || a.injury === 'yes' || (state.category === 'brakes' && a.moving === 'yes' && state.detail === 'pedal');
}
