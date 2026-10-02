import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Public pages are prerendered at build time (static HTML for GitHub Pages, so search
 * engines and link previews see the content). Login and admin render in the browser only.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'projects', renderMode: RenderMode.Prerender },
  { path: 'projects/compact-llm', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
