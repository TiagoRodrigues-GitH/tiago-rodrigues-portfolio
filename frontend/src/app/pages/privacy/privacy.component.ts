import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { injectLocale } from '../../services/locale';
import { PHOTOS } from '../../content/photos';
import { AnalyticsService } from '../../services/analytics.service';

interface PrivacyText {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  /** `note` is printed after the list, for what qualifies it (retention, hosting). */
  sections: Array<{ heading: string; paragraphs: string[]; items?: string[]; note?: string }>;
  statusTitle: string;
  statusOff: string;
  statusBrowser: string;
  statusOptedOut: string;
  statusOn: string;
  optOut: string;
  optIn: string;
}

const EMAIL = 'tiagorodrigues@alunos.utfpr.edu.br';

// Facts about GoatCounter come from its own documentation (goatcounter.com/help/privacy and /help/sessions,
// read on 5 October 2026); facts about the comments, from backend/src/main/java/org/example/reviews.
const TEXT: Record<'pt' | 'en' | 'de', PrivacyText> = {
  pt: {
    eyebrow: 'Privacidade · LGPD',
    title: 'Como este site trata seus dados',
    intro: 'Este portfólio pode contar visitas para saber quais páginas interessam aos leitores, aceita comentários nos projetos e mensagens pelo formulário de contato e se protege contra abusos. Não há cookies nem publicidade.',
    updated: 'Atualizado em 11 de outubro de 2026.',
    sections: [
      {
        heading: 'Quem é o controlador',
        paragraphs: [`Tiago Rodrigues, autor deste site. Contato para qualquer assunto de privacidade: ${EMAIL}.`],
      },
      {
        heading: 'Contagem de visitas (GoatCounter)',
        paragraphs: [
          'Quando ativa, a contagem é feita pelo GoatCounter, um serviço de estatísticas sem cookies. Ele não grava o endereço IP nem a identificação completa do navegador; guarda apenas totais por página:',
        ],
        items: [
          'página visitada e site de origem (referrer);',
          'navegador e sistema (por exemplo, "Firefox 139", "Windows 11") e largura da tela;',
          'país, deduzido do endereço IP no momento da visita.',
        ],
        note: 'Para não contar a mesma pessoa duas vezes, o GoatCounter mantém em memória, por até 8 horas, um identificador aleatório da visita. Os dados ficam em servidores na Finlândia e na Alemanha; o serviço é operado na Irlanda.',
      },
      {
        heading: 'Registro de visitas no servidor do site',
        paragraphs: ['Quando o servidor do site está ativo, cada página visitada também é registrada nele:'],
        items: [
          'endereço IP e identificação do navegador (user agent);',
          'página visitada, idioma escolhido e data e hora;',
          'site de origem (referrer), apenas na primeira página da visita;',
          'tamanho da tela e fuso horário;',
          'um identificador aleatório da aba, guardado só durante a visita (sessionStorage), para agrupar páginas da mesma visita.',
        ],
      },
      {
        heading: 'Comentários nos projetos',
        paragraphs: [
          'Um comentário contém o nome que você escolher (pode ser um apelido), o texto, uma nota opcional, o projeto e a data. Ele só aparece no site depois de aprovado pelo autor.',
          'Não pedimos e-mail, e o endereço IP não é gravado com o comentário: o servidor o usa apenas em memória para limitar envios em massa (até 5 por hora) e o esquece em cerca de uma hora.',
        ],
      },
      {
        heading: 'Mensagens pelo formulário de contato',
        paragraphs: [
          'Uma mensagem contém o nome, o e-mail e o texto que você escrever, e a data. Ela não é publicada: só o autor a lê, no painel administrativo do site, e o e-mail serve apenas para responder.',
          'Quando os avisos por e-mail estão ativos, uma cópia da mensagem é enviada à caixa de entrada do autor pelo serviço Resend. O endereço IP é usado apenas em memória para limitar envios em massa (até 3 por hora) e não é gravado.',
        ],
      },
      {
        heading: 'Para que e com qual base legal',
        paragraphs: [
          'Contagem e registro de visitas: saber quais páginas são lidas e de onde vêm os visitantes, e identificar acessos abusivos. Base legal: legítimo interesse (LGPD, art. 7º, IX; para visitantes da União Europeia, GDPR, art. 6º, 1, f).',
          'Comentários: publicar a opinião que você decidiu enviar. Mensagens de contato: ler e responder ao que você escreveu. Base legal: consentimento (LGPD, art. 7º, I; GDPR, art. 6º, 1, a), que você pode revogar a qualquer momento pelo e-mail acima.',
          'Os dados não são vendidos nem usados para publicidade. São processados apenas pelos provedores que operam o site: GitHub Pages (páginas), Render (servidor), Neon (banco de dados), GoatCounter (estatísticas) e Resend (avisos por e-mail, quando ativos). Alguns desses servidores ficam fora do Brasil.',
        ],
      },
      {
        heading: 'Por quanto tempo',
        paragraphs: [
          'Registros de visita no servidor: apagados automaticamente após 90 dias. Totais do GoatCounter: não identificam ninguém e são mantidos enquanto o site usar o serviço. Comentários: até você pedir a exclusão ou o autor removê-los. Mensagens de contato: apagadas automaticamente após 12 meses, ou antes, a seu pedido.',
        ],
      },
      {
        heading: 'Seus direitos',
        paragraphs: [
          `Você pode pedir confirmação, acesso, correção ou exclusão dos seus dados (LGPD, art. 18) pelo e-mail ${EMAIL}. Para um comentário, informe o projeto, o nome usado e a data; para registros de visita, o endereço IP e o período.`,
          'Navegadores com o sinal Global Privacy Control ou "Do Not Track" ativado não são contados nem registrados. Você também pode desativar a contagem neste navegador pelo botão abaixo.',
        ],
      },
      {
        heading: 'Fontes e arquivos',
        paragraphs: ['As fontes tipográficas e as imagens são servidas pelo próprio site. Os únicos serviços externos chamados pelo navegador são o GoatCounter e o servidor do site, quando ativos.'],
      },
    ],
    statusTitle: 'Situação neste navegador',
    statusOff: 'A contagem de visitas está desativada neste site: nenhum dado é enviado.',
    statusBrowser: 'Seu navegador pede para não ser rastreado (Global Privacy Control ou Do Not Track): nenhum dado é enviado.',
    statusOptedOut: 'Você desativou a contagem de visitas neste navegador.',
    statusOn: 'As visitas deste navegador são contadas como descrito acima.',
    optOut: 'Não contar minhas visitas',
    optIn: 'Voltar a permitir a contagem',
  },
  en: {
    eyebrow: 'Privacy · LGPD / GDPR',
    title: 'How this site handles your data',
    intro: 'This portfolio may count visits to learn which pages readers find useful, accepts comments on its projects and messages through its contact form, and protects itself against abuse. There are no cookies and no advertising.',
    updated: 'Updated on 11 October 2026.',
    sections: [
      {
        heading: 'Who is responsible',
        paragraphs: [`Tiago Rodrigues, the author of this site. Contact for any privacy matter: ${EMAIL}.`],
      },
      {
        heading: 'Visit counting (GoatCounter)',
        paragraphs: [
          'When active, visits are counted by GoatCounter, a statistics service without cookies. It stores neither the IP address nor the full browser identification; it keeps only totals per page:',
        ],
        items: [
          'page visited and referring site;',
          'browser and system (for example "Firefox 139", "Windows 11") and screen width;',
          'country, derived from the IP address at the time of the visit.',
        ],
        note: 'To avoid counting the same person twice, GoatCounter keeps a random visit identifier in memory for up to 8 hours. The data is stored on servers in Finland and Germany; the service is operated from Ireland.',
      },
      {
        heading: 'Visit log on the site’s server',
        paragraphs: ['When the site’s server is active, each page visited is also logged there:'],
        items: [
          'IP address and browser identification (user agent);',
          'page visited, chosen language, date and time;',
          'referring site, on the first page of a visit only;',
          'screen size and time zone;',
          'a random tab identifier kept only for the visit (sessionStorage), to group the pages of one visit.',
        ],
      },
      {
        heading: 'Comments on projects',
        paragraphs: [
          'A comment holds the name you choose (a nickname is fine), the text, an optional rating, the project and the date. It appears on the site only after the author approves it.',
          'No e-mail is asked for, and the IP address is not stored with the comment: the server uses it only in memory to stop mass submissions (at most 5 per hour) and forgets it within about an hour.',
        ],
      },
      {
        heading: 'Messages through the contact form',
        paragraphs: [
          'A message holds the name, e-mail address and text you write, and the date. It is not published: only the author reads it, in the site’s admin panel, and the e-mail address is used only to reply.',
          'When e-mail alerts are on, a copy of the message is sent to the author’s inbox through the Resend service. The IP address is used only in memory to stop mass submissions (at most 3 per hour) and is not stored.',
        ],
      },
      {
        heading: 'Why, and on which legal basis',
        paragraphs: [
          'Visit counting and logging: learning which pages are read and where visitors come from, and spotting abusive traffic. Legal basis: legitimate interest (Brazilian LGPD, art. 7, IX; for visitors from the European Union, GDPR, art. 6(1)(f)).',
          'Comments: publishing the opinion you chose to send. Contact messages: reading and answering what you wrote. Legal basis: consent (LGPD, art. 7, I; GDPR, art. 6(1)(a)), which you can withdraw at any time at the address above.',
          'The data is not sold or used for advertising. It is processed only by the providers that run the site: GitHub Pages (pages), Render (server), Neon (database), GoatCounter (statistics) and Resend (e-mail alerts, when on). Some of these servers are outside Brazil.',
        ],
      },
      {
        heading: 'How long',
        paragraphs: [
          'Visit records on the server: deleted automatically after 90 days. GoatCounter totals: they identify no one and are kept while the site uses the service. Comments: until you ask for deletion or the author removes them. Contact messages: deleted automatically after 12 months, or earlier on request.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          `You can ask for confirmation, access, correction or deletion of your data (LGPD art. 18; GDPR arts. 15–17) at ${EMAIL}. For a comment, give the project, the name used and the date; for visit records, your IP address and the time of the visit.`,
          'Browsers sending Global Privacy Control or "Do Not Track" are neither counted nor logged. You can also switch counting off for this browser with the button below.',
        ],
      },
      {
        heading: 'Fonts and files',
        paragraphs: ['Fonts and images are served by the site itself. The only external services the browser calls are GoatCounter and the site’s server, when active.'],
      },
    ],
    statusTitle: 'Status in this browser',
    statusOff: 'Visit counting is switched off on this site: nothing is sent.',
    statusBrowser: 'Your browser asks not to be tracked (Global Privacy Control or Do Not Track): nothing is sent.',
    statusOptedOut: 'You switched visit counting off in this browser.',
    statusOn: 'Visits from this browser are counted as described above.',
    optOut: 'Do not count my visits',
    optIn: 'Allow counting again',
  },
  de: {
    eyebrow: 'Datenschutz · LGPD / DSGVO',
    title: 'Wie diese Website Ihre Daten verarbeitet',
    intro: 'Dieses Portfolio kann Besuche zählen, um zu sehen, welche Seiten für Lesende interessant sind, nimmt Kommentare zu den Projekten und Nachrichten über das Kontaktformular an und schützt sich vor Missbrauch. Es gibt keine Cookies und keine Werbung.',
    updated: 'Stand: 11. Oktober 2026.',
    sections: [
      {
        heading: 'Verantwortlicher',
        paragraphs: [`Tiago Rodrigues, Autor dieser Website. Kontakt für alle Datenschutzfragen: ${EMAIL}.`],
      },
      {
        heading: 'Besuchszählung (GoatCounter)',
        paragraphs: [
          'Wenn aktiv, zählt GoatCounter die Besuche, ein Statistikdienst ohne Cookies. Er speichert weder die IP-Adresse noch die vollständige Browserkennung, sondern nur Summen pro Seite:',
        ],
        items: [
          'besuchte Seite und verweisende Website;',
          'Browser und System (zum Beispiel „Firefox 139“, „Windows 11“) und Bildschirmbreite;',
          'Land, beim Besuch aus der IP-Adresse abgeleitet.',
        ],
        note: 'Damit dieselbe Person nicht doppelt gezählt wird, hält GoatCounter bis zu 8 Stunden lang eine zufällige Besuchskennung im Arbeitsspeicher. Die Daten liegen auf Servern in Finnland und Deutschland; betrieben wird der Dienst von Irland aus.',
      },
      {
        heading: 'Besuchsprotokoll auf dem Server der Website',
        paragraphs: ['Wenn der Server der Website aktiv ist, wird jede besuchte Seite zusätzlich dort protokolliert:'],
        items: [
          'IP-Adresse und Browserkennung (User-Agent);',
          'besuchte Seite, gewählte Sprache, Datum und Uhrzeit;',
          'verweisende Website, nur auf der ersten Seite eines Besuchs;',
          'Bildschirmgröße und Zeitzone;',
          'eine zufällige Tab-Kennung, nur für die Dauer des Besuchs gespeichert (sessionStorage), um die Seiten eines Besuchs zu gruppieren.',
        ],
      },
      {
        heading: 'Kommentare zu Projekten',
        paragraphs: [
          'Ein Kommentar enthält den Namen Ihrer Wahl (ein Spitzname genügt), den Text, eine optionale Bewertung, das Projekt und das Datum. Er erscheint erst nach Freigabe durch den Autor.',
          'Es wird keine E-Mail-Adresse abgefragt, und die IP-Adresse wird nicht mit dem Kommentar gespeichert: Der Server nutzt sie nur im Arbeitsspeicher, um Massensendungen zu begrenzen (höchstens 5 pro Stunde), und vergisst sie nach etwa einer Stunde.',
        ],
      },
      {
        heading: 'Nachrichten über das Kontaktformular',
        paragraphs: [
          'Eine Nachricht enthält Name, E-Mail-Adresse und Text, die Sie eingeben, sowie das Datum. Sie wird nicht veröffentlicht: Nur der Autor liest sie im Admin-Bereich der Website, und die E-Mail-Adresse dient nur der Antwort.',
          'Wenn E-Mail-Benachrichtigungen aktiv sind, wird eine Kopie der Nachricht über den Dienst Resend an das Postfach des Autors gesendet. Die IP-Adresse wird nur im Arbeitsspeicher genutzt, um Massensendungen zu begrenzen (höchstens 3 pro Stunde), und nicht gespeichert.',
        ],
      },
      {
        heading: 'Zweck und Rechtsgrundlage',
        paragraphs: [
          'Besuchszählung und -protokoll: sehen, welche Seiten gelesen werden und woher die Besucher kommen, und missbräuchliche Zugriffe erkennen. Rechtsgrundlage: berechtigtes Interesse (brasilianisches LGPD, Art. 7 IX; für Besucher aus der EU Art. 6 Abs. 1 lit. f DSGVO).',
          'Kommentare: Veröffentlichung der Meinung, die Sie senden möchten. Kontaktnachrichten: Lesen und Beantworten Ihrer Nachricht. Rechtsgrundlage: Einwilligung (LGPD Art. 7 I; Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit über die oben genannte Adresse widerrufen können.',
          'Die Daten werden weder verkauft noch für Werbung genutzt. Sie werden nur von den Anbietern verarbeitet, die die Website betreiben: GitHub Pages (Seiten), Render (Server), Neon (Datenbank), GoatCounter (Statistik) und Resend (E-Mail-Benachrichtigungen, wenn aktiv). Einige dieser Server stehen außerhalb Brasiliens.',
        ],
      },
      {
        heading: 'Speicherdauer',
        paragraphs: [
          'Besuchsprotokoll auf dem Server: nach 90 Tagen automatisch gelöscht. GoatCounter-Summen: identifizieren niemanden und bleiben gespeichert, solange die Website den Dienst nutzt. Kommentare: bis Sie die Löschung verlangen oder der Autor sie entfernt. Kontaktnachrichten: nach 12 Monaten automatisch gelöscht, auf Wunsch früher.',
        ],
      },
      {
        heading: 'Ihre Rechte',
        paragraphs: [
          `Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen (LGPD Art. 18; DSGVO Art. 15–17): ${EMAIL}. Nennen Sie für einen Kommentar das Projekt, den verwendeten Namen und das Datum, für Besuchsdaten Ihre IP-Adresse und den Zeitpunkt des Besuchs.`,
          'Browser mit aktiviertem Global Privacy Control oder „Do Not Track“ werden weder gezählt noch protokolliert. Sie können die Zählung für diesen Browser auch mit der Schaltfläche unten abschalten.',
        ],
      },
      {
        heading: 'Schriften und Dateien',
        paragraphs: ['Schriften und Bilder werden von der Website selbst ausgeliefert. Die einzigen externen Dienste, die der Browser aufruft, sind GoatCounter und der Server der Website, wenn sie aktiv sind.'],
      },
    ],
    statusTitle: 'Status in diesem Browser',
    statusOff: 'Die Besuchszählung ist auf dieser Website abgeschaltet: Es werden keine Daten gesendet.',
    statusBrowser: 'Ihr Browser bittet darum, nicht verfolgt zu werden (Global Privacy Control oder Do Not Track): Es werden keine Daten gesendet.',
    statusOptedOut: 'Sie haben die Besuchszählung in diesem Browser abgeschaltet.',
    statusOn: 'Besuche aus diesem Browser werden wie oben beschrieben gezählt.',
    optOut: 'Meine Besuche nicht zählen',
    optIn: 'Zählung wieder erlauben',
  },
};

@Component({
  selector: 'app-privacy',
  standalone: false,
  templateUrl: './privacy.html',
  styleUrls: ['./privacy.css'],
})
export class PrivacyComponent {
  /** Photo behind the page hero (shared/backdrop.directive.ts). */
  readonly photo = PHOTOS.privacy;

  private readonly analytics = inject(AnalyticsService);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly locale = injectLocale();
  readonly optedOut = signal(this.isBrowser && this.analytics.optedOut());

  get t(): PrivacyText {
    return TEXT[this.locale()];
  }

  get status(): string {
    if (!this.analytics.statisticsConfigured) {
      return this.t.statusOff;
    }
    if (this.analytics.browserOptOut()) {
      return this.t.statusBrowser;
    }
    return this.optedOut() ? this.t.statusOptedOut : this.t.statusOn;
  }

  get canToggle(): boolean {
    return this.isBrowser && this.analytics.statisticsConfigured && !this.analytics.browserOptOut();
  }

  toggle(): void {
    const next = !this.optedOut();
    this.analytics.setOptOut(next);
    this.optedOut.set(next);
  }
}
