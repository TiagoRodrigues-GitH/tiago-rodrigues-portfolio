import { Locale } from '../../services/i18n.service';

export interface LabTranslations {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  honesty: string;
  updated: string;
  back: string;
  onThisPage: string;

  patentsTitle: string;
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
  question: string;
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

  triageTitle: string;
  triageLede: string;
  describe: string;
  classify: string;
  examples: string;
  exampleTexts: Array<{ label: string; text: string }>;
  loadingModel: string;
  loadError: string;
  likely: string;
  unknownWords: string;
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
  resultsLede: string;
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
  notes: string[];

  methodTitle: string;
  method: string[];
}

export const LAB_I18N: Record<Locale, LabTranslations> = {
  pt: {
    eyebrow: 'Projeto 01 · Em andamento',
    title: 'LLMs compactos para a indústria automotiva',
    subtitle: 'Triagem de reclamações de defeitos e assistente de patentes',
    intro:
      'Modelos de linguagem com menos de 7 bilhões de parâmetros, ajustados com LoRA em uma GPU de 6 GB e aplicados a duas tarefas reais: classificar reclamações de defeitos veiculares registradas na NHTSA, a agência de segurança viária dos EUA, e orientar sobre patentes no Brasil com base em documentos oficiais do INPI.',
    honesty:
      'Nada aqui é simulado: respostas e previsões vêm dos experimentos. Os LLMs não rodam neste site; o classificador de reclamações, sim, roda no seu navegador.',
    updated: 'Experimentos em andamento: modelos marcados como “na fila” ainda estão sendo treinados. Dados de {date}.',
    back: 'Voltar aos projetos',
    onThisPage: 'Nesta página',

    patentsTitle: 'Assistente de patentes',
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
    question: 'Pergunta',
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

    triageTitle: 'Triagem de reclamações de defeitos',
    triageLede: 'Descreva um defeito em português, inglês ou alemão. Um classificador TF-IDF com regressão logística indica o componente afetado. Ele roda no seu navegador (1,1 MB; nada é enviado) e é a referência que os LLMs do estudo precisam superar.',
    describe: 'Descrição do defeito',
    classify: 'Classificar',
    examples: 'Exemplos',
    exampleTexts: [
      { label: 'Freios', text: 'Os freios falharam e o pedal foi até o fundo quando eu descia uma ladeira.' },
      { label: 'Airbag', text: 'A luz de advertência do airbag acendeu e o airbag do motorista não abriu na colisão.' },
      { label: 'Elétrica', text: 'As luzes do painel piscam, o rádio desliga sozinho e a bateria descarrega durante a noite.' },
      { label: 'Estrutura', text: 'O chassi está todo enferrujado e apareceram rachaduras perto da suspensão traseira.' },
      { label: 'Motor', text: 'O motor morreu na rodovia a 100 km/h e o carro perdeu a direção hidráulica.' },
      { label: 'ABS', text: 'A luz do ABS acendeu e o carro demorou muito para parar na chuva.' },
    ],
    loadingModel: 'Carregando o classificador (1,1 MB)…',
    loadError: 'Não foi possível carregar os dados. Verifique a conexão e recarregue a página.',
    likely: 'Componente provável',
    unknownWords: 'Nenhuma palavra do texto é conhecida pelo classificador; tente descrever o defeito com outras palavras.',
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
    resultsLede: 'Conjuntos de teste fixos, separados antes de qualquer ajuste.',
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
    notes: [
      'As reclamações de 1994–2013 usam a nomenclatura antiga de componentes da NHTSA; ali, a queda de desempenho mede o efeito do deslocamento temporal.',
      'O teste de perguntas e respostas tem 52 itens: diferenças de poucos pontos não são conclusivas.',
      'ROUGE-L e F1 favorecem respostas extrativas e não medem a correção jurídica; uma amostra será avaliada por especialista em propriedade intelectual.',
    ],

    methodTitle: 'Como foi feito',
    method: [
      'Dados reais e verificáveis: 12.534 reclamações públicas da NHTSA; 490 perguntas e respostas extraídas da Lei 9.279/1996 e de manuais, diretrizes e estudos do INPI, com cada trecho conferido literalmente com a fonte; e 694 pedidos de patente reais.',
      'RAG e ajuste fino: o modelo recebe os três trechos oficiais mais relevantes, recuperados por BM25, e aprende a responder com base neles e a citar a fonte.',
      'LoRA em uma GPU de 6 GB; modelos acima de 3 bilhões de parâmetros em QLoRA de 4 bits. A taxa de aprendizado é escolhida na validação, e o número de épocas, por parada antecipada.',
      'Cada tarefa tem uma referência sem LLM, para medir se o modelo de linguagem compensa o custo.',
    ],
  },

  en: {
    eyebrow: 'Project 01 · In progress',
    title: 'Compact LLMs for the automotive industry',
    subtitle: 'Defect complaint triage and patent assistant',
    intro:
      'Language models with fewer than 7 billion parameters, fine-tuned with LoRA on a 6 GB GPU and applied to two real tasks: classifying vehicle defect complaints filed with NHTSA, the US road safety agency, and giving guidance on patents in Brazil grounded in official INPI documents.',
    honesty:
      'Nothing here is simulated: answers and predictions come from the experiments. The LLMs do not run on this site; the complaint classifier does, in your browser.',
    updated: 'Experiments in progress: models marked “queued” are still training. Data from {date}.',
    back: 'Back to projects',
    onThisPage: 'On this page',

    patentsTitle: 'Patent assistant',
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
    question: 'Question',
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

    triageTitle: 'Defect complaint triage',
    triageLede: 'Describe a defect in English, Portuguese or German. A TF-IDF classifier with logistic regression names the component involved. It runs in your browser (1.1 MB; nothing is sent) and is the baseline the LLMs in the study have to beat.',
    describe: 'Defect description',
    classify: 'Classify',
    examples: 'Examples',
    exampleTexts: [
      { label: 'Brakes', text: 'The brakes failed and the pedal went to the floor while I was driving downhill.' },
      { label: 'Air bag', text: 'The airbag warning light came on and the driver air bag did not deploy in the crash.' },
      { label: 'Electrical', text: 'The dashboard lights flicker, the radio shuts off and the battery drains overnight.' },
      { label: 'Structure', text: 'The frame is badly rusted and cracks appeared near the rear suspension.' },
      { label: 'Engine', text: 'The engine stalled on the highway at 60 mph and I lost power steering.' },
      { label: 'ABS', text: 'The ABS light came on and the car took much longer to stop in the rain.' },
    ],
    loadingModel: 'Loading the classifier (1.1 MB)…',
    loadError: 'The data could not be loaded. Check your connection and reload the page.',
    likely: 'Likely component',
    unknownWords: 'None of these words is known to the classifier; try describing the defect in other words.',
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
    resultsLede: 'Fixed test sets, split off before any tuning.',
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
    notes: [
      'The 1994–2013 complaints use NHTSA’s older component names; the drop in performance there measures the effect of temporal shift.',
      'The question-answering test has 52 items: differences of a few points are not conclusive.',
      'ROUGE-L and F1 favour extractive answers and do not measure legal correctness; an intellectual-property expert will review a sample.',
    ],

    methodTitle: 'How it was done',
    method: [
      'Real, verifiable data: 12,534 public NHTSA complaints; 490 question–answer pairs drawn from Brazil’s Industrial Property Law (Law 9,279/1996) and from INPI manuals, guidelines and studies, every passage checked word for word against its source; and 694 real patent applications.',
      'RAG and fine-tuning: the model receives the three most relevant official passages, retrieved with BM25, and learns to answer from them and cite the source.',
      'LoRA on a 6 GB GPU; models above 3 billion parameters use 4-bit QLoRA. The learning rate is chosen on the validation set, the number of epochs by early stopping.',
      'Every task has a no-LLM baseline, to measure whether the language model is worth its cost.',
    ],
  },

  de: {
    eyebrow: 'Projekt 01 · In Arbeit',
    title: 'Kompakte LLMs für die Automobilindustrie',
    subtitle: 'Triage von Mängelbeschwerden und Patentassistent',
    intro:
      'Sprachmodelle mit weniger als 7 Milliarden Parametern, mit LoRA auf einer 6-GB-GPU feinabgestimmt und auf zwei reale Aufgaben angewendet: Klassifikation von Fahrzeugmängel-Beschwerden bei der NHTSA, der US-Behörde für Straßenverkehrssicherheit, und Orientierung zu Patenten in Brasilien auf Grundlage offizieller Dokumente des brasilianischen Patentamts INPI.',
    honesty:
      'Nichts hier ist simuliert: Antworten und Vorhersagen stammen aus den Experimenten. Die LLMs laufen nicht auf dieser Website; der Beschwerde-Klassifikator dagegen läuft in Ihrem Browser.',
    updated: 'Experimente laufen: Modelle mit dem Vermerk „in Warteschlange“ werden noch trainiert. Stand: {date}.',
    back: 'Zurück zu den Projekten',
    onThisPage: 'Auf dieser Seite',

    patentsTitle: 'Patentassistent',
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
    question: 'Frage',
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

    triageTitle: 'Triage von Mängelbeschwerden',
    triageLede: 'Beschreiben Sie einen Mangel auf Deutsch, Englisch oder Portugiesisch. Ein TF-IDF-Klassifikator mit logistischer Regression nennt die betroffene Komponente. Er läuft in Ihrem Browser (1,1 MB; es wird nichts übertragen) und ist die Referenz, die die LLMs der Studie übertreffen müssen.',
    describe: 'Mängelbeschreibung',
    classify: 'Klassifizieren',
    examples: 'Beispiele',
    exampleTexts: [
      { label: 'Bremsen', text: 'Die Bremsen versagten und das Pedal ging bei einer Bergabfahrt bis zum Boden durch.' },
      { label: 'Airbag', text: 'Die Airbag-Warnleuchte ging an und der Fahrerairbag hat beim Unfall nicht ausgelöst.' },
      { label: 'Elektrik', text: 'Die Armaturenbrettbeleuchtung flackert, das Radio schaltet sich ab und die Batterie entlädt sich über Nacht.' },
      { label: 'Struktur', text: 'Der Rahmen ist stark verrostet und in der Nähe der Hinterachse sind Risse entstanden.' },
      { label: 'Motor', text: 'Der Motor ging auf der Autobahn bei 100 km/h aus und die Servolenkung fiel aus.' },
      { label: 'ABS', text: 'Die ABS-Leuchte ging an und das Auto brauchte bei Regen viel länger zum Anhalten.' },
    ],
    loadingModel: 'Klassifikator wird geladen (1,1 MB) …',
    loadError: 'Die Daten konnten nicht geladen werden. Prüfen Sie die Verbindung und laden Sie die Seite neu.',
    likely: 'Wahrscheinliche Komponente',
    unknownWords: 'Keines dieser Wörter ist dem Klassifikator bekannt; beschreiben Sie den Mangel mit anderen Worten.',
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
    resultsLede: 'Feste Testsets, vor jeder Abstimmung abgetrennt.',
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
    notes: [
      'Die Beschwerden von 1994–2013 verwenden die älteren Komponentenbezeichnungen der NHTSA; der Leistungsabfall dort misst den Effekt der zeitlichen Verschiebung.',
      'Der Frage-Antwort-Test umfasst 52 Fragen: Unterschiede von wenigen Punkten sind nicht aussagekräftig.',
      'ROUGE-L und F1 bevorzugen extraktive Antworten und messen keine juristische Korrektheit; eine Stichprobe wird von einer Fachperson für geistiges Eigentum geprüft.',
    ],

    methodTitle: 'Vorgehen',
    method: [
      'Echte, überprüfbare Daten: 12.534 öffentliche NHTSA-Beschwerden; 490 Frage-Antwort-Paare aus dem brasilianischen Gesetz über gewerbliches Eigentum (Gesetz 9.279/1996) sowie aus Handbüchern, Richtlinien und Studien des INPI, jede Textstelle wörtlich mit der Quelle abgeglichen; und 694 echte Patentanmeldungen.',
      'RAG und Fine-Tuning: Das Modell erhält die drei relevantesten offiziellen Textstellen, per BM25 abgerufen, und lernt, auf dieser Grundlage zu antworten und die Quelle zu zitieren.',
      'LoRA auf einer 6-GB-GPU; Modelle über 3 Milliarden Parameter mit 4-Bit-QLoRA. Die Lernrate wird auf dem Validierungsset gewählt, die Zahl der Epochen per Early Stopping.',
      'Jede Aufgabe hat eine Referenz ohne LLM, um zu messen, ob sich das Sprachmodell lohnt.',
    ],
  },
};
