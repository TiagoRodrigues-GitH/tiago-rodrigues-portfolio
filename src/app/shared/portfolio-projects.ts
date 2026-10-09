import { Locale } from '../services/i18n.service';
import { ProjectFigureKind } from './project-figure/project-figure.component';
import { BlueprintKind } from './blueprint-figure/blueprint-parts';

export type ProjectStatus = 'done' | 'progress' | 'soon';

interface ProjectImageSource {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  /** Diagrams and screen flows: shown whole (letterboxed), never cropped. */
  contain?: boolean;
  /** Animated inline schematic instead of a bitmap (src unused). */
  figure?: ProjectFigureKind;
  /** Bitmap drawing with numbered, interactive parts. */
  blueprint?: BlueprintKind;
}

interface ProjectText {
  title: string;
  /** Second line of the title (what the project consists of), when the title alone is broad. */
  subtitle?: string;
  summary: string;
  details: string;
  role: string;
  stack: string[];
}

interface ProjectSource {
  id: number;
  status: ProjectStatus;
  /** Route of the project's demo page, if it has one. */
  demo?: string;
  image: ProjectImageSource;
  gallery: ProjectImageSource[];
  text: Record<Locale, ProjectText>;
}

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  contain: boolean;
  figure: ProjectFigureKind | null;
  blueprint: BlueprintKind | null;
}

export interface PortfolioProject extends ProjectText {
  id: number;
  status: ProjectStatus;
  demo: string | null;
  image: ProjectImage;
  /** Every image of the project, cover first — used by the lightbox. */
  gallery: ProjectImage[];
}

