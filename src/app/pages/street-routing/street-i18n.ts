import { Locale } from '../../services/i18n.service';

export type AlgorithmKey = 'dijkstra' | 'astar' | 'bidirectional' | 'greedy' | 'ants' | 'genetic' | 'annealing';

export interface StreetTranslations {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  honesty: string;
  back: string;
  onThisPage: string;
  loadError: string;

  mapTitle: string;
  mapLede: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchHint: string;
  kinds: { state: string; municipality: string; bairro: string };
  noMatch: string;
  brazil: string;
  layers: string;
  showBairros: string;
  notRouted: string;
  loadingStreets: string;
  streetsLoaded: string;

  routeTitle: string;
  pickOrigin: string;
  pickDestination: string;
  ready: string;
  clear: string;
  algorithm: string;
  run: string;
  runAll: string;
  speed: string;
  running: string;
  algorithms: Record<AlgorithmKey, { name: string; family: string; how: string }>;
  params: Record<string, { label: string; hint: string }>;
  resultsCaption: string;
  colAlgorithm: string;
  colLength: string;
  colGap: string;
  colWork: string;
  colTime: string;
  noRoute: string;
  via: string;
  estimatedLink: string;

  methodTitle: string;
  methodSteps: Array<{ title: string; text: string }>;
  algorithmsTitle: string;
  algorithmsLede: string;
  limitsTitle: string;
  limits: string[];
  referencesTitle: string;
  sourcesNote: string;
}

const REFERENCES_NOTE = 'IBGE (2024). Base de Faces de Logradouros do Brasil, Censo Demográfico 2022; IBGE (2024). Bairros, Censo 2022; IBGE, API de malhas territoriais v3.';

