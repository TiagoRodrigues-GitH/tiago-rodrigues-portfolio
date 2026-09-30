import { Injectable } from '@angular/core';

export type Locale = 'pt' | 'en' | 'de';

export type PageKey = 'home' | 'projects' | 'about' | 'contact' | 'login' | 'admin';

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
  };
  titles: Record<PageKey, string>;
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
  articlesIndex: string;
  articlesTitle: string;
  articlesLede: string;
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
  zoom: string;
  dialogLabel: string;
  previous: string;
  next: string;
  close: string;
  counter: string;
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
        tagline: 'Software para a indústria automotiva: sistemas, dados e inteligência artificial aplicados à mobilidade.',
        navigate: 'Navegação',
        contact: 'Contato',
        author: 'Autor',
        revision: 'Revisão',
        credits: 'Créditos das imagens',
        creditsIntro: 'Ilustrações técnicas em domínio público ou com licença livre, convertidas para o estilo blueprint deste site.',
        publicDomain: 'Domínio público',
        rights: 'Todos os direitos reservados.',
        backToTop: 'Voltar ao topo',
      },
      titles: {
        home: 'Tiago Rodrigues — Software para a indústria automotiva',
        projects: 'Projetos · Tiago Rodrigues',
        about: 'Sobre mim · Tiago Rodrigues',
        contact: 'Contato · Tiago Rodrigues',
        login: 'Acesso administrativo · Tiago Rodrigues',
        admin: 'Painel administrativo · Tiago Rodrigues',
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
        tagline: 'Software for the automotive industry: systems, data and artificial intelligence applied to mobility.',
        navigate: 'Navigation',
        contact: 'Contact',
        author: 'Author',
        revision: 'Revision',
        credits: 'Image credits',
        creditsIntro: 'Public-domain or openly licensed technical illustrations, converted to this site’s blueprint style.',
        publicDomain: 'Public domain',
        rights: 'All rights reserved.',
        backToTop: 'Back to top',
      },
      titles: {
        home: 'Tiago Rodrigues — Software for the automotive industry',
        projects: 'Projects · Tiago Rodrigues',
        about: 'About me · Tiago Rodrigues',
        contact: 'Contact · Tiago Rodrigues',
        login: 'Administrative access · Tiago Rodrigues',
        admin: 'Admin panel · Tiago Rodrigues',
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
        tagline: 'Software für die Automobilindustrie: Systeme, Daten und künstliche Intelligenz für die Mobilität.',
        navigate: 'Navigation',
        contact: 'Kontakt',
        author: 'Autor',
        revision: 'Revision',
        credits: 'Bildnachweise',
        creditsIntro: 'Gemeinfreie oder frei lizenzierte technische Abbildungen, im Blueprint-Stil dieser Website bearbeitet.',
        publicDomain: 'Gemeinfrei',
        rights: 'Alle Rechte vorbehalten.',
        backToTop: 'Nach oben',
      },
      titles: {
        home: 'Tiago Rodrigues – Software für die Automobilindustrie',
        projects: 'Projekte · Tiago Rodrigues',
        about: 'Über mich · Tiago Rodrigues',
        contact: 'Kontakt · Tiago Rodrigues',
        login: 'Administrativer Zugang · Tiago Rodrigues',
        admin: 'Admin-Bereich · Tiago Rodrigues',
      },
    },
  };

  readonly home: Record<Locale, HomeTranslations> = {
    pt: {
      eyebrow: 'Desenvolvedor de software · Indústria automotiva',
      titleLead: 'Software para veículos que',
      titleAccent: 'enxergam a estrada.',
      intro: 'Sou Tiago Rodrigues, desenvolvedor Java e de inteligência artificial. Construo sistemas, APIs e modelos de percepção pensando no que um carro precisa: precisão, tempo real e segurança.',
      viewProjects: 'Ver projetos',
      readArticles: 'Ler os artigos',
      availability: 'Aberto a projetos e oportunidades na indústria automotiva',
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
      specIndex: '01 — Perfil',
      specTitle: 'Ficha técnica',
      specLede: 'Uma transição de carreira com direção definida: software, inteligência artificial e a indústria automotiva.',
      specs: [
        { key: 'Foco', value: 'Indústria automotiva', detail: 'Transição de carreira para o setor automotivo, com foco em desenvolvimento de software e tecnologias inteligentes.' },
        { key: 'Software', value: 'Java · Python', detail: 'Engenharia de software, APIs REST e bancos de dados.' },
        { key: 'Inteligência artificial', value: 'Percepção', detail: 'Machine learning, reconhecimento de padrões, inteligência computacional e detecção de faixas.' },
        { key: 'Embarcados', value: 'IoT e sensores', detail: 'Sistemas embarcados, IoT e aplicações que coletam e interpretam dados de sensores.' },
        { key: 'Idiomas', value: 'PT · EN · DE', detail: 'Português nativo, inglês B2 e alemão B2, com cinco anos de vivência na Alemanha.' },
      ],
      stackTitle: 'Tecnologias do dia a dia',
      stack: [
        { key: 'Front-end', items: ['Angular', 'TypeScript', 'HTML e CSS'] },
        { key: 'Back-end', items: ['Java', 'Spring Boot', 'Python'] },
        { key: 'Dados', items: ['MariaDB', 'MySQL', 'MongoDB', 'H2'] },
        { key: 'Ferramentas', items: ['Git', 'Docker', 'Maven', 'IntelliJ IDEA'] },
      ],
      projectsIndex: '02 — Projetos',
      projectsTitle: 'Projetos selecionados',
      projectsLede: 'Um projeto concluído e dois espaços reservados para o que vem a seguir.',
      projectLink: 'Ver detalhes',
      allProjects: 'Ver todos os projetos',
      statusDone: 'Concluído',
      statusSoon: 'Em breve',
      articlesIndex: '03 — Artigos',
      articlesTitle: 'Da percepção à estrada',
      articlesLede: 'Uma história em três capítulos sobre como os carros aprenderam a perceber o ambiente — e o que é preciso para que essa percepção seja segura.',
      chapter: 'Capítulo',
      minutes: 'min de leitura',
      readMore: 'Ler o capítulo completo',
      readLess: 'Recolher o capítulo',
      references: 'Referências',
      laneDiagram: { rows: 'linhas de referência', lane: 'faixa detectada', horizon: 'horizonte' },
      ctaTitle: 'Vamos conversar sobre software para a indústria automotiva?',
      ctaText: 'Estou aberto a projetos, colaborações e oportunidades em desenvolvimento de sistemas, IA e ADAS.',
      ctaButton: 'Entrar em contato',
    },
    en: {
      eyebrow: 'Software developer · Automotive industry',
      titleLead: 'Software for vehicles that',
      titleAccent: 'read the road.',
      intro: 'I’m Tiago Rodrigues, a Java and artificial intelligence developer. I build systems, APIs and perception models around what a vehicle needs: accuracy, real-time performance and safety.',
      viewProjects: 'View projects',
      readArticles: 'Read the articles',
      availability: 'Open to projects and opportunities in the automotive industry',
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
      specIndex: '01 — Profile',
      specTitle: 'Spec sheet',
      specLede: 'A career change with a clear direction: software, artificial intelligence and the automotive industry.',
      specs: [
        { key: 'Focus', value: 'Automotive industry', detail: 'Career transition into the automotive sector, focused on software development and intelligent technologies.' },
        { key: 'Software', value: 'Java · Python', detail: 'Software engineering, REST APIs and databases.' },
        { key: 'Artificial intelligence', value: 'Perception', detail: 'Machine learning, pattern recognition, computational intelligence and lane detection.' },
        { key: 'Embedded', value: 'IoT & sensors', detail: 'Embedded systems, IoT and applications that collect and interpret sensor data.' },
        { key: 'Languages', value: 'PT · EN · DE', detail: 'Native Portuguese, B2 English and B2 German, with five years of living in Germany.' },
      ],
      stackTitle: 'Everyday tools',
      stack: [
        { key: 'Front end', items: ['Angular', 'TypeScript', 'HTML & CSS'] },
        { key: 'Back end', items: ['Java', 'Spring Boot', 'Python'] },
        { key: 'Data', items: ['MariaDB', 'MySQL', 'MongoDB', 'H2'] },
        { key: 'Tools', items: ['Git', 'Docker', 'Maven', 'IntelliJ IDEA'] },
      ],
      projectsIndex: '02 — Projects',
      projectsTitle: 'Selected projects',
      projectsLede: 'One finished project and two spaces reserved for what comes next.',
      projectLink: 'View details',
      allProjects: 'View all projects',
      statusDone: 'Completed',
      statusSoon: 'Coming soon',
      articlesIndex: '03 — Articles',
      articlesTitle: 'From perception to the road',
      articlesLede: 'A story in three chapters about how cars learned to perceive their surroundings — and what it takes to make that perception safe.',
      chapter: 'Chapter',
      minutes: 'min read',
      readMore: 'Read the full chapter',
      readLess: 'Collapse the chapter',
      references: 'References',
      laneDiagram: { rows: 'reference rows', lane: 'detected lane', horizon: 'horizon' },
      ctaTitle: 'Shall we talk about software for the automotive industry?',
      ctaText: 'I’m open to projects, collaborations and opportunities in systems development, AI and ADAS.',
      ctaButton: 'Get in touch',
    },
    de: {
      eyebrow: 'Softwareentwickler · Automobilindustrie',
      titleLead: 'Software für Fahrzeuge,',
      titleAccent: 'die ihre Umgebung verstehen.',
      intro: 'Ich bin Tiago Rodrigues, Java- und KI-Entwickler. Ich entwickle Systeme, APIs und Wahrnehmungsmodelle mit Blick auf das, was ein Fahrzeug braucht: Genauigkeit, Echtzeitfähigkeit und Sicherheit.',
      viewProjects: 'Projekte ansehen',
      readArticles: 'Artikel lesen',
      availability: 'Offen für Projekte und Positionen in der Automobilindustrie',
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
      specIndex: '01 — Profil',
      specTitle: 'Datenblatt',
      specLede: 'Ein Berufswechsel mit klarer Richtung: Software, künstliche Intelligenz und die Automobilindustrie.',
      specs: [
        { key: 'Schwerpunkt', value: 'Automobilindustrie', detail: 'Beruflicher Wechsel in die Automobilbranche mit Fokus auf Softwareentwicklung und intelligente Technologien.' },
        { key: 'Software', value: 'Java · Python', detail: 'Softwaretechnik, REST-APIs und Datenbanken.' },
        { key: 'Künstliche Intelligenz', value: 'Wahrnehmung', detail: 'Machine Learning, Mustererkennung, Computational Intelligence und Fahrspurerkennung.' },
        { key: 'Eingebettet', value: 'IoT & Sensorik', detail: 'Eingebettete Systeme, IoT und Anwendungen, die Sensordaten erfassen und auswerten.' },
        { key: 'Sprachen', value: 'PT · EN · DE', detail: 'Portugiesisch als Muttersprache, Englisch B2 und Deutsch B2 – mit fünf Jahren Lebenserfahrung in Deutschland.' },
      ],
      stackTitle: 'Werkzeuge im Alltag',
      stack: [
        { key: 'Frontend', items: ['Angular', 'TypeScript', 'HTML & CSS'] },
        { key: 'Backend', items: ['Java', 'Spring Boot', 'Python'] },
        { key: 'Daten', items: ['MariaDB', 'MySQL', 'MongoDB', 'H2'] },
        { key: 'Werkzeuge', items: ['Git', 'Docker', 'Maven', 'IntelliJ IDEA'] },
      ],
      projectsIndex: '02 — Projekte',
      projectsTitle: 'Ausgewählte Projekte',
      projectsLede: 'Ein abgeschlossenes Projekt und zwei Plätze für das, was als Nächstes kommt.',
      projectLink: 'Details ansehen',
      allProjects: 'Alle Projekte ansehen',
      statusDone: 'Abgeschlossen',
      statusSoon: 'Demnächst',
      articlesIndex: '03 — Artikel',
      articlesTitle: 'Von der Wahrnehmung auf die Straße',
      articlesLede: 'Eine Geschichte in drei Kapiteln darüber, wie Autos lernten, ihre Umgebung wahrzunehmen – und was nötig ist, damit diese Wahrnehmung sicher ist.',
      chapter: 'Kapitel',
      minutes: 'Min. Lesezeit',
      readMore: 'Ganzes Kapitel lesen',
      readLess: 'Kapitel einklappen',
      references: 'Quellen',
      laneDiagram: { rows: 'Referenzzeilen', lane: 'erkannte Fahrspur', horizon: 'Horizont' },
      ctaTitle: 'Sprechen wir über Software für die Automobilindustrie?',
      ctaText: 'Ich freue mich über Projekte, Kooperationen und Chancen in Systementwicklung, KI und ADAS.',
      ctaButton: 'Kontakt aufnehmen',
    },
  };

  readonly projects: Record<Locale, ProjectsTranslations> = {
    pt: {
      eyebrow: 'Portfólio',
      title: 'Projetos',
      intro: 'Do sistema acadêmico às próximas ideias: projetos que conectam software, dados e o universo automotivo.',
      figureAlt: 'Desenho técnico de um chassi com motor, transmissão, suspensão e rodas, sem carroceria.',
      figureCaption: 'Fig. — Chassi com motor, transmissão e suspensão (ilustração em domínio público).',
      role: 'Função',
      stack: 'Tecnologias',
      status: 'Status',
      statusDone: 'Concluído',
      statusSoon: 'Em breve',
      zoom: 'Ampliar imagem',
      dialogLabel: 'Visualização de imagem',
      previous: 'Imagem anterior',
      next: 'Próxima imagem',
      close: 'Fechar',
      counter: 'Imagem {current} de {total}',
    },
    en: {
      eyebrow: 'Portfolio',
      title: 'Projects',
      intro: 'From an academic system to the next ideas: projects that connect software, data and the automotive world.',
      figureAlt: 'Technical drawing of a chassis with engine, transmission, suspension and wheels, without the body.',
      figureCaption: 'Fig. — Chassis with engine, transmission and suspension (public-domain illustration).',
      role: 'Role',
      stack: 'Technologies',
      status: 'Status',
      statusDone: 'Completed',
      statusSoon: 'Coming soon',
      zoom: 'Enlarge image',
      dialogLabel: 'Image viewer',
      previous: 'Previous image',
      next: 'Next image',
      close: 'Close',
      counter: 'Image {current} of {total}',
    },
    de: {
      eyebrow: 'Portfolio',
      title: 'Projekte',
      intro: 'Vom Studienprojekt zu den nächsten Ideen: Projekte, die Software, Daten und die Welt des Automobils verbinden.',
      figureAlt: 'Technische Zeichnung eines Fahrgestells mit Motor, Getriebe, Aufhängung und Rädern, ohne Karosserie.',
      figureCaption: 'Abb. – Fahrgestell mit Motor, Getriebe und Aufhängung (gemeinfreie Illustration).',
      role: 'Rolle',
      stack: 'Technologien',
      status: 'Status',
      statusDone: 'Abgeschlossen',
      statusSoon: 'Demnächst',
      zoom: 'Bild vergrößern',
      dialogLabel: 'Bildansicht',
      previous: 'Vorheriges Bild',
      next: 'Nächstes Bild',
      close: 'Schließen',
      counter: 'Bild {current} von {total}',
    },
  };

  readonly contact: Record<Locale, ContactTranslations> = {
    pt: {
      eyebrow: 'Contato',
      title: 'Vamos conversar',
      intro: 'Estou disponível para conversar sobre projetos, colaborações e oportunidades profissionais. Escolha o canal que preferir.',
      availabilityLabel: 'Disponível para',
      availabilityText: 'desenvolvimento de sistemas front-end e back-end, implementação de modelos de IA e soluções para a indústria automotiva, incluindo sistemas ADAS (Advanced Driver Assistance Systems).',
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
    },
    en: {
      eyebrow: 'Contact',
      title: 'Let’s talk',
      intro: 'I’m open to discussing projects, collaborations and professional opportunities. Pick whichever channel suits you best.',
      availabilityLabel: 'Available for',
      availabilityText: 'front-end and back-end development, AI model implementation and solutions for the automotive industry, including ADAS (Advanced Driver Assistance Systems).',
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
    },
    de: {
      eyebrow: 'Kontakt',
      title: 'Lassen Sie uns sprechen',
      intro: 'Ich freue mich über Gespräche zu Projekten, Zusammenarbeit und beruflichen Möglichkeiten. Wählen Sie den Kanal, der Ihnen am besten passt.',
      availabilityLabel: 'Verfügbar für',
      availabilityText: 'Front-End- und Back-End-Entwicklung, Umsetzung von KI-Modellen sowie Lösungen für die Automobilindustrie, einschließlich ADAS (Advanced Driver Assistance Systems).',
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
    },
  };

  readonly about: Record<Locale, AboutTranslations> = {
    pt: {
      eyebrow: 'Perfil profissional',
      title: 'Sobre mim',
      intro: 'Desenvolvedor de software em formação contínua, com foco em Java, inteligência artificial e soluções para a indústria automotiva.',
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
      intro: 'Software developer committed to continuous learning, with a focus on Java, artificial intelligence and solutions for the automotive industry.',
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
      intro: 'Softwareentwickler in kontinuierlicher Weiterbildung mit Schwerpunkt auf Java, künstlicher Intelligenz und Lösungen für die Automobilindustrie.',
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
