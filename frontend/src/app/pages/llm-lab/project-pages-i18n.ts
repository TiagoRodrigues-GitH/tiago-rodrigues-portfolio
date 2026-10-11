import { Locale } from '../../services/i18n.service';

/** Header, results notes and method of the two project pages that grew out of the compact-LLM study. */
export interface ProjectPageText {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  honesty: string;
  demoTitle: string;
  demoLede: string;
  resultsLede: string;
  notes: string[];
  method: string[];
}

export const PROJECT_PAGES: Record<Locale, { triage: ProjectPageText; patents: ProjectPageText }> = {
  pt: {
    triage: {
      eyebrow: 'Projeto 01 · Em andamento',
      title: 'Triagem de reclamações de defeitos',
      subtitle: 'Reclamações veiculares da NHTSA classificadas por LLMs compactos',
      intro: 'Descreva um defeito e veja em que sistema do veículo ele se encaixa. Por trás, modelos de linguagem com menos de 7 bilhões de parâmetros, ajustados com LoRA em uma GPU de 6 GB, comparados a um classificador clássico que roda no seu navegador.',
      honesty: 'Previsões e métricas vêm dos experimentos reais. Os LLMs não rodam neste site; o classificador TF-IDF, sim, no seu navegador, sem enviar nada.',
      demoTitle: 'Experimente',
      demoLede: 'Escolha a parte do veículo ou descreva o problema com suas palavras.',
      resultsLede: 'Conjuntos de teste fixos, separados antes de qualquer ajuste.',
      notes: [
        'As reclamações de 1994–2013 usam os nomes antigos de componentes da NHTSA; a queda de desempenho mede o efeito da mudança no tempo.',
      ],
      method: [
        '12.534 reclamações públicas da NHTSA, com divisão temporal: 2014–2024 para avaliação principal e 1994–2013 para medir a mudança no tempo.',
        'LoRA em uma GPU de 6 GB; modelos acima de 3 bilhões de parâmetros em QLoRA de 4 bits. Taxa de aprendizado escolhida na validação; épocas por parada antecipada.',
        'Referências sem LLM (classe majoritária e TF-IDF com regressão logística) para medir se o modelo de linguagem compensa o custo.',
      ],
    },
    patents: {
      eyebrow: 'Projeto 02 · Em andamento',
      title: 'Assistente de patentes',
      subtitle: 'Orientação sobre patentes no Brasil com documentos oficiais do INPI',
      intro: 'Pergunte sobre patentes, siga o passo a passo para pedir uma patente no INPI e compare as empresas que mais depositam no Brasil e no exterior. As respostas do assistente vêm de LLMs compactos ajustados com LoRA e citam a fonte oficial.',
      honesty: 'As respostas mostradas são as reais da avaliação, comparadas a uma resposta de referência. É orientação geral, não aconselhamento jurídico.',
      demoTitle: 'Assistente e guia',
      demoLede: 'Use as abas: pergunte ao assistente, leia o passo a passo ou veja as estatísticas.',
      resultsLede: 'Conjuntos de teste fixos, separados antes de qualquer ajuste.',
      notes: [
        'O teste de perguntas e respostas tem 52 itens: diferenças de poucos pontos não são conclusivas.',
        'ROUGE-L e F1 favorecem respostas extrativas e não medem a correção jurídica; uma amostra será avaliada por especialista em propriedade intelectual.',
      ],
      method: [
        '490 perguntas e respostas extraídas da Lei 9.279/1996 e de manuais, diretrizes e estudos do INPI, com cada trecho conferido com a fonte; 694 pedidos de patente reais para a classificação IPC.',
        'RAG e ajuste fino: o modelo recebe os três trechos oficiais mais relevantes, recuperados por BM25, e aprende a responder com base neles e a citar a fonte.',
        'LoRA em uma GPU de 6 GB; modelos acima de 3 bilhões de parâmetros em QLoRA de 4 bits; referência sem LLM (o trecho mais relevante).',
      ],
    },
  },
  en: {
    triage: {
      eyebrow: 'Project 01 · In progress',
      title: 'Defect complaint triage',
      subtitle: 'NHTSA vehicle complaints classified by compact LLMs',
      intro: 'Describe a defect and see which vehicle system it belongs to. Behind it are language models with fewer than 7 billion parameters, fine-tuned with LoRA on a 6 GB GPU, compared with a classic classifier that runs in your browser.',
      honesty: 'Predictions and metrics come from the real experiments. The LLMs do not run on this site; the TF-IDF classifier does, in your browser, and sends nothing.',
      demoTitle: 'Try it',
      demoLede: 'Pick the part of the vehicle or describe the problem in your own words.',
      resultsLede: 'Fixed test sets, split off before any tuning.',
      notes: [
        'The 1994–2013 complaints use NHTSA’s older component names; the drop in performance measures the effect of change over time.',
      ],
      method: [
        '12,534 public NHTSA complaints with a temporal split: 2014–2024 for the main evaluation and 1994–2013 to measure change over time.',
        'LoRA on a 6 GB GPU; models above 3 billion parameters use 4-bit QLoRA. Learning rate chosen on validation; epochs by early stopping.',
        'No-LLM baselines (majority class and TF-IDF with logistic regression) to measure whether the language model is worth its cost.',
      ],
    },
    patents: {
      eyebrow: 'Project 02 · In progress',
      title: 'Patent assistant',
      subtitle: 'Guidance on patents in Brazil from official INPI documents',
      intro: 'Ask about patents, follow the steps for filing a patent at INPI and compare the companies that file the most in Brazil and abroad. The assistant’s answers come from compact LLMs fine-tuned with LoRA and cite the official source.',
      honesty: 'The answers shown are the real ones from the evaluation, compared with a reference answer. This is general guidance, not legal advice.',
      demoTitle: 'Assistant and guide',
      demoLede: 'Use the tabs: ask the assistant, read the steps or look at the statistics.',
      resultsLede: 'Fixed test sets, split off before any tuning.',
      notes: [
        'The question-answering test has 52 items: differences of a few points are not conclusive.',
        'ROUGE-L and F1 favour extractive answers and do not measure legal correctness; an intellectual-property expert will review a sample.',
      ],
      method: [
        '490 question–answer pairs drawn from Brazil’s Industrial Property Law (Law 9,279/1996) and INPI manuals, guidelines and studies, every passage checked against its source; 694 real patent applications for IPC classification.',
        'RAG and fine-tuning: the model receives the three most relevant official passages, retrieved with BM25, and learns to answer from them and cite the source.',
        'LoRA on a 6 GB GPU; models above 3 billion parameters use 4-bit QLoRA; a no-LLM baseline (the top passage).',
      ],
    },
  },
  de: {
    triage: {
      eyebrow: 'Projekt 01 · In Arbeit',
      title: 'Triage von Mängelbeschwerden',
      subtitle: 'NHTSA-Fahrzeugbeschwerden, klassifiziert von kompakten LLMs',
      intro: 'Beschreiben Sie einen Mangel und sehen Sie, zu welchem Fahrzeugsystem er gehört. Dahinter stehen Sprachmodelle mit weniger als 7 Milliarden Parametern, mit LoRA auf einer 6-GB-GPU feinabgestimmt und mit einem klassischen Klassifikator verglichen, der in Ihrem Browser läuft.',
      honesty: 'Vorhersagen und Kennzahlen stammen aus den echten Experimenten. Die LLMs laufen nicht auf dieser Website; der TF-IDF-Klassifikator schon, in Ihrem Browser, ohne etwas zu senden.',
      demoTitle: 'Ausprobieren',
      demoLede: 'Wählen Sie das Fahrzeugteil oder beschreiben Sie das Problem mit eigenen Worten.',
      resultsLede: 'Feste Testsets, vor jeder Abstimmung abgetrennt.',
      notes: [
        'Die Beschwerden von 1994–2013 verwenden die älteren Komponentenbezeichnungen der NHTSA; der Leistungsabfall misst den Effekt des zeitlichen Wandels.',
      ],
      method: [
        '12.534 öffentliche NHTSA-Beschwerden mit zeitlicher Aufteilung: 2014–2024 für die Hauptevaluierung, 1994–2013 für den zeitlichen Wandel.',
        'LoRA auf einer 6-GB-GPU; Modelle über 3 Milliarden Parameter mit 4-Bit-QLoRA. Lernrate auf der Validierung gewählt, Epochen per Early Stopping.',
        'Referenzen ohne LLM (Mehrheitsklasse und TF-IDF mit logistischer Regression), um zu messen, ob sich das Sprachmodell lohnt.',
      ],
    },
    patents: {
      eyebrow: 'Projekt 02 · In Arbeit',
      title: 'Patentassistent',
      subtitle: 'Orientierung zu Patenten in Brasilien auf Grundlage amtlicher INPI-Dokumente',
      intro: 'Fragen Sie zu Patenten, folgen Sie den Schritten zur Patentanmeldung beim INPI und vergleichen Sie die Unternehmen mit den meisten Anmeldungen in Brasilien und im Ausland. Die Antworten des Assistenten stammen von kompakten, mit LoRA feinabgestimmten LLMs und nennen die amtliche Quelle.',
      honesty: 'Die gezeigten Antworten sind die echten aus der Evaluierung, verglichen mit einer Referenzantwort. Das ist eine allgemeine Orientierung, keine Rechtsberatung.',
      demoTitle: 'Assistent und Leitfaden',
      demoLede: 'Nutzen Sie die Reiter: Fragen Sie den Assistenten, lesen Sie die Schritte oder sehen Sie sich die Statistik an.',
      resultsLede: 'Feste Testsets, vor jeder Abstimmung abgetrennt.',
      notes: [
        'Der Frage-Antwort-Test umfasst 52 Fragen: Unterschiede von wenigen Punkten sind nicht aussagekräftig.',
        'ROUGE-L und F1 bevorzugen extraktive Antworten und messen keine juristische Korrektheit; eine Stichprobe wird von einer Fachperson für geistiges Eigentum geprüft.',
      ],
      method: [
        '490 Frage-Antwort-Paare aus dem brasilianischen Gesetz über gewerbliches Eigentum (Gesetz 9.279/1996) sowie Handbüchern, Richtlinien und Studien des INPI, jede Textstelle mit der Quelle abgeglichen; 694 echte Patentanmeldungen für die IPC-Klassifikation.',
        'RAG und Fine-Tuning: Das Modell erhält die drei relevantesten amtlichen Textstellen, per BM25 abgerufen, und lernt, darauf gestützt zu antworten und die Quelle zu nennen.',
        'LoRA auf einer 6-GB-GPU; Modelle über 3 Milliarden Parameter mit 4-Bit-QLoRA; eine Referenz ohne LLM (die relevanteste Textstelle).',
      ],
    },
  },
};
