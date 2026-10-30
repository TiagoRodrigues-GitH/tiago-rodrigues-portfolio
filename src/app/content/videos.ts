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
  | 'ambient';

/**
 * Overlay style per language, each with a cyberpunk edge:
 * - pt `neural`: Brazilian AI scene — a neural graph in the flag's neon greens and golds that
 *   follows the pointer, coordinates of Curitiba (UTFPR).
 * - en `neon`: neon-noir terminal — scanlines, RGB split and a tilt that follows the pointer.
 * - de `precision`: engineering drawing — millimetre grid and a crosshair that snaps to it.
 */
export type VideoTheme = 'neural' | 'neon' | 'precision';

export const VIDEO_THEME: Record<Locale, VideoTheme> = {
  pt: 'neural',
  en: 'neon',
  de: 'precision',
};

/** Overlay corner tag: where the theme comes from. */
export const VIDEO_ORIGIN: Record<Locale, string> = {
  pt: 'CWB −25.43 −49.27 · IA',
  en: 'NET://GRID-07 · LIVE',
  de: 'FRA 50.11 N 8.68 E · M 1:1',
};

/** Short HUD readout over each loop. Decorative: the figure's label carries the meaning. */
const READOUTS: Record<VideoSlot, Record<Locale, string>> = {
  hero: { pt: 'IA embarcada · percepção em tempo real', en: '> boot adas.core --night', de: 'FAHRERASSISTENZ · ECHTZEIT' },
  chassis: { pt: 'silício → software → estrada', en: '> pick-and-place pcb.assembly', de: 'INDUSTRIE 4.0 · TAKT 0,8 s' },
  llm: { pt: 'rede neural · LoRA · 4 bi parâmetros', en: '> fine-tune --lora --params 4B', de: 'LLM · LoRA · 4 MRD. PARAMETER' },
  fleet: { pt: 'frota conectada · placa Mercosul', en: '> track fleet --live', de: 'FLOTTE · VERKEHRSFLUSS' },
  'fleet-code': { pt: 'Java · POO · UML', en: '> javac Fleet.java && run', de: 'JAVA · OOP · UML' },
  collector: { pt: 'acervo clássico · ficha técnica', en: '> catalog --classic --v8', de: 'OLDTIMER · DATENBLATT' },
  perceive: { pt: 'Iguaçu · varredura de sensores', en: '> perceive --sensors all', de: 'AUTOBAHN · SENSORFUSION' },
  rules: { pt: 'Programa MOVER · regras da estrada', en: '> audit --compliance', de: 'REGELWERK · ZULASSUNG' },
  seeing: { pt: 'detecção de faixas · row anchors', en: '> detect lanes --row-anchors', de: 'SPURERKENNUNG · ZEILENANKER' },
  patents: { pt: 'INPI · patentes brasileiras', en: '> search patents --holo', de: 'PATENTE · PRÜFSTAND' },
  ambient: { pt: 'dados → decisões · IA aplicada', en: '> connect --future', de: 'MAIN-SKYLINE · NACHTMODUS' },
};

/** What each loop shows (text alternative, and the caption where the figure has one). */
const ALTS: Record<VideoSlot, Record<Locale, string>> = {
  hero: {
    pt: 'Retrato em close de uma jovem com circuitos eletrônicos desenhados no rosto, sob luz neon.',
    en: 'Timelapse drive through city streets at night, with streaks of headlights and neon.',
    de: 'Luftaufnahme von Frankfurt am Main bei Nacht mit beleuchteten Straßenzügen.',
  },
  chassis: {
    pt: 'Close de uma placa de circuito com processador e componentes iluminados.',
    en: 'An automated pick-and-place machine mounting parts on circuit boards.',
    de: 'Ein Industrieroboter arbeitet in einer Elektronikfertigung.',
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
    en: 'A stylish woman leaning on a Camaro muscle car, lit in red.',
    de: 'Kombiinstrument eines Autos, während der Motor hochdreht.',
  },
  perceive: {
    pt: 'As Cataratas do Iguaçu, no Paraná, envoltas em névoa.',
    en: 'Timelapse of a car driving through the city at night.',
    de: 'Schnelle Fahrt auf einer Autobahn aus Fahrersicht.',
  },
  rules: {
    pt: 'Close das luzes de racks de servidores em um data center.',
    en: 'A security team checking surveillance feeds on a wall of screens.',
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
 *  full-bleed backgrounds (hero, ambient) and 1280 px for figures. */
export function videoSource(slot: VideoSlot, locale: Locale): VideoSource {
  const base = `assets/videos/${slot}-${locale}`;
  return { mp4: `${base}.mp4`, poster: `${base}.webp`, readout: READOUTS[slot][locale], alt: ALTS[slot][locale] };
}

/** Caption for a figure that shows a loop: what it shows, and where it comes from. */
export function videoCaption(slot: VideoSlot, locale: Locale): string {
  return `${ALTS[slot][locale]} ${VIDEO_CREDIT[locale]}.`;
}
