import { Locale } from '../../../services/i18n.service';
import { Answer, MainCategory, QuestionKey, ValidationError } from './triage-flow';

/** Texts of the guided triage: short labels on screen, longer explanations only on request (ⓘ). */

export interface CategoryText {
  label: string;
  info: string; // what it includes and excludes, shown on request
  details: Array<{ key: string; short: string; fits: string; notFits: string }>;
  evidence: string[];
}

export interface TriageText {
  privacy: string;
  progress: string;
  back: string;
  next: string;
  skip: string;
  restart: string;
  info: string;
  categoryQuestion: string;
  detailQuestion: string;
  examples: string;
  hideExamples: string;
  fitsLabel: string;
  notFitsLabel: string;
  illustrative: string;
  questionsTitle: string;
  answers: Record<Answer, string>;
  questions: Record<QuestionKey, { short: string; text: string; why: string }>;
  describeLabel: string;
  describeHint: string;
  describePlaceholder: string;
  classify: string;
  classifying: string;
  noKnownWords: string;
  loadError: string;
  resultTitle: string;
  likely: string;
  yourChoice: string;
  agrees: string;
  differs: string;
  useSuggestion: string;
  answersTitle: string;
  editHint: string;
  evidenceTitle: string;
  nextTitle: string;
  nextSteps: Array<{ label: string; link?: string }>;
  urgent: string;
  urgentBadge: string;
  errors: Record<ValidationError, string>;
  categories: Record<MainCategory, CategoryText>;
}

const RECALL_BR = 'https://www.gov.br/pt-br/servicos/realizar-consulta-sobre-recall-de-veiculos';
const CONSUMIDOR = 'https://www.consumidor.gov.br/';
const NHTSA = 'https://www.nhtsa.gov/report-a-safety-problem';

