import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService, VisitRow, VisitSummary } from '../../services/analytics.service';
import { injectLocale } from '../../services/locale';
import { MessageInboxComponent } from './message-inbox/message-inbox.component';
import { ReviewModerationComponent } from './review-moderation/review-moderation.component';

@Component({
  selector: 'app-admin',
  // Standalone and lazy-loaded: visitors never download the admin code.
  imports: [DatePipe, SlicePipe, MessageInboxComponent, ReviewModerationComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);

  // Signals: HTTP callbacks do not trigger change detection in this zoneless app.
  readonly locale = injectLocale();
  readonly isCheckingAuth = signal(true);
  readonly summary = signal<VisitSummary | null>(null);
  readonly visits = signal<VisitRow[]>([]);
  readonly visitsError = signal('');

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

  get t() {
    const locale = this.locale();
    return {
      panel: locale === 'en' ? 'Admin panel' : locale === 'de' ? 'Admin-Bereich' : 'Painel administrativo',
      verify: locale === 'en' ? 'Verifying authentication…' : locale === 'de' ? 'Authentifizierung wird überprüft …' : 'Verificando autenticação…',
      logout: locale === 'en' ? 'Sign out' : locale === 'de' ? 'Abmelden' : 'Sair',
      visits: locale === 'en' ? 'Visits (last 30 days)' : locale === 'de' ? 'Besuche (letzte 30 Tage)' : 'Visitas (últimos 30 dias)',
      visitsHint: locale === 'en' ? 'Personal data (LGPD): records are deleted after 90 days. Use only for audience statistics and security.' : locale === 'de' ? 'Personenbezogene Daten (LGPD/DSGVO): Einträge werden nach 90 Tagen gelöscht. Nur für Reichweitenstatistik und Sicherheit verwenden.' : 'Dados pessoais (LGPD): os registros são apagados após 90 dias. Use apenas para estatística de audiência e segurança.',
      pageViews: locale === 'en' ? 'page views' : locale === 'de' ? 'Seitenaufrufe' : 'páginas vistas',
      visitors: locale === 'en' ? 'distinct IP addresses' : locale === 'de' ? 'verschiedene IP-Adressen' : 'endereços IP distintos',
      sessions: locale === 'en' ? 'visits (browser tabs)' : locale === 'de' ? 'Besuche (Browser-Tabs)' : 'visitas (abas do navegador)',
      topPages: locale === 'en' ? 'Most visited pages' : locale === 'de' ? 'Meistbesuchte Seiten' : 'Páginas mais visitadas',
      topReferrers: locale === 'en' ? 'Where visitors came from' : locale === 'de' ? 'Herkunft der Besucher' : 'De onde vieram os visitantes',
      languages: locale === 'en' ? 'Languages' : locale === 'de' ? 'Sprachen' : 'Idiomas',
      recent: locale === 'en' ? 'Latest visits' : locale === 'de' ? 'Letzte Besuche' : 'Últimas visitas',
      item: locale === 'en' ? 'Item' : locale === 'de' ? 'Eintrag' : 'Item',
      count: locale === 'en' ? 'Count' : locale === 'de' ? 'Anzahl' : 'Quantidade',
      when: locale === 'en' ? 'When' : locale === 'de' ? 'Zeitpunkt' : 'Quando',
      page: locale === 'en' ? 'Page' : locale === 'de' ? 'Seite' : 'Página',
      referrer: locale === 'en' ? 'Came from' : locale === 'de' ? 'Herkunft' : 'Origem',
      language: locale === 'en' ? 'Language' : locale === 'de' ? 'Sprache' : 'Idioma',
      browser: locale === 'en' ? 'Browser' : locale === 'de' ? 'Browser' : 'Navegador',
      noData: locale === 'en' ? 'No data yet.' : locale === 'de' ? 'Noch keine Daten.' : 'Ainda sem dados.',
      loadingVisits: locale === 'en' ? 'Loading visits…' : locale === 'de' ? 'Besuche werden geladen …' : 'Carregando visitas…',
      visitsLoadError: locale === 'en' ? 'Visit statistics could not be loaded.' : locale === 'de' ? 'Die Besuchsstatistik konnte nicht geladen werden.' : 'Não foi possível carregar as estatísticas de visita.',
    };
  }

  loadVisits() {
    this.visitsError.set('');
    this.analytics.summary(30).subscribe({
      next: (summary) => this.summary.set(summary),
      error: () => this.visitsError.set(this.t.visitsLoadError),
    });
    this.analytics.recent(100).subscribe({
      next: (rows) => this.visits.set(rows),
      error: () => this.visitsError.set(this.t.visitsLoadError),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { lang: this.locale() } });
  }
}
