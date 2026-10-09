import { Locale } from '../../../services/i18n.service';
import { Answer, MainCategory, QuestionKey, StepKey, ValidationError } from './triage-flow';

/** Texts of the guided triage. Examples are illustrative, written for this demo, not real complaints. */

export interface CategoryText {
  label: string;
  includes: string;
  excludes: string;
  details: Array<{ key: string; label: string; fits: string; notFits: string }>;
  evidence: string[];
}

export interface TriageText {
  title: string;
  lede: string;
  privacy: string;
  stepNames: Record<StepKey, string>;
  progress: string;
  back: string;
  next: string;
  restart: string;
  change: string;
  categoryQuestion: string;
  includesLabel: string;
  excludesLabel: string;
  illustrative: string;
  detailQuestion: string;
  fitsLabel: string;
  notFitsLabel: string;
  questionsIntro: string;
  answers: Record<Answer, string>;
  questions: Record<QuestionKey, { text: string; why: string }>;
  describeLabel: string;
  describeOptional: string;
  describeRequired: string;
  describeTips: string[];
  suggestion: string;
  suggestionAgrees: string;
  suggestionDiffers: string;
  useSuggestion: string;
  askSuggestion: string;
  reviewTitle: string;
  reviewCategory: string;
  reviewDetail: string;
  reviewDescription: string;
  none: string;
  modelClass: string;
  evidenceTitle: string;
  nextTitle: string;
  nextSteps: Array<{ text: string; link?: string; label?: string }>;
  urgent: string;
  errors: Record<ValidationError, string>;
  categories: Record<MainCategory, CategoryText>;
}

const RECALL_BR = 'https://www.gov.br/pt-br/servicos/realizar-consulta-sobre-recall-de-veiculos';
const CONSUMIDOR = 'https://www.consumidor.gov.br/';
const NHTSA = 'https://www.nhtsa.gov/report-a-safety-problem';

