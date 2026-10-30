import { Locale } from '../services/i18n.service';
import { ProjectFigureKind } from './project-figure/project-figure.component';
import { BlueprintKind } from './blueprint-figure/blueprint-parts';
import { VideoSlot } from '../content/videos';

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
  /** Video loop shown in place of the still (per language, see content/videos). */
  video: VideoSlot;
}

interface ProjectText {
  title: string;
  /** Second line of the title (what the project consists of), when the title alone is broad. */
  subtitle?: string;
  summary: string;
  details: string;
  role: string;
  stack: string[];
  objectives: string;
  results: string;
  limitations: string;
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
  video: VideoSlot;
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
      video: 'llm',
      alt: {
        pt: 'Esquema animado: documentos oficiais e reclamações de defeitos alimentam um modelo de linguagem compacto ajustado com LoRA, que produz uma resposta com a fonte citada.',
        en: 'Animated schematic: official documents and defect complaints feed a compact language model fine-tuned with LoRA, which produces an answer that cites its source.',
        de: 'Animiertes Schema: Offizielle Dokumente und Mängelbeschwerden speisen ein kompaktes, mit LoRA feinabgestimmtes Sprachmodell, das eine Antwort mit Quellenangabe erzeugt.',
      },
    },
    gallery: [],
    text: {
      pt: {
        title: 'LLMs compactos com ajuste fino (LoRA)',
        subtitle: 'Triagem de reclamações de defeitos e assistente de patentes',
        summary: 'Modelos de linguagem pequenos, ajustados com LoRA, que fazem a triagem de reclamações de defeitos veiculares e orientam sobre patentes com base em documentos do INPI.',
        details: 'Dois estudos com modelos de até 4 bilhões de parâmetros, treinados em uma GPU de 6 GB: um benchmark de classificação de reclamações de defeitos registradas na NHTSA e um assistente que responde sobre patentes no Brasil a partir de trechos oficiais recuperados (RAG) e cita a fonte. Cada modelo é comparado, antes e depois do ajuste, com referências sem LLM; a demonstração mostra as respostas reais dos experimentos.',
        role: 'Pesquisa e engenharia de IA',
        stack: ['Python', 'PyTorch', 'LoRA / QLoRA', 'RAG (BM25)', 'Hugging Face'],
        objectives: 'Avaliar se modelos de linguagem pequenos (até 4 bilhões de parâmetros), ajustados com LoRA em uma GPU de 6 GB, resolvem tarefas reais de triagem e de consulta com fonte citada.',
        results: 'Benchmark NHTSA concluído com quatro modelos (zero-shot e LoRA) e referências sem LLM; o assistente de patentes responde com o trecho oficial citado. Resultados reais na demonstração.',
        limitations: 'ROUGE-L e F1 não medem a correção jurídica; reclamações antigas usam outra nomenclatura (deslocamento temporal); hardware limitado a 6 GB de GPU.',
      },
      en: {
        title: 'Compact fine-tuned LLMs (LoRA)',
        subtitle: 'Defect complaint triage and patent assistant',
        summary: 'Small language models, fine-tuned with LoRA, that triage vehicle defect complaints and give guidance on patents from INPI documents.',
        details: 'Two studies with models of up to 4 billion parameters, trained on a 6 GB GPU: a benchmark for classifying defect complaints filed with NHTSA, and an assistant that answers questions on patents in Brazil from retrieved official passages (RAG) and cites the source. Each model is compared, before and after fine-tuning, with no-LLM baselines; the demo shows the real answers from the experiments.',
        role: 'AI research and engineering',
        stack: ['Python', 'PyTorch', 'LoRA / QLoRA', 'RAG (BM25)', 'Hugging Face'],
        objectives: 'Assess whether small language models (up to 4 billion parameters), fine-tuned with LoRA on a 6 GB GPU, can handle real triage and source-citing question answering.',
        results: 'NHTSA benchmark completed with four models (zero-shot and LoRA) and no-LLM baselines; the patent assistant answers with the official passage cited. Real results in the demo.',
        limitations: 'ROUGE-L and F1 do not measure legal correctness; older complaints use a different taxonomy (temporal shift); hardware limited to a 6 GB GPU.',
      },
      de: {
        title: 'Kompakte, feinabgestimmte LLMs (LoRA)',
        subtitle: 'Triage von Mängelbeschwerden und Patentassistent',
        summary: 'Kleine, mit LoRA feinabgestimmte Sprachmodelle, die Fahrzeugmängel-Beschwerden klassifizieren und auf Basis von INPI-Dokumenten zu Patenten beraten.',
        details: 'Zwei Studien mit Modellen bis 4 Milliarden Parameter, trainiert auf einer 6-GB-GPU: ein Benchmark zur Klassifikation von Mängelbeschwerden bei der NHTSA und ein Assistent, der Fragen zu Patenten in Brasilien anhand abgerufener offizieller Textstellen (RAG) beantwortet und die Quelle zitiert. Jedes Modell wird vor und nach dem Fine-Tuning mit Referenzen ohne LLM verglichen; die Demo zeigt die echten Antworten aus den Experimenten.',
        role: 'KI-Forschung und -Entwicklung',
        stack: ['Python', 'PyTorch', 'LoRA / QLoRA', 'RAG (BM25)', 'Hugging Face'],
        objectives: 'Prüfen, ob kleine Sprachmodelle (bis 4 Milliarden Parameter), mit LoRA auf einer 6-GB-GPU feinabgestimmt, reale Triage- und Frage-Antwort-Aufgaben mit Quellenangabe lösen.',
        results: 'NHTSA-Benchmark mit vier Modellen (Zero-Shot und LoRA) und Referenzen ohne LLM abgeschlossen; der Patentassistent antwortet mit zitierter Originalstelle. Echte Ergebnisse in der Demo.',
        limitations: 'ROUGE-L und F1 messen keine juristische Korrektheit; ältere Beschwerden nutzen eine andere Taxonomie (zeitliche Verschiebung); Hardware auf 6 GB GPU begrenzt.',
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
      video: 'fleet',
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
        video: 'fleet-code',
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
        objectives: 'Aplicar os pilares da orientação a objetos — classes abstratas, herança, polimorfismo, encapsulamento, interfaces e exceções — em uma aplicação completa.',
        results: 'Aplicação desktop funcional: cadastro, consulta e exclusão por placa e listagem da frota, com modelo documentado em UML.',
        limitations: 'Escopo acadêmico; interface desktop em Java Swing, sem versão web.',
      },
      en: {
        title: 'Vehicle management system',
        summary: 'Java desktop application to register, look up and manage passenger and cargo vehicles.',
        details: 'Academic project built to apply the pillars of object-oriented programming — abstract classes, inheritance, polymorphism, encapsulation, interfaces and exception handling. The event-driven Java Swing interface lets users register vehicles, look them up or delete them by license plate, and list the entire fleet.',
        role: 'Object-oriented modeling and desktop UI',
        stack: ['Java', 'Java Swing', 'OOP', 'UML'],
        objectives: 'Apply the pillars of object orientation — abstract classes, inheritance, polymorphism, encapsulation, interfaces and exceptions — in a complete application.',
        results: 'Working desktop application: register, look up and delete by plate and list the fleet, with the model documented in UML.',
        limitations: 'Academic scope; desktop interface in Java Swing, no web version.',
      },
      de: {
        title: 'Fahrzeugverwaltung',
        summary: 'Java-Desktopanwendung zum Erfassen, Suchen und Verwalten von Personen- und Lastkraftwagen.',
        details: 'Studienprojekt zur Anwendung der Grundprinzipien der objektorientierten Programmierung – abstrakte Klassen, Vererbung, Polymorphie, Kapselung, Schnittstellen und Ausnahmebehandlung. Über die ereignisgesteuerte Java-Swing-Oberfläche lassen sich Fahrzeuge erfassen, per Kennzeichen suchen oder löschen und der gesamte Bestand auflisten.',
        role: 'Objektorientierte Modellierung und Desktop-Oberfläche',
        stack: ['Java', 'Java Swing', 'OOP', 'UML'],
        objectives: 'Die Grundprinzipien der Objektorientierung – abstrakte Klassen, Vererbung, Polymorphie, Kapselung, Schnittstellen und Ausnahmen – in einer vollständigen Anwendung umsetzen.',
        results: 'Funktionierende Desktopanwendung: Erfassen, Suchen und Löschen per Kennzeichen sowie Bestandsliste, mit in UML dokumentiertem Modell.',
        limitations: 'Studienumfang; Desktop-Oberfläche in Java Swing, keine Webversion.',
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
      video: 'collector',
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
        objectives: 'Construir uma aplicação web full stack com API REST, banco relacional e interface Angular para catalogar coleções de veículos.',
        results: 'Em planejamento: ainda sem resultados.',
        limitations: 'Projeto em fase de concepção; escopo e arquitetura podem mudar.',
      },
      en: {
        title: 'Web app for car collectors',
        summary: 'A web application for cataloging classic vehicle collections and tracking the history of each car.',
        details: 'Reserved for a project in planning: a spec sheet for every vehicle, restoration and maintenance history, documents, a photo gallery and search by era, category and condition — designed for collectors and clubs.',
        role: 'Full-stack development',
        stack: ['Angular', 'Java · Spring Boot', 'MySQL', 'REST API'],
        objectives: 'Build a full-stack web application with a REST API, a relational database and an Angular interface to catalog vehicle collections.',
        results: 'In planning: no results yet.',
        limitations: 'Project at the concept stage; scope and architecture may change.',
      },
      de: {
        title: 'Web-App für Autosammler',
        summary: 'Eine Webanwendung, um Sammlungen klassischer Fahrzeuge zu katalogisieren und die Geschichte jedes Fahrzeugs zu dokumentieren.',
        details: 'Platzhalter für ein geplantes Projekt: Datenblatt für jedes Fahrzeug, Restaurierungs- und Wartungshistorie, Dokumente, Fotogalerie und Suche nach Epoche, Kategorie und Zustand – gedacht für Sammlerinnen, Sammler und Clubs.',
        role: 'Full-Stack-Entwicklung',
        stack: ['Angular', 'Java · Spring Boot', 'MySQL', 'REST-API'],
        objectives: 'Eine Full-Stack-Webanwendung mit REST-API, relationaler Datenbank und Angular-Oberfläche zur Katalogisierung von Fahrzeugsammlungen entwickeln.',
        results: 'In Planung: noch keine Ergebnisse.',
        limitations: 'Projekt in der Konzeptphase; Umfang und Architektur können sich ändern.',
      },
    },
  },
];

function localizeImage(image: ProjectImageSource, locale: Locale): ProjectImage {
  return { src: image.src, width: image.width, height: image.height, alt: image.alt[locale], contain: !!image.contain,
           figure: image.figure ?? null, blueprint: image.blueprint ?? null, video: image.video };
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