const PT: TriageText = {
  privacy: 'Demonstração: nada é enviado nem guardado. Não informe placa, chassi ou dados pessoais.',
  progress: 'Etapa {n} de {total}',
  back: 'Voltar',
  next: 'Continuar',
  skip: 'Pular',
  restart: 'Recomeçar',
  info: 'Mais informações',
  categoryQuestion: 'Onde está o problema?',
  detailQuestion: 'O que aconteceu?',
  examples: 'Ver exemplos',
  hideExamples: 'Ocultar exemplos',
  fitsLabel: 'Se encaixa',
  notFitsLabel: 'Não se encaixa',
  illustrative: 'Exemplos ilustrativos, não são casos reais.',
  questionsTitle: 'Algumas perguntas rápidas',
  answers: { yes: 'Sim', no: 'Não', unsure: 'Não sei' },
  questions: {
    moving: { short: 'Em movimento?', text: 'O veículo estava em movimento quando o problema aconteceu?', why: 'Defeitos em movimento afetam a segurança de quem está no veículo e de outras pessoas.' },
    crash: { short: 'Houve colisão?', text: 'Houve colisão?', why: 'A colisão é registrada em cada reclamação da NHTSA e indica a gravidade.' },
    fire: { short: 'Fumaça ou fogo?', text: 'Houve fumaça, cheiro de queimado ou fogo?', why: 'Sinais de incêndio exigem atenção imediata.' },
    injury: { short: 'Alguém se feriu?', text: 'Alguém se feriu?', why: 'Só perguntamos porque houve colisão ou incêndio.' },
    warningLight: { short: 'Luz de alerta?', text: 'Alguma luz de alerta acendeu no painel?', why: 'A luz mostra que o sistema detectou a falha.' },
    detached: { short: 'Peça solta ou quebrada?', text: 'Alguma peça se soltou, quebrou ou rompeu?', why: 'Peças soltas podem atingir outras pessoas na via.' },
  },
  describeLabel: 'Descreva o problema',
  describeHint: 'Quando aconteceu, o que você fazia, o que viu ou ouviu. Opcional.',
  describePlaceholder: 'Ex.: o pedal do freio afundou numa descida e o carro demorou a parar',
  classify: 'Analisar',
  classifying: 'Analisando…',
  noKnownWords: 'O classificador não reconheceu essas palavras. Tente descrever de outro jeito.',
  loadError: 'Não foi possível carregar o classificador. Verifique a conexão e tente de novo.',
  resultTitle: 'Resultado',
  likely: 'Sistema mais provável',
  yourChoice: 'Sua escolha',
  agrees: 'O texto confirma sua escolha.',
  differs: 'O texto aponta outro sistema.',
  useSuggestion: 'Usar a sugestão',
  answersTitle: 'Suas respostas',
  editHint: 'Toque em uma resposta para alterar.',
  evidenceTitle: 'Guarde, se tiver',
  nextTitle: 'Próximos passos',
  nextSteps: [
    { label: 'Consultar recall (gov.br)', link: RECALL_BR },
    { label: 'Reclamar no consumidor.gov.br', link: CONSUMIDOR },
    { label: 'NHTSA (veículos nos EUA)', link: NHTSA },
  ],
  urgent: 'Risco imediato? Não use o veículo. SAMU 192 · Bombeiros 193.',
  urgentBadge: 'Atenção à segurança',
  errors: {
    chooseCategory: 'Escolha uma opção.',
    chooseDetail: 'Escolha uma opção.',
    answerAll: 'Responda a todas as perguntas (vale “Não sei”).',
    describeUnknown: 'Escreva pelo menos uma frase.',
  },
  categories: {
    brakes: {
      label: 'Freios', info: 'Pedal, freio de serviço, ABS e luzes do freio. Pneus e suspensão ficam em “Outro”.',
      details: [
        { key: 'pedal', short: 'Pedal fraco ou não freou', fits: 'O pedal foi até o fundo e o carro demorou a parar.', notFits: 'O pneu estourou ao frear (Outro).' },
        { key: 'abs', short: 'Luz do ABS ou do freio', fits: 'A luz do ABS acende ao ligar o carro.', notFits: 'A luz do airbag acendeu (Airbags).' },
        { key: 'noise', short: 'Ruído ou puxa ao frear', fits: 'Rangido metálico sempre que freio devagar.', notFits: 'O volante vibra o tempo todo (Outro).' },
      ],
      evidence: ['Ordens de serviço do freio', 'Data e quilometragem', 'Foto das luzes do painel'],
    },
    airbags: {
      label: 'Airbags', info: 'Airbags, sensores de colisão e a luz do airbag. Cintos e bancos ficam em “Outro”.',
      details: [
        { key: 'notDeployed', short: 'Não abriu na colisão', fits: 'Numa batida frontal, nenhum airbag abriu.', notFits: 'Abriu na batida, como esperado (não é defeito).' },
        { key: 'unexpected', short: 'Abriu sem colisão', fits: 'O airbag lateral abriu num buraco.', notFits: 'O carro desligou sozinho (Elétrico).' },
        { key: 'light', short: 'Luz do airbag acesa', fits: 'A luz ficou acesa depois da revisão.', notFits: 'A luz do ABS acendeu (Freios).' },
      ],
      evidence: ['Foto do painel ou do airbag', 'Boletim de ocorrência', 'Ordens de serviço'],
    },
    electrical: {
      label: 'Elétrico', info: 'Bateria, alternador, fiação, fusíveis, painel e luzes. Luzes de freio e airbag ficam nas suas categorias.',
      details: [
        { key: 'power', short: 'Painel ou motor desligou', fits: 'Em movimento, o painel apagou e o motor desligou.', notFits: 'Faltou combustível (Outro).' },
        { key: 'battery', short: 'Bateria ou partida', fits: 'Bateria nova descarrega numa noite.', notFits: 'A chave não gira (Outro).' },
        { key: 'wiring', short: 'Fiação ou cheiro de queimado', fits: 'Cheiro de plástico queimado sob o painel.', notFits: 'Fumaça no escapamento (Outro).' },
      ],
      evidence: ['Vídeo ou foto do defeito', 'Diagnóstico da oficina', 'Datas em que se repetiu'],
    },
    structure: {
      label: 'Estrutura', info: 'Chassi, carroceria, portas, capô, tampa e fixações. Vidros e limpadores ficam em “Outro”.',
      details: [
        { key: 'corrosion', short: 'Ferrugem estrutural', fits: 'A longarina tem furos de ferrugem.', notFits: 'Pintura riscada, sem corrosão.' },
        { key: 'body', short: 'Porta ou capô abre/solta', fits: 'O capô abriu em movimento.', notFits: 'A trava elétrica falha (Elétrico).' },
        { key: 'mounting', short: 'Banco ou suporte solto', fits: 'O trilho do banco se soltou do assoalho.', notFits: 'O cinto não trava (Outro).' },
      ],
      evidence: ['Fotos com escala (moeda, régua)', 'Laudo de vistoria', 'Histórico de reparos'],
    },
    other: {
      label: 'Outro', info: 'Motor, combustível, direção, suspensão, pneus, câmbio, visibilidade e assistentes de condução.',
      details: [
        { key: 'engine', short: 'Motor ou câmbio', fits: 'O motor perde força e a luz de injeção acende.', notFits: 'Painel apagou junto (Elétrico).' },
        { key: 'steering', short: 'Direção, suspensão, pneus', fits: 'A direção ficou pesada de repente.', notFits: 'Puxa só ao frear (Freios).' },
        { key: 'assist', short: 'Assistentes ou visibilidade', fits: 'A frenagem automática atuou sem obstáculo.', notFits: 'O pedal afundou (Freios).' },
      ],
      evidence: ['Data, quilometragem e condições', 'Ordens de serviço', 'Fotos ou vídeos'],
    },
    unknown: {
      label: 'Não sei', info: 'Descreva o problema e o classificador sugere o sistema.',
      details: [], evidence: ['O que aconteceu, na ordem', 'Fotos ou vídeos', 'Ordens de serviço'],
    },
  },
};