// Shown in this order (projects page and home): the current project first.
const PROJECTS: ProjectSource[] = [
  {
    id: 1,
    status: 'progress',
    demo: '/projects/compact-llm',
    image: {
      src: '',
      width: 640,
      height: 480,
      figure: 'llm',
      alt: {
        pt: 'Esquema animado: documentos oficiais e reclamações de defeitos alimentam um modelo de linguagem compacto ajustado com LoRA, que produz uma resposta com a fonte citada.',
        en: 'Animated schematic: official documents and defect complaints feed a compact language model fine-tuned with LoRA, which produces an answer that cites its source.',
        de: 'Animiertes Schema: Offizielle Dokumente und Mängelbeschwerden speisen ein kompaktes, mit LoRA feinabgestimmtes Sprachmodell, das eine Antwort mit Quellenangabe erzeugt.',
      },
    },
    gallery: [],
    text: {
      pt: {
        title: 'LLMs compactos para a indústria automotiva',
        subtitle: 'Triagem de reclamações de defeitos e assistente de patentes',
        summary: 'Modelos de linguagem pequenos, ajustados com LoRA, que fazem a triagem de reclamações de defeitos veiculares e orientam sobre patentes com base em documentos do INPI.',
        details: 'Dois estudos com modelos de até 4 bilhões de parâmetros, treinados em uma GPU de 6 GB: um benchmark de classificação de reclamações de defeitos registradas na NHTSA e um assistente que responde sobre patentes no Brasil a partir de trechos oficiais recuperados (RAG) e cita a fonte. Cada modelo é comparado, antes e depois do ajuste, com referências sem LLM; a demonstração mostra as respostas reais dos experimentos.',
        role: 'Pesquisa e engenharia de IA',
        stack: ['Python', 'PyTorch', 'LoRA / QLoRA', 'RAG (BM25)', 'Hugging Face'],
      },
      en: {
        title: 'Compact LLMs for the automotive industry',
        subtitle: 'Defect complaint triage and patent assistant',
        summary: 'Small language models, fine-tuned with LoRA, that triage vehicle defect complaints and give guidance on patents from INPI documents.',
        details: 'Two studies with models of up to 4 billion parameters, trained on a 6 GB GPU: a benchmark for classifying defect complaints filed with NHTSA, and an assistant that answers questions on patents in Brazil from retrieved official passages (RAG) and cites the source. Each model is compared, before and after fine-tuning, with no-LLM baselines; the demo shows the real answers from the experiments.',
        role: 'AI research and engineering',
        stack: ['Python', 'PyTorch', 'LoRA / QLoRA', 'RAG (BM25)', 'Hugging Face'],
      },
      de: {
        title: 'Kompakte LLMs für die Automobilindustrie',
        subtitle: 'Triage von Mängelbeschwerden und Patentassistent',
        summary: 'Kleine, mit LoRA feinabgestimmte Sprachmodelle, die Fahrzeugmängel-Beschwerden klassifizieren und auf Basis von INPI-Dokumenten zu Patenten beraten.',
        details: 'Zwei Studien mit Modellen bis 4 Milliarden Parameter, trainiert auf einer 6-GB-GPU: ein Benchmark zur Klassifikation von Mängelbeschwerden bei der NHTSA und ein Assistent, der Fragen zu Patenten in Brasilien anhand abgerufener offizieller Textstellen (RAG) beantwortet und die Quelle zitiert. Jedes Modell wird vor und nach dem Fine-Tuning mit Referenzen ohne LLM verglichen; die Demo zeigt die echten Antworten aus den Experimenten.',
        role: 'KI-Forschung und -Entwicklung',
        stack: ['Python', 'PyTorch', 'LoRA / QLoRA', 'RAG (BM25)', 'Hugging Face'],
      },
    },
  },
  {
    id: 4,
    status: 'progress',
    demo: '/projects/street-routing',
    image: {
      src: 'assets/images/street-routing-cover.svg',
      width: 640,
      height: 480,
      contain: true,
      alt: {
        pt: 'Grade de ruas de uma cidade com uma área explorada em laranja ao redor da origem e a rota mais curta em azul até o destino.',
        en: 'A city street grid with the area explored around the origin in orange and the shortest route to the destination in blue.',
        de: 'Ein städtisches Straßenraster mit dem um den Start erkundeten Bereich in Orange und der kürzesten Route zum Ziel in Blau.',
      },
    },
    gallery: [],
    text: {
      pt: {
        title: 'Ruas de cidades brasileiras e algoritmos de rota',
        subtitle: 'Georreferenciamento com dados públicos do IBGE e do INPE',
        summary: 'Do mapa do Brasil à rua: grafos de ruas de Londrina, Curitiba, Florianópolis, Brasília, São Paulo e do ABC Paulista reconstruídos das faces de quadra do Censo 2022, com dez algoritmos de rota animados passo a passo no navegador.',
        details: 'As faces de quadra do IBGE viram corredores de rua, o corredor é afinado até o eixo e o eixo vira um grafo com nomes de rua; cidades grandes são processadas em blocos. Sobre ele rodam Dijkstra, A*, ALT, busca bidirecional, Bellman-Ford, busca em largura, busca gulosa, colônia de formigas, algoritmo genético e recozimento simulado, calculados em um Web Worker e reproduzidos com pausa, passo a passo e controle de velocidade. Próxima etapa: detectar as ruas em imagens do satélite CBERS-4A (INPE) com segmentação semântica e comparar o grafo extraído com o do IBGE (métrica APLS).',
        role: 'Pesquisa, dados geoespaciais e desenvolvimento web',
        stack: ['Python', 'GeoPandas', 'NetworkX', 'scikit-image', 'TypeScript', 'MapLibre GL'],
      },
      en: {
        title: 'Streets of Brazilian cities and routing algorithms',
        subtitle: 'Georeferencing with public data from IBGE and INPE',
        summary: 'From the map of Brazil down to a street: street graphs of Londrina, Curitiba, Florianópolis, Brasília, São Paulo and the ABC Paulista region rebuilt from 2022 Census block faces, with ten routing algorithms animated step by step in the browser.',
        details: 'IBGE block faces become street corridors, the corridors are thinned to centre lines and the centre lines become a graph with street names; large cities are processed in tiles. Dijkstra, A*, ALT, bidirectional search, Bellman-Ford, breadth-first search, greedy search, ant colony optimisation, a genetic algorithm and simulated annealing run on it, computed in a Web Worker and replayed with pause, single steps and speed control. Next step: detect the streets in CBERS-4A satellite images (INPE) with semantic segmentation and compare the extracted graph with IBGE’s (APLS metric).',
        role: 'Research, geospatial data and web development',
        stack: ['Python', 'GeoPandas', 'NetworkX', 'scikit-image', 'TypeScript', 'MapLibre GL'],
      },
      de: {
        title: 'Straßen brasilianischer Städte und Routing-Algorithmen',
        subtitle: 'Georeferenzierung mit offenen Daten von IBGE und INPE',
        summary: 'Von der Karte Brasiliens bis zur Straße: Straßengraphen von Londrina, Curitiba, Florianópolis, Brasília, São Paulo und der Region ABC Paulista, rekonstruiert aus den Blockseiten des Zensus 2022, mit zehn Routing-Algorithmen, Schritt für Schritt im Browser animiert.',
        details: 'Die Blockseiten des IBGE werden zu Straßenkorridoren, die Korridore zu Achsen ausgedünnt und die Achsen zu einem Graphen mit Straßennamen; große Städte werden in Kacheln verarbeitet. Darauf laufen Dijkstra, A*, ALT, bidirektionale Suche, Bellman-Ford, Breitensuche, gierige Suche, Ameisenkolonie, ein genetischer Algorithmus und simulierte Abkühlung, berechnet in einem Web Worker und mit Pause, Einzelschritt und Geschwindigkeitsregler abgespielt. Nächster Schritt: die Straßen in CBERS-4A-Satellitenbildern (INPE) mit semantischer Segmentierung erkennen und den extrahierten Graphen mit dem des IBGE vergleichen (APLS-Metrik).',
        role: 'Forschung, Geodaten und Webentwicklung',
        stack: ['Python', 'GeoPandas', 'NetworkX', 'scikit-image', 'TypeScript', 'MapLibre GL'],
      },
    },
  },
  {
    id: 2,
    status: 'done',
    image: {
      src: '',
      width: 640,
      height: 480,
      figure: 'fleet',
      alt: {
        pt: 'Esquema animado: um carro de passeio e um caminhão enviam seus dados para uma ficha de cadastro com placa Mercosul, que é gravada em um banco de dados.',
        en: 'Animated schematic: a passenger car and a truck send their data to a registration form with a Mercosur licence plate, which is stored in a database.',
        de: 'Animiertes Schema: Ein Pkw und ein Lkw übermitteln ihre Daten an ein Erfassungsformular mit Mercosur-Kennzeichen, das in einer Datenbank gespeichert wird.',
      },
    },
    gallery: [
      {
        src: 'assets/images/blueprints/vehicle_management_01.webp',
        width: 720,
        height: 651,
        contain: true,
        blueprint: 'fleetUml',
        alt: {
          pt: 'Diagrama de classes UML: classe abstrata Veiculo, especializações Passeio e Carga, interface Calcular, classe Motor e exceções personalizadas.',
          en: 'UML class diagram: abstract Veiculo (vehicle) class, Passeio (passenger) and Carga (cargo) subclasses, Calcular interface, Motor class and custom exceptions.',
          de: 'UML-Klassendiagramm: abstrakte Klasse Veiculo (Fahrzeug), Unterklassen Passeio (Pkw) und Carga (Lkw), Schnittstelle Calcular, Klasse Motor und eigene Ausnahmen.',
        },
      },
    ],
    text: {
      pt: {
        title: 'Sistema de gestão de veículos',
        summary: 'Aplicação desktop em Java para cadastrar, consultar e gerenciar veículos de passeio e de carga.',
        details: 'Projeto acadêmico criado para aplicar os pilares da programação orientada a objetos — classes abstratas, herança, polimorfismo, encapsulamento, interfaces e tratamento de exceções. A interface em Java Swing, orientada a eventos, permite cadastrar veículos, consultá-los ou excluí-los pela placa e listar a frota completa.',
        role: 'Modelagem orientada a objetos e interface desktop',
        stack: ['Java', 'Java Swing', 'POO', 'UML'],
      },
      en: {
        title: 'Vehicle management system',
        summary: 'Java desktop application to register, look up and manage passenger and cargo vehicles.',
        details: 'Academic project built to apply the pillars of object-oriented programming — abstract classes, inheritance, polymorphism, encapsulation, interfaces and exception handling. The event-driven Java Swing interface lets users register vehicles, look them up or delete them by licence plate, and list the entire fleet.',
        role: 'Object-oriented modelling and desktop UI',
        stack: ['Java', 'Java Swing', 'OOP', 'UML'],
      },
      de: {
        title: 'Fahrzeugverwaltung',
        summary: 'Java-Desktopanwendung zum Erfassen, Suchen und Verwalten von Personen- und Lastkraftwagen.',
        details: 'Studienprojekt zur Anwendung der Grundprinzipien der objektorientierten Programmierung – abstrakte Klassen, Vererbung, Polymorphie, Kapselung, Schnittstellen und Ausnahmebehandlung. Über die ereignisgesteuerte Java-Swing-Oberfläche lassen sich Fahrzeuge erfassen, per Kennzeichen suchen oder löschen und der gesamte Bestand auflisten.',
        role: 'Objektorientierte Modellierung und Desktop-Oberfläche',
        stack: ['Java', 'Java Swing', 'OOP', 'UML'],
      },
    },
  },
  {
    id: 3,
    status: 'soon',
    image: {
      src: 'assets/images/blueprints/patent-1900.webp',
      width: 1400,
      height: 995,
      blueprint: 'patent1900',
      alt: {
        pt: 'Desenho de patente de 1900 de um automóvel com rodas raiadas, em estilo blueprint.',
        en: 'Patent drawing of an automobile with spoked wheels from 1900, in blueprint style.',
        de: 'Patentzeichnung eines Automobils mit Speichenrädern aus dem Jahr 1900 im Blueprint-Stil.',
      },
    },
    gallery: [],
    text: {
      pt: {
        title: 'Web app para colecionadores de carros',
        summary: 'Uma aplicação web para catalogar coleções de veículos clássicos e acompanhar a história de cada um.',
        details: 'Espaço reservado para um projeto em planejamento: ficha técnica de cada veículo, histórico de restauração e manutenção, documentação, galeria de fotos e busca por época, categoria e estado de conservação — tudo pensado para colecionadores e clubes.',
        role: 'Desenvolvimento full stack',
        stack: ['Angular', 'Java · Spring Boot', 'MySQL', 'API REST'],
      },
      en: {
        title: 'Web app for car collectors',
        summary: 'A web application for cataloguing classic vehicle collections and tracking the history of each car.',
        details: 'Reserved for a project in planning: a spec sheet for every vehicle, restoration and maintenance history, documents, a photo gallery and search by era, category and condition — designed for collectors and clubs.',
        role: 'Full-stack development',
        stack: ['Angular', 'Java · Spring Boot', 'MySQL', 'REST API'],
      },
      de: {
        title: 'Web-App für Autosammler',
        summary: 'Eine Webanwendung, um Sammlungen klassischer Fahrzeuge zu katalogisieren und die Geschichte jedes Fahrzeugs zu dokumentieren.',
        details: 'Platzhalter für ein geplantes Projekt: Datenblatt für jedes Fahrzeug, Restaurierungs- und Wartungshistorie, Dokumente, Fotogalerie und Suche nach Epoche, Kategorie und Zustand – gedacht für Sammlerinnen, Sammler und Clubs.',
        role: 'Full-Stack-Entwicklung',
        stack: ['Angular', 'Java · Spring Boot', 'MySQL', 'REST-API'],
      },
    },
  },
];

function localizeImage(image: ProjectImageSource, locale: Locale): ProjectImage {
  return { src: image.src, width: image.width, height: image.height, alt: image.alt[locale], contain: !!image.contain,
           figure: image.figure ?? null, blueprint: image.blueprint ?? null };
}

export function getPortfolioProjects(locale: Locale): PortfolioProject[] {
  return PROJECTS.map((project) => {
    const image = localizeImage(project.image, locale);
    return {
      id: project.id,
      status: project.status,
      demo: project.demo ?? null,
      ...project.text[locale],
      image,
      // An animated cover is shown on its own; the gallery (zoomable images) holds bitmaps only.
      gallery: [...(image.figure || image.blueprint ? [] : [image]), ...project.gallery.map((item) => localizeImage(item, locale))],
    };
  });
}
