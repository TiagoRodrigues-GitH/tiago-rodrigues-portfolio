import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { injectLocale } from '../../services/locale';
import { AnalyticsService } from '../../services/analytics.service';

interface PrivacyText {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: Array<{ heading: string; paragraphs: string[]; items?: string[] }>;
  statusTitle: string;
  statusOff: string;
  statusBrowser: string;
  statusOptedOut: string;
  statusOn: string;
  optOut: string;
  optIn: string;
}

const EMAIL = 'tiagorodrigues@alunos.utfpr.edu.br';

const TEXT: Record<'pt' | 'en' | 'de', PrivacyText> = {
  pt: {
    eyebrow: 'Privacidade · LGPD',
    title: 'Como este site trata dados de visita',
    intro: 'Este portfólio pode registrar estatísticas simples de visita para saber quais páginas interessam aos leitores e para proteger o site contra abusos. Não há cookies, publicidade nem rastreadores de terceiros.',
    updated: 'Atualizado em 1º de outubro de 2026.',
    sections: [
      {
        heading: 'Quem é o controlador',
        paragraphs: [`Tiago Rodrigues, autor deste site. Contato para qualquer assunto de privacidade: ${EMAIL}.`],
      },
      {
        heading: 'O que é registrado',
        paragraphs: ['A cada página visitada, quando as estatísticas estão ativas:'],
        items: [
          'endereço IP e identificação do navegador (user agent), recebidos pelo servidor;',
          'página visitada, idioma escolhido e data e hora;',
          'site de origem (referrer), apenas na primeira página da visita;',
          'tamanho da tela e fuso horário;',
          'um identificador aleatório da aba, guardado só durante a visita (sessionStorage), para agrupar páginas da mesma visita.',
        ],
      },
      {
        heading: 'Para que e com qual base legal',
        paragraphs: [
          'Estatística de audiência do portfólio (quais páginas e de onde vêm os visitantes) e segurança (identificar acessos abusivos). Base legal: legítimo interesse (LGPD, art. 7º, IX; para visitantes da União Europeia, GDPR, art. 6º, 1, f).',
          'Os dados não são vendidos nem compartilhados para publicidade. São processados apenas pelo provedor que hospeda o servidor do site.',
        ],
      },
      {
        heading: 'Por quanto tempo',
        paragraphs: ['Os registros de visita são apagados automaticamente após 90 dias.'],
      },
      {
        heading: 'Seus direitos',
        paragraphs: [
          `Você pode pedir confirmação, acesso, correção ou exclusão dos seus dados (LGPD, art. 18) pelo e-mail ${EMAIL}. Informe o endereço IP e o período da visita para que os registros possam ser localizados.`,
          'Navegadores com o sinal Global Privacy Control ou "Do Not Track" ativado não são registrados. Você também pode desativar o registro neste navegador pelo botão abaixo.',
        ],
      },
      {
        heading: 'Fontes e arquivos',
        paragraphs: ['As fontes tipográficas e as imagens são servidas pelo próprio site, sem chamadas a serviços de terceiros.'],
      },
    ],
    statusTitle: 'Situação neste navegador',
    statusOff: 'As estatísticas de visita estão desativadas neste site: nenhum dado é enviado.',
    statusBrowser: 'Seu navegador pede para não ser rastreado (Global Privacy Control ou Do Not Track): nenhum dado é enviado.',
    statusOptedOut: 'Você desativou o registro de visitas neste navegador.',
    statusOn: 'As visitas deste navegador são registradas como descrito acima.',
    optOut: 'Não registrar minhas visitas',
    optIn: 'Voltar a permitir o registro',
  },
  en: {
    eyebrow: 'Privacy · LGPD / GDPR',
    title: 'How this site handles visit data',
    intro: 'This portfolio may record simple visit statistics to learn which pages readers find useful and to protect the site against abuse. There are no cookies, no advertising and no third-party trackers.',
    updated: 'Updated on 1 October 2026.',
    sections: [
      {
        heading: 'Who is responsible',
        paragraphs: [`Tiago Rodrigues, the author of this site. Contact for any privacy matter: ${EMAIL}.`],
      },
      {
        heading: 'What is recorded',
        paragraphs: ['For each page you visit, when statistics are active:'],
        items: [
          'IP address and browser identification (user agent), received by the server;',
          'page visited, chosen language, date and time;',
          'referring site, on the first page of a visit only;',
          'screen size and time zone;',
          'a random tab identifier kept only for the visit (sessionStorage), to group the pages of one visit.',
        ],
      },
      {
        heading: 'Why, and on which legal basis',
        paragraphs: [
          'Audience statistics for the portfolio (which pages, where visitors come from) and security (spotting abusive traffic). Legal basis: legitimate interest (Brazilian LGPD, art. 7, IX; for visitors from the European Union, GDPR, art. 6(1)(f)).',
          'The data is not sold or shared for advertising. It is processed only by the provider that hosts the site’s server.',
        ],
      },
      {
        heading: 'How long',
        paragraphs: ['Visit records are deleted automatically after 90 days.'],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          `You can ask for confirmation, access, correction or deletion of your data (LGPD art. 18; GDPR arts. 15–17) at ${EMAIL}. Please give your IP address and the time of the visit so the records can be found.`,
          'Browsers sending Global Privacy Control or "Do Not Track" are not recorded. You can also switch recording off for this browser with the button below.',
        ],
      },
      {
        heading: 'Fonts and files',
        paragraphs: ['Fonts and images are served by the site itself, with no calls to third-party services.'],
      },
    ],
    statusTitle: 'Status in this browser',
    statusOff: 'Visit statistics are switched off on this site: nothing is sent.',
    statusBrowser: 'Your browser asks not to be tracked (Global Privacy Control or Do Not Track): nothing is sent.',
    statusOptedOut: 'You switched visit recording off in this browser.',
    statusOn: 'Visits from this browser are recorded as described above.',
    optOut: 'Do not record my visits',
    optIn: 'Allow recording again',
  },
  de: {
    eyebrow: 'Datenschutz · LGPD / DSGVO',
    title: 'Wie diese Website Besuchsdaten verarbeitet',
    intro: 'Dieses Portfolio kann einfache Besuchsstatistiken erfassen, um zu sehen, welche Seiten für Lesende interessant sind, und um die Website vor Missbrauch zu schützen. Es gibt keine Cookies, keine Werbung und keine Tracker von Drittanbietern.',
    updated: 'Stand: 1. Oktober 2026.',
    sections: [
      {
        heading: 'Verantwortlicher',
        paragraphs: [`Tiago Rodrigues, Autor dieser Website. Kontakt für alle Datenschutzfragen: ${EMAIL}.`],
      },
      {
        heading: 'Was gespeichert wird',
        paragraphs: ['Für jede besuchte Seite, wenn die Statistik aktiv ist:'],
        items: [
          'IP-Adresse und Browserkennung (User-Agent), die der Server empfängt;',
          'besuchte Seite, gewählte Sprache, Datum und Uhrzeit;',
          'verweisende Website, nur auf der ersten Seite eines Besuchs;',
          'Bildschirmgröße und Zeitzone;',
          'eine zufällige Tab-Kennung, nur für die Dauer des Besuchs gespeichert (sessionStorage), um die Seiten eines Besuchs zu gruppieren.',
        ],
      },
      {
        heading: 'Zweck und Rechtsgrundlage',
        paragraphs: [
          'Reichweitenstatistik des Portfolios (welche Seiten, woher die Besucher kommen) und Sicherheit (Erkennen missbräuchlicher Zugriffe). Rechtsgrundlage: berechtigtes Interesse (brasilianisches LGPD, Art. 7 IX; für Besucher aus der EU Art. 6 Abs. 1 lit. f DSGVO).',
          'Die Daten werden weder verkauft noch für Werbung weitergegeben. Sie werden nur vom Anbieter verarbeitet, der den Server der Website betreibt.',
        ],
      },
      {
        heading: 'Speicherdauer',
        paragraphs: ['Besuchsdaten werden nach 90 Tagen automatisch gelöscht.'],
      },
      {
        heading: 'Ihre Rechte',
        paragraphs: [
          `Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen (LGPD Art. 18; DSGVO Art. 15–17): ${EMAIL}. Bitte nennen Sie Ihre IP-Adresse und den Zeitpunkt des Besuchs, damit die Einträge gefunden werden können.`,
          'Browser mit aktiviertem Global Privacy Control oder „Do Not Track“ werden nicht erfasst. Sie können die Erfassung für diesen Browser auch mit der Schaltfläche unten abschalten.',
        ],
      },
      {
        heading: 'Schriften und Dateien',
        paragraphs: ['Schriften und Bilder werden von der Website selbst ausgeliefert, ohne Aufrufe von Drittanbieterdiensten.'],
      },
    ],
    statusTitle: 'Status in diesem Browser',
    statusOff: 'Die Besuchsstatistik ist auf dieser Website abgeschaltet: Es werden keine Daten gesendet.',
    statusBrowser: 'Ihr Browser bittet darum, nicht verfolgt zu werden (Global Privacy Control oder Do Not Track): Es werden keine Daten gesendet.',
    statusOptedOut: 'Sie haben die Erfassung in diesem Browser abgeschaltet.',
    statusOn: 'Besuche aus diesem Browser werden wie oben beschrieben erfasst.',
    optOut: 'Meine Besuche nicht erfassen',
    optIn: 'Erfassung wieder erlauben',
  },
};

@Component({
  selector: 'app-privacy',
  standalone: false,
  templateUrl: './privacy.html',
  styleUrls: ['./privacy.css'],
})
export class PrivacyComponent {
  private readonly analytics = inject(AnalyticsService);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly locale = injectLocale();
  readonly optedOut = signal(this.isBrowser && this.analytics.optedOut());

  get t(): PrivacyText {
    return TEXT[this.locale()];
  }

  get status(): string {
    if (!this.analytics.backendConfigured) {
      return this.t.statusOff;
    }
    if (this.analytics.browserOptOut()) {
      return this.t.statusBrowser;
    }
    return this.optedOut() ? this.t.statusOptedOut : this.t.statusOn;
  }

  get canToggle(): boolean {
    return this.isBrowser && this.analytics.backendConfigured && !this.analytics.browserOptOut();
  }

  toggle(): void {
    const next = !this.optedOut();
    this.analytics.setOptOut(next);
    this.optedOut.set(next);
  }
}
