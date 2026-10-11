import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

const SCRIPT_URL = 'https://gc.zgo.at/count.js';

interface GoatCounterApi {
  count(vars: { path: string }): void;
}

type GoatCounterWindow = Window & { goatcounter?: GoatCounterApi };

/**
 * GoatCounter page views: countries, referrers, browsers, systems and screen sizes, with no cookies and no
 * personal data stored. The script loads only when an endpoint is configured; automatic counting on load is
 * off, so each Angular navigation is counted once, by AnalyticsService, after its consent checks.
 */
@Injectable({ providedIn: 'root' })
export class GoatCounterService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly endpoint = environment.goatcounter;
  private api: Promise<GoatCounterApi | null> | null = null;

  /** An endpoint is set. Platform-independent, so prerendered pages say the same as the browser. */
  get configured(): boolean {
    return !!this.endpoint;
  }

  count(path: string): void {
    if (!this.isBrowser || !this.configured) {
      return;
    }
    void this.load().then((api) => api?.count({ path }));
  }

  private load(): Promise<GoatCounterApi | null> {
    this.api ??= new Promise((resolve) => {
      const win = this.document.defaultView as GoatCounterWindow;
      const script = this.document.createElement('script');
      script.async = true;
      script.src = SCRIPT_URL;
      script.dataset['goatcounter'] = this.endpoint!;
      script.dataset['goatcounterSettings'] = JSON.stringify({ no_onload: true });
      script.onload = () => resolve(win.goatcounter ?? null);
      script.onerror = () => resolve(null); // blocked by an extension or offline: count nothing
      this.document.head.appendChild(script);
    });
    return this.api;
  }
}
