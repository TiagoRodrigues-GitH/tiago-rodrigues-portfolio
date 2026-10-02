/**
 * Browser-side logic of the compact-LLM demo, free of Angular so it can be unit-tested:
 * the NHTSA complaint classifier and the BM25 search that matches a visitor's question to a test question.
 */

/** TF-IDF + logistic regression exported by scripts/llm-lab/export_llm_lab.py (nhtsa-classifier.json). */
export interface ClassifierData {
  labels: string[];
  terms: string[];
  idf: number[];
  /** weights[term * labels.length + label] */
  weights: number[];
  bias: number[];
  maxChars: number;
  metrics: { accuracyEval: number; macroF1Eval: number; macroF1Test: number };
  /** Texts with the probabilities scikit-learn gave them: the port must reproduce these. */
  check: Array<{ text: string; probs: number[] }>;
}

export interface Classification {
  probabilities: number[];
  /** Number of the text's unigrams and bigrams found in the vocabulary (0: the result is only the prior). */
  knownTerms: number;
}

/**
 * Same steps as scikit-learn's TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True) followed by a multinomial
 * LogisticRegression: lowercase, tokens of two or more word characters, unigram and bigram counts,
 * 1 + ln(count) times idf, l2 normalisation, softmax of the linear scores.
 */
export class ComplaintClassifier {
  private readonly index = new Map<string, number>();

  constructor(private readonly model: ClassifierData) {
    model.terms.forEach((term, i) => this.index.set(term, i));
  }

  get labels(): string[] {
    return this.model.labels;
  }

  classify(text: string): Classification {
    const tokens = text.trim().slice(0, this.model.maxChars).toLowerCase().match(/[\p{L}\p{N}_]{2,}/gu) ?? [];
    const counts = new Map<number, number>();
    const count = (term: string): void => {
      const i = this.index.get(term);
      if (i !== undefined) {
        counts.set(i, (counts.get(i) ?? 0) + 1);
      }
    };
    tokens.forEach((token, k) => {
      count(token);
      if (k + 1 < tokens.length) {
        count(`${token} ${tokens[k + 1]}`);
      }
    });

    const features = [...counts].map(([i, c]) => [i, (1 + Math.log(c)) * this.model.idf[i]] as const);
    const norm = Math.hypot(...features.map(([, v]) => v)) || 1;
    const n = this.model.labels.length;
    const scores = [...this.model.bias];
    for (const [i, v] of features) {
      for (let label = 0; label < n; label++) {
        scores[label] += (v / norm) * this.model.weights[i * n + label];
      }
    }
    const top = Math.max(...scores);
    const exp = scores.map((s) => Math.exp(s - top));
    const sum = exp.reduce((a, b) => a + b, 0);
    return { probabilities: exp.map((e) => e / sum), knownTerms: counts.size };
  }
}

/** Portuguese function words, accents removed (the questions are compared without accents). */
const STOPWORDS = new Set(
  ('a o e de da do das dos em no na nos nas um uma uns umas para por com que se ao aos as os ou e sao como mais sua ' +
    'seu suas seus pelo pela pelos pelas este esta isso essa esse isto aquele qual quais quando onde ser foi ter tem ' +
    'ha sobre entre sem tambem ja nao sim n art arts').split(' '),
);

export function normalize(text: string): string {
  return text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
}

export function terms(text: string): string[] {
  return (normalize(text).match(/[a-z0-9]+/g) ?? []).filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export interface SearchHit {
  index: number;
  score: number;
}

/** Okapi BM25 over short documents (the test questions), k1 = 1.5 and b = 0.75 as in the research code. */
export class Bm25 {
  private readonly docs: Map<string, number>[];
  private readonly lengths: number[];
  private readonly mean: number;
  private readonly idf = new Map<string, number>();

  constructor(texts: string[], private readonly k1 = 1.5, private readonly b = 0.75) {
    this.docs = texts.map((text) => {
      const counts = new Map<string, number>();
      for (const t of terms(text)) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
      return counts;
    });
    this.lengths = this.docs.map((d) => [...d.values()].reduce((a, b) => a + b, 0));
    this.mean = this.lengths.reduce((a, b) => a + b, 0) / Math.max(1, this.lengths.length);
    const df = new Map<string, number>();
    for (const d of this.docs) {
      for (const t of d.keys()) {
        df.set(t, (df.get(t) ?? 0) + 1);
      }
    }
    for (const [t, f] of df) {
      this.idf.set(t, Math.log(1 + (this.docs.length - f + 0.5) / (f + 0.5)));
    }
  }

  search(query: string, k = 3): SearchHit[] {
    const scores = new Map<number, number>();
    for (const t of new Set(terms(query))) {
      const idf = this.idf.get(t);
      if (idf === undefined) {
        continue;
      }
      this.docs.forEach((d, i) => {
        const f = d.get(t);
        if (f) {
          const norm = (f * (this.k1 + 1)) / (f + this.k1 * (1 - this.b + (this.b * this.lengths[i]) / this.mean));
          scores.set(i, (scores.get(i) ?? 0) + idf * norm);
        }
      });
    }
    return [...scores]
      .map(([index, score]) => ({ index, score }))
      .sort((x, y) => y.score - x.score)
      .slice(0, k);
  }
}
