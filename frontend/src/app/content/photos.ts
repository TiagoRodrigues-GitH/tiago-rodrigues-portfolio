import { Locale } from '../services/i18n.service';

/** A photograph behind a page hero, with the place it shows (labelled on the home page). */
export interface Photo {
  src: string;
  place: string;
}

/** Same photos in every language, or one list per language. A list of several photos rotates. */
type PerLocale = Photo[] | Record<Locale, Photo[]>;

export type PhotoSection = 'automotive' | 'ai' | 'security';

const p = (file: string, place: string): Photo => ({ src: `assets/images/photos/${file}.webp`, place });

/**
 * Photographs in the home page's area doors (Wikimedia Commons; authors and licences in content/credits.ts),
 * chosen and cropped without brand marks. Page backgrounds are films since October 2026 (content/cinema.ts).
 * Any section may give each language its own list.
 */
const PHOTOS: Record<PhotoSection, PerLocale> = {
  automotive: [p('stelvio-pass', 'Passo dello Stelvio')],
  ai: [p('gpu-dies', '')],
  security: [p('data-center', '')],
};

export function photosFor(section: PhotoSection, locale: Locale): Photo[] {
  const photos = PHOTOS[section];
  return Array.isArray(photos) ? photos : photos[locale];
}

/** Sources only. */
export function photoSources(section: PhotoSection, locale: Locale): string[] {
  return photosFor(section, locale).map((photo) => photo.src);
}
