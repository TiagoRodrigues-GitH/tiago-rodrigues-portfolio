export interface ImageCredit {
  title: string;
  author: string;
  /** `null` means public domain; the label is localized in the footer. */
  license: string | null;
  url: string;
}

/** Sources of the illustrations in assets/images/blueprints (all from Wikimedia Commons). */
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
];
