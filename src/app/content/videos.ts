import { Locale } from '../services/i18n.service';

/** Every place on the site that shows a video loop. */
export type VideoSlot =
  | 'hero'
  | 'chassis'
  | 'llm'
  | 'fleet'
  | 'fleet-code'
  | 'collector'
  | 'perceive'
  | 'rules'
  | 'seeing'
  | 'patents'
  /** Full-bleed background of the closing call to action and the projects header. */
  | 'ambient'
  /** Full-bleed backgrounds of content sections (profile, projects, research), dimmed behind cards. */
  | 'bg-about'
  | 'bg-projects'
  | 'bg-research';

/**
 * Art direction per language, on one palette (deep teal, graphite, gold, off-white, sage):
 * - pt `cinematic`: full-bleed footage, dramatic light and film grain; a gold neural graph over figures.
 * - en `editorial`: magazine plates — serif type, hairlines, a caption that types itself.
 * - de `minimal`: engineering drawing — millimetre grid and a crosshair that snaps to it.
 */
export type VideoTheme = 'cinematic' | 'editorial' | 'minimal';

export const VIDEO_THEME: Record<Locale, VideoTheme> = {
  pt: 'cinematic',
  en: 'editorial',
  de: 'minimal',
};

/** Overlay corner tag: where the theme comes from. */
export const VIDEO_ORIGIN: Record<Locale, string> = {
  pt: 'CWB −25.43 −49.27 · IA',
  en: 'PLATE 01 · STUDIO',
  de: 'FRA 50.11 N 8.68 E · M 1:1',
};

/** Short HUD readout over each loop. Decorative: the figure's label carries the meaning. */
const READOUTS: Record<VideoSlot, Record<Locale, string>> = {
  hero: { pt: 'humano × máquina', en: 'Plate 01 — Human × machine', de: 'MENSCH × MASCHINE' },
  chassis: { pt: 'silício → software', en: 'Plate 02 — Circuitry, macro', de: 'LEITERPLATTE · MAKRO' },
  llm: { pt: 'rede neural · LoRA · 4 bi parâmetros', en: 'Plate 03 — Language models', de: 'LLM · LoRA · 4 MRD. PARAMETER' },
  fleet: { pt: 'frota conectada · placa Mercosul', en: 'Plate 04 — A fleet in motion', de: 'FLOTTE · VERKEHRSFLUSS' },
  'fleet-code': { pt: 'Java · POO · UML', en: 'Plate 05 — Java · OOP · UML', de: 'JAVA · OOP · UML' },
  collector: { pt: 'acervo clássico · ficha técnica', en: 'Plate 06 — Classic machines', de: 'OLDTIMER · DATENBLATT' },
  perceive: { pt: 'Iguaçu · varredura de sensores', en: 'Plate 07 — Perception', de: 'AUTOBAHN · SENSORFUSION' },
  rules: { pt: 'Programa MOVER · regras da estrada', en: 'Plate 08 — Compliance', de: 'REGELWERK · ZULASSUNG' },
  seeing: { pt: 'detecção de faixas · row anchors', en: 'Plate 09 — Lane detection', de: 'SPURERKENNUNG · ZEILENANKER' },
  patents: { pt: 'INPI · patentes brasileiras', en: 'Plate 10 — Patents', de: 'PATENTE · PRÜFSTAND' },
  ambient: { pt: 'dados → decisões · IA aplicada', en: 'Plate 11 — The city at night', de: 'MAIN-SKYLINE · NACHTMODUS' },
  'bg-about': { pt: 'rede de ideias · conexões', en: 'Structures', de: 'STRUKTUR · RASTER' },
  'bg-projects': { pt: 'do ouro digital ao produto', en: 'Passage', de: 'ROTATION · 3D' },
  'bg-research': { pt: 'pesquisa · redes neurais', en: 'Network', de: 'NETZWERK · ANALYSE' },
};

