import { Injectable } from '@angular/core';

export type Locale = 'pt' | 'en' | 'de';

export type PageKey = 'home' | 'projects' | 'llmLab' | 'about' | 'contact' | 'privacy' | 'login' | 'admin';

export interface LocaleOption {
  locale: Locale;
  /** Short code shown in the language switcher (ISO 639-1, not a country). */
  code: string;
  /** Language name written in that language. */
  label: string;
  /** Value for the `lang` attribute (WCAG 3.1.1 / 3.1.2). */
  htmlLang: string;
}

export interface ShellTranslations {
  nav: { home: string; projects: string; about: string; contact: string };
  skipLink: string;
  mainNav: string;
  homeLink: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  profiles: string;
  newTab: string;
  footer: {
    tagline: string;
    navigate: string;
    contact: string;
    author: string;
    revision: string;
    credits: string;
    creditsIntro: string;
    publicDomain: string;
    rights: string;
    backToTop: string;
    privacy: string;
  };
  /** Bottom bar on every page (WCAG 2.1 AA statement). */
  a11y: { statement: string; guidelines: string; url: string };
  titles: Record<PageKey, string>;
  /** Meta description per page (search engines and link previews). */
  descriptions: Record<PageKey, string>;
}

export interface SpecItem {
  key: string;
  value: string;
  detail: string;
}

export interface HomeTranslations {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  viewProjects: string;
  readArticles: string;
  contactMe: string;
  availability: string;
  figure: {
    title: string;
    desc: string;
    caption: string;
    camera: string;
    radar: string;
    rearRadar: string;
    ultrasonic: string;
    ecu: string;
    bus: string;
  };
  specIndex: string;
  specTitle: string;
  specLede: string;
  specs: SpecItem[];
  stackTitle: string;
  stack: Array<{ key: string; items: string[] }>;
  projectsIndex: string;
  projectsTitle: string;
  projectsLede: string;
  projectLink: string;
  allProjects: string;
  statusDone: string;
  statusSoon: string;
  statusProgress: string;
  articlesIndex: string;
  articlesTitle: string;
  articlesLede: string;
  /** Research status: interests, work in progress and completed results, kept apart. */
  research: Array<{ key: 'interests' | 'progress' | 'done'; title: string; items: string[] }>;
  chapter: string;
  minutes: string;
  readMore: string;
  readLess: string;
  references: string;
  laneDiagram: { rows: string; lane: string; horizon: string };
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
}

export interface ProjectsTranslations {
  eyebrow: string;
  title: string;
  intro: string;
  figureAlt: string;
  figureCaption: string;
  role: string;
  stack: string;
  status: string;
  statusDone: string;
  statusSoon: string;
  statusProgress: string;
  zoom: string;
  dialogLabel: string;
  previous: string;
  next: string;
  close: string;
  counter: string;
  demo: string;
  objectives: string;
  results: string;
  limitations: string;
  repository: string;
  documentation: string;
}

export interface ContactTranslations {
  eyebrow: string;
  title: string;
  intro: string;
  availabilityLabel: string;
  availabilityText: string;
  emailLabel: string;
  emailDescription: string;
  writeEmail: string;
  copyEmail: string;
  copied: string;
  copyFailed: string;
  linkedInLabel: string;
  linkedInDescription: string;
  githubLabel: string;
  githubDescription: string;
  open: string;
  photoAlt: string;
}

export interface AboutTranslations {
  eyebrow: string;
  title: string;
  intro: string;
  photoAlt: string;
  resumeLabel: string;
  resumeHint: string;
  timelineTitle: string;
  timeline: Array<{ period: string; title: string; text: string }>;
  certifications: string;
  achievements: string[];
  languages: string;
  languageList: string[];
  personalExperienceTitle: string;
  personalExperience: string;
  technicalSkills: string;
  skillGroups: Array<{ title: string; text: string }>;
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly locales: LocaleOption[] = [
    { locale: 'pt', code: 'PT', label: 'Português', htmlLang: 'pt-BR' },
    { locale: 'en', code: 'EN', label: 'English', htmlLang: 'en' },
    { locale: 'de', code: 'DE', label: 'Deutsch', htmlLang: 'de' },
  ];