export const STREET_I18N: Record<Locale, StreetTranslations> = {
  pt: {
    eyebrow: 'Projeto em andamento · Georreferenciamento',
    title: 'Ruas de uma cidade brasileira, de dados públicos ao melhor caminho',
    subtitle: 'Do mapa do Brasil à rua, com algoritmos de rota que você pode ver trabalhando',
    intro:
      'Navegue do Brasil ao estado, ao município e ao bairro com as malhas oficiais do IBGE. Em Londrina, as ruas foram reconstruídas a partir das faces de quadra do Censo 2022 e transformadas em um grafo: escolha origem e destino e compare algoritmos exatos, heurísticos e evolutivos, passo a passo.',
    honesty:
      'Tudo roda no seu navegador, sem servidor. As distâncias são em metros pelo eixo das ruas; os dados do IBGE não trazem sentido de circulação nem velocidade, então a rota é a mais curta, não a mais rápida.',
    back: 'Todos os projetos',
    onThisPage: 'Nesta página',
    loadError: 'Não foi possível carregar os dados do mapa. Recarregue a página.',

    mapTitle: 'Mapa',
    mapLede: 'Busque um estado, um município ou, em Londrina, um bairro; ou clique no mapa para aproximar.',
    searchLabel: 'Buscar lugar',
    searchPlaceholder: 'Ex.: Paraná, Londrina, Gleba Palhano',
    searchHint: 'Setas para escolher, Enter para ir.',
    kinds: { state: 'Estado', municipality: 'Município', bairro: 'Bairro' },
    noMatch: 'Nenhum lugar encontrado.',
    brazil: 'Brasil',
    layers: 'Camadas',
    showBairros: 'Bairros',
    notRouted: 'O grafo de ruas está disponível para Londrina (PR) nesta versão; os demais municípios mostram só os limites.',
    loadingStreets: 'Carregando as ruas de Londrina…',
    streetsLoaded: '{nodes} cruzamentos e {km} km de ruas carregados.',

    routeTitle: 'Rota',
    pickOrigin: 'Clique no mapa para marcar a origem.',
    pickDestination: 'Agora clique para marcar o destino.',
    ready: 'Origem e destino marcados. Escolha um algoritmo e rode.',
    clear: 'Limpar',
    algorithm: 'Algoritmo',
    run: 'Rodar',
    runAll: 'Comparar todos',
    speed: 'Velocidade da animação',
    running: 'Calculando…',
    algorithms: {
      dijkstra: { name: 'Dijkstra', family: 'Exato', how: 'Expande os cruzamentos em ordem de distância à origem; garante o caminho mais curto.' },
      astar: { name: 'A*', family: 'Exato com heurística', how: 'Como Dijkstra, mas prioriza o que parece mais perto do destino em linha reta; com peso 1 continua exato e expande menos.' },
      bidirectional: { name: 'Dijkstra bidirecional', family: 'Exato', how: 'Busca a partir da origem e do destino ao mesmo tempo e para quando as frentes se encontram.' },
      greedy: { name: 'Busca gulosa', family: 'Heurístico', how: 'Vai sempre para o vizinho mais próximo do destino em linha reta: rápido, mas pode dar voltas.' },
      ants: { name: 'Colônia de formigas', family: 'Bioinspirado', how: 'Formigas virtuais andam ao acaso sem repetir esquinas (voltam em becos sem saída), preferindo ruas com mais feromônio; caminhos curtos recebem mais feromônio e atraem as próximas.' },
      genetic: { name: 'Algoritmo genético', family: 'Evolutivo', how: 'Uma população de rotas evolui por seleção, cruzamento em cruzamentos comuns e mutação de trechos.' },
      annealing: { name: 'Recozimento simulado', family: 'Metaheurística', how: 'Modifica um trecho da rota e às vezes aceita piorar, com probabilidade que cai com a “temperatura”, para escapar de mínimos locais.' },
    },
    params: {
      weight: { label: 'Peso da heurística', hint: '1 = exato; maior = mais rápido e rota possivelmente mais longa.' },
      ants: { label: 'Formigas', hint: 'Mais formigas exploram mais, custam mais tempo.' },
      iterations: { label: 'Iterações', hint: 'Mais iterações refinam a rota.' },
      alpha: { label: 'α (feromônio)', hint: 'Quanto a experiência coletiva pesa.' },
      beta: { label: 'β (direção)', hint: 'Quanto a direção do destino pesa.' },
      evaporation: { label: 'Evaporação', hint: 'Maior esquece trilhas antigas mais depressa.' },
      population: { label: 'População', hint: 'Mais rotas por geração.' },
      generations: { label: 'Gerações', hint: 'Mais gerações refinam a rota.' },
      mutationRate: { label: 'Taxa de mutação', hint: 'Mais mutação, mais diversidade.' },
      temperature: { label: 'Temperatura inicial (m)', hint: 'Piora aceita no início com probabilidade 1/e.' },
      cooling: { label: 'Resfriamento', hint: 'Mais perto de 1 = resfria devagar.' },
      seed: { label: 'Semente', hint: 'A mesma semente repete o resultado.' },
    },
    resultsCaption: 'Comparação na mesma origem e destino. Diferença: quanto a rota é mais longa que a de Dijkstra (ótima).',
    colAlgorithm: 'Algoritmo',
    colLength: 'Distância',
    colGap: 'Diferença',
    colWork: 'Trabalho',
    colTime: 'Tempo',
    noRoute: 'sem rota',
    via: 'Principais vias',
    estimatedLink: 'Ligação estimada (sem face de quadra no IBGE)',

    methodTitle: 'Como o grafo foi construído',
    methodSteps: [
      { title: 'Faces de quadra (IBGE)', text: 'O IBGE publica, para cada município, os lados das quadras voltados para cada logradouro, com o nome da rua. Não há eixo de rua: cada rua aparece como duas linhas, uma de cada lado.' },
      { title: 'Corredor da rua', text: 'Cada face ganha uma faixa de 8 m; as faixas de lados opostos se unem e formam o espaço da rua, desenhado em uma grade de 2 m (a mesma resolução das imagens CBERS-4A usadas depois).' },
      { title: 'Esqueleto', text: 'O corredor é afinado até um pixel de largura, o eixo da rua. Pontas curtas (cantos, fim de faixa) são removidas.' },
      { title: 'Grafo', text: 'Cruzamentos e pontas viram nós; cada trecho entre eles vira uma aresta com comprimento em metros e o nome da face mais próxima. Fica a maior parte conectada.' },
    ],
    algorithmsTitle: 'Os algoritmos',
    algorithmsLede: 'Exatos garantem a rota mais curta; heurísticos e bioinspirados trocam garantia por flexibilidade (objetivos múltiplos, restrições). Aqui todos resolvem o mesmo problema para que a diferença apareça.',
    limitsTitle: 'Limitações',
    limits: [
      'Sem sentido de circulação, velocidades ou restrições de conversão: a rota é a mais curta, não a mais rápida.',
      'Avenidas largas podem virar dois eixos paralelos; ruas sem face de quadra (rodovias fora da área urbana) ficam de fora.',
      'As metaheurísticas são estocásticas: a comparação justa usa várias sementes e muitos pares origem-destino (no estudo, não nesta demonstração).',
    ],
    referencesTitle: 'Referências',
    sourcesNote: REFERENCES_NOTE,
  },
  en: {
    eyebrow: 'Work in progress · Georeferencing',
    title: 'Streets of a Brazilian city, from public data to the best route',
    subtitle: 'From the map of Brazil down to a street, with routing algorithms you can watch at work',
    intro:
      'Navigate from Brazil to a state, a municipality and a neighbourhood with the official IBGE boundaries. In Londrina the streets were rebuilt from the 2022 Census block faces and turned into a graph: pick an origin and a destination and compare exact, heuristic and evolutionary algorithms step by step.',
    honesty:
      'Everything runs in your browser, with no server. Distances are metres along the street centre lines; the IBGE data have no one-way streets or speeds, so the route is the shortest, not the fastest.',
    back: 'All projects',
    onThisPage: 'On this page',
    loadError: 'The map data could not be loaded. Please reload the page.',

    mapTitle: 'Map',
    mapLede: 'Search for a state, a municipality or, in Londrina, a neighbourhood; or click the map to zoom in.',
    searchLabel: 'Search a place',
    searchPlaceholder: 'E.g. Paraná, Londrina, Gleba Palhano',
    searchHint: 'Arrow keys to choose, Enter to go.',
    kinds: { state: 'State', municipality: 'Municipality', bairro: 'Neighbourhood' },
    noMatch: 'No place found.',
    brazil: 'Brazil',
    layers: 'Layers',
    showBairros: 'Neighbourhoods',
    notRouted: 'The street graph is available for Londrina (PR) in this version; other municipalities show boundaries only.',
    loadingStreets: 'Loading the streets of Londrina…',
    streetsLoaded: '{nodes} intersections and {km} km of streets loaded.',

    routeTitle: 'Route',
    pickOrigin: 'Click the map to set the origin.',
    pickDestination: 'Now click to set the destination.',
    ready: 'Origin and destination set. Choose an algorithm and run it.',
    clear: 'Clear',
    algorithm: 'Algorithm',
    run: 'Run',
    runAll: 'Compare all',
    speed: 'Animation speed',
    running: 'Computing…',
    algorithms: {
      dijkstra: { name: 'Dijkstra', family: 'Exact', how: 'Expands intersections in order of distance from the origin; guarantees the shortest route.' },
      astar: { name: 'A*', family: 'Exact with a heuristic', how: 'Like Dijkstra, but first explores what looks closest to the destination in a straight line; with weight 1 it stays exact and expands less.' },
      bidirectional: { name: 'Bidirectional Dijkstra', family: 'Exact', how: 'Searches from the origin and the destination at the same time and stops when the two frontiers meet.' },
      greedy: { name: 'Greedy search', family: 'Heuristic', how: 'Always moves to the neighbour closest to the destination in a straight line: fast, but may wander.' },
      ants: { name: 'Ant colony', family: 'Bio-inspired', how: 'Virtual ants walk at random without revisiting a corner (turning back at dead ends), preferring streets with more pheromone; short routes receive more pheromone and attract the next ants.' },
      genetic: { name: 'Genetic algorithm', family: 'Evolutionary', how: 'A population of routes evolves by selection, crossover at shared intersections and mutation of stretches.' },
      annealing: { name: 'Simulated annealing', family: 'Metaheuristic', how: 'Changes a stretch of the route and sometimes accepts a worse one, with a probability that falls with the “temperature”, to escape local minima.' },
    },
    params: {
      weight: { label: 'Heuristic weight', hint: '1 = exact; larger = faster and possibly a longer route.' },
      ants: { label: 'Ants', hint: 'More ants explore more and take longer.' },
      iterations: { label: 'Iterations', hint: 'More iterations refine the route.' },
      alpha: { label: 'α (pheromone)', hint: 'Weight of the collective experience.' },
      beta: { label: 'β (direction)', hint: 'Weight of the direction to the destination.' },
      evaporation: { label: 'Evaporation', hint: 'Higher forgets old trails faster.' },
      population: { label: 'Population', hint: 'More routes per generation.' },
      generations: { label: 'Generations', hint: 'More generations refine the route.' },
      mutationRate: { label: 'Mutation rate', hint: 'More mutation, more diversity.' },
      temperature: { label: 'Initial temperature (m)', hint: 'Extra length accepted at first with probability 1/e.' },
      cooling: { label: 'Cooling', hint: 'Closer to 1 = cools slowly.' },
      seed: { label: 'Seed', hint: 'The same seed repeats the result.' },
    },
    resultsCaption: 'Comparison on the same origin and destination. Gap: how much longer the route is than Dijkstra’s (optimal).',
    colAlgorithm: 'Algorithm',
    colLength: 'Length',
    colGap: 'Gap',
    colWork: 'Work',
    colTime: 'Time',
    noRoute: 'no route',
    via: 'Main streets',
    estimatedLink: 'Estimated link (no IBGE block face)',

    methodTitle: 'How the graph was built',
    methodSteps: [
      { title: 'Block faces (IBGE)', text: 'For every municipality IBGE publishes the sides of the city blocks that face each street, with the street name. There is no centre line: each street appears as two lines, one on each side.' },
      { title: 'Street corridor', text: 'Each face gets an 8 m band; the bands of opposite sides merge into the street space, drawn on a 2 m grid (the resolution of the CBERS-4A images used later).' },
      { title: 'Skeleton', text: 'The corridor is thinned to one pixel, the street centre line. Short spurs (corners, band ends) are removed.' },
      { title: 'Graph', text: 'Intersections and dead ends become nodes; each stretch between them becomes an edge with its length in metres and the name of the nearest face. The largest connected part is kept.' },
    ],
    algorithmsTitle: 'The algorithms',
    algorithmsLede: 'Exact algorithms guarantee the shortest route; heuristic and bio-inspired ones trade that guarantee for flexibility (several objectives, constraints). Here all of them solve the same problem, so the difference shows.',
    limitsTitle: 'Limitations',
    limits: [
      'No one-way streets, speeds or turn restrictions: the route is the shortest, not the fastest.',
      'Wide avenues may become two parallel centre lines; streets without block faces (highways outside the urban area) are missing.',
      'Metaheuristics are stochastic: a fair comparison uses several seeds and many origin-destination pairs (in the study, not in this demo).',
    ],
    referencesTitle: 'References',
    sourcesNote: REFERENCES_NOTE,
  },
  de: {
    eyebrow: 'Laufendes Projekt · Georeferenzierung',
    title: 'Straßen einer brasilianischen Stadt, von offenen Daten zur besten Route',
    subtitle: 'Von der Karte Brasiliens bis zur Straße, mit Routing-Algorithmen, denen man bei der Arbeit zusieht',
    intro:
      'Navigieren Sie von Brasilien zum Bundesstaat, zur Gemeinde und zum Stadtviertel mit den amtlichen Grenzen des IBGE. In Londrina wurden die Straßen aus den Blockseiten des Zensus 2022 rekonstruiert und in einen Graphen überführt: Wählen Sie Start und Ziel und vergleichen Sie exakte, heuristische und evolutionäre Algorithmen Schritt für Schritt.',
    honesty:
      'Alles läuft in Ihrem Browser, ohne Server. Entfernungen sind Meter entlang der Straßenachsen; die IBGE-Daten enthalten keine Einbahnstraßen oder Geschwindigkeiten, die Route ist also die kürzeste, nicht die schnellste.',
    back: 'Alle Projekte',
    onThisPage: 'Auf dieser Seite',
    loadError: 'Die Kartendaten konnten nicht geladen werden. Bitte laden Sie die Seite neu.',

    mapTitle: 'Karte',
    mapLede: 'Suchen Sie einen Bundesstaat, eine Gemeinde oder, in Londrina, ein Stadtviertel; oder klicken Sie in die Karte, um hineinzuzoomen.',
    searchLabel: 'Ort suchen',
    searchPlaceholder: 'z. B. Paraná, Londrina, Gleba Palhano',
    searchHint: 'Pfeiltasten zur Auswahl, Enter zum Anzeigen.',
    kinds: { state: 'Bundesstaat', municipality: 'Gemeinde', bairro: 'Stadtviertel' },
    noMatch: 'Kein Ort gefunden.',
    brazil: 'Brasilien',
    layers: 'Ebenen',
    showBairros: 'Stadtviertel',
    notRouted: 'Der Straßengraph ist in dieser Version für Londrina (PR) verfügbar; andere Gemeinden zeigen nur die Grenzen.',
    loadingStreets: 'Straßen von Londrina werden geladen…',
    streetsLoaded: '{nodes} Kreuzungen und {km} km Straßen geladen.',

    routeTitle: 'Route',
    pickOrigin: 'Klicken Sie in die Karte, um den Start zu setzen.',
    pickDestination: 'Klicken Sie jetzt, um das Ziel zu setzen.',
    ready: 'Start und Ziel gesetzt. Wählen Sie einen Algorithmus und starten Sie ihn.',
    clear: 'Zurücksetzen',
    algorithm: 'Algorithmus',
    run: 'Starten',
    runAll: 'Alle vergleichen',
    speed: 'Animationsgeschwindigkeit',
    running: 'Wird berechnet…',
    algorithms: {
      dijkstra: { name: 'Dijkstra', family: 'Exakt', how: 'Erweitert Kreuzungen in der Reihenfolge ihrer Entfernung vom Start; garantiert die kürzeste Route.' },
      astar: { name: 'A*', family: 'Exakt mit Heuristik', how: 'Wie Dijkstra, untersucht aber zuerst, was in Luftlinie am nächsten am Ziel liegt; mit Gewicht 1 bleibt er exakt und erweitert weniger.' },
      bidirectional: { name: 'Bidirektionaler Dijkstra', family: 'Exakt', how: 'Sucht gleichzeitig vom Start und vom Ziel aus und hält an, wenn sich die beiden Fronten treffen.' },
      greedy: { name: 'Gierige Suche', family: 'Heuristisch', how: 'Geht immer zum Nachbarn, der in Luftlinie am nächsten am Ziel liegt: schnell, aber mit möglichen Umwegen.' },
      ants: { name: 'Ameisenkolonie', family: 'Bioinspiriert', how: 'Virtuelle Ameisen laufen zufällig, ohne eine Kreuzung zweimal zu besuchen (in Sackgassen kehren sie um), und bevorzugen Straßen mit mehr Pheromon; kurze Routen erhalten mehr Pheromon und ziehen die nächsten an.' },
      genetic: { name: 'Genetischer Algorithmus', family: 'Evolutionär', how: 'Eine Population von Routen entwickelt sich durch Selektion, Kreuzung an gemeinsamen Kreuzungen und Mutation von Abschnitten.' },
      annealing: { name: 'Simulierte Abkühlung', family: 'Metaheuristik', how: 'Ändert einen Abschnitt der Route und akzeptiert manchmal eine schlechtere, mit einer Wahrscheinlichkeit, die mit der „Temperatur“ sinkt, um lokalen Minima zu entkommen.' },
    },
    params: {
      weight: { label: 'Gewicht der Heuristik', hint: '1 = exakt; größer = schneller, Route evtl. länger.' },
      ants: { label: 'Ameisen', hint: 'Mehr Ameisen erkunden mehr und brauchen länger.' },
      iterations: { label: 'Iterationen', hint: 'Mehr Iterationen verfeinern die Route.' },
      alpha: { label: 'α (Pheromon)', hint: 'Gewicht der kollektiven Erfahrung.' },
      beta: { label: 'β (Richtung)', hint: 'Gewicht der Richtung zum Ziel.' },
      evaporation: { label: 'Verdunstung', hint: 'Höher vergisst alte Spuren schneller.' },
      population: { label: 'Population', hint: 'Mehr Routen pro Generation.' },
      generations: { label: 'Generationen', hint: 'Mehr Generationen verfeinern die Route.' },
      mutationRate: { label: 'Mutationsrate', hint: 'Mehr Mutation, mehr Vielfalt.' },
      temperature: { label: 'Anfangstemperatur (m)', hint: 'Anfangs mit Wahrscheinlichkeit 1/e akzeptierter Umweg.' },
      cooling: { label: 'Abkühlung', hint: 'Näher an 1 = kühlt langsam ab.' },
      seed: { label: 'Startwert', hint: 'Derselbe Startwert wiederholt das Ergebnis.' },
    },
    resultsCaption: 'Vergleich mit demselben Start und Ziel. Abweichung: wie viel länger die Route ist als die von Dijkstra (optimal).',
    colAlgorithm: 'Algorithmus',
    colLength: 'Länge',
    colGap: 'Abweichung',
    colWork: 'Aufwand',
    colTime: 'Zeit',
    noRoute: 'keine Route',
    via: 'Hauptstraßen',
    estimatedLink: 'Geschätzte Verbindung (keine IBGE-Blockseite)',

    methodTitle: 'Wie der Graph entstand',
    methodSteps: [
      { title: 'Blockseiten (IBGE)', text: 'Für jede Gemeinde veröffentlicht das IBGE die Seiten der Häuserblöcke, die einer Straße zugewandt sind, mit dem Straßennamen. Eine Straßenachse gibt es nicht: jede Straße erscheint als zwei Linien, eine auf jeder Seite.' },
      { title: 'Straßenkorridor', text: 'Jede Blockseite erhält ein 8-m-Band; die Bänder gegenüberliegender Seiten verschmelzen zum Straßenraum, gezeichnet auf einem 2-m-Raster (die Auflösung der später verwendeten CBERS-4A-Bilder).' },
      { title: 'Skelett', text: 'Der Korridor wird auf ein Pixel ausgedünnt, die Straßenachse. Kurze Ausläufer (Ecken, Bandenden) werden entfernt.' },
      { title: 'Graph', text: 'Kreuzungen und Sackgassen werden zu Knoten; jeder Abschnitt dazwischen wird zu einer Kante mit Länge in Metern und dem Namen der nächsten Blockseite. Der größte zusammenhängende Teil bleibt erhalten.' },
    ],
    algorithmsTitle: 'Die Algorithmen',
    algorithmsLede: 'Exakte Algorithmen garantieren die kürzeste Route; heuristische und bioinspirierte tauschen diese Garantie gegen Flexibilität (mehrere Ziele, Nebenbedingungen). Hier lösen alle dasselbe Problem, damit der Unterschied sichtbar wird.',
    limitsTitle: 'Grenzen',
    limits: [
      'Keine Einbahnstraßen, Geschwindigkeiten oder Abbiegeverbote: die Route ist die kürzeste, nicht die schnellste.',
      'Breite Alleen können zu zwei parallelen Achsen werden; Straßen ohne Blockseiten (Fernstraßen außerhalb des Stadtgebiets) fehlen.',
      'Metaheuristiken sind stochastisch: ein fairer Vergleich nutzt mehrere Startwerte und viele Start-Ziel-Paare (in der Studie, nicht in dieser Demo).',
    ],
    referencesTitle: 'Literatur',
    sourcesNote: REFERENCES_NOTE,
  },
};

