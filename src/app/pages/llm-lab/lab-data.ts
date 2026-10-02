import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ClassifierData } from './lab-engine';

/** Shapes of the files written by scripts/llm-lab/export_llm_lab.py into src/assets/llm-lab/. */

export type RowStatus = 'done' | 'pending' | 'needsLargerGpu';

export interface PatentAnswer {
  text: string;
  rougeL: number | null;
  f1: number | null;
  cites: boolean;
  support: number | null;
}

export interface PatentItem {
  id: string;
  category: string;
  question: string;
  reference: string;
  passages: Array<{ citation: string; text: string }>;
  /** 'bm25' plus '<model>/base' and '<model>/fineTuned' once evaluated. */
  answers: Record<string, PatentAnswer>;
}

export interface PatentRow {
  model: string;
  stage: 'baseline' | 'base' | 'fineTuned';
  status: RowStatus;
  qaRougeL?: number | null;
  qaF1?: number | null;
  qaCites?: number | null;
  qaSupport?: number | null;
  ipcAccuracy?: number | null;
  ipcMacroF1?: number | null;
}

export interface PatentData {
  generated: string;
  testQuestions: number;
  rows: PatentRow[];
  items: PatentItem[];
}

export interface NhtsaRow {
  model: string;
  stage: 'baseline' | 'zero_shot' | 'lora';
  status: RowStatus;
  accuracyEval?: number;
  macroF1Eval?: number;
  macroF1Test?: number | null;
  examplesPerSecond?: number | null;
}

export interface NhtsaSample {
  text: string;
  label: string;
  /** 'tfidf' plus '<model>/<stage>' for every evaluated model. */
  predictions: Record<string, string>;
}

export interface NhtsaData {
  generated: string;
  labels: string[];
  rows: NhtsaRow[];
  samples: NhtsaSample[];
}

/** Display names of the language models (the research code uses lowercase keys). */
export const MODEL_NAMES: Record<string, string> = {
  'qwen3-0.6b': 'Qwen3-0.6B',
  'tinyllama-1.1b': 'TinyLlama-1.1B',
  'qwen2.5-1.5b': 'Qwen2.5-1.5B',
  'qwen3-1.7b': 'Qwen3-1.7B',
  'qwen3-4b': 'Qwen3-4B',
  'phi4-mini': 'Phi-4-mini',
  'mistral-7b': 'Mistral-7B',
};

/** Loads each file once per visit; requests start only in the browser (the page is prerendered without data). */
@Injectable({ providedIn: 'root' })
export class LabDataService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Observable<unknown>>();

  patents(): Observable<PatentData> {
    return this.load<PatentData>('patents.json');
  }

  nhtsa(): Observable<NhtsaData> {
    return this.load<NhtsaData>('nhtsa.json');
  }

  classifier(): Observable<ClassifierData> {
    return this.load<ClassifierData>('nhtsa-classifier.json');
  }

  private load<T>(file: string): Observable<T> {
    if (!this.cache.has(file)) {
      this.cache.set(file, this.http.get<T>(`assets/llm-lab/${file}`).pipe(shareReplay(1)));
    }
    return this.cache.get(file) as Observable<T>;
  }
}
