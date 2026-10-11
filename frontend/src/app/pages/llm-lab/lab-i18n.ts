import { Locale } from '../../services/i18n.service';

export interface LabTranslations {
  back: string;
  onThisPage: string;

  patentsLede: string;
  askLabel: string;
  askHint: string;
  askPlaceholder: string;
  tryLabel: string;
  tryExamples: string[];
  translatedNote: string;
  search: string;
  matches: string;
  noMatch: string;
  pickLabel: string;
  pickPrompt: string;
  passages: string;
  reference: string;
  modelLabel: string;
  before: string;
  after: string;
  pendingAnswers: string;
  baselineAnswer: string;
  cites: string;
  support: string;
  yes: string;
  no: string;
  scoresHint: string;
  disclaimer: string;
  categories: Record<string, string>;

  loadError: string;
  browserModel: string;
  samplesTitle: string;
  samplesLede: string;
  filterLabel: string;
  all: string;
  truth: string;
  correct: string;
  wrong: string;
  trySample: string;
  showMore: string;
  showOriginal: string;
  showTranslation: string;
  classes: Record<string, string>;

  resultsTitle: string;
  patentCaption: string;
  nhtsaCaption: string;
  colModel: string;
  colStage: string;
  colAccuracy: string;
  colF1: string;
  colF1Old: string;
  colSpeed: string;
  colIpc: string;
  stages: Record<string, string>;
  status: Record<string, string>;
  baselines: Record<string, string>;

  methodTitle: string;
}

