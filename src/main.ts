import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

/**
 * Pages are prerendered in Portuguese. For another language (?lang=en|de) the prerendered DOM
 * would not match the first client render, so it is dropped and the app renders normally;
 * Portuguese pages are hydrated (reused) instead.
 */
const lang = new URLSearchParams(window.location.search).get('lang');
if (lang && lang !== 'pt') {
  const root = document.querySelector('app-root');
  root?.removeAttribute('ngh');
  root?.replaceChildren();
  document.getElementById('ng-state')?.remove();
}

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
