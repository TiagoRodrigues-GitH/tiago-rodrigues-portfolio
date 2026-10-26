import { Locale } from '../services/i18n.service';

/** A photograph behind a page hero, with the place it shows (labelled on the home page). */
export interface Photo {
  src: string;
  place: string;
}

/** Same photos in every language, or one list per language. A list of several photos rotates. */
type PerLocale = Photo[] | Record<Locale, Photo[]>;

export type PhotoSection =
  | 'home' | 'projects' | 'automotive' | 'ai' | 'security' | 'about' | 'contact' | 'privacy'
  | 'streetRouting' | 'defectTriage' | 'patentAssistant';

const p = (file: string, place: string): Photo => ({ src: `assets/images/photos/${file}.webp`, place });

/**
 * Photographs behind the page heroes and in the area doors (Wikimedia Commons; authors and licences in
 * content/credits.ts), chosen and cropped without brand marks. Any section may give each language its own list.
 */
const PHOTOS: Record<PhotoSection, PerLocale> = {
  // the home hero travels: Brazil in Portuguese, the United States in English, Germany in German
  home: {
    pt: [
      p('tiradentes-minas', 'Tiradentes, Minas Gerais'),
      p('sao-paulo-paulista', 'Avenida Paulista, São Paulo'),
      p('parana-iguacu', 'Cataratas do Iguaçu, Paraná'),
      p('brasilia-congresso', 'Congresso Nacional, Brasília'),
      p('nordeste-noronha', 'Fernando de Noronha, Pernambuco'),
      p('sul-itaimbezinho', 'Cânion Itaimbezinho, Rio Grande do Sul'),
    ],
    en: [
      p('seattle-rainier', 'Seattle, Washington'),
      p('texas-austin', 'Austin, Texas'),
      p('miami-harbor', 'Miami, Florida'),
    ],
    de: [
      p('stuttgart-neues-schloss', 'Stuttgart, Baden-Württemberg'),
      p('munich-alps', 'München, Bayern'),
      p('berlin-dom', 'Berlin'),
    ],
  },
  projects: [p('code-macro', '')],
  automotive: [p('stelvio-pass', 'Passo dello Stelvio')],
  ai: [p('gpu-dies', '')],
  security: [p('data-center', '')],
  // Londrina, my home town: the city behind Lago Igapó
  about: [p('londrina-igapo', 'Londrina, Paraná')],
  // ripe coffee cherries: let's talk over a coffee
  contact: [p('coffee-cherries', '')],
  privacy: [p('code-macro', '')],
  // project demo pages, by the area they belong to
  streetRouting: [p('stelvio-pass', 'Passo dello Stelvio')],
  defectTriage: [p('highway-night', '')],
  patentAssistant: [p('gpu-dies', '')],
};

export function photosFor(section: PhotoSection, locale: Locale): Photo[] {
  const photos = PHOTOS[section];
  return Array.isArray(photos) ? photos : photos[locale];
}

/** Sources only, for [appBackdrop]. */
export function photoSources(section: PhotoSection, locale: Locale): string[] {
  return photosFor(section, locale).map((photo) => photo.src);
}
