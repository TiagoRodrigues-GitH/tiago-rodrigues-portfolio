import { Locale } from '../services/i18n.service';

export type ProjectStatus = 'done' | 'soon';

interface ProjectImageSource {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
}

interface ProjectText {
  title: string;
  summary: string;
  details: string;
  role: string;
  stack: string[];
}

interface ProjectSource {
  id: number;
  status: ProjectStatus;
  image: ProjectImageSource;
  gallery: ProjectImageSource[];
  text: Record<Locale, ProjectText>;
}

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface PortfolioProject extends ProjectText {
  id: number;
  status: ProjectStatus;
  image: ProjectImage;
  /** Every image of the project, cover first — used by the lightbox. */
  gallery: ProjectImage[];
}

const PROJECTS: ProjectSource[] = [
  {
    id: 1,
    status: 'done',
    image: {
      src: 'assets/images/image_vehicle_management_system_02.png',
      width: 809,
      height: 465,
      alt: {
        pt: 'Fluxo de telas do sistema: o menu de gestão de veículos leva aos módulos de veículos de passeio e de carga, com telas de cadastro, consulta e listagem.',
        en: 'Screen flow of the system: the vehicle management menu leads to the passenger and cargo vehicle modules, with registration, lookup and listing screens.',
        de: 'Bildschirmablauf des Systems: Das Menü der Fahrzeugverwaltung führt zu den Modulen für Personen- und Lastkraftwagen mit Erfassungs-, Such- und Listenansichten.',
      },
    },
    gallery: [
      {
        src: 'assets/images/image_vehicle_management_system_01.png',
        width: 720,
        height: 651,
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
        details: 'Academic project built to apply the pillars of object-oriented programming — abstract classes, inheritance, polymorphism, encapsulation, interfaces and exception handling. The event-driven Java Swing interface lets users register vehicles, look them up or delete them by license plate, and list the entire fleet.',
        role: 'Object-oriented modeling and desktop UI',
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
    id: 2,
    status: 'soon',
    image: {
      src: 'assets/images/blueprints/circuit.webp',
      width: 1400,
      height: 1050,
      alt: {
        pt: 'Trilhas de uma placa de circuito impresso em tons de azul.',
        en: 'Printed circuit board traces in shades of blue.',
        de: 'Leiterbahnen einer Platine in Blautönen.',
      },
    },
    gallery: [],
    text: {
      pt: {
        title: 'LLM compacto para a indústria automotiva',
        summary: 'Um modelo de linguagem pequeno, ajustado com fine-tuning para o vocabulário e os processos da indústria automotiva.',
        details: 'Espaço reservado para o próximo projeto: um tiny LLM treinado para responder sobre normas, requisitos e documentação técnica automotiva — como ISO 26262, SOTIF e diagnóstico — e leve o suficiente para rodar localmente, sem depender da nuvem.',
        role: 'Pesquisa e engenharia de IA',
        stack: ['Python', 'PyTorch', 'Fine-tuning (LoRA)', 'Quantização'],
      },
      en: {
        title: 'Compact LLM for the automotive industry',
        summary: 'A small language model fine-tuned for the vocabulary and processes of the automotive industry.',
        details: 'Reserved for the next project: a tiny LLM trained to answer questions about automotive standards, requirements and technical documentation — such as ISO 26262, SOTIF and diagnostics — and light enough to run locally, without depending on the cloud.',
        role: 'AI research and engineering',
        stack: ['Python', 'PyTorch', 'Fine-tuning (LoRA)', 'Quantization'],
      },
      de: {
        title: 'Kompaktes LLM für die Automobilindustrie',
        summary: 'Ein kleines Sprachmodell, per Fine-Tuning auf Fachsprache und Prozesse der Automobilindustrie zugeschnitten.',
        details: 'Platzhalter für das nächste Projekt: ein Tiny LLM, das Fragen zu Normen, Anforderungen und technischer Dokumentation der Automobilbranche beantwortet – etwa zu ISO 26262, SOTIF und Diagnose – und schlank genug ist, um lokal ohne Cloud zu laufen.',
        role: 'KI-Forschung und -Entwicklung',
        stack: ['Python', 'PyTorch', 'Fine-Tuning (LoRA)', 'Quantisierung'],
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
        summary: 'A web application for cataloging classic vehicle collections and tracking the history of each car.',
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
  return { src: image.src, width: image.width, height: image.height, alt: image.alt[locale] };
}

export function getPortfolioProjects(locale: Locale): PortfolioProject[] {
  return PROJECTS.map((project) => {
    const image = localizeImage(project.image, locale);
    return {
      id: project.id,
      status: project.status,
      ...project.text[locale],
      image,
      gallery: [image, ...project.gallery.map((item) => localizeImage(item, locale))],
    };
  });
}
