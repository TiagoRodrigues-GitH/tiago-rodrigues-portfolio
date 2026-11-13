import { Locale } from '../services/i18n.service';

export interface MusicTrack {
  /** File in public/assets/audio: mono MP3, the whole piece, level lowered to about -30 LUFS, fades baked in. */
  src: string;
  /** Composer and piece, shown in the button label. */
  title: string;
  /** Footer credit (content/credits.ts). `license: null` means public domain. */
  credit: { title: string; author: string; license: string | null; url: string };
}

/**
 * Quiet background music, one piece per language of the site: a Brazilian, an English and a German composer.
 * Recordings from Wikimedia Commons, all free to reuse; the Elgar recording is CC BY 3.0 and must stay credited.
 * Changes made to the originals: converted to mono MP3, level lowered, fade-in and fade-out added.
 */
export const MUSIC: Record<Locale, MusicTrack> = {
  pt: {
    src: 'assets/audio/music-pt.mp3',
    title: 'Ernesto Nazareth — Odeon',
    credit: {
      title: 'Music: Ernesto Nazareth — Odeon (1909), level lowered',
      author: 'Arrangement by Eduardo Feld',
      license: null,
      url: 'https://commons.wikimedia.org/wiki/File:Odeon.mp3',
    },
  },
  en: {
    src: 'assets/audio/music-en.mp3',
    title: 'Edward Elgar — Salut d’Amour',
    credit: {
      title: 'Music: Edward Elgar — Salut d’amour, Op. 12, level lowered',
      author: 'Emanuel Salvador (violin) and Pau Casan (piano)',
      license: 'CC BY 3.0',
      url: 'https://commons.wikimedia.org/wiki/File:Edward_Elgar_-_Salut_d%27amour,_Op._12_-_Emanuel_Salvador_and_Pau_Casan_(2011).ogg',
    },
  },
  de: {
    src: 'assets/audio/music-de.mp3',
    title: 'Johann Sebastian Bach — Air (BWV 1068)',
    credit: {
      title: 'Music: J. S. Bach — Air, Orchestral Suite No. 3, BWV 1068, level lowered',
      author: 'Air Force Strings, United States Air Force Band',
      license: null,
      url: 'https://commons.wikimedia.org/wiki/File:Air_-_Air_Force_Strings_-_United_States_Air_Force_Band.mp3',
    },
  },
};
