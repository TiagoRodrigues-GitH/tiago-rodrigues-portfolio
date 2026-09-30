import { Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { I18nService, Locale } from './i18n.service';

/**
 * Current page locale from the `?lang=` query parameter, as a signal.
 * The app runs zoneless, so templates must read signals to re-render on language changes.
 */
export function injectLocale(): Signal<Locale> {
  const route = inject(ActivatedRoute);
  const i18n = inject(I18nService);
  return toSignal(route.queryParamMap.pipe(map((params) => i18n.getLocale(params.get('lang')))), {
    requireSync: true,
  });
}
