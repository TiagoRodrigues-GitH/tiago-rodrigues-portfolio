import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';
import { injectLangQuery, injectLocale } from '../../services/locale';
import { SPRITE_SVG, SpriteName } from '../../pages/capybara-game/capivara-sprites';

/** Source code of Avisa Aí (WhatsApp reminders), published on GitHub. */
export const AVISA_AI_REPO = 'https://github.com/TiagoRodrigues-GitH/avisa-ai';

const TEASERS = {
  pt: {
    section: 'Outros trabalhos',
    avisa: {
      eyebrow: 'Novo · código aberto',
      title: 'Avisa Aí',
      text: 'Lembretes pelo WhatsApp sem custo por mensagem, para clínicas, oficinas, lojas e entregas: o sistema prepara o aviso na hora certa e o atendente envia com um toque pelo link oficial wa.me. Backend em Java 17 e Spring Boot com arquitetura hexagonal, app Angular instalável (PWA) e regras cobertas por testes.',
      cta: 'Ver o código no GitHub',
      alt: 'Painel do Avisa Aí com os avisos do dia prontos para enviar pelo WhatsApp.',
    },
    game: {
      eyebrow: 'Extra · jogo no navegador',
      title: 'Trilha da Capivara',
      text: 'Um jogo brasileiro feito em TypeScript e Canvas: guie a capivara e os filhotes, colha açaí, caju e jabuticaba, fuja da onça-pintada e desvie das pedras. Sem paredes, com três ritmos e motor de regras coberto por testes.',
      cta: 'Jogar agora',
    },
  },
  en: {
    section: 'More work',
    avisa: {
      eyebrow: 'New · open source',
      title: 'Avisa Aí',
      text: 'WhatsApp reminders with no per-message cost, for clinics, repair shops, stores and deliveries: the system prepares each notice at the right time and the attendant sends it with one tap through the official wa.me link. Java 17 and Spring Boot backend with hexagonal architecture, installable Angular app (PWA) and rules covered by tests.',
      cta: 'See the code on GitHub',
      alt: 'Avisa Aí dashboard with the notices of the day ready to send over WhatsApp.',
    },
    game: {
      eyebrow: 'Bonus · browser game',
      title: 'Capybara Trail',
      text: 'A Brazilian-themed game built with TypeScript and Canvas: lead the capybara and her pups, pick açaí, cashew apples and jabuticabas, escape the jaguar and dodge the rocks. No walls, three paces and a fully tested rules engine.',
      cta: 'Play now',
    },
  },
  de: {
    section: 'Weitere Arbeiten',
    avisa: {
      eyebrow: 'Neu · Open Source',
      title: 'Avisa Aí',
      text: 'WhatsApp-Erinnerungen ohne Kosten pro Nachricht, für Praxen, Werkstätten, Läden und Lieferdienste: Das System bereitet jede Nachricht zum richtigen Zeitpunkt vor, und das Personal sendet sie mit einem Tippen über den offiziellen wa.me-Link. Backend mit Java 17 und Spring Boot in hexagonaler Architektur, installierbare Angular-App (PWA) und durch Tests abgesicherte Regeln.',
      cta: 'Code auf GitHub ansehen',
      alt: 'Übersicht von Avisa Aí mit den Nachrichten des Tages, bereit zum Senden über WhatsApp.',
    },
    game: {
      eyebrow: 'Extra · Browserspiel',
      title: 'Capybara-Pfad',
      text: 'Ein brasilianisches Spiel mit TypeScript und Canvas: Führe das Capybara und seine Jungen, sammle Açaí, Cashewäpfel und Jabuticabas, entkomme dem Jaguar und weiche Felsen aus. Ohne Wände, mit drei Tempostufen und einer vollständig getesteten Spiellogik.',
      cta: 'Jetzt spielen',
    },
  },
} as const;

/** Cards at the bottom of the projects page: the Avisa Aí repository and the browser game. */
@Component({
  selector: 'app-extra-teasers',
  templateUrl: './extra-teasers.component.html',
  styleUrls: ['./extra-teasers.component.css'],
  imports: [RouterLink],
})
export class ExtraTeasersComponent {
  private readonly i18n = inject(I18nService);

  readonly locale = injectLocale();
  readonly langQuery = injectLangQuery(this.locale);
  readonly text = computed(() => TEASERS[this.locale()]);
  readonly avisaRepo = AVISA_AI_REPO;

  get newTab(): string {
    return this.i18n.shell[this.locale()].newTab;
  }

  sprite(name: SpriteName): string {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SPRITE_SVG[name])}`;
  }
}