  readonly shell: Record<Locale, ShellTranslations> = {
    pt: {
      nav: { home: 'Início', projects: 'Projetos', about: 'Sobre mim', contact: 'Contato' },
      skipLink: 'Pular para o conteúdo',
      mainNav: 'Navegação principal',
      homeLink: 'Tiago Rodrigues — página inicial',
      openMenu: 'Abrir menu',
      closeMenu: 'Fechar menu',
      language: 'Idioma',
      profiles: 'Perfis profissionais',
      newTab: '(abre em nova aba)',
      footer: {
        tagline: 'Desenvolvimento de software: sistemas, APIs, dados e inteligência artificial — do back-end à interface.',
        navigate: 'Navegação',
        contact: 'Contato',
        author: 'Autor',
        revision: 'Revisão',
        credits: 'Créditos dos vídeos',
        creditsIntro: 'Vídeos de banco livre, recortados em loops curtos e sem som; cada idioma tem a sua própria seleção.',
        publicDomain: 'Domínio público',
        rights: 'Todos os direitos reservados.',
        backToTop: 'Voltar ao topo',
        privacy: 'Privacidade',
      },
      a11y: {
        statement: 'Este site segue as recomendações de acessibilidade WCAG 2.1 AA.',
        guidelines: 'Diretrizes oficiais do W3C (tradução autorizada)',
        url: 'https://www.w3c.br/traducoes/wcag/wcag21-pt-BR/',
      },
      titles: {
        home: 'Tiago Rodrigues — Desenvolvedor de software',
        projects: 'Projetos · Tiago Rodrigues',
        about: 'Sobre mim · Tiago Rodrigues',
        contact: 'Contato · Tiago Rodrigues',
        privacy: 'Privacidade · Tiago Rodrigues',
        llmLab: 'LLMs compactos: triagem de defeitos e patentes · Tiago Rodrigues',
        login: 'Acesso administrativo · Tiago Rodrigues',
        admin: 'Painel administrativo · Tiago Rodrigues',
      },
      descriptions: {
        home: 'Tiago Rodrigues, desenvolvedor de software: Java, Spring Boot, Angular, APIs REST e inteligência artificial.',
        projects: 'Projetos de Tiago Rodrigues: sistemas Java, APIs, aplicações web e modelos de IA.',
        about: 'Formação e competências de Tiago Rodrigues em desenvolvimento de software e inteligência artificial.',
        contact: 'Fale com Tiago Rodrigues sobre desenvolvimento de software, IA e novos projetos.',
        privacy: 'Como este site trata dados de visita (LGPD): o que é registrado, por quanto tempo e como pedir a exclusão.',
        login: 'Acesso administrativo do portfólio.',
        admin: 'Painel administrativo do portfólio.',
        llmLab: 'LLMs compactos ajustados com LoRA: triagem de reclamações de defeitos da NHTSA e assistente de patentes com documentos do INPI, com resultados reais.',
      },
    },
    en: {
      nav: { home: 'Home', projects: 'Projects', about: 'About me', contact: 'Contact' },
      skipLink: 'Skip to content',
      mainNav: 'Main navigation',
      homeLink: 'Tiago Rodrigues — home',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      language: 'Language',
      profiles: 'Professional profiles',
      newTab: '(opens in a new tab)',
      footer: {
        tagline: 'Software development: systems, APIs, data and artificial intelligence — from back end to interface.',
        navigate: 'Navigation',
        contact: 'Contact',
        author: 'Author',
        revision: 'Revision',
        credits: 'Video credits',
        creditsIntro: 'Free stock footage, cut into short, silent loops; each language has its own selection.',
        publicDomain: 'Public domain',
        rights: 'All rights reserved.',
        backToTop: 'Back to top',
        privacy: 'Privacy',
      },
      a11y: {
        statement: 'This site follows the WCAG 2.1 AA accessibility recommendations.',
        guidelines: 'Official W3C guidelines',
        url: 'https://www.w3.org/TR/WCAG21/',
      },
      titles: {
        home: 'Tiago Rodrigues — Software developer',
        projects: 'Projects · Tiago Rodrigues',
        about: 'About me · Tiago Rodrigues',
        contact: 'Contact · Tiago Rodrigues',
        privacy: 'Privacy · Tiago Rodrigues',
        llmLab: 'Compact LLMs: defect triage and patents · Tiago Rodrigues',
        login: 'Administrative access · Tiago Rodrigues',
        admin: 'Admin panel · Tiago Rodrigues',
      },
      descriptions: {
        home: 'Tiago Rodrigues, software developer: Java, Spring Boot, Angular, REST APIs and artificial intelligence.',
        projects: 'Projects by Tiago Rodrigues: Java systems, APIs, web applications and AI models.',
        about: 'Background and skills of Tiago Rodrigues in software development and artificial intelligence.',
        contact: 'Contact Tiago Rodrigues about software development, AI and new projects.',
        privacy: 'How this site handles visit data (LGPD/GDPR): what is recorded, for how long and how to request deletion.',
        login: 'Portfolio administrative access.',
        admin: 'Portfolio admin panel.',
        llmLab: 'Compact LLMs fine-tuned with LoRA: NHTSA defect complaint triage and a patent assistant grounded in INPI documents, with real results.',
      },
    },
    de: {
      nav: { home: 'Startseite', projects: 'Projekte', about: 'Über mich', contact: 'Kontakt' },
      skipLink: 'Zum Inhalt springen',
      mainNav: 'Hauptnavigation',
      homeLink: 'Tiago Rodrigues – Startseite',
      openMenu: 'Menü öffnen',
      closeMenu: 'Menü schließen',
      language: 'Sprache',
      profiles: 'Berufliche Profile',
      newTab: '(öffnet in neuem Tab)',
      footer: {
        tagline: 'Softwareentwicklung: Systeme, APIs, Daten und künstliche Intelligenz – vom Back-End bis zur Oberfläche.',
        navigate: 'Navigation',
        contact: 'Kontakt',
        author: 'Autor',
        revision: 'Revision',
        credits: 'Videonachweise',
        creditsIntro: 'Frei lizenziertes Stockmaterial, zu kurzen, stummen Loops geschnitten; jede Sprache hat eine eigene Auswahl.',
        publicDomain: 'Gemeinfrei',
        rights: 'Alle Rechte vorbehalten.',
        backToTop: 'Nach oben',
        privacy: 'Datenschutz',
      },
      a11y: {
        statement: 'Diese Website folgt den Barrierefreiheitsempfehlungen der WCAG 2.1 AA.',
        guidelines: 'Offizielle W3C-Richtlinien (Englisch)',
        url: 'https://www.w3.org/TR/WCAG21/',
      },
      titles: {
        home: 'Tiago Rodrigues – Softwareentwickler',
        projects: 'Projekte · Tiago Rodrigues',
        about: 'Über mich · Tiago Rodrigues',
        contact: 'Kontakt · Tiago Rodrigues',
        privacy: 'Datenschutz · Tiago Rodrigues',
        llmLab: 'Kompakte LLMs: Mängeltriage und Patente · Tiago Rodrigues',
        login: 'Administrativer Zugang · Tiago Rodrigues',
        admin: 'Admin-Bereich · Tiago Rodrigues',
      },
      descriptions: {
        home: 'Tiago Rodrigues, Softwareentwickler: Java, Spring Boot, Angular, REST-APIs und künstliche Intelligenz.',
        projects: 'Projekte von Tiago Rodrigues: Java-Systeme, APIs, Webanwendungen und KI-Modelle.',
        about: 'Werdegang und Kompetenzen von Tiago Rodrigues in Softwareentwicklung und künstlicher Intelligenz.',
        contact: 'Kontakt zu Tiago Rodrigues zu Softwareentwicklung, KI und neuen Projekten.',
        privacy: 'Wie diese Website Besuchsdaten verarbeitet (LGPD/DSGVO): was gespeichert wird und wie man die Löschung verlangt.',
        login: 'Administrativer Zugang zum Portfolio.',
        admin: 'Admin-Bereich des Portfolios.',
        llmLab: 'Kompakte, mit LoRA feinabgestimmte LLMs: Triage von NHTSA-Mängelbeschwerden und ein Patentassistent auf Basis von INPI-Dokumenten, mit echten Ergebnissen.',
      },
    },
  };

