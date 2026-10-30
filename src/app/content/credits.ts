export interface ImageCredit {
  title: string;
  author: string;
  /** `null` means public domain; the label is localized in the footer. */
  license: string | null;
  url: string;
}

/** Sources of the video loops in assets/videos (different clips per language, see content/videos). */
export const IMAGE_CREDITS: ImageCredit[] = [
  {
    title: 'Mixkit — 30 stock video clips (technology, coding, cities at night)',
    author: 'Mixkit · Envato',
    license: 'Mixkit Stock Video Free License',
    url: 'https://mixkit.co/license/#videoFree',
  },
];
