/**
 * Photographs behind the page heroes and in the area doors (Wikimedia Commons, most of them Unsplash photos
 * released as CC0; authors and licences in content/credits.ts). Chosen and cropped without brand marks.
 */
export const PHOTOS = {
  home: 'assets/images/photos/rio-sugarloaf.webp',
  projects: 'assets/images/photos/code-macro.webp',
  automotive: 'assets/images/photos/stelvio-pass.webp',
  ai: 'assets/images/photos/gpu-dies.webp',
  security: 'assets/images/photos/data-center.webp',
  about: 'assets/images/photos/highway-night.webp',
  contact: 'assets/images/photos/code-monitor.webp',
  privacy: 'assets/images/photos/code-macro.webp',
  // project demo pages, by the area they belong to
  streetRouting: 'assets/images/photos/stelvio-pass.webp',
  defectTriage: 'assets/images/photos/highway-night.webp',
  patentAssistant: 'assets/images/photos/gpu-dies.webp',
} as const;

export type PhotoKey = keyof typeof PHOTOS;