const PT: TriageText = {
  title: 'Triagem guiada',
  lede: 'Responda a poucas perguntas para organizar a descrição de um defeito de veículo. As categorias são as mesmas que o classificador usa.',
  privacy: 'Demonstração: nada é enviado a nenhum órgão nem guardado; tudo fica no seu navegador. Não informe placa, chassi ou dados pessoais aqui.',
  stepNames: { category: 'Categoria', detail: 'Situação', questions: 'Perguntas', describe: 'Descrição', review: 'Resumo' },
  progress: 'Etapa {n} de {total}: {name}',
  back: 'Voltar',
  next: 'Continuar',
  restart: 'Recomeçar',
  change: 'Alterar',
  categoryQuestion: 'Que parte do veículo apresentou o problema?',
  includesLabel: 'Inclui',
  excludesLabel: 'Não inclui',
  illustrative: 'Exemplos ilustrativos, não são casos reais.',
  detailQuestion: 'Qual situação descreve melhor o que aconteceu?',
  fitsLabel: 'Se encaixa',
  notFitsLabel: 'Não se encaixa',
  questionsIntro: 'Responda com o que você sabe; “não sei” também é uma resposta válida.',
  answers: { yes: 'Sim', no: 'Não', unsure: 'Não sei' },
  questions: {
    moving: { text: 'O veículo estava em movimento quando o problema aconteceu?', why: 'Defeitos em movimento podem afetar a segurança de quem está no veículo e de outras pessoas.' },
    crash: { text: 'Houve colisão?', why: 'A colisão é um dos campos que a NHTSA registra em cada reclamação e ajuda a avaliar a gravidade.' },
    fire: { text: 'Houve fumaça, cheiro de queimado ou fogo?', why: 'Sinais de incêndio exigem atenção imediata e mudam a prioridade da análise.' },
    injury: { text: 'Alguém se feriu?', why: 'Perguntamos só porque houve colisão ou incêndio; a informação indica a gravidade do caso.' },
    warningLight: { text: 'Alguma luz de alerta acendeu no painel?', why: 'A luz indica que o sistema detectou uma falha e ajuda a localizar o componente.' },
    detached: { text: 'Alguma peça se soltou, quebrou ou rompeu?', why: 'Peças estruturais soltas podem causar risco a outras pessoas na via.' },
  },
  describeLabel: 'Descreva o que aconteceu, com suas palavras',
  describeOptional: 'Opcional. O classificador lê o texto e sugere uma categoria.',
  describeRequired: 'Como você não sabe a categoria, descreva o problema (pelo menos uma frase): o classificador vai sugerir uma.',
  describeTips: ['quando e onde aconteceu (sem endereço);', 'velocidade aproximada e o que você fazia (frear, virar, ligar o carro);', 'o que viu, ouviu ou sentiu;', 'se o problema se repetiu e se o veículo foi à oficina.'],
  suggestion: 'Sugestão do classificador: {label} ({p}).',
  suggestionAgrees: 'A sugestão confirma a categoria escolhida.',
  suggestionDiffers: 'A sugestão é diferente da categoria escolhida. Você pode mantê-la ou trocar.',
  useSuggestion: 'Usar a sugestão',
  askSuggestion: 'Ver a sugestão do classificador',
  reviewTitle: 'Confira antes de concluir',
  reviewCategory: 'Categoria',
  reviewDetail: 'Situação',
  reviewDescription: 'Descrição',
  none: 'sem descrição',
  modelClass: 'Classe usada pelo modelo',
  evidenceTitle: 'O que pode ajudar a comprovar',
  nextTitle: 'Próximos passos',
  nextSteps: [
    { text: 'Verifique se há recall para o veículo:', link: RECALL_BR, label: 'Consulta de recall de veículos (gov.br)' },
    { text: 'Procure a concessionária ou o fabricante e guarde os protocolos de atendimento.' },
    { text: 'Sem solução, registre a reclamação em um canal oficial de defesa do consumidor:', link: CONSUMIDOR, label: 'consumidor.gov.br' },
    { text: 'Para veículos nos Estados Unidos, a agência de segurança viária recebe relatos de defeitos:', link: NHTSA, label: 'NHTSA: Report a Safety Problem' },
  ],
  urgent: 'Se houver risco imediato, não use o veículo. Em emergências no Brasil: SAMU 192 e Corpo de Bombeiros 193.',
  errors: {
    chooseCategory: 'Escolha uma categoria, ou “Não sei”, para continuar.',
    chooseDetail: 'Escolha a situação mais parecida para continuar.',
    answerAll: 'Responda a todas as perguntas; se não tiver certeza, marque “Não sei”.',
    describeUnknown: 'Escreva pelo menos uma frase (15 caracteres) para receber uma sugestão de categoria.',
  },
  categories: {
    brakes: {
      label: 'Freios', includes: 'pedal, freio de serviço, ABS e luzes de alerta do freio.', excludes: 'pneus e suspensão (use “Outro sistema”).',
      details: [
        { key: 'pedal', label: 'O pedal ficou mais baixo ou macio, ou o carro não freou como esperado', fits: 'Ao frear num semáforo, o pedal foi até o fundo e o carro demorou a parar.', notFits: 'O pneu estourou ao frear (use “Outro sistema”).' },
        { key: 'abs', label: 'A luz do ABS ou do freio acendeu, ou o ABS atuou sem motivo', fits: 'A luz do ABS acende ao ligar o carro e o pedal pulsa em piso seco.', notFits: 'A luz do airbag acendeu (use “Airbags”).' },
        { key: 'noise', label: 'Ruído, vibração ou o carro puxa para um lado ao frear', fits: 'Um rangido metálico aparece sempre que freio em baixa velocidade.', notFits: 'O volante vibra em qualquer situação, sem frear (use “Outro sistema”).' },
      ],
      evidence: ['ordens de serviço e notas de manutenção do freio;', 'data e quilometragem de cada ocorrência;', 'fotos ou vídeo das luzes do painel.'],
    },
    airbags: {
      label: 'Airbags', includes: 'airbags, sensores de colisão e a luz de alerta do airbag.', excludes: 'cintos de segurança e bancos (use “Outro sistema”).',
      details: [
        { key: 'notDeployed', label: 'O airbag não abriu em uma colisão', fits: 'Numa batida frontal, nenhum airbag abriu.', notFits: 'O airbag abriu numa batida (se funcionou como esperado, não é defeito).' },
        { key: 'unexpected', label: 'O airbag abriu sem colisão', fits: 'O airbag lateral abriu ao passar por um buraco.', notFits: 'O carro desligou sozinho (use “Sistema elétrico”).' },
        { key: 'light', label: 'A luz do airbag fica acesa', fits: 'A luz do airbag ficou acesa depois de uma revisão.', notFits: 'A luz do ABS acendeu (use “Freios”).' },
      ],
      evidence: ['fotos do painel com a luz acesa ou do airbag acionado;', 'boletim de ocorrência e laudo, se houve colisão;', 'ordens de serviço relacionadas.'],
    },
    electrical: {
      label: 'Sistema elétrico', includes: 'bateria, alternador, fiação, fusíveis, painel e iluminação.', excludes: 'luz de alerta de freio ou airbag (use essas categorias).',
      details: [
        { key: 'power', label: 'Painel, luzes ou motor desligaram sozinhos', fits: 'Com o carro em movimento, o painel apagou e o motor desligou.', notFits: 'O motor falha por falta de combustível (use “Outro sistema”).' },
        { key: 'battery', label: 'Bateria descarrega ou o carro não dá partida', fits: 'A bateria nova descarrega em uma noite com tudo desligado.', notFits: 'A chave não gira no contato (use “Outro sistema”).' },
        { key: 'wiring', label: 'Fiação, fusível, curto ou cheiro de queimado', fits: 'Senti cheiro de plástico queimado vindo de baixo do painel.', notFits: 'Fumaça saindo do escapamento (use “Outro sistema”).' },
      ],
      evidence: ['vídeo ou foto do defeito e das luzes do painel;', 'ordens de serviço com diagnóstico;', 'datas em que o problema se repetiu.'],
    },
    structure: {
      label: 'Estrutura e carroceria', includes: 'chassi, carroceria, portas, capô, tampa traseira e fixações.', excludes: 'vidros e limpadores (use “Outro sistema”).',
      details: [
        { key: 'corrosion', label: 'Ferrugem ou corrosão em partes estruturais', fits: 'A longarina sob o carro tem furos de ferrugem.', notFits: 'Pintura riscada ou desbotada, sem corrosão estrutural.' },
        { key: 'body', label: 'Porta, capô, tampa ou teto abre ou se solta', fits: 'O capô abriu sozinho em movimento.', notFits: 'A trava elétrica das portas não funciona (use “Sistema elétrico”).' },
        { key: 'mounting', label: 'Fixações e suportes: bancos, para-choques, suportes', fits: 'O trilho do banco do motorista se soltou do assoalho.', notFits: 'O cinto de segurança não trava (use “Outro sistema”).' },
      ],
      evidence: ['fotos com algo que dê a escala (uma moeda, uma régua);', 'laudo de vistoria, se houver;', 'histórico de manutenção e de reparos de funilaria.'],
    },
    other: {
      label: 'Outro sistema', includes: 'motor, combustível, direção, suspensão, pneus, câmbio, visibilidade, assistentes de condução e demais sistemas.', excludes: 'freios, airbags, sistema elétrico e estrutura.',
      details: [
        { key: 'engine', label: 'Motor, combustível ou câmbio', fits: 'O motor perde força em subidas e a luz de injeção acende.', notFits: 'O painel apagou junto com o motor (use “Sistema elétrico”).' },
        { key: 'steering', label: 'Direção, suspensão ou pneus', fits: 'A direção ficou pesada de repente numa curva.', notFits: 'O carro puxa para um lado só ao frear (use “Freios”).' },
        { key: 'assist', label: 'Visibilidade, assistentes de condução ou outro', fits: 'A frenagem automática atuou sem obstáculo à frente.', notFits: 'O pedal do freio afundou (use “Freios”).' },
      ],
      evidence: ['data, quilometragem e condições (chuva, estrada, velocidade);', 'ordens de serviço;', 'fotos ou vídeos do defeito.'],
    },
    unknown: {
      label: 'Não sei', includes: 'quando não está claro qual parte falhou: descreva o problema e o classificador sugere a categoria.', excludes: '',
      details: [], evidence: ['data, quilometragem e o que aconteceu, na ordem;', 'fotos ou vídeos;', 'ordens de serviço.'],
    },
  },
};

