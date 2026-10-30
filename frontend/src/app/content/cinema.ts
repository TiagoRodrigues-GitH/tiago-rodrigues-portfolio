import { Locale, PageKey } from '../services/i18n.service';
import { AreaKey } from '../shared/areas';

/**
 * Background films (shared/cinema): one realistic clip per page, chosen for the page's theme and shown behind the
 * whole page, so the picture never changes while the reader scrolls; it changes only with the page.
 * Mixkit clips, cut to seamless 9 s loops (7 s for `developer`), graded towards the navy identity:
 * assets/videos/cinema/<clip>.mp4 (1920 or 1280 px), <clip>-sm.mp4 (960 px, phones) and <clip>.webp (poster).
 */
export type CinemaClip =
  | 'home' | 'drive' | 'circuit' | 'servers' | 'cluster' | 'hologram' | 'traffic' | 'developer' | 'city' | 'datacenter';

const PAGE_CLIPS: Record<PageKey, CinemaClip> = {
  home: 'home',
  projects: 'drive',
  defectTriage: 'cluster',
  patentAssistant: 'hologram',
  streetRouting: 'traffic',
  about: 'developer',
  contact: 'city',
  privacy: 'datacenter',
  login: 'datacenter',
  admin: 'datacenter',
};

const AREA_CLIPS: Record<AreaKey, CinemaClip> = {
  automotive: 'drive',
  ai: 'circuit',
  security: 'servers',
};

export function cinemaClip(page: PageKey, area?: AreaKey): CinemaClip {
  return (area && AREA_CLIPS[area]) || PAGE_CLIPS[page];
}

export interface CinemaSource {
  /** 1920 or 1280 px, for screens wider than 900 px */
  large: string;
  /** 960 px, for phones and small tablets */
  small: string;
  poster: string;
}

export function cinemaSource(clip: CinemaClip): CinemaSource {
  const base = `assets/videos/cinema/${clip}`;
  return { large: `${base}.mp4`, small: `${base}-sm.mp4`, poster: `${base}.webp` };
}

/** Mixkit clip pages, for the footer credits. */
export const CINEMA_SOURCES: Record<CinemaClip, { title: string; url: string }> = {
  home: { title: 'Close up on young woman with circuits on her face', url: 'https://mixkit.co/free-stock-video/close-up-on-young-woman-with-circuits-on-her-face-50443/' },
  drive: { title: 'View from inside a car in night traffic', url: 'https://mixkit.co/free-stock-video/view-from-inside-a-car-in-night-traffic-42039/' },
  circuit: { title: 'High tech circuit board with processor', url: 'https://mixkit.co/free-stock-video/high-tech-circuit-board-with-processor-47051/' },
  servers: { title: 'Server lights flickering', url: 'https://mixkit.co/free-stock-video/server-lights-flickering-7863/' },
  cluster: { title: 'Accelerating car dashboard', url: 'https://mixkit.co/free-stock-video/accelerating-car-dashboard-64/' },
  hologram: { title: 'Man browsing holographic VR screens with gestures', url: 'https://mixkit.co/free-stock-video/man-browsing-holographic-vr-screens-with-gestures-5427/' },
  traffic: { title: 'Aerial view of city traffic at night', url: 'https://mixkit.co/free-stock-video/aerial-view-of-city-traffic-at-night-11/' },
  developer: { title: 'Hands of a programmer working on his computer', url: 'https://mixkit.co/free-stock-video/hands-of-a-programmer-working-on-his-computer-41640/' },
  city: { title: 'Aerial view of Frankfurt illuminated at night', url: 'https://mixkit.co/free-stock-video/aerial-view-of-frankfurt-illuminated-at-night-26947/' },
  datacenter: { title: 'Bluish data center hallway', url: 'https://mixkit.co/free-stock-video/bluish-data-center-hallway-23282/' },
};

/** Pause control (WCAG 2.2.2: moving content that lasts more than 5 s can be paused). */
export const CINEMA_CONTROLS: Record<Locale, { pause: string; play: string }> = {
  pt: { pause: 'Pausar vídeo de fundo', play: 'Reproduzir vídeo de fundo' },
  en: { pause: 'Pause background video', play: 'Play background video' },
  de: { pause: 'Hintergrundvideo anhalten', play: 'Hintergrundvideo abspielen' },
};