/** What each loop shows (text alternative, and the caption where the figure has one). */
const ALTS: Record<VideoSlot, Record<Locale, string>> = {
  hero: {
    pt: 'Retrato em close de uma jovem com circuitos eletrônicos no rosto, em luz cinematográfica.',
    en: 'Close-up portrait of a young woman with electronic circuits on her face.',
    de: 'Nahaufnahme einer jungen Frau mit elektronischen Schaltkreisen im Gesicht.',
  },
  chassis: {
    pt: 'Close de um microchip em uma placa eletrônica.',
    en: 'Close-up of a circuit board.',
    de: 'Nahaufnahme einer elektronischen Leiterplatte.',
  },
  llm: {
    pt: 'Pontos e linhas formando uma esfera digital, como uma rede neural.',
    en: 'Computer screens scrolling green text and code, Matrix style.',
    de: 'Langer, blau beleuchteter Gang in einem Rechenzentrum.',
  },
  fleet: {
    pt: 'Vista aérea noturna do trânsito de uma grande cidade.',
    en: 'Top-down view of night traffic circling a roundabout.',
    de: 'Luftaufnahme von Straßen und Bahngleisen, auf denen Autos und ein Zug fahren.',
  },
  'fleet-code': {
    pt: 'Close de mãos programando em um teclado sob luz azul.',
    en: 'Close-up of a developer’s screen full of code.',
    de: 'Komplexer Programmcode auf dem Bildschirm einer Entwicklerin.',
  },
  collector: {
    pt: 'Painel de instrumentos de um carro: velocímetro e conta-giros.',
    en: 'A car’s instrument cluster as the engine accelerates.',
    de: 'Kombiinstrument eines Autos, während der Motor hochdreht.',
  },
  perceive: {
    pt: 'As Cataratas do Iguaçu, no Paraná, envoltas em névoa.',
    en: 'Timelapse of a car driving through the city at night.',
    de: 'Schnelle Fahrt auf einer Autobahn aus Fahrersicht.',
  },
  rules: {
    pt: 'Close das luzes de racks de servidores em um data center.',
    en: 'Server lights flickering in a data center.',
    de: 'Luftaufnahme des Brandenburger Tors in Berlin.',
  },
  seeing: {
    pt: 'Viagem de carro por uma rodovia, do ponto de vista do motorista.',
    en: 'View from inside a car in night traffic.',
    de: 'Fahrt auf einer Landstraße bei Sonnenaufgang, aus Fahrersicht.',
  },
  patents: {
    pt: 'Bandeira do Brasil tremulando suavemente ao vento.',
    en: 'A man browsing holographic screens with hand gestures.',
    de: 'Behandschuhte Hände prüfen eine Leiterplatte in der Qualitätskontrolle.',
  },
  ambient: {
    pt: 'Feixes de luz atravessando um banco de dados virtual em 3D.',
    en: 'Skyscrapers in Shenzhen flashing with neon light at night.',
    de: 'Frankfurt am Main bei Nacht, aus der Luft gesehen.',
  },
  'bg-about': {
    pt: 'Animação 3D de muitos pontos conectados flutuando no espaço.',
    en: 'Abstract luminous structures floating in space.',
    de: 'Fahrt durch einen Tunnel aus schwarzen Würfeln, in 3D.',
  },
  'bg-projects': {
    pt: 'Partículas douradas subindo em um mundo digital.',
    en: 'Travelling through a digital technology tunnel.',
    de: 'Rotierende 3D-Animation aus Linien und Lichtpunkten.',
  },
  'bg-research': {
    pt: 'Rede digital em forma de esfera, em animação 3D.',
    en: 'Luminous networking shapes.',
    de: 'Darstellung eines virtuellen Netzwerks.',
  },
};

export const VIDEO_CREDIT: Record<Locale, string> = {
  pt: 'Vídeo: Mixkit',
  en: 'Video: Mixkit',
  de: 'Video: Mixkit',
};

/** Button labels for the pause control (WCAG 2.2.2: moving content longer than 5 s can be paused). */
export const VIDEO_CONTROLS: Record<Locale, { pause: string; play: string }> = {
  pt: { pause: 'Pausar vídeo', play: 'Reproduzir vídeo' },
  en: { pause: 'Pause video', play: 'Play video' },
  de: { pause: 'Video anhalten', play: 'Video abspielen' },
};

export interface VideoSource {
  mp4: string;
  poster: string;
  readout: string;
  alt: string;
}

/** Loops encoded from Mixkit clips (Mixkit Stock Video Free License): 10 s, muted, H.264, 1920 px for
 *  full-bleed backgrounds (hero, ambient, bg-*) and 1280 px for figures. */
export function videoSource(slot: VideoSlot, locale: Locale): VideoSource {
  const base = `assets/videos/${slot}-${locale}`;
  return { mp4: `${base}.mp4`, poster: `${base}.webp`, readout: READOUTS[slot][locale], alt: ALTS[slot][locale] };
}

/** Caption for a figure that shows a loop: what it shows, and where it comes from. */
export function videoCaption(slot: VideoSlot, locale: Locale): string {
  return `${ALTS[slot][locale]} ${VIDEO_CREDIT[locale]}.`;
}