const EN: TriageText = {
  privacy: 'Demo: nothing is sent or stored. Do not enter a licence plate, VIN or personal data.',
  progress: 'Step {n} of {total}',
  back: 'Back',
  next: 'Continue',
  skip: 'Skip',
  restart: 'Start again',
  info: 'More information',
  categoryQuestion: 'Where is the problem?',
  detailQuestion: 'What happened?',
  examples: 'Show examples',
  hideExamples: 'Hide examples',
  fitsLabel: 'Fits',
  notFitsLabel: 'Does not fit',
  illustrative: 'Illustrative examples, not real cases.',
  questionsTitle: 'A few quick questions',
  answers: { yes: 'Yes', no: 'No', unsure: 'Not sure' },
  questions: {
    moving: { short: 'Was it moving?', text: 'Was the vehicle moving when the problem happened?', why: 'Defects while driving affect the safety of the occupants and of others.' },
    crash: { short: 'A crash?', text: 'Was there a crash?', why: 'NHTSA records crashes in every complaint; they indicate severity.' },
    fire: { short: 'Smoke or fire?', text: 'Was there smoke, a burning smell or fire?', why: 'Signs of fire need immediate attention.' },
    injury: { short: 'Anyone injured?', text: 'Was anyone injured?', why: 'Asked only because there was a crash or a fire.' },
    warningLight: { short: 'Warning light?', text: 'Did a warning light come on in the dashboard?', why: 'A warning light means the system detected the fault.' },
    detached: { short: 'Part loose or broken?', text: 'Did a part come loose, crack or break?', why: 'Loose parts can hit other road users.' },
  },
  describeLabel: 'Describe the problem',
  describeHint: 'When it happened, what you were doing, what you saw or heard. Optional.',
  describePlaceholder: 'E.g. the brake pedal sank going downhill and the car was slow to stop',
  classify: 'Analyse',
  classifying: 'Analysing…',
  noKnownWords: 'The classifier did not recognise these words. Try describing it differently.',
  loadError: 'The classifier could not be loaded. Check your connection and try again.',
  resultTitle: 'Result',
  likely: 'Most likely system',
  yourChoice: 'Your choice',
  agrees: 'The text confirms your choice.',
  differs: 'The text points to another system.',
  useSuggestion: 'Use the suggestion',
  answersTitle: 'Your answers',
  editHint: 'Tap an answer to change it.',
  evidenceTitle: 'Keep, if you have it',
  nextTitle: 'Next steps',
  nextSteps: [
    { label: 'Check for recalls (Brazil, gov.br)', link: RECALL_BR },
    { label: 'Complain at consumidor.gov.br (Brazil)', link: CONSUMIDOR },
    { label: 'NHTSA (vehicles in the US)', link: NHTSA },
  ],
  urgent: 'Immediate risk? Do not use the vehicle. Emergency in Brazil: SAMU 192 · fire brigade 193.',
  urgentBadge: 'Safety alert',
  errors: {
    chooseCategory: 'Choose an option.',
    chooseDetail: 'Choose an option.',
    answerAll: 'Answer every question (“Not sure” is fine).',
    describeUnknown: 'Write at least one sentence.',
  },
  categories: {
    brakes: {
      label: 'Brakes', info: 'Pedal, service brakes, ABS and brake lights. Tyres and suspension go under “Other”.',
      details: [
        { key: 'pedal', short: 'Soft pedal or did not stop', fits: 'The pedal went to the floor and the car was slow to stop.', notFits: 'A tyre burst while braking (Other).' },
        { key: 'abs', short: 'ABS or brake light', fits: 'The ABS light comes on at start-up.', notFits: 'The airbag light came on (Airbags).' },
        { key: 'noise', short: 'Noise or pulling when braking', fits: 'A metallic squeal whenever I brake gently.', notFits: 'The wheel shakes all the time (Other).' },
      ],
      evidence: ['Brake work orders', 'Date and mileage', 'Photo of the dashboard lights'],
    },
    airbags: {
      label: 'Airbags', info: 'Airbags, crash sensors and the airbag light. Seat belts and seats go under “Other”.',
      details: [
        { key: 'notDeployed', short: 'Did not deploy in a crash', fits: 'In a frontal crash, no airbag deployed.', notFits: 'It deployed in a crash, as intended (not a defect).' },
        { key: 'unexpected', short: 'Deployed without a crash', fits: 'The side airbag deployed over a pothole.', notFits: 'The car switched off by itself (Electrical).' },
        { key: 'light', short: 'Airbag light stays on', fits: 'The light stayed on after a service.', notFits: 'The ABS light came on (Brakes).' },
      ],
      evidence: ['Photo of the dashboard or the airbag', 'Police report', 'Work orders'],
    },
    electrical: {
      label: 'Electrical', info: 'Battery, alternator, wiring, fuses, dashboard and lights. Brake and airbag lights have their own categories.',
      details: [
        { key: 'power', short: 'Dashboard or engine cut out', fits: 'While driving, the dashboard went dark and the engine stopped.', notFits: 'It ran out of fuel (Other).' },
        { key: 'battery', short: 'Battery or starting', fits: 'A new battery drains overnight.', notFits: 'The key does not turn (Other).' },
        { key: 'wiring', short: 'Wiring or burning smell', fits: 'A smell of burning plastic under the dashboard.', notFits: 'Smoke from the exhaust (Other).' },
      ],
      evidence: ['Video or photo of the fault', 'Workshop diagnosis', 'Dates it came back'],
    },
    structure: {
      label: 'Structure', info: 'Chassis, body, doors, bonnet, tailgate and mountings. Windows and wipers go under “Other”.',
      details: [
        { key: 'corrosion', short: 'Structural rust', fits: 'The frame rail has rust holes.', notFits: 'Scratched paint, no corrosion.' },
        { key: 'body', short: 'Door or bonnet opens/loose', fits: 'The bonnet opened while driving.', notFits: 'The electric lock fails (Electrical).' },
        { key: 'mounting', short: 'Seat or bracket loose', fits: 'The seat rail came loose from the floor.', notFits: 'The seat belt does not lock (Other).' },
      ],
      evidence: ['Photos with scale (coin, ruler)', 'Inspection report', 'Repair history'],
    },
    other: {
      label: 'Other', info: 'Engine, fuel, steering, suspension, tyres, transmission, visibility and driver assistance.',
      details: [
        { key: 'engine', short: 'Engine or transmission', fits: 'The engine loses power and the check-engine light comes on.', notFits: 'The dashboard went dark too (Electrical).' },
        { key: 'steering', short: 'Steering, suspension, tyres', fits: 'The steering suddenly became heavy.', notFits: 'It pulls only when braking (Brakes).' },
        { key: 'assist', short: 'Driver assistance or visibility', fits: 'Emergency braking engaged with no obstacle.', notFits: 'The pedal sank (Brakes).' },
      ],
      evidence: ['Date, mileage and conditions', 'Work orders', 'Photos or videos'],
    },
    unknown: {
      label: 'Not sure', info: 'Describe the problem and the classifier suggests the system.',
      details: [], evidence: ['What happened, in order', 'Photos or videos', 'Work orders'],
    },
  },
};

