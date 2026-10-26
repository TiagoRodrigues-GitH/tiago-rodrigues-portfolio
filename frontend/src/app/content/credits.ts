export interface ImageCredit {
  title: string;
  author: string;
  /** `null` means public domain; the label is localized in the footer. */
  license: string | null;
  url: string;
}

/** Sources of the illustrations (assets/images/blueprints) and photographs (assets/images/photos), all from Wikimedia Commons. */
export const IMAGE_CREDITS: ImageCredit[] = [
  {
    title: 'Streamlined Car Carries Engine at Rear (1931)',
    author: 'Everyday Science and Mechanics',
    license: null,
    url: 'https://commons.wikimedia.org/wiki/File:Streamlined_Car.png',
  },
  {
    title: 'Chassis',
    author: 'Pearson Scott Foresman',
    license: null,
    url: 'https://commons.wikimedia.org/wiki/File:Chassis_(PSF).jpg',
  },
  {
    title: 'US Patent 652,851 — Automobile Vehicle (1900)',
    author: 'H. W. Libbey · U.S. National Archives',
    license: null,
    url: "https://commons.wikimedia.org/wiki/File:Patent_Drawing_for_H._W._Libbey's_Automobile_Vehicle_-_NARA_-_7369158.jpg",
  },
  {
    title: 'US Patent 2,269,452 — Fig. 1',
    author: 'U.S. Patent Office',
    license: null,
    url: 'https://commons.wikimedia.org/wiki/File:Fig_1_patent_2,269,452.jpg',
  },
  {
    title: 'Green circuit board II',
    author: 'Peter Shanks',
    license: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Green_circuit_board_II_(2389301870).jpg',
  },
  // photographs behind the page heroes and in the area doors (assets/images/photos, cropped and resized to WebP)
  {
    title: 'Rio de Janeiro',
    author: 'Agustin Diaz Gargiulo (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Rio_de_Janeiro._Unsplash_7F65HDP0-E0.jpg',
  },
  {
    title: 'Macro laptop coding',
    author: 'Marc Mueller (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Macro_laptop_coding_(Unsplash).jpg',
  },
  {
    title: 'Code on computer monitor',
    author: 'Markus Spiske (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Code_on_computer_monitor_(Unsplash).jpg',
  },
  {
    title: 'Stelvio Pass',
    author: 'Raul Taciu (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Stelvio_Pass_(Unsplash).jpg',
  },
  {
    title: 'Highway light trails at night',
    author: 'Jamie Street (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Highway_light_trains_at_night_(Unsplash).jpg',
  },
  {
    title: 'Turing Chips TU104 TU106 TU116',
    author: 'Fritzchens Fritz',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Turing_Chips_TU104_TU106_TU116_DSC09169-DSC09169_(50914923407).jpg',
  },
  {
    title: 'Racks, Amravati Data Center',
    author: 'PiDatacenters',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Racks_Amravati_Data_Center.jpg',
  },
];
