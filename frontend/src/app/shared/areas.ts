import { Locale } from '../services/i18n.service';

/** The three fields the portfolio is split into; each has its own tab, colour and animated backdrop. */
export type AreaKey = 'automotive' | 'ai' | 'security';

export const AREA_KEYS: readonly AreaKey[] = ['automotive', 'ai', 'security'];

export interface AreaText {
  /** Short name for tabs and chips. */
  name: string;
  /** Heading on the home page doors. */
  title: string;
  lede: string;
  topics: string[];
  /** Shown on the area's tab while it has no project yet. */
  empty: string;
}

export interface AreasTranslations {
  all: string;
  tabs: string;
  open: string;
  count: { one: string; many: string; none: string };
}

export const AREAS: Record<AreaKey, Record<Locale, AreaText>> = {
  automotive: {
    pt: {
      name: 'Automotivo',
      title: 'Software automotivo e ADAS',
      lede: 'Percepção, roteamento e dados de veículos: software pensado para precisão, tempo real e segurança na estrada.',
      topics: ['ADAS', 'Detecção de faixas', 'Roteamento', 'Dados NHTSA'],
      empty: '',
    },
    en: {
      name: 'Automotive',
      title: 'Automotive software and ADAS',
      lede: 'Perception, routing and vehicle data: software built for precision, real time and safety on the road.',
      topics: ['ADAS', 'Lane detection', 'Routing', 'NHTSA data'],
      empty: '',
    },
    de: {
      name: 'Automotive',
      title: 'Automotive-Software und ADAS',
      lede: 'Wahrnehmung, Routing und Fahrzeugdaten: Software für Präzision, Echtzeit und Sicherheit auf der Straße.',
      topics: ['ADAS', 'Spurerkennung', 'Routing', 'NHTSA-Daten'],
      empty: '',
    },
  },
  ai: {
    pt: {
      name: 'IA',
      title: 'Inteligência artificial e Deep Learning',
      lede: 'Redes neurais, LLMs compactos e recuperação de documentos, avaliados com dados reais e resultados medidos.',
      topics: ['Deep Learning', 'LLMs', 'Visão computacional', 'RAG'],
      empty: '',
    },
    en: {
      name: 'AI',
      title: 'Artificial intelligence and deep learning',
      lede: 'Neural networks, compact LLMs and document retrieval, evaluated on real data with measured results.',
      topics: ['Deep learning', 'LLMs', 'Computer vision', 'RAG'],
      empty: '',
    },
    de: {
      name: 'KI',
      title: 'Künstliche Intelligenz und Deep Learning',
      lede: 'Neuronale Netze, kompakte LLMs und Dokumentensuche, mit echten Daten bewertet und mit gemessenen Ergebnissen.',
      topics: ['Deep Learning', 'LLMs', 'Computer Vision', 'RAG'],
      empty: '',
    },
  },
  security: {
    pt: {
      name: 'Segurança',
      title: 'Redes e Ethical Hacking',
      lede: 'Redes, defesa e testes de intrusão em laboratórios autorizados: CTFs, write-ups e hardening.',
      topics: ['Redes Cisco', 'Pentest', 'CTF', 'Hardening'],
      empty: 'Os primeiros laboratórios e write-ups desta área estão em preparação.',
    },
    en: {
      name: 'Security',
      title: 'Networks and ethical hacking',
      lede: 'Networking, defence and penetration testing in authorised labs: CTFs, write-ups and hardening.',
      topics: ['Cisco networking', 'Pentesting', 'CTF', 'Hardening'],
      empty: 'The first labs and write-ups of this area are in preparation.',
    },
    de: {
      name: 'Sicherheit',
      title: 'Netzwerke und Ethical Hacking',
      lede: 'Netzwerke, Abwehr und Penetrationstests in autorisierten Laboren: CTFs, Write-ups und Härtung.',
      topics: ['Cisco-Netzwerke', 'Pentesting', 'CTF', 'Härtung'],
      empty: 'Die ersten Labore und Write-ups dieses Bereichs sind in Vorbereitung.',
    },
  },
};

export const AREAS_TEXT: Record<Locale, AreasTranslations> = {
  pt: {
    all: 'Todos',
    tabs: 'Áreas do portfólio',
    open: 'Ver projetos',
    count: { one: '1 projeto', many: '{n} projetos', none: 'Em breve' },
  },
  en: {
    all: 'All',
    tabs: 'Portfolio areas',
    open: 'View projects',
    count: { one: '1 project', many: '{n} projects', none: 'Coming soon' },
  },
  de: {
    all: 'Alle',
    tabs: 'Bereiche des Portfolios',
    open: 'Projekte ansehen',
    count: { one: '1 Projekt', many: '{n} Projekte', none: 'Demnächst' },
  },
};

export function isAreaKey(value: unknown): value is AreaKey {
  return typeof value === 'string' && (AREA_KEYS as readonly string[]).includes(value);
}