  readonly home: Record<Locale, HomeTranslations> = {
    pt: {
      eyebrow: 'Desenvolvedor de software · Analista de sistemas',
      titleLead: 'Engenharia de software.',
      titleAccent: 'Sistemas inteligentes.',
      intro: 'Desenvolvedor de software e analista de sistemas atuando na interseção entre engenharia de software, inteligência artificial, deep learning e sistemas embarcados.',
      viewProjects: 'Ver projetos',
      readArticles: 'Explorar a pesquisa',
      contactMe: 'Fale comigo',
      availability: 'Aberto a projetos e oportunidades em desenvolvimento de software',
      figure: {
        title: 'Ilustração esquemática de um veículo genérico com sensores ADAS',
        desc: 'Vista lateral em estilo blueprint: câmera frontal atrás do para-brisa, radar frontal no para-choque, radar traseiro e sensores de ultrassom, todos ligados a uma unidade de controle ADAS pelo barramento CAN.',
        caption: 'Fig. 00 — Arquitetura de sensores ADAS (ilustração esquemática, veículo genérico).',
        camera: 'Câmera frontal',
        radar: 'Radar frontal',
        rearRadar: 'Radar traseiro',
        ultrasonic: 'Ultrassom',
        ecu: 'ECU ADAS',
        bus: 'Barramento CAN',
      },
      specIndex: '01 — Sobre',
      specTitle: 'Sobre',
      specLede: 'Uma abordagem multidisciplinar: programação, engenharia, matemática e inteligência computacional aplicadas ao desenvolvimento prático de sistemas — com formação em Medicina (UNIOESTE), especialização em Tecnologias Java e disciplinas de mestrado em Informática (UTFPR).',
      specs: [
        { key: 'Foco', value: 'Engenharia de software', detail: 'Sistemas completos, do back-end à interface, com orientação a objetos, UML, testes (TDD) e boas práticas.' },
        { key: 'Software', value: 'Java · Python · C/C++', detail: 'Back-end com Spring Boot, APIs REST, SQL e JPA/Hibernate.' },
        { key: 'Inteligência artificial', value: 'Deep learning', detail: 'PyTorch, machine learning, ajuste fino de LLMs com LoRA e inteligência computacional.' },
        { key: 'Visão computacional', value: 'OpenCV', detail: 'Processamento de imagem, detecção de objetos e pesquisa em detecção de faixas.' },
        { key: 'Idiomas', value: 'PT · EN · DE', detail: 'Português nativo, inglês B2 e alemão B2, com cinco anos de vivência na Alemanha.' },
      ],
      stackTitle: 'Competências técnicas',
      stack: [
        { key: 'Programação', items: ['Java', 'Python', 'C/C++', 'TypeScript'] },
        { key: 'Back-end', items: ['Spring Boot', 'APIs REST', 'SQL', 'JPA/Hibernate'] },
        { key: 'Inteligência artificial', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'LoRA'] },
        { key: 'Visão computacional', items: ['OpenCV', 'Processamento de imagem', 'Detecção de objetos'] },
        { key: 'Sistemas embarcados', items: ['IoT', 'Sensores'] },
        { key: 'Engenharia de software', items: ['POO', 'UML', 'TDD'] },
        { key: 'Front-end', items: ['Angular', 'HTML e CSS'] },
        { key: 'Ferramentas', items: ['Git', 'Docker', 'Maven', 'IntelliJ IDEA'] },
      ],
      projectsIndex: '02 — Projetos',
      projectsTitle: 'Projetos selecionados',
      projectsLede: 'Um projeto concluído e dois espaços reservados para o que vem a seguir.',
      projectLink: 'Ver detalhes',
      allProjects: 'Ver todos os projetos',
      statusDone: 'Concluído',
      statusSoon: 'Em breve',
      statusProgress: 'Em andamento',
      articlesIndex: '03 — Pesquisa',
      articlesTitle: 'Pesquisa & artigos',
      articlesLede: 'Notas da minha pesquisa em inteligência artificial: visão computacional, regulamentação e patentes, com referências.',
      research: [
        { key: 'interests', title: 'Interesses de pesquisa', items: ['Deep learning', 'Visão computacional', 'ADAS automotivo', 'IA embarcada', 'Inteligência computacional', 'Modelagem e simulação de sistemas'] },
        { key: 'progress', title: 'Em andamento', items: ['Detecção de faixas para sistemas embarcados (AI Residency Program, UTFPR)', 'Assistente de patentes com LLMs compactos e RAG sobre documentos do INPI'] },
        { key: 'done', title: 'Resultados concluídos', items: ['Benchmark de triagem de reclamações de defeitos da NHTSA: quatro modelos, zero-shot e LoRA, comparados com referências sem LLM'] },
      ],
      chapter: 'Capítulo',
      minutes: 'min de leitura',
      readMore: 'Ler o capítulo completo',
      readLess: 'Recolher o capítulo',
      references: 'Referências',
      laneDiagram: { rows: 'linhas de referência', lane: 'faixa detectada', horizon: 'horizonte' },
      ctaTitle: 'Vamos construir algo juntos?',
      ctaText: 'Estou aberto a projetos, colaborações e oportunidades em desenvolvimento de software, APIs, aplicações web e IA.',
      ctaButton: 'Entrar em contato',
    },
    en: {
      eyebrow: 'Software Developer · Systems Analyst',
      titleLead: 'Engineering Software.',
      titleAccent: 'Building Intelligent Systems.',
      intro: 'Software Developer & Systems Analyst working at the intersection of Software Engineering, Artificial Intelligence, Deep Learning and Embedded Systems.',
      viewProjects: 'View Projects',
      readArticles: 'Explore Research',
      contactMe: 'Contact Me',
      availability: 'Open to software development projects and opportunities',
      figure: {
        title: 'Schematic illustration of a generic vehicle with ADAS sensors',
        desc: 'Blueprint-style side view: a front camera behind the windshield, a front radar in the bumper, a rear radar and ultrasonic sensors, all connected to an ADAS control unit over the CAN bus.',
        caption: 'Fig. 00 — ADAS sensor architecture (schematic illustration, generic vehicle).',
        camera: 'Front camera',
        radar: 'Front radar',
        rearRadar: 'Rear radar',
        ultrasonic: 'Ultrasonic',
        ecu: 'ADAS ECU',
        bus: 'CAN bus',
      },
      specIndex: '01 — About',
      specTitle: 'About',
      specLede: 'A multidisciplinary approach: programming, engineering, mathematics and computational intelligence applied to practical system development — with a medical degree (UNIOESTE), a postgraduate specialization in Java Technologies and master’s-level Computer Science courses (UTFPR).',
      specs: [
        { key: 'Focus', value: 'Software engineering', detail: 'Complete systems, from back end to interface, with object orientation, UML, testing (TDD) and sound practices.' },
        { key: 'Software', value: 'Java · Python · C/C++', detail: 'Back end with Spring Boot, REST APIs, SQL and JPA/Hibernate.' },
        { key: 'Artificial intelligence', value: 'Deep learning', detail: 'PyTorch, machine learning, LLM fine-tuning with LoRA and computational intelligence.' },
        { key: 'Computer vision', value: 'OpenCV', detail: 'Image processing, object detection and research on lane detection.' },
        { key: 'Languages', value: 'PT · EN · DE', detail: 'Native Portuguese, B2 English and B2 German, with five years of living in Germany.' },
      ],
      stackTitle: 'Technical expertise',
      stack: [
        { key: 'Programming', items: ['Java', 'Python', 'C/C++', 'TypeScript'] },
        { key: 'Back end', items: ['Spring Boot', 'REST APIs', 'SQL', 'JPA/Hibernate'] },
        { key: 'Artificial intelligence', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'LoRA'] },
        { key: 'Computer vision', items: ['OpenCV', 'Image processing', 'Object detection'] },
        { key: 'Embedded systems', items: ['IoT', 'Sensors'] },
        { key: 'Software engineering', items: ['OOP', 'UML', 'TDD'] },
        { key: 'Front end', items: ['Angular', 'HTML & CSS'] },
        { key: 'Tools', items: ['Git', 'Docker', 'Maven', 'IntelliJ IDEA'] },
      ],
      projectsIndex: '02 — Projects',
      projectsTitle: 'Selected projects',
      projectsLede: 'One finished project and two spaces reserved for what comes next.',
      projectLink: 'View details',
      allProjects: 'View all projects',
      statusDone: 'Completed',
      statusSoon: 'Coming soon',
      statusProgress: 'In progress',
      articlesIndex: '03 — Research',
      articlesTitle: 'Research & articles',
      articlesLede: 'Notes from my artificial intelligence research: computer vision, regulation and patents, with references.',
      research: [
        { key: 'interests', title: 'Research interests', items: ['Deep learning', 'Computer vision', 'Automotive ADAS', 'Embedded AI', 'Computational intelligence', 'System modeling and simulation'] },
        { key: 'progress', title: 'In progress', items: ['Lane detection for embedded systems (AI Residency Program, UTFPR)', 'Patent assistant with compact LLMs and RAG over INPI documents'] },
        { key: 'done', title: 'Completed results', items: ['NHTSA defect complaint triage benchmark: four models, zero-shot and LoRA, compared with no-LLM baselines'] },
      ],
      chapter: 'Chapter',
      minutes: 'min read',
      readMore: 'Read the full chapter',
      readLess: 'Collapse the chapter',
      references: 'References',
      laneDiagram: { rows: 'reference rows', lane: 'detected lane', horizon: 'horizon' },
      ctaTitle: 'Shall we build something together?',
      ctaText: 'I’m open to projects, collaborations and opportunities in software development, APIs, web applications and AI.',
      ctaButton: 'Get in touch',
    },
    de: {
      eyebrow: 'Softwareentwickler · Systemanalytiker',
      titleLead: 'Software entwickeln.',
      titleAccent: 'Intelligente Systeme bauen.',
      intro: 'Softwareentwickler und Systemanalytiker an der Schnittstelle von Softwaretechnik, künstlicher Intelligenz, Deep Learning und eingebetteten Systemen.',
      viewProjects: 'Projekte ansehen',
      readArticles: 'Forschung entdecken',
      contactMe: 'Kontakt aufnehmen',
      availability: 'Offen für Projekte und Positionen in der Softwareentwicklung',
      figure: {
        title: 'Schematische Darstellung eines generischen Fahrzeugs mit ADAS-Sensoren',
        desc: 'Seitenansicht im Blueprint-Stil: Frontkamera hinter der Windschutzscheibe, Frontradar im Stoßfänger, Heckradar und Ultraschallsensoren, alle über den CAN-Bus mit einem ADAS-Steuergerät verbunden.',
        caption: 'Abb. 00 – ADAS-Sensorarchitektur (schematische Darstellung, generisches Fahrzeug).',
        camera: 'Frontkamera',
        radar: 'Frontradar',
        rearRadar: 'Heckradar',
        ultrasonic: 'Ultraschall',
        ecu: 'ADAS-Steuergerät',
        bus: 'CAN-Bus',
      },
      specIndex: '01 — Über mich',
      specTitle: 'Über mich',
      specLede: 'Ein multidisziplinärer Ansatz: Programmierung, Ingenieurwesen, Mathematik und Computational Intelligence für die praktische Systementwicklung – mit Medizinstudium (UNIOESTE), Aufbaustudium in Java-Technologien und Masterkursen in Informatik (UTFPR).',
      specs: [
        { key: 'Schwerpunkt', value: 'Softwaretechnik', detail: 'Komplette Systeme vom Back-End bis zur Oberfläche, mit Objektorientierung, UML, Tests (TDD) und bewährten Praktiken.' },
        { key: 'Software', value: 'Java · Python · C/C++', detail: 'Back-End mit Spring Boot, REST-APIs, SQL und JPA/Hibernate.' },
        { key: 'Künstliche Intelligenz', value: 'Deep Learning', detail: 'PyTorch, Machine Learning, Fine-Tuning von LLMs mit LoRA und Computational Intelligence.' },
        { key: 'Computer Vision', value: 'OpenCV', detail: 'Bildverarbeitung, Objekterkennung und Forschung zur Fahrspurerkennung.' },
        { key: 'Sprachen', value: 'PT · EN · DE', detail: 'Portugiesisch als Muttersprache, Englisch B2 und Deutsch B2, mit fünf Jahren Lebenserfahrung in Deutschland.' },
      ],
      stackTitle: 'Technische Kompetenzen',
      stack: [
        { key: 'Programmierung', items: ['Java', 'Python', 'C/C++', 'TypeScript'] },
        { key: 'Back-End', items: ['Spring Boot', 'REST-APIs', 'SQL', 'JPA/Hibernate'] },
        { key: 'Künstliche Intelligenz', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'LoRA'] },
        { key: 'Computer Vision', items: ['OpenCV', 'Bildverarbeitung', 'Objekterkennung'] },
        { key: 'Eingebettete Systeme', items: ['IoT', 'Sensorik'] },
        { key: 'Softwaretechnik', items: ['OOP', 'UML', 'TDD'] },
        { key: 'Front-End', items: ['Angular', 'HTML & CSS'] },
        { key: 'Werkzeuge', items: ['Git', 'Docker', 'Maven', 'IntelliJ IDEA'] },
      ],
      projectsIndex: '02 — Projekte',
      projectsTitle: 'Ausgewählte Projekte',
      projectsLede: 'Ein abgeschlossenes Projekt und zwei Plätze für das, was als Nächstes kommt.',
      projectLink: 'Details ansehen',
      allProjects: 'Alle Projekte ansehen',
      statusDone: 'Abgeschlossen',
      statusSoon: 'Demnächst',
      statusProgress: 'In Arbeit',
      articlesIndex: '03 — Forschung',
      articlesTitle: 'Forschung & Artikel',
      articlesLede: 'Notizen aus meiner Forschung zu künstlicher Intelligenz: Computer Vision, Regulierung und Patente, mit Quellen.',
      research: [
        { key: 'interests', title: 'Forschungsinteressen', items: ['Deep Learning', 'Computer Vision', 'ADAS im Automobil', 'Eingebettete KI', 'Computational Intelligence', 'Systemmodellierung und Simulation'] },
        { key: 'progress', title: 'In Arbeit', items: ['Fahrspurerkennung für eingebettete Systeme (AI Residency Program, UTFPR)', 'Patentassistent mit kompakten LLMs und RAG über INPI-Dokumente'] },
        { key: 'done', title: 'Abgeschlossene Ergebnisse', items: ['Benchmark zur Triage von NHTSA-Mängelbeschwerden: vier Modelle, Zero-Shot und LoRA, verglichen mit Referenzen ohne LLM'] },
      ],
      chapter: 'Kapitel',
      minutes: 'Min. Lesezeit',
      readMore: 'Ganzes Kapitel lesen',
      readLess: 'Kapitel einklappen',
      references: 'Quellen',
      laneDiagram: { rows: 'Referenzzeilen', lane: 'erkannte Fahrspur', horizon: 'Horizont' },
      ctaTitle: 'Wollen wir gemeinsam etwas bauen?',
      ctaText: 'Ich freue mich über Projekte, Kooperationen und Chancen in Softwareentwicklung, APIs, Webanwendungen und KI.',
      ctaButton: 'Kontakt aufnehmen',
    },
  };

  readonly projects: Record<Locale, ProjectsTranslations> = {
    pt: {
      eyebrow: 'Portfólio',
      title: 'Projetos',
      intro: 'Do sistema acadêmico às próximas ideias: projetos que conectam software, dados e inteligência artificial.',
      figureAlt: 'Desenho técnico de um chassi com motor, transmissão, suspensão e rodas, sem carroceria.',
      figureCaption: 'Fig. — Chassi com motor, transmissão e suspensão (ilustração em domínio público).',
      role: 'Função',
      stack: 'Tecnologias',
      status: 'Status',
      statusDone: 'Concluído',
      statusSoon: 'Em breve',
      statusProgress: 'Em andamento',
      zoom: 'Ampliar imagem',
      dialogLabel: 'Visualização de imagem',
      previous: 'Imagem anterior',
      next: 'Próxima imagem',
      close: 'Fechar',
      counter: 'Imagem {current} de {total}',
      demo: 'Abrir a demonstração',
      objectives: 'Objetivos técnicos',
      results: 'Resultados',
      limitations: 'Limitações',
      repository: 'Repositório no GitHub',
      documentation: 'Documentação técnica',
    },
    en: {
      eyebrow: 'Portfolio',
      title: 'Projects',
      intro: 'From an academic system to the next ideas: projects that connect software, data and artificial intelligence.',
      figureAlt: 'Technical drawing of a chassis with engine, transmission, suspension and wheels, without the body.',
      figureCaption: 'Fig. — Chassis with engine, transmission and suspension (public-domain illustration).',
      role: 'Role',
      stack: 'Technologies',
      status: 'Status',
      statusDone: 'Completed',
      statusSoon: 'Coming soon',
      statusProgress: 'In progress',
      zoom: 'Enlarge image',
      dialogLabel: 'Image viewer',
      previous: 'Previous image',
      next: 'Next image',
      close: 'Close',
      counter: 'Image {current} of {total}',
      demo: 'Open the demo',
      objectives: 'Technical objectives',
      results: 'Results',
      limitations: 'Limitations',
      repository: 'GitHub repository',
      documentation: 'Technical documentation',
    },
    de: {
      eyebrow: 'Portfolio',
      title: 'Projekte',
      intro: 'Vom Studienprojekt zu den nächsten Ideen: Projekte, die Software, Daten und künstliche Intelligenz verbinden.',
      figureAlt: 'Technische Zeichnung eines Fahrgestells mit Motor, Getriebe, Aufhängung und Rädern, ohne Karosserie.',
      figureCaption: 'Abb. – Fahrgestell mit Motor, Getriebe und Aufhängung (gemeinfreie Illustration).',
      role: 'Rolle',
      stack: 'Technologien',
      status: 'Status',
      statusDone: 'Abgeschlossen',
      statusSoon: 'Demnächst',
      statusProgress: 'In Arbeit',
      zoom: 'Bild vergrößern',
      dialogLabel: 'Bildansicht',
      previous: 'Vorheriges Bild',
      next: 'Nächstes Bild',
      close: 'Schließen',
      counter: 'Bild {current} von {total}',
      demo: 'Demo öffnen',
      objectives: 'Technische Ziele',
      results: 'Ergebnisse',
      limitations: 'Grenzen',
      repository: 'GitHub-Repository',
      documentation: 'Technische Dokumentation',
    },
  };

  readonly contact: Record<Locale, ContactTranslations> = {
    pt: {
      eyebrow: 'Contato',
      title: 'Vamos conversar',
      intro: 'Estou disponível para conversar sobre projetos, colaborações e oportunidades profissionais. Escolha o canal que preferir.',
      availabilityLabel: 'Disponível para',
      availabilityText: 'desenvolvimento de sistemas front-end e back-end, APIs, aplicações web e implementação de modelos de IA.',
      emailLabel: 'E-mail',
      emailDescription: 'Para propostas, dúvidas e oportunidades profissionais.',
      writeEmail: 'Escrever e-mail',
      copyEmail: 'Copiar endereço',
      copied: 'Endereço de e-mail copiado.',
      copyFailed: 'Não foi possível copiar. Selecione o endereço e copie manualmente.',
      linkedInLabel: 'LinkedIn',
      linkedInDescription: 'Trajetória profissional e experiência em desenvolvimento.',
      githubLabel: 'GitHub',
      githubDescription: 'Repositórios, projetos e estudos de programação.',
      open: 'Abrir perfil',
      photoAlt: 'Retrato de Tiago Rodrigues',
    },
    en: {
      eyebrow: 'Contact',
      title: 'Let’s talk',
      intro: 'I’m open to discussing projects, collaborations and professional opportunities. Pick whichever channel suits you best.',
      availabilityLabel: 'Available for',
      availabilityText: 'front-end and back-end development, APIs, web applications and AI model implementation.',
      emailLabel: 'Email',
      emailDescription: 'For proposals, questions and professional opportunities.',
      writeEmail: 'Write an email',
      copyEmail: 'Copy address',
      copied: 'Email address copied.',
      copyFailed: 'Could not copy. Please select the address and copy it manually.',
      linkedInLabel: 'LinkedIn',
      linkedInDescription: 'Professional background and development experience.',
      githubLabel: 'GitHub',
      githubDescription: 'Repositories, projects and programming studies.',
      open: 'Open profile',
      photoAlt: 'Portrait of Tiago Rodrigues',
    },
    de: {
      eyebrow: 'Kontakt',
      title: 'Lassen Sie uns sprechen',
      intro: 'Ich freue mich über Gespräche zu Projekten, Zusammenarbeit und beruflichen Möglichkeiten. Wählen Sie den Kanal, der Ihnen am besten passt.',
      availabilityLabel: 'Verfügbar für',
      availabilityText: 'Front-End- und Back-End-Entwicklung, APIs, Webanwendungen und Umsetzung von KI-Modellen.',
      emailLabel: 'E-Mail',
      emailDescription: 'Für Projektanfragen, Fragen und berufliche Möglichkeiten.',
      writeEmail: 'E-Mail schreiben',
      copyEmail: 'Adresse kopieren',
      copied: 'E-Mail-Adresse kopiert.',
      copyFailed: 'Kopieren nicht möglich. Bitte markieren Sie die Adresse und kopieren Sie sie manuell.',
      linkedInLabel: 'LinkedIn',
      linkedInDescription: 'Beruflicher Werdegang und Erfahrung in der Softwareentwicklung.',
      githubLabel: 'GitHub',
      githubDescription: 'Repositories, Projekte und Programmierstudien.',
      open: 'Profil öffnen',
      photoAlt: 'Porträt von Tiago Rodrigues',
    },
  };

  readonly about: Record<Locale, AboutTranslations> = {
    pt: {
      eyebrow: 'Perfil profissional',
      title: 'Sobre mim',
      intro: 'Desenvolvedor de software em formação contínua, com foco em Java, aplicações web e inteligência artificial.',
      photoAlt: 'Retrato de Tiago Rodrigues',
      resumeLabel: 'Baixar currículo',
      resumeHint: 'PDF',
      timelineTitle: 'Trajetória',
      timeline: [
        { period: '2025–2026', title: 'Pesquisa e mestrado', text: 'AI Residency Program e disciplinas do mestrado em Informática da UTFPR.' },
        { period: '2024–2026', title: 'Pós-graduação em Tecnologias Java', text: 'Especialização de 360 horas pela UTFPR, com projetos de gestão de veículos e IoT.' },
        { period: '2019', title: 'LMU, Alemanha', text: 'Diploma em Medicina Tropical e Saúde Internacional.' },
        { period: '2013–2018', title: 'Graduação em Medicina', text: 'Formação médica pela UNIOESTE.' },
      ],
      certifications: 'Formação e conquistas',
      achievements: [
        'Aluno especial do mestrado em Informática da UTFPR: Engenharia de Software, Mineração de Dados, Linguagens de Programação e Inteligência Computacional.',
        'AI Residency Program: participação em grupo de estudos de IA, com pesquisa em detecção de faixas para sistemas embarcados e veículos autônomos.',
        'Pós-graduação em Tecnologias Java pela UTFPR (360 horas), com aplicações em gestão de veículos e sensores IoT.',
        'Microsoft Student Summit Africa 2021 Hackathon: desenvolvimento de uma solução IoT para monitoramento animal.',
        'Graduação em Medicina pela UNIOESTE (2013–2018) e Diploma em Medicina Tropical e Saúde Internacional pela LMU (2019).',
      ],
      languages: 'Idiomas',
      languageList: ['Português — nativo', 'Inglês — B2 (TOEFL)', 'Alemão — B2 (curso na DFKA em parceria com a LMU)'],
      personalExperienceTitle: 'Vivência na Alemanha',
      personalExperience: 'Morei cinco anos em Munique, principalmente em Schwabing, entre a Leopoldstraße e o Englischer Garten. Lá cheguei ao nível B2 de alemão, em um curso da DFKA em parceria com a LMU, e vivi a cidade por dentro: as tradições locais, o futebol, a Oktoberfest, a mídia alemã e museus dedicados à ciência e à mobilidade, como o Deutsches Museum e o Deutsches Verkehrszentrum.',
      technicalSkills: 'Competências técnicas',
      skillGroups: [
        { title: 'Java e back-end', text: 'Java 17+, Spring Boot, Jakarta EE, APIs RESTful, JPA, Maven, Gradle, Thymeleaf, Lombok, tratamento de exceções e autenticação JWT.' },
        { title: 'Bancos de dados', text: 'MySQL, MariaDB, H2, SQL e modelagem de bancos de dados.' },
        { title: 'IA e machine learning', text: 'Python, TensorFlow, PyTorch, scikit-learn, fine-tuning e avaliação de modelos.' },
      ],
    },
    en: {
      eyebrow: 'Professional profile',
      title: 'About me',
      intro: 'Software developer committed to continuous learning, with a focus on Java, web applications and artificial intelligence.',
      photoAlt: 'Portrait of Tiago Rodrigues',
      resumeLabel: 'Download résumé',
      resumeHint: 'PDF, in Portuguese',
      timelineTitle: 'Timeline',
      timeline: [
        { period: '2025–2026', title: 'Research and master’s studies', text: 'AI Residency Program and master’s-level Computer Science courses at UTFPR.' },
        { period: '2024–2026', title: 'Postgraduate specialization in Java Technologies', text: 'A 360-hour UTFPR program with projects in vehicle management and IoT.' },
        { period: '2019', title: 'LMU, Germany', text: 'Diploma in Tropical Medicine and International Health.' },
        { period: '2013–2018', title: 'Medical degree', text: 'Medical training at UNIOESTE.' },
      ],
      certifications: 'Education and achievements',
      achievements: [
        'Non-degree student in the Master’s program in Computer Science at UTFPR: Software Engineering, Data Mining, Programming Languages and Computational Intelligence.',
        'AI Residency Program: member of an AI study group researching lane-detection algorithms for embedded systems and autonomous vehicles.',
        'Postgraduate specialization in Java Technologies at UTFPR (360 hours), with applications in vehicle management and IoT sensors.',
        'Microsoft Student Summit Africa 2021 Hackathon: development of an IoT solution for animal monitoring.',
        'Medical degree from UNIOESTE (2013–2018) and Diploma in Tropical Medicine and International Health from LMU (2019).',
      ],
      languages: 'Languages',
      languageList: ['Portuguese — native', 'English — B2 (TOEFL)', 'German — B2 (DFKA course in partnership with LMU)'],
      personalExperienceTitle: 'Life in Germany',
      personalExperience: 'I lived in Munich for five years, mostly in Schwabing, between Leopoldstraße and the English Garden. There I reached B2-level German through a DFKA course run in partnership with LMU, and experienced the city from the inside: local traditions, football, Oktoberfest, German media and museums dedicated to science and mobility, such as the Deutsches Museum and the Deutsches Verkehrszentrum.',
      technicalSkills: 'Technical skills',
      skillGroups: [
        { title: 'Java and back end', text: 'Java 17+, Spring Boot, Jakarta EE, RESTful APIs, JPA, Maven, Gradle, Thymeleaf, Lombok, exception handling and JWT authentication.' },
        { title: 'Databases', text: 'MySQL, MariaDB, H2, SQL and database design.' },
        { title: 'AI and machine learning', text: 'Python, TensorFlow, PyTorch, scikit-learn, fine-tuning and model evaluation.' },
      ],
    },
    de: {
      eyebrow: 'Berufliches Profil',
      title: 'Über mich',
      intro: 'Softwareentwickler in kontinuierlicher Weiterbildung mit Schwerpunkt auf Java, Webanwendungen und künstlicher Intelligenz.',
      photoAlt: 'Porträt von Tiago Rodrigues',
      resumeLabel: 'Lebenslauf herunterladen',
      resumeHint: 'PDF, auf Portugiesisch',
      timelineTitle: 'Werdegang',
      timeline: [
        { period: '2025–2026', title: 'Forschung und Masterstudium', text: 'AI Residency Program und Masterkurse in Informatik an der UTFPR.' },
        { period: '2024–2026', title: 'Aufbaustudium in Java-Technologien', text: '360-stündiges Programm an der UTFPR mit Projekten zur Fahrzeugverwaltung und zu IoT.' },
        { period: '2019', title: 'LMU, Deutschland', text: 'Diplom in Tropenmedizin und Internationaler Gesundheit.' },
        { period: '2013–2018', title: 'Medizinstudium', text: 'Medizinische Ausbildung an der UNIOESTE.' },
      ],
      certifications: 'Qualifikationen und Erfolge',
      achievements: [
        'Gaststudent im Masterstudiengang Informatik der UTFPR: Softwaretechnik, Data Mining, Programmiersprachen und Computational Intelligence.',
        'AI Residency Program: Mitarbeit in einer KI-Studiengruppe, die Fahrspurerkennung für eingebettete Systeme und autonome Fahrzeuge erforscht.',
        'Aufbaustudium in Java-Technologien an der UTFPR (360 Stunden) mit Anwendungen in Fahrzeugverwaltung und IoT-Sensorik.',
        'Microsoft Student Summit Africa 2021 Hackathon: Entwicklung einer IoT-Lösung zur Tierüberwachung.',
        'Medizinstudium an der UNIOESTE (2013–2018) und Diplom in Tropenmedizin und Internationaler Gesundheit an der LMU (2019).',
      ],
      languages: 'Sprachen',
      languageList: ['Portugiesisch – Muttersprache', 'Englisch – B2 (TOEFL)', 'Deutsch – B2 (DFKA-Kurs in Zusammenarbeit mit der LMU)'],
      personalExperienceTitle: 'Leben in Deutschland',
      personalExperience: 'Fünf Jahre habe ich in München gelebt, vor allem in Schwabing zwischen Leopoldstraße und Englischem Garten. Dort habe ich in einem DFKA-Kurs in Zusammenarbeit mit der LMU Deutsch auf B2-Niveau gelernt und die Stadt von innen erlebt: lokale Traditionen, Fußball, das Oktoberfest, die deutsche Medienlandschaft sowie Museen für Wissenschaft und Mobilität wie das Deutsche Museum und das Deutsche Verkehrszentrum.',
      technicalSkills: 'Technische Kompetenzen',
      skillGroups: [
        { title: 'Java und Backend', text: 'Java 17+, Spring Boot, Jakarta EE, RESTful APIs, JPA, Maven, Gradle, Thymeleaf, Lombok, Ausnahmebehandlung und JWT-Authentifizierung.' },
        { title: 'Datenbanken', text: 'MySQL, MariaDB, H2, SQL und Datenbankdesign.' },
        { title: 'KI und Machine Learning', text: 'Python, TensorFlow, PyTorch, scikit-learn, Fine-Tuning und Modellevaluierung.' },
      ],
    },
  };

  getLocale(locale: string | null): Locale {
    return locale === 'en' || locale === 'de' ? locale : 'pt';
  }

  option(locale: Locale): LocaleOption {
    return this.locales.find((item) => item.locale === locale) ?? this.locales[0];
  }
}