const EN: TriageText = {
  title: 'Guided triage',
  lede: 'Answer a few questions to organise the description of a vehicle defect. The categories are the ones the classifier uses.',
  privacy: 'Demo: nothing is sent to any agency or stored; everything stays in your browser. Do not enter a licence plate, VIN or personal data here.',
  stepNames: { category: 'Category', detail: 'Situation', questions: 'Questions', describe: 'Description', review: 'Summary' },
  progress: 'Step {n} of {total}: {name}',
  back: 'Back',
  next: 'Continue',
  restart: 'Start again',
  change: 'Change',
  categoryQuestion: 'Which part of the vehicle had the problem?',
  includesLabel: 'Includes',
  excludesLabel: 'Does not include',
  illustrative: 'Illustrative examples, not real cases.',
  detailQuestion: 'Which situation best describes what happened?',
  fitsLabel: 'Fits',
  notFitsLabel: 'Does not fit',
  questionsIntro: 'Answer with what you know; “Not sure” is also a valid answer.',
  answers: { yes: 'Yes', no: 'No', unsure: 'Not sure' },
  questions: {
    moving: { text: 'Was the vehicle moving when the problem happened?', why: 'Defects while driving can affect the safety of the people in the vehicle and of others.' },
    crash: { text: 'Was there a crash?', why: 'A crash is one of the fields NHTSA records for every complaint and helps to assess severity.' },
    fire: { text: 'Was there smoke, a burning smell or fire?', why: 'Signs of fire need immediate attention and change the priority of the analysis.' },
    injury: { text: 'Was anyone injured?', why: 'We ask only because there was a crash or a fire; the answer indicates how serious the case is.' },
    warningLight: { text: 'Did a warning light come on in the dashboard?', why: 'A warning light means the system detected a fault and helps to locate the component.' },
    detached: { text: 'Did a part come loose, crack or break?', why: 'Loose structural parts can endanger other road users.' },
  },
  describeLabel: 'Describe what happened in your own words',
  describeOptional: 'Optional. The classifier reads the text and suggests a category.',
  describeRequired: 'As you do not know the category, describe the problem (at least one sentence): the classifier will suggest one.',
  describeTips: ['when and where it happened (no address);', 'approximate speed and what you were doing (braking, turning, starting the car);', 'what you saw, heard or felt;', 'whether it happened again and whether the vehicle went to a workshop.'],
  suggestion: 'Classifier suggestion: {label} ({p}).',
  suggestionAgrees: 'The suggestion confirms the category you chose.',
  suggestionDiffers: 'The suggestion differs from the category you chose. You can keep yours or switch.',
  useSuggestion: 'Use the suggestion',
  askSuggestion: 'See the classifier’s suggestion',
  reviewTitle: 'Check before finishing',
  reviewCategory: 'Category',
  reviewDetail: 'Situation',
  reviewDescription: 'Description',
  none: 'no description',
  modelClass: 'Class used by the model',
  evidenceTitle: 'What can help as evidence',
  nextTitle: 'Next steps',
  nextSteps: [
    { text: 'Check whether there is a recall for the vehicle (Brazil):', link: RECALL_BR, label: 'Vehicle recall lookup (gov.br)' },
    { text: 'Contact the dealer or the manufacturer and keep the service case numbers.' },
    { text: 'If it is not solved, file a complaint through an official consumer-protection channel (Brazil):', link: CONSUMIDOR, label: 'consumidor.gov.br' },
    { text: 'For vehicles in the United States, the road-safety agency accepts defect reports:', link: NHTSA, label: 'NHTSA: Report a Safety Problem' },
  ],
  urgent: 'If there is an immediate risk, do not use the vehicle. Emergency numbers in Brazil: SAMU 192 and fire brigade 193.',
  errors: {
    chooseCategory: 'Choose a category, or “Not sure”, to continue.',
    chooseDetail: 'Choose the closest situation to continue.',
    answerAll: 'Answer every question; if you are not sure, choose “Not sure”.',
    describeUnknown: 'Write at least one sentence (15 characters) to get a category suggestion.',
  },
  categories: {
    brakes: {
      label: 'Brakes', includes: 'pedal, service brakes, ABS and brake warning lights.', excludes: 'tyres and suspension (use “Other system”).',
      details: [
        { key: 'pedal', label: 'The pedal went lower or softer, or the car did not brake as expected', fits: 'Braking at a traffic light, the pedal went to the floor and the car was slow to stop.', notFits: 'A tyre burst while braking (use “Other system”).' },
        { key: 'abs', label: 'The ABS or brake light came on, or the ABS acted for no reason', fits: 'The ABS light comes on at start-up and the pedal pulses on dry roads.', notFits: 'The airbag light came on (use “Airbags”).' },
        { key: 'noise', label: 'Noise, vibration or the car pulls to one side when braking', fits: 'A metallic squeal appears whenever I brake at low speed.', notFits: 'The steering wheel shakes all the time, not only when braking (use “Other system”).' },
      ],
      evidence: ['work orders and brake service invoices;', 'date and mileage of each occurrence;', 'photos or video of the dashboard lights.'],
    },
    airbags: {
      label: 'Airbags', includes: 'airbags, crash sensors and the airbag warning light.', excludes: 'seat belts and seats (use “Other system”).',
      details: [
        { key: 'notDeployed', label: 'The airbag did not deploy in a crash', fits: 'In a frontal collision, no airbag deployed.', notFits: 'The airbag deployed in a crash (if it worked as intended, it is not a defect).' },
        { key: 'unexpected', label: 'The airbag deployed without a crash', fits: 'The side airbag deployed when driving over a pothole.', notFits: 'The car switched off by itself (use “Electrical system”).' },
        { key: 'light', label: 'The airbag light stays on', fits: 'The airbag light stayed on after a service.', notFits: 'The ABS light came on (use “Brakes”).' },
      ],
      evidence: ['photos of the dashboard light or of the deployed airbag;', 'police report and assessment, if there was a crash;', 'related work orders.'],
    },
    electrical: {
      label: 'Electrical system', includes: 'battery, alternator, wiring, fuses, dashboard and lighting.', excludes: 'brake or airbag warning lights (use those categories).',
      details: [
        { key: 'power', label: 'Dashboard, lights or engine switched off by themselves', fits: 'While driving, the dashboard went dark and the engine stopped.', notFits: 'The engine stalls because it is out of fuel (use “Other system”).' },
        { key: 'battery', label: 'The battery drains or the car does not start', fits: 'A new battery drains overnight with everything switched off.', notFits: 'The key does not turn in the ignition (use “Other system”).' },
        { key: 'wiring', label: 'Wiring, fuse, short circuit or burning smell', fits: 'I smelled burning plastic from under the dashboard.', notFits: 'Smoke coming from the exhaust (use “Other system”).' },
      ],
      evidence: ['video or photo of the fault and the dashboard lights;', 'work orders with the diagnosis;', 'dates on which the problem came back.'],
    },
    structure: {
      label: 'Structure and body', includes: 'chassis, body, doors, bonnet, tailgate and mountings.', excludes: 'windows and wipers (use “Other system”).',
      details: [
        { key: 'corrosion', label: 'Rust or corrosion on structural parts', fits: 'The frame rail under the car has rust holes.', notFits: 'Scratched or faded paint without structural corrosion.' },
        { key: 'body', label: 'A door, the bonnet, the tailgate or the roof opens or comes loose', fits: 'The bonnet opened by itself while driving.', notFits: 'The electric door lock does not work (use “Electrical system”).' },
        { key: 'mounting', label: 'Mountings and brackets: seats, bumpers, supports', fits: 'The driver’s seat rail came loose from the floor.', notFits: 'The seat belt does not lock (use “Other system”).' },
      ],
      evidence: ['photos with something that shows the scale (a coin, a ruler);', 'an inspection report, if available;', 'service and body-repair history.'],
    },
    other: {
      label: 'Other system', includes: 'engine, fuel, steering, suspension, tyres, transmission, visibility, driver assistance and the remaining systems.', excludes: 'brakes, airbags, electrical system and structure.',
      details: [
        { key: 'engine', label: 'Engine, fuel or transmission', fits: 'The engine loses power uphill and the check-engine light comes on.', notFits: 'The dashboard went dark together with the engine (use “Electrical system”).' },
        { key: 'steering', label: 'Steering, suspension or tyres', fits: 'The steering suddenly became heavy in a bend.', notFits: 'The car pulls to one side only when braking (use “Brakes”).' },
        { key: 'assist', label: 'Visibility, driver assistance or other', fits: 'Automatic emergency braking engaged with no obstacle ahead.', notFits: 'The brake pedal sank (use “Brakes”).' },
      ],
      evidence: ['date, mileage and conditions (rain, road, speed);', 'work orders;', 'photos or videos of the fault.'],
    },
    unknown: {
      label: 'Not sure', includes: 'when it is unclear which part failed: describe the problem and the classifier suggests the category.', excludes: '',
      details: [], evidence: ['date, mileage and what happened, in order;', 'photos or videos;', 'work orders.'],
    },
  },
};

