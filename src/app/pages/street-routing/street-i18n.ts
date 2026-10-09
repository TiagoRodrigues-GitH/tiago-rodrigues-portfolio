import { Locale } from '../../services/i18n.service';
import { AlgorithmKey } from './engine/algorithm-catalog';

export type { AlgorithmKey };

export interface AlgorithmText {
  name: string;
  family: string;
  /** One sentence: how it works. */
  how: string;
  trait: string;
  when: string;
  time: string;
  space: string;
  limits: string;
}

export interface LegendText {
  street: string;
  evaluated: string;
  frontier: string;
  visited: string;
  backward: string;
  candidate: string;
  best: string;
  route: string;
  link: string;
  origin: string;
  destination: string;
  oneway: string;
}

export interface StreetTranslations {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  honesty: string;
  back: string;
  onThisPage: string;
  loadError: string;
  retry: string;

  mapTitle: string;
  mapLede: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchHint: string;
  kinds: { state: string; municipality: string; bairro: string };
  noMatch: string;
  brazil: string;
  citiesLabel: string;
  citiesHint: string;
  layers: string;
  showBairros: string;
  notRouted: string;
  loadingStreets: string;
  streetsLoaded: string;
  streetsError: string;

  routeTitle: string;
  pickOrigin: string;
  pickDestination: string;
  ready: string;
  nextClick: string;
  originOption: string;
  destinationOption: string;
  atCentre: string;
  centreHint: string;
  swap: string;
  clear: string;
  samePoint: string;
  differentParts: string;

  algorithm: string;
  aboutAlgorithm: string;
  labels: { how: string; trait: string; when: string; complexity: string; time: string; space: string; limits: string };
  exactBadge: string;
  heuristicBadge: string;
  algorithms: Record<AlgorithmKey, AlgorithmText>;
  params: Record<string, { label: string; hint: string }>;

  run: string;
  runAll: string;
  computing: string;
  playback: string;
  play: string;
  pause: string;
  resume: string;
  replay: string;
  step: string;
  restart: string;
  skipToEnd: string;
  speed: string;
  speedValue: string;
  progress: string;
  visited: string;
  frontier: string;
  evaluated: string;
  labelSearch: string;
  labelBest: string;
  routeFound: string;
  noRoute: string;
  runError: string;

  legendTitle: string;
  legend: LegendText;

  resultsCaption: string;
  colAlgorithm: string;
  colLength: string;
  colGap: string;
  colWork: string;
  colTime: string;
  noRouteShort: string;
  via: string;

  onewayTitle: string;
  onewayLede: string;
  onewayNote: string;
  onewayRespect: string;
  onewayFigure: string;
  onewayCompare: string;
  onewayPick: string;

  methodTitle: string;
  methodSteps: Array<{ title: string; text: string }>;
  citiesTitle: string;
  citiesText: string;
  algorithmsTitle: string;
  algorithmsLede: string;
  limitsTitle: string;
  limits: string[];
  referencesTitle: string;
  sourcesNote: string;
}

const REFERENCES_NOTE = 'IBGE (2024). Base de Faces de Logradouros do Brasil, Censo Demográfico 2022; IBGE (2024). Bairros, Censo 2022; IBGE, API de malhas territoriais v3 e API de localidades v1.';

