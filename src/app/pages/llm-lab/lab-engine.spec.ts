import classifierData from '../../../assets/llm-lab/nhtsa-classifier.json';
import patentData from '../../../assets/llm-lab/patents.json';
import { Bm25, ClassifierData, ComplaintClassifier, terms } from './lab-engine';
import { LAB_I18N } from './lab-i18n';

describe('ComplaintClassifier', () => {
  const model = classifierData as ClassifierData;
  const classifier = new ComplaintClassifier(model);

  it('reproduces the probabilities scikit-learn gave the reference texts', () => {
    expect(model.check.length).toBeGreaterThan(0);
    for (const { text, probs } of model.check) {
      const { probabilities } = classifier.classify(text);
      probabilities.forEach((p, i) => expect(Math.abs(p - probs[i])).toBeLessThan(0.01));
      expect(probabilities.indexOf(Math.max(...probabilities))).toBe(probs.indexOf(Math.max(...probs)));
    }
  });

  it('reports when no word of the text is known', () => {
    expect(classifier.classify('xyzzy plugh qwrtz').knownTerms).toBe(0);
    expect(classifier.classify('brake pedal went to the floor').knownTerms).toBeGreaterThan(0);
  });

  it('understands Portuguese and German descriptions too', () => {
    const top = (text: string) => {
      const { probabilities } = classifier.classify(text);
      return model.labels[probabilities.indexOf(Math.max(...probabilities))];
    };
    expect(top('Os freios falharam e o pedal foi até o fundo.')).toBe('SERVICE BRAKES');
    expect(top('Der Airbag hat beim Unfall nicht ausgelöst.')).toBe('AIR BAGS');
  });
});

describe('Bm25 question search', () => {
  const locales = ['pt', 'en', 'de'] as const;

  it('ignores accents, case, function words and plural endings', () => {
    expect(terms('O que é a Patente de Invenção?', 'pt')).toEqual(['patente', 'invencao']);
    expect(terms('Patentes e invenções', 'pt')).toEqual(['patente', 'invencao']);
    expect(terms('Welche Fahrzeugteilen?', 'de')).toEqual(terms('Fahrzeugteile', 'de'));
    expect(terms('außerdem', 'de')).toEqual(['ausserdem']);
  });

  for (const locale of locales) {
    const questions = patentData.items.map((item) => item.question[locale]);
    const index = new Bm25(questions, locale);

    it(`finds each test question from its own wording (${locale})`, () => {
      const found = questions.filter((q, i) => index.search(q, 1)[0]?.index === i).length;
      expect(found / questions.length).toBeGreaterThan(0.9);
    });

    it(`answers every example button (${locale})`, () => {
      for (const example of LAB_I18N[locale].tryExamples) {
        expect(index.search(example, 1).length, example).toBe(1);
      }
    });
  }

  it('returns nothing for unrelated words', () => {
    expect(new Bm25(patentData.items.map((item) => item.question.pt)).search('xyzzy plugh')).toEqual([]);
  });
});

describe('Lab translations', () => {
  it('have the same keys and list lengths in every language', () => {
    const pt = LAB_I18N.pt;
    for (const t of [LAB_I18N.en, LAB_I18N.de]) {
      expect(Object.keys(t).sort()).toEqual(Object.keys(pt).sort());
      expect(Object.keys(t.categories).sort()).toEqual(Object.keys(pt.categories).sort());
      expect(Object.keys(t.classes).sort()).toEqual(Object.keys(pt.classes).sort());
      expect(t.method.length).toBe(pt.method.length);
      expect(t.notes.length).toBe(pt.notes.length);
      expect(t.exampleTexts.length).toBe(pt.exampleTexts.length);
    }
  });

  it('name every patent category and complaint class found in the data', () => {
    for (const item of patentData.items) {
      expect(LAB_I18N.pt.categories[item.category]).toBeDefined();
    }
    for (const label of classifierData.labels) {
      expect(LAB_I18N.pt.classes[label]).toBeDefined();
    }
  });
});