const DE: TriageText = {
  privacy: 'Demo: Nichts wird gesendet oder gespeichert. Geben Sie kein Kennzeichen, keine Fahrgestellnummer und keine persönlichen Daten ein.',
  progress: 'Schritt {n} von {total}',
  back: 'Zurück',
  next: 'Weiter',
  skip: 'Überspringen',
  restart: 'Neu beginnen',
  info: 'Mehr Informationen',
  categoryQuestion: 'Wo liegt das Problem?',
  detailQuestion: 'Was ist passiert?',
  examples: 'Beispiele zeigen',
  hideExamples: 'Beispiele ausblenden',
  fitsLabel: 'Passt',
  notFitsLabel: 'Passt nicht',
  illustrative: 'Anschauliche Beispiele, keine echten Fälle.',
  questionsTitle: 'Ein paar kurze Fragen',
  answers: { yes: 'Ja', no: 'Nein', unsure: 'Weiß nicht' },
  questions: {
    moving: { short: 'In Bewegung?', text: 'War das Fahrzeug in Bewegung, als das Problem auftrat?', why: 'Mängel während der Fahrt gefährden Insassen und andere.' },
    crash: { short: 'Ein Unfall?', text: 'Gab es einen Unfall?', why: 'Die NHTSA erfasst Unfälle bei jeder Beschwerde; sie zeigen die Schwere.' },
    fire: { short: 'Rauch oder Feuer?', text: 'Gab es Rauch, Brandgeruch oder Feuer?', why: 'Anzeichen eines Brandes erfordern sofortige Aufmerksamkeit.' },
    injury: { short: 'Jemand verletzt?', text: 'Wurde jemand verletzt?', why: 'Wir fragen nur, weil es einen Unfall oder Brand gab.' },
    warningLight: { short: 'Warnleuchte?', text: 'Hat eine Warnleuchte aufgeleuchtet?', why: 'Eine Warnleuchte zeigt, dass das System den Fehler erkannt hat.' },
    detached: { short: 'Teil lose oder gebrochen?', text: 'Hat sich ein Teil gelöst, ist es gerissen oder gebrochen?', why: 'Lose Teile können andere Verkehrsteilnehmer treffen.' },
  },
  describeLabel: 'Beschreiben Sie das Problem',
  describeHint: 'Wann es passierte, was Sie taten, was Sie sahen oder hörten. Optional.',
  describePlaceholder: 'z. B. das Bremspedal sank bergab durch und das Auto hielt nur langsam an',
  classify: 'Analysieren',
  classifying: 'Wird analysiert…',
  noKnownWords: 'Der Klassifikator kennt diese Wörter nicht. Beschreiben Sie es anders.',
  loadError: 'Der Klassifikator konnte nicht geladen werden. Prüfen Sie die Verbindung und versuchen Sie es erneut.',
  resultTitle: 'Ergebnis',
  likely: 'Wahrscheinlichstes System',
  yourChoice: 'Ihre Wahl',
  agrees: 'Der Text bestätigt Ihre Wahl.',
  differs: 'Der Text deutet auf ein anderes System.',
  useSuggestion: 'Vorschlag übernehmen',
  answersTitle: 'Ihre Antworten',
  editHint: 'Tippen Sie auf eine Antwort, um sie zu ändern.',
  evidenceTitle: 'Aufbewahren, falls vorhanden',
  nextTitle: 'Nächste Schritte',
  nextSteps: [
    { label: 'Rückrufe prüfen (Brasilien, gov.br)', link: RECALL_BR },
    { label: 'Beschwerde bei consumidor.gov.br (Brasilien)', link: CONSUMIDOR },
    { label: 'NHTSA (Fahrzeuge in den USA)', link: NHTSA },
  ],
  urgent: 'Unmittelbare Gefahr? Fahrzeug nicht benutzen. Notruf in Brasilien: SAMU 192 · Feuerwehr 193.',
  urgentBadge: 'Sicherheitshinweis',
  errors: {
    chooseCategory: 'Wählen Sie eine Option.',
    chooseDetail: 'Wählen Sie eine Option.',
    answerAll: 'Beantworten Sie alle Fragen („Weiß nicht“ ist erlaubt).',
    describeUnknown: 'Schreiben Sie mindestens einen Satz.',
  },
  categories: {
    brakes: {
      label: 'Bremsen', info: 'Pedal, Betriebsbremse, ABS und Bremsleuchten. Reifen und Fahrwerk gehören zu „Sonstiges“.',
      details: [
        { key: 'pedal', short: 'Weiches Pedal, bremst nicht', fits: 'Das Pedal ging bis zum Boden, das Auto hielt nur langsam an.', notFits: 'Ein Reifen platzte beim Bremsen (Sonstiges).' },
        { key: 'abs', short: 'ABS- oder Bremsleuchte', fits: 'Die ABS-Leuchte geht beim Starten an.', notFits: 'Die Airbag-Leuchte ging an (Airbags).' },
        { key: 'noise', short: 'Geräusch oder Ziehen beim Bremsen', fits: 'Metallisches Quietschen bei sanftem Bremsen.', notFits: 'Das Lenkrad vibriert immer (Sonstiges).' },
      ],
      evidence: ['Werkstattaufträge zur Bremse', 'Datum und Kilometerstand', 'Foto der Kontrollleuchten'],
    },
    airbags: {
      label: 'Airbags', info: 'Airbags, Crashsensoren und die Airbag-Leuchte. Gurte und Sitze gehören zu „Sonstiges“.',
      details: [
        { key: 'notDeployed', short: 'Beim Unfall nicht ausgelöst', fits: 'Beim Frontalaufprall löste kein Airbag aus.', notFits: 'Beim Unfall wie vorgesehen ausgelöst (kein Mangel).' },
        { key: 'unexpected', short: 'Ohne Unfall ausgelöst', fits: 'Der Seitenairbag löste in einem Schlagloch aus.', notFits: 'Das Auto ging von selbst aus (Elektrik).' },
        { key: 'light', short: 'Airbag-Leuchte bleibt an', fits: 'Die Leuchte blieb nach der Inspektion an.', notFits: 'Die ABS-Leuchte ging an (Bremsen).' },
      ],
      evidence: ['Foto der Leuchte oder des Airbags', 'Polizeibericht', 'Werkstattaufträge'],
    },
    electrical: {
      label: 'Elektrik', info: 'Batterie, Lichtmaschine, Kabel, Sicherungen, Armaturenbrett und Licht. Brems- und Airbag-Leuchten haben eigene Kategorien.',
      details: [
        { key: 'power', short: 'Armaturen oder Motor aus', fits: 'Während der Fahrt ging alles aus und der Motor stoppte.', notFits: 'Kein Kraftstoff mehr (Sonstiges).' },
        { key: 'battery', short: 'Batterie oder Starten', fits: 'Eine neue Batterie entlädt sich über Nacht.', notFits: 'Der Schlüssel dreht sich nicht (Sonstiges).' },
        { key: 'wiring', short: 'Kabel oder Brandgeruch', fits: 'Geruch nach verbranntem Kunststoff unter dem Armaturenbrett.', notFits: 'Rauch aus dem Auspuff (Sonstiges).' },
      ],
      evidence: ['Video oder Foto des Fehlers', 'Werkstattdiagnose', 'Daten der Wiederholungen'],
    },
    structure: {
      label: 'Struktur', info: 'Rahmen, Karosserie, Türen, Motorhaube, Heckklappe und Befestigungen. Scheiben und Wischer gehören zu „Sonstiges“.',
      details: [
        { key: 'corrosion', short: 'Rost am Tragwerk', fits: 'Der Längsträger hat Rostlöcher.', notFits: 'Zerkratzter Lack ohne Korrosion.' },
        { key: 'body', short: 'Tür oder Haube öffnet sich', fits: 'Die Motorhaube öffnete sich während der Fahrt.', notFits: 'Die Zentralverriegelung versagt (Elektrik).' },
        { key: 'mounting', short: 'Sitz oder Halterung lose', fits: 'Die Sitzschiene löste sich vom Boden.', notFits: 'Der Gurt blockiert nicht (Sonstiges).' },
      ],
      evidence: ['Fotos mit Größenvergleich (Münze, Lineal)', 'Gutachten', 'Reparaturhistorie'],
    },
    other: {
      label: 'Sonstiges', info: 'Motor, Kraftstoff, Lenkung, Fahrwerk, Reifen, Getriebe, Sicht und Fahrerassistenz.',
      details: [
        { key: 'engine', short: 'Motor oder Getriebe', fits: 'Der Motor verliert Leistung, die Motorleuchte geht an.', notFits: 'Armaturen gingen mit aus (Elektrik).' },
        { key: 'steering', short: 'Lenkung, Fahrwerk, Reifen', fits: 'Die Lenkung wurde plötzlich schwergängig.', notFits: 'Zieht nur beim Bremsen (Bremsen).' },
        { key: 'assist', short: 'Assistenz oder Sicht', fits: 'Der Notbremsassistent griff ohne Hindernis ein.', notFits: 'Das Pedal sank ab (Bremsen).' },
      ],
      evidence: ['Datum, Kilometerstand und Bedingungen', 'Werkstattaufträge', 'Fotos oder Videos'],
    },
    unknown: {
      label: 'Weiß nicht', info: 'Beschreiben Sie das Problem, und der Klassifikator schlägt das System vor.',
      details: [], evidence: ['Was geschah, der Reihe nach', 'Fotos oder Videos', 'Werkstattaufträge'],
    },
  },
};

export const TRIAGE_I18N: Record<Locale, TriageText> = { pt: PT, en: EN, de: DE };
