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
  // the home hero travels: Brazil in Portuguese, Canada and the United States in English, Germany in German
  home: {
    // urban and nature in turn, opening with Ouro Preto: the colonial town and the mountains together
    pt: [
      p('ouro-preto-vista', 'Ouro Preto, Minas Gerais'),
      p('parana-iguacu', 'Cataratas do Iguaçu, Paraná'),
      p('sao-paulo-paulista', 'Avenida Paulista, São Paulo'),
      p('lencois-maranhenses', 'Lençóis Maranhenses, Maranhão'),
      p('salvador-pelourinho', 'Pelourinho, Salvador, Bahia'),
      p('amazonas-solimoes', 'Rio Solimões, Floresta Amazônica, Amazonas'),
      p('brasilia-congresso', 'Congresso Nacional, Brasília'),
      p('nordeste-noronha', 'Fernando de Noronha, Pernambuco'),
      p('manaus-teatro', 'Teatro Amazonas, Manaus'),
      p('tiradentes-minas', 'Serra de São José, Tiradentes, Minas Gerais'),
      p('rio-sugarloaf', 'Pão de Açúcar, Rio de Janeiro'),
      p('gramado-lago-negro', 'Lago Negro, Gramado, Rio Grande do Sul'),
      p('ouro-preto-praca', 'Praça Tiradentes, Ouro Preto, Minas Gerais'),
      p('sul-itaimbezinho', 'Cânion Itaimbezinho, Rio Grande do Sul'),
      p('rio-cristo', 'Cristo Redentor, Rio de Janeiro'),
    ],
    // Canada first, then Canada and the United States in turn
    en: [
      p('canada-moraine-lake', 'Moraine Lake, Banff, Alberta'),
      p('seattle-rainier', 'Seattle, Washington'),
      p('canada-toronto', 'Toronto, Ontario'),
      p('golden-gate', 'Golden Gate Bridge, San Francisco'),
      p('canada-quebec-frontenac', 'Château Frontenac, Québec'),
      p('statue-of-liberty', 'Statue of Liberty, New York'),
      p('canada-vancouver', 'Vancouver, British Columbia'),
      p('grand-canyon', 'Grand Canyon, Arizona'),
      p('canada-niagara', 'Niagara Falls, Ontario'),
      p('brooklyn-bridge', 'Brooklyn Bridge, New York'),
      p('canada-peyto-lake', 'Peyto Lake, Banff, Alberta'),
      p('texas-austin', 'Austin, Texas'),
      p('canada-ottawa-parliament', 'Parliament Hill, Ottawa'),
      p('miami-harbor', 'Miami, Florida'),
    ],
    de: [
      p('stuttgart-neues-schloss', 'Stuttgart, Baden-Württemberg'),
      p('heidelberg', 'Heidelberg, Baden-Württemberg'),
      p('neuschwanstein', 'Schloss Neuschwanstein, Bayern'),
      p('munich-alps', 'München, Bayern'),
      p('koeln-dom', 'Kölner Dom, Nordrhein-Westfalen'),
      p('berlin-dom', 'Berlin'),
    ],
  },
  // technology up close: a robot, circuit boards and code; the light photo first
  projects: [
    p('robot-white', ''),
    p('pcb-traces', ''),
    p('coding-workstation', ''),
    p('controller-board', ''),
    p('colorful-code', ''),
  ],
  automotive: [p('stelvio-pass', 'Passo dello Stelvio')],
  ai: [p('gpu-dies', '')],
  security: [p('data-center', '')],
  // Londrina, my home town: the history museum first, the "Eu amo Londrina" sign, Lago Igapó, the old bus station
  about: [
    p('londrina-museu', 'Museu Histórico de Londrina'),
    p('londrina-amo-londrina', 'Lago Cabrinha, Londrina'),
    p('londrina-igapo', 'Lago Igapó, Londrina'),
    p('londrina-igapo-skyline', 'Lago Igapó, Londrina'),
    p('londrina-rodoviaria', 'Antiga Rodoviária, Londrina'),
  ],
  // let's talk over a coffee: ripe cherries, a cup, the harvest
  contact: [p('coffee-cherries', ''), p('coffee-cup', ''), p('coffee-berries', ''), p('coffee-harvest', '')],
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