/** Works cited on the page (same in every language). */
export const STREET_REFERENCES: string[] = [
  'Dijkstra, E. W. (1959). A note on two problems in connexion with graphs. Numerische Mathematik, 1, 269–271.',
  'Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). A formal basis for the heuristic determination of minimum cost paths. IEEE Transactions on Systems Science and Cybernetics, 4(2), 100–107.',
  'Goldberg, A. V., & Harrelson, C. (2005). Computing the shortest path: A* search meets graph theory. Proc. 16th ACM-SIAM SODA, 156–165.',
  'Dorigo, M., Maniezzo, V., & Colorni, A. (1996). Ant system: optimization by a colony of cooperating agents. IEEE Transactions on Systems, Man, and Cybernetics, Part B, 26(1), 29–41.',
  'Kirkpatrick, S., Gelatt, C. D., & Vecchi, M. P. (1983). Optimization by simulated annealing. Science, 220(4598), 671–680.',
  'Zhang, T. Y., & Suen, C. Y. (1984). A fast parallel algorithm for thinning digital patterns. Communications of the ACM, 27(3), 236–239.',
  'Van Etten, A., Lindenbaum, D., & Bacastow, T. M. (2018). SpaceNet: A remote sensing dataset and challenge series. arXiv:1807.01232 (APLS metric).',
];
