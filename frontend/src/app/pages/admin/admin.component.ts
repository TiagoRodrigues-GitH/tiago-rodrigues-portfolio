import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService, CountRow, VisitRow, VisitSummary } from '../../services/analytics.service';
import { injectLocale } from '../../services/locale';
import { MessageInboxComponent } from './message-inbox/message-inbox.component';
import { ReviewModerationComponent } from './review-moderation/review-moderation.component';
import { countryName, flag, parseUserAgent, refHost, toCsv, zoneCity } from './visitor-info';

type Locale = 'pt' | 'en' | 'de';

/** One visit as shown in the admin table (raw row plus readable columns). */
export interface VisitView {
  raw: VisitRow;
  at: string;
  country: string;
  countryLabel: string;
  place: string;
  page: string;
  lang: string;
  browser: string;
  os: string;
  device: string;
  screen: string;
  from: string;
  session: string;
  ip: string;
  bot: boolean;
}

const TEXT = {
  pt: {
    panel: 'Painel administrativo', verify: 'Verificando autenticação…', logout: 'Sair',
    visits: 'Visitas e visitantes', period: 'Período',
    days: (n: number) => `últimos ${n} dias`,
    visitsHint: 'Dados pessoais (LGPD): os registros são apagados após 90 dias. País vem de uma base offline (DB-IP Lite); a pessoa não é identificável — apenas país, navegador, sistema e tela.',
    pageViews: 'páginas vistas', visitors: 'IPs distintos', sessions: 'visitas (abas)', countriesN: 'países',
    perDay: 'Páginas vistas por dia', topPages: 'Páginas mais visitadas', topReferrers: 'De onde vieram',
    languages: 'Idiomas', countries: 'Países', item: 'Item', count: 'Qtd.',
    recent: 'Visitantes (registros mais recentes)', when: 'Quando', country: 'País / região', page: 'Página',
    referrer: 'Origem', language: 'Idioma', browser: 'Navegador', os: 'Sistema', device: 'Dispositivo',
    screen: 'Tela', session: 'Visita', ip: 'IP',
    search: 'Filtrar (página, país, navegador…)', allCountries: 'Todos os países', hideBots: 'Ocultar robôs',
    showIp: 'Mostrar IP completo', exportCsv: 'Exportar CSV', reload: 'Atualizar',
    shown: (a: number, b: number) => `${a} de ${b} registros`,
    noData: 'Ainda sem dados.', loadingVisits: 'Carregando visitas…', direct: 'direto',
    visitsLoadError: 'Não foi possível carregar as estatísticas (o servidor gratuito pode levar ~1 min para acordar — tente “Atualizar”).',
    device_desktop: 'computador', device_mobile: 'celular', device_tablet: 'tablet', device_bot: 'robô',
  },
  en: {
    panel: 'Admin panel', verify: 'Verifying authentication…', logout: 'Sign out',
    visits: 'Visits and visitors', period: 'Period',
    days: (n: number) => `last ${n} days`,
    visitsHint: 'Personal data (LGPD/GDPR): records are deleted after 90 days. Country comes from an offline database (DB-IP Lite); people are not identifiable — only country, browser, system and screen.',
    pageViews: 'page views', visitors: 'distinct IPs', sessions: 'visits (tabs)', countriesN: 'countries',
    perDay: 'Page views per day', topPages: 'Most visited pages', topReferrers: 'Where visitors came from',
    languages: 'Languages', countries: 'Countries', item: 'Item', count: 'Count',
    recent: 'Visitors (latest records)', when: 'When', country: 'Country / region', page: 'Page',
    referrer: 'Came from', language: 'Language', browser: 'Browser', os: 'System', device: 'Device',
    screen: 'Screen', session: 'Visit', ip: 'IP',
    search: 'Filter (page, country, browser…)', allCountries: 'All countries', hideBots: 'Hide bots',
    showIp: 'Show full IP', exportCsv: 'Export CSV', reload: 'Refresh',
    shown: (a: number, b: number) => `${a} of ${b} records`,
    noData: 'No data yet.', loadingVisits: 'Loading visits…', direct: 'direct',
    visitsLoadError: 'Visit statistics could not be loaded (the free server may take ~1 min to wake up — try “Refresh”).',
    device_desktop: 'desktop', device_mobile: 'phone', device_tablet: 'tablet', device_bot: 'bot',
  },
  de: {
    panel: 'Admin-Bereich', verify: 'Authentifizierung wird geprüft …', logout: 'Abmelden',
    visits: 'Besuche und Besucher', period: 'Zeitraum',
    days: (n: number) => `letzte ${n} Tage`,
    visitsHint: 'Personenbezogene Daten (LGPD/DSGVO): Einträge werden nach 90 Tagen gelöscht. Das Land stammt aus einer Offline-Datenbank (DB-IP Lite); Personen sind nicht identifizierbar — nur Land, Browser, System und Bildschirm.',
    pageViews: 'Seitenaufrufe', visitors: 'verschiedene IPs', sessions: 'Besuche (Tabs)', countriesN: 'Länder',
    perDay: 'Seitenaufrufe pro Tag', topPages: 'Meistbesuchte Seiten', topReferrers: 'Herkunft der Besucher',
    languages: 'Sprachen', countries: 'Länder', item: 'Eintrag', count: 'Anzahl',
    recent: 'Besucher (neueste Einträge)', when: 'Zeitpunkt', country: 'Land / Region', page: 'Seite',
    referrer: 'Herkunft', language: 'Sprache', browser: 'Browser', os: 'System', device: 'Gerät',
    screen: 'Bildschirm', session: 'Besuch', ip: 'IP',
    search: 'Filtern (Seite, Land, Browser …)', allCountries: 'Alle Länder', hideBots: 'Bots ausblenden',
    showIp: 'Volle IP anzeigen', exportCsv: 'CSV exportieren', reload: 'Aktualisieren',
    shown: (a: number, b: number) => `${a} von ${b} Einträgen`,
    noData: 'Noch keine Daten.', loadingVisits: 'Besuche werden geladen …', direct: 'direkt',
    visitsLoadError: 'Die Besuchsstatistik konnte nicht geladen werden (der kostenlose Server braucht ggf. ~1 Min. zum Aufwachen — „Aktualisieren“ versuchen).',
    device_desktop: 'Computer', device_mobile: 'Handy', device_tablet: 'Tablet', device_bot: 'Bot',
  },
};