const DE: TriageText = {
  title: 'Geführte Einordnung',
  lede: 'Beantworten Sie einige Fragen, um die Beschreibung eines Fahrzeugmangels zu ordnen. Die Kategorien sind dieselben, die der Klassifikator verwendet.',
  privacy: 'Demo: Nichts wird an eine Behörde gesendet oder gespeichert; alles bleibt in Ihrem Browser. Geben Sie hier kein Kennzeichen, keine Fahrgestellnummer und keine persönlichen Daten ein.',
  stepNames: { category: 'Kategorie', detail: 'Situation', questions: 'Fragen', describe: 'Beschreibung', review: 'Zusammenfassung' },
  progress: 'Schritt {n} von {total}: {name}',
  back: 'Zurück',
  next: 'Weiter',
  restart: 'Neu beginnen',
  change: 'Ändern',
  categoryQuestion: 'An welchem Teil des Fahrzeugs trat das Problem auf?',
  includesLabel: 'Umfasst',
  excludesLabel: 'Umfasst nicht',
  illustrative: 'Anschauliche Beispiele, keine echten Fälle.',
  detailQuestion: 'Welche Situation beschreibt am besten, was passiert ist?',
  fitsLabel: 'Passt',
  notFitsLabel: 'Passt nicht',
  questionsIntro: 'Antworten Sie mit dem, was Sie wissen; „Weiß nicht“ ist auch eine gültige Antwort.',
  answers: { yes: 'Ja', no: 'Nein', unsure: 'Weiß nicht' },
  questions: {
    moving: { text: 'War das Fahrzeug in Bewegung, als das Problem auftrat?', why: 'Mängel während der Fahrt können die Sicherheit der Insassen und anderer gefährden.' },
    crash: { text: 'Gab es einen Unfall?', why: 'Ein Unfall ist eines der Felder, die die NHTSA bei jeder Beschwerde erfasst, und hilft, die Schwere einzuschätzen.' },
    fire: { text: 'Gab es Rauch, Brandgeruch oder Feuer?', why: 'Anzeichen eines Brandes erfordern sofortige Aufmerksamkeit und ändern die Priorität der Prüfung.' },
    injury: { text: 'Wurde jemand verletzt?', why: 'Wir fragen nur, weil es einen Unfall oder einen Brand gab; die Antwort zeigt, wie schwer der Fall ist.' },
    warningLight: { text: 'Hat eine Warnleuchte im Armaturenbrett aufgeleuchtet?', why: 'Eine Warnleuchte zeigt, dass das System einen Fehler erkannt hat, und hilft, das Bauteil einzugrenzen.' },
    detached: { text: 'Hat sich ein Teil gelöst, ist es gerissen oder gebrochen?', why: 'Lose tragende Teile können andere Verkehrsteilnehmer gefährden.' },
  },
  describeLabel: 'Beschreiben Sie mit eigenen Worten, was passiert ist',
  describeOptional: 'Optional. Der Klassifikator liest den Text und schlägt eine Kategorie vor.',
  describeRequired: 'Da Sie die Kategorie nicht kennen, beschreiben Sie das Problem (mindestens einen Satz): Der Klassifikator schlägt eine vor.',
  describeTips: ['wann und wo es passiert ist (ohne Adresse);', 'ungefähre Geschwindigkeit und was Sie gerade taten (bremsen, abbiegen, starten);', 'was Sie gesehen, gehört oder gespürt haben;', 'ob es erneut auftrat und ob das Fahrzeug in der Werkstatt war.'],
  suggestion: 'Vorschlag des Klassifikators: {label} ({p}).',
  suggestionAgrees: 'Der Vorschlag bestätigt die gewählte Kategorie.',
  suggestionDiffers: 'Der Vorschlag weicht von der gewählten Kategorie ab. Sie können Ihre behalten oder wechseln.',
  useSuggestion: 'Vorschlag übernehmen',
  askSuggestion: 'Vorschlag des Klassifikators anzeigen',
  reviewTitle: 'Vor dem Abschluss prüfen',
  reviewCategory: 'Kategorie',
  reviewDetail: 'Situation',
  reviewDescription: 'Beschreibung',
  none: 'keine Beschreibung',
  modelClass: 'Vom Modell verwendete Klasse',
  evidenceTitle: 'Was als Nachweis helfen kann',
  nextTitle: 'Nächste Schritte',
  nextSteps: [
    { text: 'Prüfen Sie, ob es einen Rückruf für das Fahrzeug gibt (Brasilien):', link: RECALL_BR, label: 'Rückrufabfrage für Fahrzeuge (gov.br)' },
    { text: 'Wenden Sie sich an den Händler oder Hersteller und bewahren Sie die Vorgangsnummern auf.' },
    { text: 'Ohne Lösung reichen Sie eine Beschwerde über einen amtlichen Verbraucherschutzkanal ein (Brasilien):', link: CONSUMIDOR, label: 'consumidor.gov.br' },
    { text: 'Für Fahrzeuge in den USA nimmt die Verkehrssicherheitsbehörde Mängelmeldungen entgegen:', link: NHTSA, label: 'NHTSA: Report a Safety Problem' },
  ],
  urgent: 'Bei unmittelbarer Gefahr benutzen Sie das Fahrzeug nicht. Notrufnummern in Brasilien: SAMU 192 und Feuerwehr 193.',
  errors: {
    chooseCategory: 'Wählen Sie eine Kategorie oder „Weiß nicht“, um fortzufahren.',
    chooseDetail: 'Wählen Sie die ähnlichste Situation, um fortzufahren.',
    answerAll: 'Beantworten Sie alle Fragen; wenn Sie unsicher sind, wählen Sie „Weiß nicht“.',
    describeUnknown: 'Schreiben Sie mindestens einen Satz (15 Zeichen), um einen Kategorievorschlag zu erhalten.',
  },
  categories: {
    brakes: {
      label: 'Bremsen', includes: 'Pedal, Betriebsbremse, ABS und Bremswarnleuchten.', excludes: 'Reifen und Fahrwerk (wählen Sie „Anderes System“).',
      details: [
        { key: 'pedal', label: 'Das Pedal sank tiefer oder wurde weicher, oder das Auto bremste nicht wie erwartet', fits: 'Beim Bremsen an einer Ampel ging das Pedal bis zum Boden, und das Auto hielt nur langsam an.', notFits: 'Ein Reifen platzte beim Bremsen (wählen Sie „Anderes System“).' },
        { key: 'abs', label: 'Die ABS- oder Bremsleuchte ging an, oder das ABS griff grundlos ein', fits: 'Die ABS-Leuchte geht beim Starten an, und das Pedal pulsiert auf trockener Straße.', notFits: 'Die Airbag-Leuchte ging an (wählen Sie „Airbags“).' },
        { key: 'noise', label: 'Geräusch, Vibration oder das Auto zieht beim Bremsen zur Seite', fits: 'Bei langsamer Fahrt quietscht es metallisch, sobald ich bremse.', notFits: 'Das Lenkrad vibriert immer, nicht nur beim Bremsen (wählen Sie „Anderes System“).' },
      ],
      evidence: ['Werkstattaufträge und Rechnungen zur Bremswartung;', 'Datum und Kilometerstand jedes Vorfalls;', 'Fotos oder Video der Kontrollleuchten.'],
    },
    airbags: {
      label: 'Airbags', includes: 'Airbags, Crashsensoren und die Airbag-Warnleuchte.', excludes: 'Sicherheitsgurte und Sitze (wählen Sie „Anderes System“).',
      details: [
        { key: 'notDeployed', label: 'Der Airbag löste bei einem Unfall nicht aus', fits: 'Bei einem Frontalaufprall löste kein Airbag aus.', notFits: 'Der Airbag löste bei einem Unfall aus (wenn er wie vorgesehen funktionierte, ist das kein Mangel).' },
        { key: 'unexpected', label: 'Der Airbag löste ohne Unfall aus', fits: 'Der Seitenairbag löste beim Überfahren eines Schlaglochs aus.', notFits: 'Das Auto schaltete sich von selbst ab (wählen Sie „Elektrik“).' },
        { key: 'light', label: 'Die Airbag-Leuchte bleibt an', fits: 'Die Airbag-Leuchte blieb nach einer Inspektion an.', notFits: 'Die ABS-Leuchte ging an (wählen Sie „Bremsen“).' },
      ],
      evidence: ['Fotos der Kontrollleuchte oder des ausgelösten Airbags;', 'Polizeibericht und Gutachten, falls es einen Unfall gab;', 'zugehörige Werkstattaufträge.'],
    },
    electrical: {
      label: 'Elektrik', includes: 'Batterie, Lichtmaschine, Verkabelung, Sicherungen, Armaturenbrett und Beleuchtung.', excludes: 'Brems- oder Airbag-Warnleuchten (wählen Sie diese Kategorien).',
      details: [
        { key: 'power', label: 'Armaturenbrett, Licht oder Motor schalteten sich von selbst ab', fits: 'Während der Fahrt ging das Armaturenbrett aus, und der Motor stoppte.', notFits: 'Der Motor geht aus, weil der Kraftstoff fehlt (wählen Sie „Anderes System“).' },
        { key: 'battery', label: 'Die Batterie entlädt sich oder das Auto springt nicht an', fits: 'Eine neue Batterie entlädt sich über Nacht, obwohl alles ausgeschaltet ist.', notFits: 'Der Schlüssel lässt sich im Zündschloss nicht drehen (wählen Sie „Anderes System“).' },
        { key: 'wiring', label: 'Verkabelung, Sicherung, Kurzschluss oder Brandgeruch', fits: 'Unter dem Armaturenbrett roch es nach verbranntem Kunststoff.', notFits: 'Rauch aus dem Auspuff (wählen Sie „Anderes System“).' },
      ],
      evidence: ['Video oder Foto des Fehlers und der Kontrollleuchten;', 'Werkstattaufträge mit Diagnose;', 'Daten, an denen das Problem erneut auftrat.'],
    },
    structure: {
      label: 'Struktur und Karosserie', includes: 'Rahmen, Karosserie, Türen, Motorhaube, Heckklappe und Befestigungen.', excludes: 'Scheiben und Scheibenwischer (wählen Sie „Anderes System“).',
      details: [
        { key: 'corrosion', label: 'Rost oder Korrosion an tragenden Teilen', fits: 'Der Längsträger unter dem Auto hat Rostlöcher.', notFits: 'Zerkratzter oder verblasster Lack ohne Korrosion am Tragwerk.' },
        { key: 'body', label: 'Tür, Motorhaube, Heckklappe oder Dach öffnet sich oder löst sich', fits: 'Die Motorhaube öffnete sich während der Fahrt von selbst.', notFits: 'Die elektrische Türverriegelung funktioniert nicht (wählen Sie „Elektrik“).' },
        { key: 'mounting', label: 'Befestigungen und Halterungen: Sitze, Stoßfänger, Träger', fits: 'Die Schiene des Fahrersitzes löste sich vom Boden.', notFits: 'Der Sicherheitsgurt blockiert nicht (wählen Sie „Anderes System“).' },
      ],
      evidence: ['Fotos mit einem Größenvergleich (Münze, Lineal);', 'ein Gutachten, falls vorhanden;', 'Wartungs- und Karosseriereparaturhistorie.'],
    },
    other: {
      label: 'Anderes System', includes: 'Motor, Kraftstoff, Lenkung, Fahrwerk, Reifen, Getriebe, Sicht, Fahrerassistenz und die übrigen Systeme.', excludes: 'Bremsen, Airbags, Elektrik und Struktur.',
      details: [
        { key: 'engine', label: 'Motor, Kraftstoff oder Getriebe', fits: 'Der Motor verliert bergauf Leistung, und die Motorkontrollleuchte geht an.', notFits: 'Das Armaturenbrett ging zusammen mit dem Motor aus (wählen Sie „Elektrik“).' },
        { key: 'steering', label: 'Lenkung, Fahrwerk oder Reifen', fits: 'Die Lenkung wurde in einer Kurve plötzlich schwergängig.', notFits: 'Das Auto zieht nur beim Bremsen zur Seite (wählen Sie „Bremsen“).' },
        { key: 'assist', label: 'Sicht, Fahrerassistenz oder Sonstiges', fits: 'Der Notbremsassistent griff ohne Hindernis ein.', notFits: 'Das Bremspedal sank ab (wählen Sie „Bremsen“).' },
      ],
      evidence: ['Datum, Kilometerstand und Bedingungen (Regen, Straße, Geschwindigkeit);', 'Werkstattaufträge;', 'Fotos oder Videos des Fehlers.'],
    },
    unknown: {
      label: 'Weiß nicht', includes: 'wenn unklar ist, welches Teil versagt hat: Beschreiben Sie das Problem, und der Klassifikator schlägt die Kategorie vor.', excludes: '',
      details: [], evidence: ['Datum, Kilometerstand und Ablauf des Geschehens;', 'Fotos oder Videos;', 'Werkstattaufträge.'],
    },
  },
};

export const TRIAGE_I18N: Record<Locale, TriageText> = { pt: PT, en: EN, de: DE };