export const STREET_I18N: Record<Locale, StreetTranslations> = {
  pt: {
    eyebrow: 'Projeto em andamento · Georreferenciamento',
    title: 'Ruas de cidades brasileiras, de dados públicos ao melhor caminho',
    subtitle: 'Do mapa do Brasil à rua, com algoritmos de rota que você pode ver trabalhando',
    intro:
      'Navegue do Brasil ao estado, ao município e ao bairro com as malhas oficiais do IBGE. Em seis áreas (Londrina, Curitiba, Florianópolis, Brasília, São Paulo e o ABC Paulista), as ruas foram reconstruídas a partir das faces de quadra do Censo 2022 e transformadas em um grafo: escolha origem e destino e acompanhe, passo a passo, como dez algoritmos exatos, heurísticos e estocásticos constroem a rota.',
    honesty:
      'Tudo roda no seu navegador, sem servidor. As distâncias são em metros pelo eixo das ruas; os dados do IBGE não trazem sentido de circulação nem velocidade, então a rota é a mais curta, não a mais rápida, e todas as ruas são tratadas como de mão dupla.',
    back: 'Todos os projetos',
    onThisPage: 'Nesta página',
    loadError: 'Não foi possível carregar os dados do mapa.',
    retry: 'Tentar de novo',

    mapTitle: 'Mapa',
    mapLede: 'Escolha uma cidade com ruas, busque um estado, um município ou um bairro, ou clique no mapa para aproximar.',
    searchLabel: 'Buscar lugar',
    searchPlaceholder: 'Ex.: Paraná, Curitiba, Gleba Palhano',
    searchHint: 'Setas para escolher, Enter para ir.',
    kinds: { state: 'Estado', municipality: 'Município', bairro: 'Bairro' },
    noMatch: 'Nenhum lugar encontrado.',
    brazil: 'Brasil',
    citiesLabel: 'Cidades com ruas',
    citiesHint: 'Só estas áreas têm ruas e rotas; no mapa, aparecem como caixas verdes tracejadas. Os demais municípios mostram apenas os limites.',
    layers: 'Camadas',
    showBairros: 'Bairros',
    notRouted: 'Este município mostra só os limites. Há ruas para: {list}.',
    loadingStreets: 'Carregando as ruas de {city} ({mb} MB)…',
    streetsLoaded: '{city}: {nodes} cruzamentos e {km} km de ruas em {parts} parte(s) da rede.',
    streetsError: 'Não foi possível carregar as ruas de {city}.',

    routeTitle: 'Rota',
    pickOrigin: 'Clique no mapa (ou use o centro do mapa) para marcar a origem.',
    pickDestination: 'Agora marque o destino.',
    ready: 'Origem e destino marcados. Escolha um algoritmo e inicie.',
    nextClick: 'O próximo clique no mapa marca',
    originOption: 'Origem (A)',
    destinationOption: 'Destino (B)',
    atCentre: 'Marcar no centro do mapa',
    centreHint: 'Sem mouse: mova o mapa com as setas do teclado e marque o ponto sob a mira.',
    swap: 'Inverter A e B',
    clear: 'Limpar',
    samePoint: 'Origem e destino são o mesmo cruzamento: a rota tem distância zero.',
    differentParts: 'Origem e destino estão em partes da rede que os dados do IBGE não ligam (pontes e rodovias sem faces de quadra). A busca vai mostrar que não há rota.',

    algorithm: 'Algoritmo',
    aboutAlgorithm: 'Sobre este algoritmo',
    labels: { how: 'Como funciona', trait: 'Característica principal', when: 'Quando usar', complexity: 'Complexidade', time: 'Tempo', space: 'Memória', limits: 'Limitações' },
    exactBadge: 'Garante a rota mais curta',
    heuristicBadge: 'Não garante a rota mais curta',
    algorithms: {
      dijkstra: {
        name: 'Dijkstra', family: 'Exato',
        how: 'Expande os cruzamentos em ordem crescente de distância à origem; cada um sai da fronteira com a sua distância definitiva.',
        trait: 'Referência de rota mais curta com comprimentos não negativos.',
        when: 'Quando é preciso a rota ótima e não há uma boa estimativa da distância até o destino.',
        time: 'O((V + E) log V) com fila de prioridade binária', space: 'O(V)',
        limits: 'Explora em círculo, em todas as direções: em uma cidade grande, expande muito mais que A* ou ALT.',
      },
      astar: {
        name: 'A*', family: 'Exato com heurística',
        how: 'Como Dijkstra, mas ordena a fronteira pela distância percorrida mais a distância em linha reta até o destino.',
        trait: 'Com peso 1 a linha reta nunca superestima, então a rota continua a mais curta e a busca se alonga em direção ao destino.',
        when: 'Rotas ponto a ponto em mapas com coordenadas. Com peso maior que 1, troca exatidão por velocidade.',
        time: 'O((V + E) log V) no pior caso; na prática, bem menos expansões', space: 'O(V)',
        limits: 'Com peso w > 1, a rota pode ser até w vezes mais longa que a ótima. A linha reta é uma estimativa fraca quando rios e morros obrigam a desvios.',
      },
      alt: {
        name: 'ALT (A* com marcos)', family: 'Exato com pré-processamento',
        how: 'Antes da primeira busca, calcula a distância de 8 marcos espalhados na rede até todos os cruzamentos; a desigualdade triangular dá uma estimativa melhor que a linha reta.',
        trait: 'Estimativa pelas ruas, não em linha reta: expande menos que A* e continua exato.',
        when: 'Muitas consultas na mesma rede, quando vale pagar um pré-processamento uma vez.',
        time: 'Pré-processamento O(k (V + E) log V); consulta O((V + E) log V) no pior caso', space: 'O(k · V) para k marcos',
        limits: 'O pré-processamento leva alguns segundos na primeira execução por cidade e ocupa memória proporcional ao número de marcos.',
      },
      bidirectional: {
        name: 'Dijkstra bidirecional', family: 'Exato',
        how: 'Busca a partir da origem e do destino ao mesmo tempo (a busca do destino segue as ruas no sentido contrário) e para quando nenhuma combinação das duas frentes pode melhorar a rota.',
        trait: 'Duas bolas pequenas no lugar de uma grande: costuma expandir cerca de metade dos cruzamentos de Dijkstra.',
        when: 'Rotas ponto a ponto quando não há heurística confiável.',
        time: 'O((V + E) log V)', space: 'O(V)',
        limits: 'O critério de parada é mais delicado, e precisa das arestas de entrada em redes com mão única.',
      },
      bellmanFord: {
        name: 'Bellman-Ford-Moore', family: 'Exato (correção de rótulos)',
        how: 'Mantém uma fila dos cruzamentos cuja distância melhorou e reavalia seus vizinhos até que nenhuma distância melhore; um cruzamento pode voltar à fila várias vezes.',
        trait: 'Aceita comprimentos negativos e detecta ciclos negativos, o que Dijkstra não faz.',
        when: 'Custos que podem ser negativos (bônus, créditos) ou cálculo distribuído, como em protocolos de roteamento de redes.',
        time: 'O(V · E) no pior caso', space: 'O(V)',
        limits: 'Não pode parar ao chegar ao destino e reavalia cruzamentos: em ruas, com comprimentos positivos, é bem mais lento que Dijkstra.',
      },
      bfs: {
        name: 'Busca em largura', family: 'Exata em número de trechos',
        how: 'Visita os cruzamentos em camadas: primeiro os vizinhos da origem, depois os vizinhos deles, e assim por diante.',
        trait: 'Encontra a rota com menos trechos de rua, ignorando o comprimento de cada trecho.',
        when: 'Grafos sem pesos (redes sociais, labirintos em grade) ou para contar quantos cruzamentos separam dois pontos.',
        time: 'O(V + E)', space: 'O(V)',
        limits: 'Em ruas, poucos trechos não significam poucos metros: a rota pode ser bem mais longa que a de Dijkstra.',
      },
      greedy: {
        name: 'Busca gulosa', family: 'Heurístico',
        how: 'Expande sempre o cruzamento da fronteira mais próximo do destino em linha reta, sem considerar o caminho já percorrido.',
        trait: 'Muito rápida quando o caminho é quase reto.',
        when: 'Quando uma rota razoável rápida importa mais que a melhor rota.',
        time: 'O((V + E) log V) no pior caso', space: 'O(V)',
        limits: 'Não garante a rota mais curta; diante de um obstáculo (rio, linha férrea) pode dar grandes voltas.',
      },
      ants: {
        name: 'Colônia de formigas', family: 'Bioinspirado',
        how: 'Formigas virtuais andam ao acaso sem repetir cruzamentos (voltam em becos sem saída), preferindo ruas com mais feromônio e que apontam para o destino; rotas curtas recebem mais feromônio, que evapora com o tempo.',
        trait: 'A experiência coletiva concentra a busca nas boas ruas ao longo das iterações.',
        when: 'Problemas com vários critérios ou restrições que mudam (como rotas de veículos), em que não há algoritmo exato eficiente.',
        time: 'O(I · F · (V + E)) no pior caso, para I iterações e F formigas', space: 'O(V + E) (feromônio por rua)',
        limits: 'Estocástico: não garante a rota mais curta, o resultado depende da semente e dos parâmetros, e é muito mais lento que os exatos.',
      },
      genetic: {
        name: 'Algoritmo genético', family: 'Evolutivo',
        how: 'Uma população de rotas evolui: as melhores são selecionadas, cruzadas em cruzamentos que têm em comum, e trechos são trocados por mutação.',
        trait: 'Mantém várias soluções ao mesmo tempo e combina partes boas de rotas diferentes.',
        when: 'Otimização com vários objetivos (distância, tempo, risco) ou com funções de custo sem estrutura que um exato explore.',
        time: 'O(G · P · (V + E)) no pior caso, para G gerações e população P', space: 'O(P · L) para rotas de L cruzamentos',
        limits: 'Estocástico e sensível aos parâmetros; pode convergir cedo para uma rota ruim; sem garantia de ótimo.',
      },
      annealing: {
        name: 'Recozimento simulado', family: 'Metaheurística',
        how: 'Troca um trecho da rota por outro e aceita a troca se encurtar a rota; se alongar, aceita às vezes, com probabilidade que cai com a “temperatura”.',
        trait: 'Aceitar pioras no início ajuda a escapar de mínimos locais.',
        when: 'Problemas combinatórios grandes em que basta uma boa solução, com controle simples do tempo gasto.',
        time: 'O(N · (V + E)) no pior caso, para N iterações', space: 'O(L) para a rota atual e a melhor',
        limits: 'O resultado depende do resfriamento e da semente; sem garantia de ótimo em tempo finito.',
      },
    },
    params: {
      weight: { label: 'Peso da heurística', hint: '1 = exato; maior = mais rápido, rota possivelmente mais longa.' },
      ants: { label: 'Formigas', hint: 'Mais formigas exploram mais e demoram mais.' },
      iterations: { label: 'Iterações', hint: 'Mais iterações refinam a rota.' },
      alpha: { label: 'α (feromônio)', hint: 'Quanto pesa a experiência coletiva.' },
      beta: { label: 'β (direção)', hint: 'Quanto pesa a direção do destino.' },
      evaporation: { label: 'Evaporação', hint: 'Maior: trilhas antigas são esquecidas mais depressa.' },
      population: { label: 'População', hint: 'Mais rotas por geração.' },
      generations: { label: 'Gerações', hint: 'Mais gerações refinam a rota.' },
      mutationRate: { label: 'Taxa de mutação', hint: 'Mais mutação, mais diversidade.' },
      temperature: { label: 'Temperatura inicial (m)', hint: 'Piora aceita no início com probabilidade 1/e.' },
      cooling: { label: 'Resfriamento', hint: 'Mais perto de 1 = resfria mais devagar.' },
      saIterations: { label: 'Iterações', hint: 'Cada iteração avalia uma rota modificada.' },
      seed: { label: 'Semente', hint: 'A mesma semente repete o resultado.' },
    },

    run: 'Calcular e animar',
    runAll: 'Comparar todos',
    computing: 'Calculando…',
    playback: 'Controles da animação',
    play: 'Reproduzir',
    pause: 'Pausar',
    resume: 'Continuar',
    replay: 'Ver de novo',
    step: 'Um passo',
    restart: 'Reiniciar',
    skipToEnd: 'Ir ao fim',
    speed: 'Velocidade',
    speedValue: '{n} passos/s',
    progress: 'Passo {step} de {total}',
    visited: 'Visitados',
    frontier: 'Na fronteira',
    evaluated: 'Ruas avaliadas',
    labelSearch: 'Distância do último cruzamento expandido',
    labelBest: 'Melhor rota até agora',
    routeFound: 'Rota encontrada: {km}, em {steps} passos; cálculo em {ms}.',
    noRoute: 'Não há rota entre a origem e o destino nesta rede.',
    runError: 'O cálculo falhou. Tente de novo.',

    legendTitle: 'Legenda',
    legend: {
      street: 'Rua ainda não avaliada',
      evaluated: 'Rua avaliada pela busca',
      frontier: 'Cruzamento na fronteira (aguardando)',
      visited: 'Cruzamento visitado a partir da origem',
      backward: 'Visitado a partir do destino (bidirecional)',
      candidate: 'Rota em avaliação (metaheurísticas)',
      best: 'Melhor rota até agora (metaheurísticas)',
      route: 'Rota final',
      link: 'Ligação estimada (sem face de quadra no IBGE)',
      origin: 'Origem (A)',
      destination: 'Destino (B)',
      oneway: 'Mão única (sentido permitido)',
    },

    resultsCaption: 'Comparação com a mesma origem e o mesmo destino. Diferença: quanto a rota é mais longa que a de Dijkstra (ótima). Trabalho: passos da animação (cruzamentos expandidos ou rotas avaliadas).',
    colAlgorithm: 'Algoritmo',
    colLength: 'Distância',
    colGap: 'Diferença',
    colWork: 'Trabalho',
    colTime: 'Tempo',
    noRouteShort: 'sem rota',
    via: 'Principais vias',

    onewayTitle: 'Mão única: um grafo direcionado didático',
    onewayLede: 'Nas ruas reais desta página todas as vias são de mão dupla, porque os dados do IBGE não informam o sentido. Este exemplo pequeno mostra o que muda quando há ruas de mão única: cada uma vira uma aresta que só pode ser percorrida no sentido da seta.',
    onewayNote: 'Exemplo ilustrativo, com ruas fictícias; não representa nenhuma cidade.',
    onewayRespect: 'Respeitar a mão única',
    onewayFigure: 'Grade de 6 por 5 cruzamentos com ruas de mão única (setas) e de mão dupla (sem seta).',
    onewayCompare: 'Respeitando a mão única: {with}. Ignorando: {without}.',
    onewayPick: 'Clique em dois cruzamentos para mudar origem e destino.',

    methodTitle: 'Como o grafo foi construído',
    methodSteps: [
      { title: 'Faces de quadra (IBGE)', text: 'O IBGE publica, para cada município, os lados das quadras voltados para cada logradouro, com o nome da rua. Não há eixo de rua: cada rua aparece como duas linhas, uma de cada lado.' },
      { title: 'Corredor da rua', text: 'Cada face ganha uma faixa de 8 m; as faixas de lados opostos se unem e formam o espaço da rua, desenhado em uma grade de 2 m (a resolução das imagens CBERS-4A usadas depois). Cidades grandes são desenhadas em blocos de 8 km com 400 m de sobreposição.' },
      { title: 'Esqueleto', text: 'O corredor é afinado até um pixel de largura, o eixo da rua. Pontas curtas (cantos, fim de faixa) são removidas.' },
      { title: 'Grafo', text: 'Cruzamentos e pontas viram nós; cada trecho entre eles vira uma aresta com o comprimento em metros e o nome da face mais próxima. Ficam as partes da rede com pelo menos 20 km de ruas.' },
    ],
    citiesTitle: 'Cidades disponíveis',
    citiesText: 'O ABC Paulista (Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires e Rio Grande da Serra) é um grafo único porque as ruas continuam através das divisas. Em Florianópolis e Brasília a rede fica dividida em partes: pontes e rodovias entre a ilha e o continente, ou entre as regiões administrativas, não têm faces de quadra, e nenhuma ligação foi inventada.',
    algorithmsTitle: 'Os algoritmos',
    algorithmsLede: 'Exatos garantem a rota mais curta; heurísticos e estocásticos trocam essa garantia por flexibilidade (vários objetivos, restrições). Aqui todos resolvem o mesmo problema, para que a diferença apareça. V é o número de cruzamentos e E o de trechos de rua.',
    limitsTitle: 'Limitações',
    limits: [
      'Sem sentido de circulação, velocidades ou restrições de conversão: a rota é a mais curta, não a mais rápida. Dados de mão única existem no OpenStreetMap (licença ODbL, com atribuição), mas exigiriam casar cada via do OSM com os eixos derivados do IBGE; o motor já aceita arestas direcionadas, como mostra o exemplo didático.',
      'Avenidas largas podem virar dois eixos paralelos; vias sem face de quadra (rodovias, pontes, avenidas junto a parques) ficam de fora, o que divide algumas cidades em partes.',
      'As metaheurísticas são estocásticas: uma comparação justa usa várias sementes e muitos pares de origem e destino (no estudo, não nesta demonstração).',
      'São Paulo tem cerca de 20 MB de ruas: em celulares, o carregamento e a memória podem pesar.',
    ],
    referencesTitle: 'Referências',
    sourcesNote: REFERENCES_NOTE,
  },
  en: {
    eyebrow: 'Work in progress · Georeferencing',
    title: 'Streets of Brazilian cities, from public data to the best route',
    subtitle: 'From the map of Brazil down to a street, with routing algorithms you can watch at work',
    intro:
      'Navigate from Brazil to a state, a municipality and a neighbourhood using the official IBGE boundaries. In six areas (Londrina, Curitiba, Florianópolis, Brasília, São Paulo and the ABC Paulista region), the streets were rebuilt from the 2022 Census block faces and turned into a graph: pick an origin and a destination and watch, step by step, how ten exact, heuristic and stochastic algorithms build the route.',
    honesty:
      'Everything runs in your browser, with no server. Distances are metres along the street centre lines; the IBGE data contain neither one-way streets nor speeds, so the route is the shortest, not the fastest, and every street is treated as two-way.',
    back: 'All projects',
    onThisPage: 'On this page',
    loadError: 'The map data could not be loaded.',
    retry: 'Try again',

    mapTitle: 'Map',
    mapLede: 'Choose a city with streets, search for a state, a municipality or a neighbourhood, or click the map to zoom in.',
    searchLabel: 'Search for a place',
    searchPlaceholder: 'E.g. Paraná, Curitiba, Gleba Palhano',
    searchHint: 'Use the arrow keys to choose and Enter to go.',
    kinds: { state: 'State', municipality: 'Municipality', bairro: 'Neighbourhood' },
    noMatch: 'No place found.',
    brazil: 'Brazil',
    citiesLabel: 'Cities with streets',
    citiesHint: 'Only these areas have streets and routes; on the map they appear as dashed green boxes. Other municipalities show boundaries only.',
    layers: 'Layers',
    showBairros: 'Neighbourhoods',
    notRouted: 'This municipality shows boundaries only. Streets are available for: {list}.',
    loadingStreets: 'Loading the streets of {city} ({mb} MB)…',
    streetsLoaded: '{city}: {nodes} intersections and {km} km of streets in {parts} part(s) of the network.',
    streetsError: 'The streets of {city} could not be loaded.',

    routeTitle: 'Route',
    pickOrigin: 'Click the map (or use the map centre) to set the origin.',
    pickDestination: 'Now set the destination.',
    ready: 'Origin and destination set. Choose an algorithm and start.',
    nextClick: 'The next click on the map sets the',
    originOption: 'Origin (A)',
    destinationOption: 'Destination (B)',
    atCentre: 'Set at the map centre',
    centreHint: 'No mouse? Move the map with the arrow keys and set the point under the crosshair.',
    swap: 'Swap A and B',
    clear: 'Clear',
    samePoint: 'Origin and destination are the same intersection: the route has zero length.',
    differentParts: 'Origin and destination lie in parts of the network that the IBGE data do not connect (bridges and highways have no block faces). The search will show that there is no route.',

    algorithm: 'Algorithm',
    aboutAlgorithm: 'About this algorithm',
    labels: { how: 'How it works', trait: 'Main trait', when: 'When to use it', complexity: 'Complexity', time: 'Time', space: 'Memory', limits: 'Limitations' },
    exactBadge: 'Guarantees the shortest route',
    heuristicBadge: 'Does not guarantee the shortest route',
    algorithms: {
      dijkstra: {
        name: 'Dijkstra', family: 'Exact',
        how: 'Expands intersections in increasing order of distance from the origin; each one leaves the frontier with its final distance.',
        trait: 'The reference shortest-path algorithm for non-negative lengths.',
        when: 'When the optimal route is required and there is no good estimate of the distance to the destination.',
        time: 'O((V + E) log V) with a binary priority queue', space: 'O(V)',
        limits: 'It explores in a circle, in every direction: in a large city it expands far more than A* or ALT.',
      },
      astar: {
        name: 'A*', family: 'Exact with a heuristic',
        how: 'Like Dijkstra, but orders the frontier by the distance travelled plus the straight-line distance to the destination.',
        trait: 'With weight 1 the straight line never overestimates, so the route stays the shortest while the search stretches towards the destination.',
        when: 'Point-to-point routes on maps with coordinates. With a weight above 1, it trades exactness for speed.',
        time: 'O((V + E) log V) in the worst case; far fewer expansions in practice', space: 'O(V)',
        limits: 'With weight w > 1 the route can be up to w times longer than the optimum. The straight line is a weak estimate when rivers or hills force detours.',
      },
      alt: {
        name: 'ALT (A* with landmarks)', family: 'Exact with preprocessing',
        how: 'Before the first search it computes the distance from 8 landmarks spread across the network to every intersection; the triangle inequality then gives a better estimate than the straight line.',
        trait: 'An estimate along the streets rather than as the crow flies: it expands less than A* and stays exact.',
        when: 'Many queries on the same network, when a one-off preprocessing cost pays off.',
        time: 'Preprocessing O(k (V + E) log V); query O((V + E) log V) in the worst case', space: 'O(k · V) for k landmarks',
        limits: 'Preprocessing takes a few seconds on the first run in each city and uses memory proportional to the number of landmarks.',
      },
      bidirectional: {
        name: 'Bidirectional Dijkstra', family: 'Exact',
        how: 'Searches from the origin and the destination at the same time (the search from the destination follows the streets backwards) and stops when no combination of the two frontiers can improve the route.',
        trait: 'Two small balls instead of one large one: it usually expands about half as many intersections as Dijkstra.',
        when: 'Point-to-point routes when no reliable heuristic is available.',
        time: 'O((V + E) log V)', space: 'O(V)',
        limits: 'The stopping rule is subtler, and with one-way streets it needs the incoming edges of every node.',
      },
      bellmanFord: {
        name: 'Bellman-Ford-Moore', family: 'Exact (label-correcting)',
        how: 'Keeps a queue of intersections whose distance improved and re-evaluates their neighbours until no distance improves; an intersection may re-enter the queue many times.',
        trait: 'Accepts negative lengths and detects negative cycles, which Dijkstra cannot do.',
        when: 'Costs that can be negative (bonuses, credits) or distributed computation, as in network routing protocols.',
        time: 'O(V · E) in the worst case', space: 'O(V)',
        limits: 'It cannot stop on reaching the destination and re-evaluates intersections: on streets, where lengths are positive, it is much slower than Dijkstra.',
      },
      bfs: {
        name: 'Breadth-first search', family: 'Exact in number of segments',
        how: 'Visits intersections layer by layer: first the neighbours of the origin, then their neighbours, and so on.',
        trait: 'Finds the route with the fewest street segments, ignoring how long each segment is.',
        when: 'Unweighted graphs (social networks, grid mazes) or to count how many intersections separate two points.',
        time: 'O(V + E)', space: 'O(V)',
        limits: 'On streets, few segments do not mean few metres: the route can be much longer than Dijkstra’s.',
      },
      greedy: {
        name: 'Greedy best-first search', family: 'Heuristic',
        how: 'Always expands the frontier intersection closest to the destination in a straight line, ignoring the distance already travelled.',
        trait: 'Very fast when the way is nearly straight.',
        when: 'When a reasonable route found quickly matters more than the best route.',
        time: 'O((V + E) log V) in the worst case', space: 'O(V)',
        limits: 'It does not guarantee the shortest route; faced with an obstacle (a river, a railway) it can make long detours.',
      },
      ants: {
        name: 'Ant colony', family: 'Bio-inspired',
        how: 'Virtual ants walk at random without revisiting an intersection (turning back at dead ends), preferring streets with more pheromone and those that point to the destination; short routes receive more pheromone, which evaporates over time.',
        trait: 'Collective experience focuses the search on good streets over the iterations.',
        when: 'Problems with several criteria or changing constraints (such as vehicle routing), where no efficient exact algorithm exists.',
        time: 'O(I · F · (V + E)) in the worst case, for I iterations and F ants', space: 'O(V + E) (pheromone per street)',
        limits: 'Stochastic: no guarantee of the shortest route, the result depends on the seed and the parameters, and it is much slower than the exact algorithms.',
      },
      genetic: {
        name: 'Genetic algorithm', family: 'Evolutionary',
        how: 'A population of routes evolves: the best are selected, recombined at intersections they share, and stretches are replaced by mutation.',
        trait: 'Keeps several solutions at once and combines good parts of different routes.',
        when: 'Multi-objective optimisation (distance, time, risk) or cost functions without structure that an exact algorithm could exploit.',
        time: 'O(G · P · (V + E)) in the worst case, for G generations and population P', space: 'O(P · L) for routes of L intersections',
        limits: 'Stochastic and sensitive to its parameters; it can converge early on a poor route; no guarantee of optimality.',
      },
      annealing: {
        name: 'Simulated annealing', family: 'Metaheuristic',
        how: 'Replaces a stretch of the route with another and keeps the change if the route gets shorter; if it gets longer, it keeps it sometimes, with a probability that falls with the “temperature”.',
        trait: 'Accepting worse routes early on helps it escape local minima.',
        when: 'Large combinatorial problems where a good solution is enough and running time must be easy to control.',
        time: 'O(N · (V + E)) in the worst case, for N iterations', space: 'O(L) for the current and the best route',
        limits: 'The result depends on the cooling schedule and the seed; no guarantee of optimality in finite time.',
      },
    },
    params: {
      weight: { label: 'Heuristic weight', hint: '1 = exact; higher = faster, possibly a longer route.' },
      ants: { label: 'Ants', hint: 'More ants explore more and take longer.' },
      iterations: { label: 'Iterations', hint: 'More iterations refine the route.' },
      alpha: { label: 'α (pheromone)', hint: 'Weight of the collective experience.' },
      beta: { label: 'β (direction)', hint: 'Weight of the direction to the destination.' },
      evaporation: { label: 'Evaporation', hint: 'Higher: old trails are forgotten faster.' },
      population: { label: 'Population', hint: 'More routes per generation.' },
      generations: { label: 'Generations', hint: 'More generations refine the route.' },
      mutationRate: { label: 'Mutation rate', hint: 'More mutation, more diversity.' },
      temperature: { label: 'Initial temperature (m)', hint: 'Extra length accepted at first with probability 1/e.' },
      cooling: { label: 'Cooling', hint: 'Closer to 1 = cools more slowly.' },
      saIterations: { label: 'Iterations', hint: 'Each iteration evaluates one modified route.' },
      seed: { label: 'Seed', hint: 'The same seed repeats the result.' },
    },

    run: 'Compute and animate',
    runAll: 'Compare all',
    computing: 'Computing…',
    playback: 'Animation controls',
    play: 'Play',
    pause: 'Pause',
    resume: 'Resume',
    replay: 'Replay',
    step: 'One step',
    restart: 'Restart',
    skipToEnd: 'Skip to end',
    speed: 'Speed',
    speedValue: '{n} steps/s',
    progress: 'Step {step} of {total}',
    visited: 'Visited',
    frontier: 'In the frontier',
    evaluated: 'Streets evaluated',
    labelSearch: 'Distance of the last intersection expanded',
    labelBest: 'Best route so far',
    routeFound: 'Route found: {km}, in {steps} steps; computed in {ms}.',
    noRoute: 'There is no route between the origin and the destination in this network.',
    runError: 'The computation failed. Please try again.',

    legendTitle: 'Legend',
    legend: {
      street: 'Street not evaluated yet',
      evaluated: 'Street evaluated by the search',
      frontier: 'Intersection in the frontier (waiting)',
      visited: 'Intersection visited from the origin',
      backward: 'Visited from the destination (bidirectional)',
      candidate: 'Route being evaluated (metaheuristics)',
      best: 'Best route so far (metaheuristics)',
      route: 'Final route',
      link: 'Estimated link (no IBGE block face)',
      origin: 'Origin (A)',
      destination: 'Destination (B)',
      oneway: 'One-way street (allowed direction)',
    },

    resultsCaption: 'Comparison on the same origin and destination. Gap: how much longer the route is than Dijkstra’s (optimal). Work: animation steps (intersections expanded or routes evaluated).',
    colAlgorithm: 'Algorithm',
    colLength: 'Length',
    colGap: 'Gap',
    colWork: 'Work',
    colTime: 'Time',
    noRouteShort: 'no route',
    via: 'Main streets',

    onewayTitle: 'One-way streets: a small directed graph',
    onewayLede: 'On the real streets of this page every street is two-way, because the IBGE data do not record the direction of traffic. This small example shows what changes with one-way streets: each becomes an edge that can only be travelled in the direction of its arrow.',
    onewayNote: 'Illustrative example with fictitious streets; it does not represent any city.',
    onewayRespect: 'Respect one-way streets',
    onewayFigure: 'Grid of 6 by 5 intersections with one-way streets (arrows) and two-way streets (no arrow).',
    onewayCompare: 'Respecting one-way streets: {with}. Ignoring them: {without}.',
    onewayPick: 'Click two intersections to change the origin and the destination.',

    methodTitle: 'How the graph was built',
    methodSteps: [
      { title: 'Block faces (IBGE)', text: 'For every municipality, IBGE publishes the sides of the city blocks that face each street, with the street name. There is no centre line: each street appears as two lines, one on each side.' },
      { title: 'Street corridor', text: 'Each face gets an 8 m band; the bands of opposite sides merge into the street space, drawn on a 2 m grid (the resolution of the CBERS-4A images used later). Large cities are drawn in 8 km tiles with a 400 m overlap.' },
      { title: 'Skeleton', text: 'The corridor is thinned to one pixel, the street centre line. Short spurs (corners, band ends) are removed.' },
      { title: 'Graph', text: 'Intersections and dead ends become nodes; each stretch between them becomes an edge with its length in metres and the name of the nearest face. Parts of the network with at least 20 km of streets are kept.' },
    ],
    citiesTitle: 'Available cities',
    citiesText: 'The ABC Paulista region (Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires and Rio Grande da Serra) is a single graph because its streets continue across municipal borders. In Florianópolis and Brasília the network stays split into parts: the bridges and highways between the island and the mainland, or between the administrative regions, have no block faces, and no link was invented.',
    algorithmsTitle: 'The algorithms',
    algorithmsLede: 'Exact algorithms guarantee the shortest route; heuristic and stochastic ones trade that guarantee for flexibility (several objectives, constraints). Here they all solve the same problem, so the difference shows. V is the number of intersections and E the number of street segments.',
    limitsTitle: 'Limitations',
    limits: [
      'No one-way streets, speeds or turn restrictions: the route is the shortest, not the fastest. One-way data exist in OpenStreetMap (ODbL licence, attribution required), but each OSM way would have to be matched to the centre lines derived from IBGE; the engine already accepts directed edges, as the small example shows.',
      'Wide avenues may become two parallel centre lines; roads without block faces (highways, bridges, avenues along parks) are missing, which splits some cities into parts.',
      'Metaheuristics are stochastic: a fair comparison uses several seeds and many origin-destination pairs (in the study, not in this demo).',
      'São Paulo has about 20 MB of streets: on phones, loading time and memory use can be noticeable.',
    ],
    referencesTitle: 'References',
    sourcesNote: REFERENCES_NOTE,
  },
  de: {
    eyebrow: 'Laufendes Projekt · Georeferenzierung',
    title: 'Straßen brasilianischer Städte, von offenen Daten zur besten Route',
    subtitle: 'Von der Karte Brasiliens bis zur Straße, mit Routing-Algorithmen, denen Sie bei der Arbeit zusehen können',
    intro:
      'Navigieren Sie mit den amtlichen Grenzen des IBGE von Brasilien zum Bundesstaat, zur Gemeinde und zum Stadtviertel. In sechs Gebieten (Londrina, Curitiba, Florianópolis, Brasília, São Paulo und die Region ABC Paulista) wurden die Straßen aus den Blockseiten des Zensus 2022 rekonstruiert und in einen Graphen überführt: Wählen Sie Start und Ziel und verfolgen Sie Schritt für Schritt, wie zehn exakte, heuristische und stochastische Algorithmen die Route aufbauen.',
    honesty:
      'Alles läuft in Ihrem Browser, ohne Server. Entfernungen sind Meter entlang der Straßenachsen; die IBGE-Daten enthalten weder Einbahnstraßen noch Geschwindigkeiten, die Route ist also die kürzeste, nicht die schnellste, und jede Straße gilt als in beide Richtungen befahrbar.',
    back: 'Alle Projekte',
    onThisPage: 'Auf dieser Seite',
    loadError: 'Die Kartendaten konnten nicht geladen werden.',
    retry: 'Erneut versuchen',

    mapTitle: 'Karte',
    mapLede: 'Wählen Sie eine Stadt mit Straßen, suchen Sie einen Bundesstaat, eine Gemeinde oder ein Stadtviertel, oder klicken Sie in die Karte, um hineinzuzoomen.',
    searchLabel: 'Ort suchen',
    searchPlaceholder: 'z. B. Paraná, Curitiba, Gleba Palhano',
    searchHint: 'Mit den Pfeiltasten auswählen, mit Enter anzeigen.',
    kinds: { state: 'Bundesstaat', municipality: 'Gemeinde', bairro: 'Stadtviertel' },
    noMatch: 'Kein Ort gefunden.',
    brazil: 'Brasilien',
    citiesLabel: 'Städte mit Straßen',
    citiesHint: 'Nur diese Gebiete haben Straßen und Routen; auf der Karte erscheinen sie als grün gestrichelte Rahmen. Andere Gemeinden zeigen nur ihre Grenzen.',
    layers: 'Ebenen',
    showBairros: 'Stadtviertel',
    notRouted: 'Diese Gemeinde zeigt nur die Grenzen. Straßen gibt es für: {list}.',
    loadingStreets: 'Straßen von {city} werden geladen ({mb} MB)…',
    streetsLoaded: '{city}: {nodes} Kreuzungen und {km} km Straßen in {parts} Teil(en) des Netzes.',
    streetsError: 'Die Straßen von {city} konnten nicht geladen werden.',

    routeTitle: 'Route',
    pickOrigin: 'Klicken Sie in die Karte (oder nutzen Sie die Kartenmitte), um den Start zu setzen.',
    pickDestination: 'Setzen Sie jetzt das Ziel.',
    ready: 'Start und Ziel sind gesetzt. Wählen Sie einen Algorithmus und starten Sie ihn.',
    nextClick: 'Der nächste Klick in die Karte setzt',
    originOption: 'Start (A)',
    destinationOption: 'Ziel (B)',
    atCentre: 'In der Kartenmitte setzen',
    centreHint: 'Ohne Maus: Verschieben Sie die Karte mit den Pfeiltasten und setzen Sie den Punkt unter dem Fadenkreuz.',
    swap: 'A und B tauschen',
    clear: 'Zurücksetzen',
    samePoint: 'Start und Ziel sind dieselbe Kreuzung: Die Route hat die Länge null.',
    differentParts: 'Start und Ziel liegen in Teilen des Netzes, die die IBGE-Daten nicht verbinden (Brücken und Fernstraßen haben keine Blockseiten). Die Suche wird zeigen, dass es keine Route gibt.',

    algorithm: 'Algorithmus',
    aboutAlgorithm: 'Über diesen Algorithmus',
    labels: { how: 'Funktionsweise', trait: 'Hauptmerkmal', when: 'Einsatz', complexity: 'Komplexität', time: 'Zeit', space: 'Speicher', limits: 'Grenzen' },
    exactBadge: 'Garantiert die kürzeste Route',
    heuristicBadge: 'Garantiert nicht die kürzeste Route',
    algorithms: {
      dijkstra: {
        name: 'Dijkstra', family: 'Exakt',
        how: 'Expandiert die Kreuzungen in aufsteigender Entfernung vom Start; jede verlässt die Front mit ihrer endgültigen Entfernung.',
        trait: 'Der Referenzalgorithmus für kürzeste Wege bei nichtnegativen Längen.',
        when: 'Wenn die optimale Route nötig ist und es keine gute Schätzung der Entfernung zum Ziel gibt.',
        time: 'O((V + E) log V) mit binärer Prioritätswarteschlange', space: 'O(V)',
        limits: 'Er sucht kreisförmig in alle Richtungen: In einer großen Stadt expandiert er weit mehr als A* oder ALT.',
      },
      astar: {
        name: 'A*', family: 'Exakt mit Heuristik',
        how: 'Wie Dijkstra, ordnet die Front aber nach zurückgelegter Strecke plus Luftlinie bis zum Ziel.',
        trait: 'Mit Gewicht 1 überschätzt die Luftlinie nie, die Route bleibt also die kürzeste, während sich die Suche zum Ziel hin streckt.',
        when: 'Punkt-zu-Punkt-Routen auf Karten mit Koordinaten. Mit einem Gewicht über 1 tauscht er Genauigkeit gegen Geschwindigkeit.',
        time: 'O((V + E) log V) im schlechtesten Fall; in der Praxis weit weniger Expansionen', space: 'O(V)',
        limits: 'Mit Gewicht w > 1 kann die Route bis zu w-mal länger sein als die optimale. Die Luftlinie ist eine schwache Schätzung, wenn Flüsse oder Hügel Umwege erzwingen.',
      },
      alt: {
        name: 'ALT (A* mit Landmarken)', family: 'Exakt mit Vorverarbeitung',
        how: 'Vor der ersten Suche berechnet er die Entfernung von 8 im Netz verteilten Landmarken zu allen Kreuzungen; die Dreiecksungleichung liefert dann eine bessere Schätzung als die Luftlinie.',
        trait: 'Eine Schätzung entlang der Straßen statt Luftlinie: Er expandiert weniger als A* und bleibt exakt.',
        when: 'Viele Anfragen im selben Netz, wenn sich eine einmalige Vorverarbeitung lohnt.',
        time: 'Vorverarbeitung O(k (V + E) log V); Anfrage O((V + E) log V) im schlechtesten Fall', space: 'O(k · V) für k Landmarken',
        limits: 'Die Vorverarbeitung dauert beim ersten Lauf in jeder Stadt einige Sekunden und belegt Speicher proportional zur Zahl der Landmarken.',
      },
      bidirectional: {
        name: 'Bidirektionaler Dijkstra', family: 'Exakt',
        how: 'Sucht gleichzeitig vom Start und vom Ziel aus (die Suche vom Ziel folgt den Straßen rückwärts) und hält an, wenn keine Kombination der beiden Fronten die Route noch verbessern kann.',
        trait: 'Zwei kleine Kugeln statt einer großen: Er expandiert meist etwa halb so viele Kreuzungen wie Dijkstra.',
        when: 'Punkt-zu-Punkt-Routen, wenn keine verlässliche Heuristik verfügbar ist.',
        time: 'O((V + E) log V)', space: 'O(V)',
        limits: 'Das Abbruchkriterium ist anspruchsvoller, und bei Einbahnstraßen braucht er die eingehenden Kanten jedes Knotens.',
      },
      bellmanFord: {
        name: 'Bellman-Ford-Moore', family: 'Exakt (Label-Correcting)',
        how: 'Führt eine Warteschlange der Kreuzungen, deren Entfernung sich verbessert hat, und prüft deren Nachbarn erneut, bis sich keine Entfernung mehr verbessert; eine Kreuzung kann mehrmals in die Warteschlange zurückkehren.',
        trait: 'Lässt negative Längen zu und erkennt negative Zyklen, was Dijkstra nicht kann.',
        when: 'Kosten, die negativ sein können (Boni, Gutschriften), oder verteilte Berechnung wie in Routing-Protokollen von Netzwerken.',
        time: 'O(V · E) im schlechtesten Fall', space: 'O(V)',
        limits: 'Er kann nicht beim Erreichen des Ziels anhalten und prüft Kreuzungen mehrfach: Auf Straßen mit positiven Längen ist er viel langsamer als Dijkstra.',
      },
      bfs: {
        name: 'Breitensuche', family: 'Exakt nach Zahl der Abschnitte',
        how: 'Besucht die Kreuzungen schichtweise: zuerst die Nachbarn des Starts, dann deren Nachbarn und so weiter.',
        trait: 'Findet die Route mit den wenigsten Straßenabschnitten, unabhängig von deren Länge.',
        when: 'Ungewichtete Graphen (soziale Netzwerke, Labyrinthe auf Rastern) oder um zu zählen, wie viele Kreuzungen zwei Punkte trennen.',
        time: 'O(V + E)', space: 'O(V)',
        limits: 'Auf Straßen bedeuten wenige Abschnitte nicht wenige Meter: Die Route kann viel länger sein als die von Dijkstra.',
      },
      greedy: {
        name: 'Gierige Bestensuche', family: 'Heuristisch',
        how: 'Expandiert immer die Kreuzung der Front, die in Luftlinie am nächsten am Ziel liegt, ohne die bereits zurückgelegte Strecke zu beachten.',
        trait: 'Sehr schnell, wenn der Weg fast gerade ist.',
        when: 'Wenn eine brauchbare, schnell gefundene Route wichtiger ist als die beste.',
        time: 'O((V + E) log V) im schlechtesten Fall', space: 'O(V)',
        limits: 'Sie garantiert nicht die kürzeste Route; vor einem Hindernis (Fluss, Bahnlinie) kann sie große Umwege machen.',
      },
      ants: {
        name: 'Ameisenkolonie', family: 'Bioinspiriert',
        how: 'Virtuelle Ameisen laufen zufällig, ohne eine Kreuzung zweimal zu besuchen (in Sackgassen kehren sie um), und bevorzugen Straßen mit mehr Pheromon und solche, die zum Ziel zeigen; kurze Routen erhalten mehr Pheromon, das mit der Zeit verdunstet.',
        trait: 'Die kollektive Erfahrung bündelt die Suche über die Iterationen auf gute Straßen.',
        when: 'Probleme mit mehreren Kriterien oder wechselnden Nebenbedingungen (etwa Tourenplanung), für die es keinen effizienten exakten Algorithmus gibt.',
        time: 'O(I · F · (V + E)) im schlechtesten Fall, für I Iterationen und F Ameisen', space: 'O(V + E) (Pheromon je Straße)',
        limits: 'Stochastisch: keine Garantie der kürzesten Route, das Ergebnis hängt von Startwert und Parametern ab, und er ist viel langsamer als die exakten Algorithmen.',
      },
      genetic: {
        name: 'Genetischer Algorithmus', family: 'Evolutionär',
        how: 'Eine Population von Routen entwickelt sich: Die besten werden ausgewählt, an gemeinsamen Kreuzungen rekombiniert, und Abschnitte werden durch Mutation ersetzt.',
        trait: 'Hält mehrere Lösungen zugleich und kombiniert gute Teile verschiedener Routen.',
        when: 'Mehrzieloptimierung (Strecke, Zeit, Risiko) oder Kostenfunktionen ohne Struktur, die ein exakter Algorithmus nutzen könnte.',
        time: 'O(G · P · (V + E)) im schlechtesten Fall, für G Generationen und Population P', space: 'O(P · L) für Routen mit L Kreuzungen',
        limits: 'Stochastisch und parameterempfindlich; er kann früh bei einer schlechten Route konvergieren; keine Optimalitätsgarantie.',
      },
      annealing: {
        name: 'Simulierte Abkühlung', family: 'Metaheuristik',
        how: 'Ersetzt einen Abschnitt der Route durch einen anderen und behält die Änderung, wenn die Route kürzer wird; wird sie länger, behält sie sie manchmal, mit einer Wahrscheinlichkeit, die mit der „Temperatur“ sinkt.',
        trait: 'Das Akzeptieren schlechterer Routen zu Beginn hilft, lokalen Minima zu entkommen.',
        when: 'Große kombinatorische Probleme, bei denen eine gute Lösung genügt und die Laufzeit leicht steuerbar sein soll.',
        time: 'O(N · (V + E)) im schlechtesten Fall, für N Iterationen', space: 'O(L) für die aktuelle und die beste Route',
        limits: 'Das Ergebnis hängt vom Abkühlungsplan und vom Startwert ab; keine Optimalitätsgarantie in endlicher Zeit.',
      },
    },
    params: {
      weight: { label: 'Gewicht der Heuristik', hint: '1 = exakt; größer = schneller, Route evtl. länger.' },
      ants: { label: 'Ameisen', hint: 'Mehr Ameisen erkunden mehr und brauchen länger.' },
      iterations: { label: 'Iterationen', hint: 'Mehr Iterationen verfeinern die Route.' },
      alpha: { label: 'α (Pheromon)', hint: 'Gewicht der kollektiven Erfahrung.' },
      beta: { label: 'β (Richtung)', hint: 'Gewicht der Richtung zum Ziel.' },
      evaporation: { label: 'Verdunstung', hint: 'Höher: Alte Spuren werden schneller vergessen.' },
      population: { label: 'Population', hint: 'Mehr Routen pro Generation.' },
      generations: { label: 'Generationen', hint: 'Mehr Generationen verfeinern die Route.' },
      mutationRate: { label: 'Mutationsrate', hint: 'Mehr Mutation, mehr Vielfalt.' },
      temperature: { label: 'Anfangstemperatur (m)', hint: 'Anfangs mit Wahrscheinlichkeit 1/e akzeptierter Umweg.' },
      cooling: { label: 'Abkühlung', hint: 'Näher an 1 = kühlt langsamer ab.' },
      saIterations: { label: 'Iterationen', hint: 'Jede Iteration bewertet eine veränderte Route.' },
      seed: { label: 'Startwert (Seed)', hint: 'Derselbe Startwert wiederholt das Ergebnis.' },
    },

    run: 'Berechnen und animieren',
    runAll: 'Alle vergleichen',
    computing: 'Wird berechnet…',
    playback: 'Steuerung der Animation',
    play: 'Abspielen',
    pause: 'Anhalten',
    resume: 'Fortsetzen',
    replay: 'Noch einmal',
    step: 'Ein Schritt',
    restart: 'Neu starten',
    skipToEnd: 'Zum Ende',
    speed: 'Geschwindigkeit',
    speedValue: '{n} Schritte/s',
    progress: 'Schritt {step} von {total}',
    visited: 'Besucht',
    frontier: 'In der Front',
    evaluated: 'Geprüfte Straßen',
    labelSearch: 'Entfernung der zuletzt expandierten Kreuzung',
    labelBest: 'Beste Route bisher',
    routeFound: 'Route gefunden: {km}, in {steps} Schritten; berechnet in {ms}.',
    noRoute: 'In diesem Netz gibt es keine Route zwischen Start und Ziel.',
    runError: 'Die Berechnung ist fehlgeschlagen. Bitte versuchen Sie es erneut.',

    legendTitle: 'Legende',
    legend: {
      street: 'Noch nicht geprüfte Straße',
      evaluated: 'Von der Suche geprüfte Straße',
      frontier: 'Kreuzung in der Front (wartet)',
      visited: 'Vom Start aus besuchte Kreuzung',
      backward: 'Vom Ziel aus besucht (bidirektional)',
      candidate: 'Gerade bewertete Route (Metaheuristiken)',
      best: 'Beste Route bisher (Metaheuristiken)',
      route: 'Endgültige Route',
      link: 'Geschätzte Verbindung (keine IBGE-Blockseite)',
      origin: 'Start (A)',
      destination: 'Ziel (B)',
      oneway: 'Einbahnstraße (erlaubte Richtung)',
    },

    resultsCaption: 'Vergleich mit demselben Start und Ziel. Abweichung: wie viel länger die Route ist als die von Dijkstra (optimal). Aufwand: Schritte der Animation (expandierte Kreuzungen oder bewertete Routen).',
    colAlgorithm: 'Algorithmus',
    colLength: 'Länge',
    colGap: 'Abweichung',
    colWork: 'Aufwand',
    colTime: 'Zeit',
    noRouteShort: 'keine Route',
    via: 'Hauptstraßen',

    onewayTitle: 'Einbahnstraßen: ein kleiner gerichteter Graph',
    onewayLede: 'Auf den echten Straßen dieser Seite sind alle Straßen in beide Richtungen befahrbar, weil die IBGE-Daten die Fahrtrichtung nicht erfassen. Dieses kleine Beispiel zeigt, was sich mit Einbahnstraßen ändert: Jede wird zu einer Kante, die nur in Pfeilrichtung befahren werden darf.',
    onewayNote: 'Anschauliches Beispiel mit erfundenen Straßen; es stellt keine Stadt dar.',
    onewayRespect: 'Einbahnstraßen beachten',
    onewayFigure: 'Raster aus 6 mal 5 Kreuzungen mit Einbahnstraßen (Pfeile) und Straßen in beide Richtungen (ohne Pfeil).',
    onewayCompare: 'Mit Einbahnstraßen: {with}. Ohne: {without}.',
    onewayPick: 'Klicken Sie auf zwei Kreuzungen, um Start und Ziel zu ändern.',

    methodTitle: 'Wie der Graph entstand',
    methodSteps: [
      { title: 'Blockseiten (IBGE)', text: 'Für jede Gemeinde veröffentlicht das IBGE die Seiten der Häuserblöcke, die einer Straße zugewandt sind, mit dem Straßennamen. Eine Straßenachse gibt es nicht: Jede Straße erscheint als zwei Linien, eine auf jeder Seite.' },
      { title: 'Straßenkorridor', text: 'Jede Blockseite erhält ein 8 m breites Band; die Bänder gegenüberliegender Seiten verschmelzen zum Straßenraum, gezeichnet auf einem 2-m-Raster (der Auflösung der später verwendeten CBERS-4A-Bilder). Große Städte werden in Kacheln von 8 km mit 400 m Überlappung gezeichnet.' },
      { title: 'Skelett', text: 'Der Korridor wird auf ein Pixel ausgedünnt, die Straßenachse. Kurze Ausläufer (Ecken, Bandenden) werden entfernt.' },
      { title: 'Graph', text: 'Kreuzungen und Sackgassen werden zu Knoten; jeder Abschnitt dazwischen wird zu einer Kante mit ihrer Länge in Metern und dem Namen der nächsten Blockseite. Teile des Netzes mit mindestens 20 km Straßen bleiben erhalten.' },
    ],
    citiesTitle: 'Verfügbare Städte',
    citiesText: 'Die Region ABC Paulista (Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires und Rio Grande da Serra) ist ein einziger Graph, weil ihre Straßen über die Gemeindegrenzen hinweg weiterlaufen. In Florianópolis und Brasília bleibt das Netz in Teile getrennt: Die Brücken und Fernstraßen zwischen Insel und Festland bzw. zwischen den Verwaltungsregionen haben keine Blockseiten, und es wurde keine Verbindung erfunden.',
    algorithmsTitle: 'Die Algorithmen',
    algorithmsLede: 'Exakte Algorithmen garantieren die kürzeste Route; heuristische und stochastische tauschen diese Garantie gegen Flexibilität (mehrere Ziele, Nebenbedingungen). Hier lösen alle dasselbe Problem, damit der Unterschied sichtbar wird. V ist die Zahl der Kreuzungen, E die Zahl der Straßenabschnitte.',
    limitsTitle: 'Grenzen',
    limits: [
      'Keine Einbahnstraßen, Geschwindigkeiten oder Abbiegeverbote: Die Route ist die kürzeste, nicht die schnellste. Einbahndaten gibt es in OpenStreetMap (Lizenz ODbL, mit Namensnennung), aber jeder OSM-Weg müsste den aus IBGE-Daten abgeleiteten Achsen zugeordnet werden; die Engine unterstützt gerichtete Kanten bereits, wie das kleine Beispiel zeigt.',
      'Breite Alleen können zu zwei parallelen Achsen werden; Straßen ohne Blockseiten (Fernstraßen, Brücken, Alleen an Parks) fehlen, wodurch manche Städte in Teile zerfallen.',
      'Metaheuristiken sind stochastisch: Ein fairer Vergleich nutzt mehrere Startwerte und viele Start-Ziel-Paare (in der Studie, nicht in dieser Demo).',
      'São Paulo umfasst etwa 20 MB Straßendaten: Auf Smartphones können Ladezeit und Speicherbedarf spürbar sein.',
    ],
    referencesTitle: 'Literatur',
    sourcesNote: REFERENCES_NOTE,
  },
};