export const LAB_I18N: Record<Locale, LabTranslations> = {
  pt: {
    back: 'Voltar aos projetos',
    onThisPage: 'Nesta página',

    patentsLede:
      'Faça uma pergunta sobre patentes no Brasil. Ela é comparada às {n} perguntas de teste, que os modelos nunca viram no treino. Você vê os trechos oficiais que cada modelo recebeu, a resposta de referência e o que cada modelo respondeu antes e depois do ajuste fino.',
    askLabel: 'Sua pergunta',
    askHint: 'As respostas vêm de documentos oficiais brasileiros: a Lei 9.279/1996 e os manuais, diretrizes e estudos do INPI.',
    askPlaceholder: 'Ex.: posso patentear um algoritmo de detecção de faixas?',
    tryLabel: 'Experimente',
    translatedNote: '',
    tryExamples: [
      'posso patentear um algoritmo de detecção de faixas?',
      'qual o prazo para pedir o exame?',
      'o que é o trâmite prioritário?',
      'preciso pesquisar se o invento já existe?',
      'como proteger uma invenção em outros países?',
      'quais partes de veículos têm mais pedidos de patente?',
    ],
    search: 'Buscar',
    matches: 'Perguntas de teste mais parecidas',
    noMatch: 'Nenhuma pergunta de teste parecida. Tente outras palavras ou escolha da lista.',
    pickLabel: 'Ou escolha uma pergunta de teste',
    pickPrompt: 'Escolha…',
    passages: 'Trechos oficiais recuperados (BM25) e entregues ao modelo',
    reference: 'Resposta de referência',
    modelLabel: 'Modelo',
    before: 'Antes do ajuste',
    after: 'Depois do ajuste',
    pendingAnswers:
      'As respostas dos LLMs aparecem aqui quando a avaliação terminar. Por enquanto, compare a referência com a resposta sem LLM.',
    baselineAnswer: 'Sem LLM: o trecho mais relevante',
    cites: 'Cita a fonte',
    support: 'Apoio nos trechos',
    yes: 'sim',
    no: 'não',
    scoresHint:
      'ROUGE-L e F1 medem a sobreposição de palavras com a referência (0 a 1). “Apoio nos trechos” é a fração das palavras da resposta que aparecem nos trechos recebidos; um valor baixo indica alucinação.',
    disclaimer: 'Orientação geral com base em documentos públicos; não é parecer jurídico.',
    categories: {
      lei: 'Lei 9.279/1996',
      manual: 'Manual do INPI',
      diretrizes: 'Diretrizes de exame',
      portal: 'Portal do INPI',
      faq_inpi: 'Perguntas frequentes do INPI',
      radar: 'Radares tecnológicos',
      software_adas: 'Software e ADAS',
      conceitos: 'Conceitos',
      procedimento: 'Procedimentos',
      prazos_custos: 'Prazos e custos',
      automotivo: 'Setor automotivo',
    },

    loadError: 'Não foi possível carregar os dados. Verifique a conexão e recarregue a página.',
    browserModel: 'Este classificador usa 20 mil termos. F1 macro: {en} em inglês (reclamações reais de 2014–2024), {pt} em português e {de} em alemão (traduções automáticas das mesmas reclamações). A versão do estudo, só em inglês, chega a 0,842.',
    samplesTitle: 'Reclamações reais e o que cada modelo previu',
    samplesLede: 'Reclamações reais do conjunto de avaliação (2014–2024). Os modelos classificaram o texto original em inglês; a tradução foi feita à mão para esta página.',
    filterLabel: 'Componente',
    all: 'Todos',
    truth: 'Rótulo verdadeiro',
    correct: 'acertou',
    wrong: 'errou',
    trySample: 'Testar este texto',
    showMore: 'Mostrar mais reclamações ({n} restantes)',
    showTranslation: 'Ver tradução',
    showOriginal: 'Ver original',
    classes: {
      'AIR BAGS': 'Airbags',
      'ELECTRICAL SYSTEM': 'Sistema elétrico',
      'SERVICE BRAKES': 'Freios',
      STRUCTURE: 'Estrutura',
      OTHER: 'Outros',
    },

    resultsTitle: 'Resultados',
    patentCaption:
      'Assistente de patentes: 52 perguntas de teste (resposta com RAG) e 104 pedidos reais (classificação pela IPC)',
    nhtsaCaption:
      'Triagem NHTSA: 2.089 reclamações de 2014–2024 (avaliação principal) e 2.089 de 1994–2013 (deslocamento temporal)',
    colModel: 'Modelo',
    colStage: 'Etapa',
    colAccuracy: 'Acurácia 2014–2024',
    colF1: 'F1 macro 2014–2024',
    colF1Old: 'F1 macro 1994–2013',
    colSpeed: 'Reclamações/s',
    colIpc: 'IPC: acurácia',
    stages: { baseline: 'sem LLM', base: 'base', fineTuned: 'ajustado (LoRA)', zero_shot: 'zero-shot', lora: 'ajustado (LoRA)' },
    status: { pending: 'na fila', needsLargerGpu: 'requer GPU maior' },
    baselines: {
      bm25: 'BM25 (trecho mais relevante)',
      majority: 'Classe majoritária',
      tfidf: 'TF-IDF + regressão logística',
    },

    methodTitle: 'Como foi feito',
  },

  en: {
    back: 'Back to projects',
    onThisPage: 'On this page',

    patentsLede:
      'Ask a question about patents in Brazil. It is matched against the {n} test questions, which the models never saw in training. You see the official passages each model received, the reference answer and what each model answered before and after fine-tuning.',
    askLabel: 'Your question',
    askHint: 'Questions translated by hand; the official passages and the answers are machine translations from Portuguese, the language the models read and wrote. The original is one click away.',
    askPlaceholder: 'e.g. can I patent a lane detection algorithm?',
    tryLabel: 'Try',
    translatedNote: 'Passages and answers: machine translation from Portuguese.',
    tryExamples: [
      'can I patent a lane detection algorithm?',
      'what is the deadline for requesting examination?',
      'what is fast-track examination?',
      'do I need to search whether my invention already exists?',
      'how do I protect an invention in other countries?',
      'which vehicle parts get the most patent applications?',
    ],
    search: 'Search',
    matches: 'Closest test questions',
    noMatch: 'No similar test question. Try other words or pick one from the list.',
    pickLabel: 'Or pick a test question',
    pickPrompt: 'Choose…',
    passages: 'Official passages retrieved by BM25 and given to the model',
    reference: 'Reference answer',
    modelLabel: 'Model',
    before: 'Before fine-tuning',
    after: 'After fine-tuning',
    pendingAnswers:
      'The LLM answers appear here once the evaluation finishes. Meanwhile, compare the reference with the no-LLM answer.',
    baselineAnswer: 'No LLM: the top passage',
    cites: 'Cites the source',
    support: 'Grounded in passages',
    yes: 'yes',
    no: 'no',
    scoresHint:
      'ROUGE-L and F1 measure word overlap with the reference (0 to 1). “Grounded in passages” is the share of the answer’s words found in the passages it received; a low value points to hallucination.',
    disclaimer: 'General guidance based on public documents, not legal advice.',
    categories: {
      lei: 'Industrial Property Law 9,279/1996',
      manual: 'INPI manual',
      diretrizes: 'Examination guidelines',
      portal: 'INPI website',
      faq_inpi: 'INPI FAQ',
      radar: 'Technology radar studies',
      software_adas: 'Software and ADAS',
      conceitos: 'Concepts',
      procedimento: 'Procedures',
      prazos_custos: 'Deadlines and fees',
      automotivo: 'Automotive sector',
    },

    loadError: 'The data could not be loaded. Check your connection and reload the page.',
    browserModel: 'This classifier uses 20,000 terms. Macro-F1: {en} in English (real 2014–2024 complaints), {pt} in Portuguese and {de} in German (machine translations of the same complaints). The study’s English-only version reaches 0.842.',
    samplesTitle: 'Real complaints and what each model predicted',
    samplesLede: 'Real complaints from the evaluation split (2014–2024), in the original wording.',
    filterLabel: 'Component',
    all: 'All',
    truth: 'True label',
    correct: 'correct',
    wrong: 'wrong',
    trySample: 'Try this text',
    showMore: 'Show more complaints ({n} left)',
    showTranslation: 'Show translation',
    showOriginal: 'Show original',
    classes: {
      'AIR BAGS': 'Air bags',
      'ELECTRICAL SYSTEM': 'Electrical system',
      'SERVICE BRAKES': 'Service brakes',
      STRUCTURE: 'Structure',
      OTHER: 'Other',
    },

    resultsTitle: 'Results',
    patentCaption:
      'Patent assistant: 52 test questions (answers with RAG) and 104 real applications (IPC classification)',
    nhtsaCaption:
      'NHTSA triage: 2,089 complaints from 2014–2024 (main evaluation) and 2,089 from 1994–2013 (temporal shift)',
    colModel: 'Model',
    colStage: 'Stage',
    colAccuracy: 'Accuracy 2014–2024',
    colF1: 'Macro-F1 2014–2024',
    colF1Old: 'Macro-F1 1994–2013',
    colSpeed: 'Complaints/s',
    colIpc: 'IPC: accuracy',
    stages: { baseline: 'no LLM', base: 'base', fineTuned: 'fine-tuned (LoRA)', zero_shot: 'zero-shot', lora: 'fine-tuned (LoRA)' },
    status: { pending: 'queued', needsLargerGpu: 'needs a larger GPU' },
    baselines: {
      bm25: 'BM25 (top passage)',
      majority: 'Majority class',
      tfidf: 'TF-IDF + logistic regression',
    },

    methodTitle: 'How it was done',
  },

  de: {
    back: 'Zurück zu den Projekten',
    onThisPage: 'Auf dieser Seite',

    patentsLede:
      'Stellen Sie eine Frage zu Patenten in Brasilien. Sie wird mit den {n} Testfragen abgeglichen, die die Modelle im Training nie gesehen haben. Sie sehen die offiziellen Textstellen, die jedes Modell erhielt, die Referenzantwort und die Antwort jedes Modells vor und nach dem Fine-Tuning.',
    askLabel: 'Ihre Frage',
    askHint: 'Die Fragen wurden von Hand übersetzt; die offiziellen Textstellen und die Antworten sind maschinelle Übersetzungen aus dem Portugiesischen, der Sprache, in der die Modelle gelesen und geschrieben haben. Das Original ist einen Klick entfernt.',
    askPlaceholder: 'z. B. kann ich einen Algorithmus zur Fahrspurerkennung patentieren?',
    tryLabel: 'Zum Ausprobieren',
    translatedNote: 'Textstellen und Antworten: maschinelle Übersetzung aus dem Portugiesischen.',
    tryExamples: [
      'kann ich einen Algorithmus zur Fahrspurerkennung patentieren?',
      'welche Frist gilt für den Prüfungsantrag?',
      'was ist die beschleunigte Prüfung?',
      'muss ich recherchieren, ob meine Erfindung schon existiert?',
      'wie schütze ich eine Erfindung in anderen Ländern?',
      'welche Fahrzeugteile haben die meisten Patentanmeldungen?',
    ],
    search: 'Suchen',
    matches: 'Ähnlichste Testfragen',
    noMatch: 'Keine ähnliche Testfrage. Versuchen Sie andere Wörter oder wählen Sie eine aus der Liste.',
    pickLabel: 'Oder wählen Sie eine Testfrage',
    pickPrompt: 'Auswählen …',
    passages: 'Offizielle Textstellen, per BM25 abgerufen und dem Modell übergeben',
    reference: 'Referenzantwort',
    modelLabel: 'Modell',
    before: 'Vor dem Fine-Tuning',
    after: 'Nach dem Fine-Tuning',
    pendingAnswers:
      'Die Antworten der LLMs erscheinen hier, sobald die Evaluierung abgeschlossen ist. Bis dahin können Sie die Referenz mit der Antwort ohne LLM vergleichen.',
    baselineAnswer: 'Ohne LLM: die relevanteste Textstelle',
    cites: 'Zitiert die Quelle',
    support: 'Durch Textstellen gestützt',
    yes: 'ja',
    no: 'nein',
    scoresHint:
      'ROUGE-L und F1 messen die Wortüberlappung mit der Referenz (0 bis 1). „Durch Textstellen gestützt“ ist der Anteil der Antwortwörter, die in den erhaltenen Textstellen vorkommen; ein niedriger Wert deutet auf Halluzination hin.',
    disclaimer: 'Allgemeine Orientierung auf Grundlage öffentlicher Dokumente, keine Rechtsberatung.',
    categories: {
      lei: 'Gesetz über gewerbliches Eigentum 9.279/1996',
      manual: 'INPI-Handbuch',
      diretrizes: 'Prüfungsrichtlinien',
      portal: 'INPI-Website',
      faq_inpi: 'INPI-FAQ',
      radar: 'Technologie-Radar-Studien',
      software_adas: 'Software und ADAS',
      conceitos: 'Begriffe',
      procedimento: 'Verfahren',
      prazos_custos: 'Fristen und Gebühren',
      automotivo: 'Automobilsektor',
    },

    loadError: 'Die Daten konnten nicht geladen werden. Prüfen Sie die Verbindung und laden Sie die Seite neu.',
    browserModel: 'Dieser Klassifikator nutzt 20.000 Terme. Makro-F1: {en} auf Englisch (echte Beschwerden von 2014–2024), {pt} auf Portugiesisch und {de} auf Deutsch (maschinelle Übersetzungen derselben Beschwerden). Die rein englische Version der Studie erreicht 0,842.',
    samplesTitle: 'Echte Beschwerden und die Vorhersage jedes Modells',
    samplesLede: 'Echte Beschwerden aus den Evaluierungsdaten (2014–2024). Die Modelle haben das englische Original klassifiziert; die Übersetzung wurde für diese Seite von Hand erstellt.',
    filterLabel: 'Komponente',
    all: 'Alle',
    truth: 'Tatsächliche Klasse',
    correct: 'richtig',
    wrong: 'falsch',
    trySample: 'Diesen Text testen',
    showMore: 'Weitere Beschwerden anzeigen (noch {n})',
    showTranslation: 'Übersetzung anzeigen',
    showOriginal: 'Original anzeigen',
    classes: {
      'AIR BAGS': 'Airbags',
      'ELECTRICAL SYSTEM': 'Elektrik',
      'SERVICE BRAKES': 'Betriebsbremse',
      STRUCTURE: 'Struktur',
      OTHER: 'Sonstiges',
    },

    resultsTitle: 'Ergebnisse',
    patentCaption:
      'Patentassistent: 52 Testfragen (Antworten mit RAG) und 104 echte Anmeldungen (IPC-Klassifikation)',
    nhtsaCaption:
      'NHTSA-Triage: 2.089 Beschwerden von 2014–2024 (Hauptevaluierung) und 2.089 von 1994–2013 (zeitliche Verschiebung)',
    colModel: 'Modell',
    colStage: 'Stufe',
    colAccuracy: 'Genauigkeit 2014–2024',
    colF1: 'Makro-F1 2014–2024',
    colF1Old: 'Makro-F1 1994–2013',
    colSpeed: 'Beschwerden/s',
    colIpc: 'IPC: Genauigkeit',
    stages: { baseline: 'ohne LLM', base: 'Basis', fineTuned: 'feinabgestimmt (LoRA)', zero_shot: 'Zero-Shot', lora: 'feinabgestimmt (LoRA)' },
    status: { pending: 'in Warteschlange', needsLargerGpu: 'braucht größere GPU' },
    baselines: {
      bm25: 'BM25 (relevanteste Textstelle)',
      majority: 'Mehrheitsklasse',
      tfidf: 'TF-IDF + logistische Regression',
    },

    methodTitle: 'Vorgehen',
  },
};