@Component({
  selector: 'app-admin',
  // Standalone and lazy-loaded: visitors never download the admin code.
  imports: [DatePipe, MessageInboxComponent, ReviewModerationComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);
  private readonly document = inject(DOCUMENT);

  // Signals: HTTP callbacks do not trigger change detection in this zoneless app.
  readonly locale = injectLocale();
  readonly isCheckingAuth = signal(true);
  readonly summary = signal<VisitSummary | null>(null);
  readonly visits = signal<VisitRow[]>([]);
  readonly visitsError = signal('');
  readonly days = signal(30);
  readonly query = signal('');
  readonly countryFilter = signal('');
  readonly hideBots = signal(true);
  readonly showIp = signal(false);
  readonly periods = [7, 30, 90];

  readonly t = computed(() => TEXT[(this.locale() as Locale) in TEXT ? (this.locale() as Locale) : 'pt']);

  /** All rows turned into readable columns. */
  readonly rows = computed<VisitView[]>(() => {
    const loc = this.locale();
    const t = this.t();
    return this.visits().map((v) => {
      const agent = parseUserAgent(v.userAgent);
      return {
        raw: v,
        at: v.at,
        country: v.country ?? '',
        countryLabel: v.country ? `${flag(v.country)} ${countryName(v.country, loc)}` : '—',
        place: zoneCity(v.timezone),
        page: v.path,
        lang: v.lang ?? '—',
        browser: agent.browser,
        os: agent.os,
        device: t[`device_${agent.device}`],
        screen: v.screen ?? '—',
        from: refHost(v.referrer) || t.direct,
        session: (v.session ?? '').slice(0, 8) || '—',
        ip: v.ip,
        bot: agent.device === 'bot',
      };
    });
  });

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const c = this.countryFilter();
    return this.rows().filter(
      (r) =>
        (!this.hideBots() || !r.bot) &&
        (!c || r.country === c) &&
        (!q || [r.countryLabel, r.place, r.page, r.browser, r.os, r.device, r.from, r.lang].join(' ').toLowerCase().includes(q)),
    );
  });

  /** Countries present in the loaded rows, for the filter. */
  readonly countryOptions = computed(() => {
    const seen = new Map<string, string>();
    for (const r of this.rows()) {
      if (r.country && !seen.has(r.country)) {
        seen.set(r.country, r.countryLabel);
      }
    }
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([code, label]) => ({ code, label }));
  });

  readonly countryRows = computed<CountRow[]>(() =>
    (this.summary()?.countries ?? []).map((r) => ({ key: `${flag(r.key)} ${countryName(r.key, this.locale())}`, count: r.count })),
  );

  readonly maxPerDay = computed(() => Math.max(1, ...(this.summary()?.perDay ?? []).map((d) => d.count)));

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin', lang: this.locale() } });
        return;
      }

      this.isCheckingAuth.set(false);
      this.loadVisits();
    });
  }

  setDays(n: number) {
    this.days.set(n);
    this.loadVisits();
  }

  loadVisits() {
    this.visitsError.set('');
    this.summary.set(null);
    this.analytics.summary(this.days()).subscribe({
      next: (summary) => this.summary.set(summary),
      error: () => this.visitsError.set(this.t().visitsLoadError),
    });
    this.analytics.recent(1000).subscribe({
      next: (rows) => this.visits.set(rows),
      error: () => this.visitsError.set(this.t().visitsLoadError),
    });
  }

  /** IP shown masked by default (last block hidden), so a screen share does not leak it. */
  maskIp(ip: string): string {
    if (this.showIp()) {
      return ip;
    }
    if (ip.includes(':')) {
      return ip.split(':').slice(0, 3).join(':') + ':…';
    }
    return ip.replace(/\.\d+$/, '.×');
  }

  barWidth(count: number): string {
    return `${Math.round((count / this.maxPerDay()) * 100)}%`;
  }

  exportCsv() {
    const t = this.t();
    const csv = toCsv(
      [t.when, t.country, 'timezone', t.page, t.language, t.browser, t.os, t.device, t.screen, t.referrer, t.session, t.ip],
      this.filtered().map((r) => [r.at, r.country, r.raw.timezone, r.page, r.lang, r.browser, r.os, r.device, r.screen, r.raw.referrer, r.raw.session, this.maskIp(r.ip)]),
    );
    const win = this.document.defaultView;
    if (!win) {
      return;
    }
    const url = win.URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = this.document.createElement('a');
    a.href = url;
    a.download = `visitas-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    win.URL.revokeObjectURL(url);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { lang: this.locale() } });
  }
}