/** Works cited on the page (same in every language). */
export const STREET_REFERENCES: string[] = [
  'Bellman, R. (1958). On a routing problem. Quarterly of Applied Mathematics, 16(1), 87–90.',
  'Dijkstra, E. W. (1959). A note on two problems in connexion with graphs. Numerische Mathematik, 1, 269–271.',
  'Moore, E. F. (1959). The shortest path through a maze. Proc. International Symposium on the Theory of Switching, Part II, 285–292. Harvard University Press.',
  'Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). A formal basis for the heuristic determination of minimum cost paths. IEEE Transactions on Systems Science and Cybernetics, 4(2), 100–107.',
  'Pohl, I. (1970). Heuristic search viewed as path finding in a graph. Artificial Intelligence, 1(3–4), 193–204.',
  'Holland, J. H. (1975). Adaptation in Natural and Artificial Systems. University of Michigan Press.',
  'Kirkpatrick, S., Gelatt, C. D., & Vecchi, M. P. (1983). Optimization by simulated annealing. Science, 220(4598), 671–680.',
  'Zhang, T. Y., & Suen, C. Y. (1984). A fast parallel algorithm for thinning digital patterns. Communications of the ACM, 27(3), 236–239.',
  'Dorigo, M., Maniezzo, V., & Colorni, A. (1996). Ant system: optimization by a colony of cooperating agents. IEEE Transactions on Systems, Man, and Cybernetics, Part B, 26(1), 29–41.',
  'Goldberg, A. V., & Harrelson, C. (2005). Computing the shortest path: A* search meets graph theory. Proc. 16th ACM-SIAM Symposium on Discrete Algorithms (SODA), 156–165.',
  'Okabe, M., & Ito, K. (2008). Color Universal Design (CUD): How to make figures and presentations that are friendly to colorblind people. J*FLY (jfly.uni-koeln.de).',
  'Van Etten, A., Lindenbaum, D., & Bacastow, T. M. (2018). SpaceNet: A remote sensing dataset and challenge series. arXiv:1807.01232 (APLS metric).',
];
