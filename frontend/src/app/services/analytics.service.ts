import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GoatCounterService } from './goatcounter.service';

/** One page view as sent to the backend. The backend adds the IP address and user agent. */
interface VisitPayload {
  path: string;
  lang: string;
  referrer: string | null;
  screen: string;
  timezone: string;
  session: string;
}

export interface VisitRow {
  at: string;
  ip: string;
  path: string;
  lang: string | null;
  referrer: string | null;
  userAgent: string | null;
  screen: string | null;
  timezone: string | null;
  session: string | null;
}

export interface CountRow {
  key: string;
  count: number;
}

export interface VisitSummary {
  days: number;
  pageViews: number;
  visitors: number;
  sessions: number;
  topPages: CountRow[];
  topReferrers: CountRow[];
  languages: CountRow[];
  perDay: CountRow[];
}

const OPT_OUT_KEY = 'visit_stats_opt_out';
const SESSION_KEY = 'visit_session';

/**
 * Visit statistics, no cookies: page counts through GoatCounter (aggregates only) and, when a backend is
 * configured, a first-party visit log. Nothing is sent when neither is configured, when the browser asks not to
 * be tracked (Global Privacy Control or Do Not Track) or when the visitor opted out on the privacy page.
 * See /privacy for what is stored and for how long.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly goatCounter = inject(GoatCounterService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private firstView = true;

  get backendConfigured(): boolean {
    return this.auth.backendConfigured;
  }

  /** Some statistics service exists: GoatCounter, the first-party log, or both. */
  get statisticsConfigured(): boolean {
    return this.goatCounter.configured || this.auth.backendConfigured;
  }

  /** The visitor may be counted at all: in a browser, no Global Privacy Control / Do Not Track, no opt-out. */
  get countingAllowed(): boolean {
    return this.isBrowser && !this.browserOptOut() && !this.optedOut();
  }

  /** First-party statistics are recorded: counting allowed and a backend configured. */
  get enabled(): boolean {
    return this.countingAllowed && this.auth.backendConfigured;
  }

  /** True when the browser itself signals "do not track" (honoured, cannot be overridden here). */
  browserOptOut(): boolean {
    const nav = this.document.defaultView?.navigator as (Navigator & { globalPrivacyControl?: boolean }) | undefined;
    return !!nav && (nav.globalPrivacyControl === true || nav.doNotTrack === '1');
  }

  optedOut(): boolean {
    try {
      return this.document.defaultView?.localStorage.getItem(OPT_OUT_KEY) === '1';
    } catch {
      return false;
    }
  }

  setOptOut(optOut: boolean): void {
    try {
      const storage = this.document.defaultView?.localStorage;
      if (optOut) {
        storage?.setItem(OPT_OUT_KEY, '1');
      } else {
        storage?.removeItem(OPT_OUT_KEY);
      }
    } catch {
      // Storage blocked: nothing to remember, and nothing is sent either way.
    }
  }

  trackPageView(path: string, lang: string): void {
    if (!this.countingAllowed || path.startsWith('/admin') || path.startsWith('/login')) {
      return;
    }
    this.goatCounter.count(path);
    if (!this.auth.backendConfigured) {
      return;
    }
    const win = this.document.defaultView!;
    const payload: VisitPayload = {
      path: path.slice(0, 200),
      lang,
      // The external referrer only matters on the first page of a visit.
      referrer: this.firstView && this.document.referrer ? this.document.referrer.slice(0, 300) : null,
      screen: `${win.screen.width}x${win.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? '',
      session: this.sessionId(),
    };
    this.firstView = false;
    this.http.post(`${this.auth.apiUrl}/analytics/visit`, payload).subscribe({ error: () => undefined });
  }

  summary(days: number): Observable<VisitSummary> {
    return this.http.get<VisitSummary>(`${this.auth.apiUrl}/admin/analytics/summary`, { params: { days }, headers: this.auth.authHeaders() });
  }

  recent(limit: number): Observable<VisitRow[]> {
    return this.http.get<VisitRow[]>(`${this.auth.apiUrl}/admin/analytics/visits`, { params: { limit }, headers: this.auth.authHeaders() });
  }

  /** Random id per browser tab (sessionStorage), only to group page views into visits. */
  private sessionId(): string {
    try {
      const storage = this.document.defaultView!.sessionStorage;
      let id = storage.getItem(SESSION_KEY);
      if (!id) {
        id = crypto.randomUUID();
        storage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch {
      return '';
    }
  }
}
