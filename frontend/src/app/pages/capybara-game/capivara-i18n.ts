import { Locale } from '../../services/i18n.service';
import { FruitKind, GameOverCause } from './capivara-engine';

export interface CapivaraText {
  eyebrow: string;
  title: string;
  intro: string;
  canvasLabel: string;
  start: string;
  pause: string;
  resume: string;
  restart: string;
  score: string;
  best: string;
  level: string;
  pups: string;
  ready: string;
  paused: string;
  jaguarWarning: string;
  over: Record<Exclude<GameOverCause, null>, string>;
  fruitsTitle: string;
  fruits: Record<FruitKind, string>;
  controlsTitle: string;
  controls: string[];
  pad: { up: string; down: string; left: string; right: string; group: string };
  aboutTitle: string;
  about: string[];
  back: string;
  speed: string;
  speeds: { slow: string; normal: string; fast: string };
  obstacleWarning: string;
}

export const CAPIVARA_TEXT: Record<Locale, CapivaraText> = {
  pt: {
    eyebrow: 'Jogo · TypeScript e Canvas',
    title: 'Trilha da Capivara',
    intro: 'Guie a capivara pela beira do rio, coma frutas brasileiras e leve os filhotes em fila. Não há paredes: saia por um lado e volte pelo outro. A partir do nível 2 uma onça-pintada ronda o campo, e do nível 5 surgem pedras e troncos.',
    canvasLabel: 'Campo do jogo Trilha da Capivara',
    start: 'Começar',
    pause: 'Pausar',
    resume: 'Continuar',
    restart: 'Jogar de novo',
    score: 'Pontos',
    best: 'Recorde',
    level: 'Nível',
    pups: 'Filhotes',
    ready: 'Pressione Começar ou a barra de espaço.',
    paused: 'Jogo pausado.',
    jaguarWarning: 'Cuidado: a onça-pintada entrou no campo!',
    over: {
      rock: 'A capivara bateu numa pedra. Fim de jogo.',
      pups: 'A capivara tropeçou nos próprios filhotes. Fim de jogo.',
      jaguar: 'A onça-pintada alcançou a família. Fim de jogo.',
    },
    fruitsTitle: 'Frutas',
    fruits: { acai: 'Açaí: 10 pontos', caju: 'Caju: 20 pontos', jabuticaba: 'Jabuticaba: 30 pontos' },
    controlsTitle: 'Como jogar',
    controls: [
      'Setas ou W, A, S, D para mudar de direção.',
      'No celular, deslize o dedo sobre o campo ou use os botões.',
      'Espaço pausa e continua; Enter recomeça.',
      'A cada 5 frutas o nível sobe, os pontos valem mais e a capivara acelera um pouco.',
      'Escolha o ritmo (lento, normal, rápido) antes de começar; você pode apertar duas direções seguidas para curvas rápidas.',
    ],
    pad: { up: 'Para cima', down: 'Para baixo', left: 'Para a esquerda', right: 'Para a direita', group: 'Controles de direção' },
    aboutTitle: 'Como foi feito',
    about: [
      'Toda a regra do jogo fica em um módulo TypeScript sem dependência de tela, com gerador pseudoaleatório de semente fixa (mulberry32): a mesma semente reproduz a mesma partida, e os testes automatizados cobrem movimento, colisões, níveis e a perseguição da onça.',
      'O desenho é feito em Canvas 2D, nas cores da bandeira do Brasil. A onça anda a cada dois passos na direção da capivara, com um passo lateral aleatório em um a cada quatro, para que seja possível fugir dela.',
    ],
    back: 'Voltar aos projetos',
    speed: 'Ritmo',
    speeds: { slow: 'Lento', normal: 'Normal', fast: 'Rápido' },
    obstacleWarning: 'Nível 5: pedras e troncos no caminho!',
  },
  en: {
    eyebrow: 'Game · TypeScript and Canvas',
    title: 'Capybara Trail',
    intro: 'Lead the capybara along the riverbank, eat Brazilian fruits and keep the pups in line. There are no walls: leave on one side and come back on the other. From level 2 a jaguar prowls the field; from level 5 rocks and logs appear.',
    canvasLabel: 'Capybara Trail game field',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    restart: 'Play again',
    score: 'Score',
    best: 'Best',
    level: 'Level',
    pups: 'Pups',
    ready: 'Press Start or the space bar.',
    paused: 'Game paused.',
    jaguarWarning: 'Watch out: the jaguar has entered the field!',
    over: {
      rock: 'The capybara ran into a rock. Game over.',
      pups: 'The capybara tripped over its own pups. Game over.',
      jaguar: 'The jaguar reached the family. Game over.',
    },
    fruitsTitle: 'Fruits',
    fruits: { acai: 'Açaí: 10 points', caju: 'Cashew apple: 20 points', jabuticaba: 'Jabuticaba: 30 points' },
    controlsTitle: 'How to play',
    controls: [
      'Arrow keys or W, A, S, D to change direction.',
      'On a phone, swipe across the field or use the buttons.',
      'Space pauses and resumes; Enter starts over.',
      'Every 5 fruits the level goes up, fruits are worth more and the capybara speeds up a little.',
      'Pick the pace (slow, normal, fast) before starting; two quick presses make a tight turn.',
    ],
    pad: { up: 'Up', down: 'Down', left: 'Left', right: 'Right', group: 'Direction controls' },
    aboutTitle: 'How it was built',
    about: [
      'All the game rules live in a TypeScript module with no screen code, driven by a fixed-seed pseudo-random generator (mulberry32): the same seed replays the same game, and automated tests cover movement, collisions, levels and the jaguar chase.',
      'Drawing uses the 2D Canvas, in the colours of the Brazilian flag. The jaguar moves every other step towards the capybara, with a random side step one time in four, so it can be escaped.',
    ],
    back: 'Back to projects',
    speed: 'Pace',
    speeds: { slow: 'Slow', normal: 'Normal', fast: 'Fast' },
    obstacleWarning: 'Level 5: rocks and logs in the way!',
  },
  de: {
    eyebrow: 'Spiel · TypeScript und Canvas',
    title: 'Capybara-Pfad',
    intro: 'Führe das Capybara am Flussufer entlang, iss brasilianische Früchte und halte die Jungen in der Reihe. Es gibt keine Wände: Wer auf einer Seite hinausläuft, kommt auf der anderen wieder herein. Ab Level 2 streift ein Jaguar umher, ab Level 5 liegen Felsen und Baumstämme im Weg.',
    canvasLabel: 'Spielfeld Capybara-Pfad',
    start: 'Start',
    pause: 'Pause',
    resume: 'Weiter',
    restart: 'Nochmal spielen',
    score: 'Punkte',
    best: 'Rekord',
    level: 'Level',
    pups: 'Junge',
    ready: 'Drücke Start oder die Leertaste.',
    paused: 'Spiel pausiert.',
    jaguarWarning: 'Achtung: Der Jaguar ist auf dem Feld!',
    over: {
      rock: 'Das Capybara ist gegen einen Felsen gelaufen. Spiel vorbei.',
      pups: 'Das Capybara ist über die eigenen Jungen gestolpert. Spiel vorbei.',
      jaguar: 'Der Jaguar hat die Familie erreicht. Spiel vorbei.',
    },
    fruitsTitle: 'Früchte',
    fruits: { acai: 'Açaí: 10 Punkte', caju: 'Cashewapfel: 20 Punkte', jabuticaba: 'Jabuticaba: 30 Punkte' },
    controlsTitle: 'So wird gespielt',
    controls: [
      'Pfeiltasten oder W, A, S, D zum Richtungswechsel.',
      'Auf dem Handy über das Feld wischen oder die Tasten nutzen.',
      'Leertaste pausiert und setzt fort; Enter startet neu.',
      'Alle 5 Früchte steigt das Level, Früchte zählen mehr und das Capybara wird etwas schneller.',
      'Wähle vor dem Start das Tempo (langsam, normal, schnell); zwei schnelle Tastendrücke ergeben eine enge Kurve.',
    ],
    pad: { up: 'Nach oben', down: 'Nach unten', left: 'Nach links', right: 'Nach rechts', group: 'Richtungstasten' },
    aboutTitle: 'Wie es gebaut ist',
    about: [
      'Alle Spielregeln stecken in einem TypeScript-Modul ohne Bildschirmcode, mit einem Zufallsgenerator mit festem Seed (mulberry32): derselbe Seed spielt dieselbe Partie nach, und automatisierte Tests decken Bewegung, Kollisionen, Level und die Jagd des Jaguars ab.',
      'Gezeichnet wird mit Canvas 2D in den Farben der brasilianischen Flagge. Der Jaguar bewegt sich jeden zweiten Schritt auf das Capybara zu, in einem von vier Schritten zufällig zur Seite, damit man ihm entkommen kann.',
    ],
    back: 'Zurück zu den Projekten',
    speed: 'Tempo',
    speeds: { slow: 'Langsam', normal: 'Normal', fast: 'Schnell' },
    obstacleWarning: 'Level 5: Felsen und Baumstämme im Weg!',
  },
};
