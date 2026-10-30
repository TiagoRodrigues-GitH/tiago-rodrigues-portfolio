import { Locale, PageKey } from '../services/i18n.service';

/**
 * Background films (shared/cinema): realistic clips shown behind the whole page. Each page has its film; a section
 * can bring its own with `data-film="<clip>"`, which cross-fades in when the section reaches the middle of the screen.
 * Clips are cut to seamless 9 s loops (7 s for `developer`) and graded towards the navy identity by
 * scripts/encode-cinema.sh: assets/videos/cinema/<clip>.mp4 (1920 or 1280 px), <clip>-sm.mp4 (960 px, phones)
 * and <clip>.webp (poster).
 */
export type CinemaClip =
  | 'home' | 'circuit' | 'servers' | 'cluster' | 'hologram' | 'traffic' | 'developer' | 'city' | 'datacenter'
  | 'fiber' | 'fibernet' | 'earth' | 'visor' | 'engineer' | 'trains' | 'jaguar' | 'meeting' | 'boardroom';

const PAGE_CLIPS: Record<PageKey, CinemaClip> = {
  home: 'home',
  // one film for the whole page and every area tab, with no switch per project
  projects: 'visor',
  defectTriage: 'cluster',
  patentAssistant: 'hologram',
  streetRouting: 'traffic',
  about: 'developer',
  contact: 'meeting',
  privacy: 'datacenter',
  login: 'datacenter',
  admin: 'datacenter',
};

export function cinemaClip(page: PageKey): CinemaClip {
  return PAGE_CLIPS[page];
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

interface FilmCredit {
  title: string;
  url: string;
  author: string;
  license: string;
}

const mixkit = (title: string, url: string): FilmCredit => ({ title, url, author: 'Mixkit', license: 'Mixkit License' });

/** Where each clip comes from, for the footer credits. */
export const CINEMA_SOURCES: Record<CinemaClip, FilmCredit> = {
  home: mixkit('Close up on young woman with circuits on her face', 'https://mixkit.co/free-stock-video/close-up-on-young-woman-with-circuits-on-her-face-50443/'),
  circuit: mixkit('High tech circuit board with processor', 'https://mixkit.co/free-stock-video/high-tech-circuit-board-with-processor-47051/'),
  servers: mixkit('Server lights flickering', 'https://mixkit.co/free-stock-video/server-lights-flickering-7863/'),
  cluster: mixkit('Accelerating car dashboard', 'https://mixkit.co/free-stock-video/accelerating-car-dashboard-64/'),
  hologram: mixkit('Man browsing holographic VR screens with gestures', 'https://mixkit.co/free-stock-video/man-browsing-holographic-vr-screens-with-gestures-5427/'),
  traffic: mixkit('Aerial view of city traffic at night', 'https://mixkit.co/free-stock-video/aerial-view-of-city-traffic-at-night-11/'),
  developer: mixkit('Hands of a programmer working on his computer', 'https://mixkit.co/free-stock-video/hands-of-a-programmer-working-on-his-computer-41640/'),
  city: mixkit('Aerial view of Frankfurt illuminated at night', 'https://mixkit.co/free-stock-video/aerial-view-of-frankfurt-illuminated-at-night-26947/'),
  datacenter: mixkit('Bluish data center hallway', 'https://mixkit.co/free-stock-video/bluish-data-center-hallway-23282/'),
  fiber: mixkit('Optic fiber glowing blue in a black background', 'https://mixkit.co/free-stock-video/optic-fiber-glowing-blue-in-a-black-background-14887/'),
  fibernet: mixkit('Close up of fiber optics in a server room', 'https://mixkit.co/free-stock-video/close-up-of-fiber-optics-in-a-server-room-47050/'),
  earth: mixkit('Beautiful satellite shot of planet Earth', 'https://mixkit.co/free-stock-video/beautiful-satellite-shot-of-planet-earth-45033/'),
  visor: mixkit('A woman wearing futuristic VR glasses concentrates', 'https://mixkit.co/free-stock-video/a-woman-wearign-a-futuristic-vr-glasses-concentrates-on-the-51214/'),
  engineer: mixkit('Technical engineer working with a microcircuit', 'https://mixkit.co/free-stock-video/technical-engineer-working-with-a-microcircuit-47047/'),
  trains: mixkit('Time lapse of trains in Tokyo', 'https://mixkit.co/free-stock-video/time-lapse-of-trains-in-tokyo-46121/'),
  meeting: mixkit('Business meeting in a meeting room', 'https://mixkit.co/free-stock-video/business-meeting-in-a-meeting-room-42644/'),
  boardroom: mixkit('Silhouettes of a business meeting', 'https://mixkit.co/free-stock-video/silhouettes-of-a-business-meeting-36897/'),
  // CC BY-SA 2.0: the cut and graded loop is shared under the same licence
  jaguar: {
    title: 'Pantanal Jaguar (Panthera onca)',
    url: 'https://commons.wikimedia.org/wiki/File:Pantanal_Jaguar_(Panthera_onca).webm',
    author: 'Gregory “Slobirdr” Smith',
    license: 'CC BY-SA 2.0',
  },
};

/** Pause control (WCAG 2.2.2: moving content that lasts more than 5 s can be paused). */
export const CINEMA_CONTROLS: Record<Locale, { pause: string; play: string }> = {
  pt: { pause: 'Pausar vídeo de fundo', play: 'Reproduzir vídeo de fundo' },
  en: { pause: 'Pause background video', play: 'Play background video' },
  de: { pause: 'Hintergrundvideo anhalten', play: 'Hintergrundvideo abspielen' },
};
