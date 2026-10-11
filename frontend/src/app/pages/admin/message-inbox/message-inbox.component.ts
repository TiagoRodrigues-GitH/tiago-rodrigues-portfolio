import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Locale } from '../../../services/i18n.service';
import { ContactMessage, ContactService } from '../../../services/contact.service';

const TEXT: Record<Locale, Record<string, string>> = {
  pt: {
    heading: 'Mensagens', hint: 'Enviadas pelo formulário de contato. Apagadas automaticamente após 12 meses (LGPD).',
    unread: 'não lidas', none: 'Nenhuma mensagem ainda.', loading: 'Carregando mensagens…',
    error: 'Não foi possível carregar as mensagens.', reply: 'Responder por e-mail', markRead: 'Marcar como lida',
    markUnread: 'Marcar como não lida', remove: 'Excluir', removeConfirm: 'Excluir esta mensagem definitivamente?',
    actionError: 'A ação não foi concluída. Tente de novo.', newLabel: 'Nova', replySubject: 'Re: sua mensagem pelo portfólio',
  },
  en: {
    heading: 'Messages', hint: 'Sent through the contact form. Deleted automatically after 12 months (LGPD).',
    unread: 'unread', none: 'No messages yet.', loading: 'Loading messages…',
    error: 'The messages could not be loaded.', reply: 'Reply by e-mail', markRead: 'Mark as read',
    markUnread: 'Mark as unread', remove: 'Delete', removeConfirm: 'Delete this message permanently?',
    actionError: 'The action did not complete. Please try again.', newLabel: 'New', replySubject: 'Re: your message via my portfolio',
  },
  de: {
    heading: 'Nachrichten', hint: 'Über das Kontaktformular gesendet. Nach 12 Monaten automatisch gelöscht (LGPD).',
    unread: 'ungelesen', none: 'Noch keine Nachrichten.', loading: 'Nachrichten werden geladen …',
    error: 'Die Nachrichten konnten nicht geladen werden.', reply: 'Per E-Mail antworten', markRead: 'Als gelesen markieren',
    markUnread: 'Als ungelesen markieren', remove: 'Löschen', removeConfirm: 'Diese Nachricht endgültig löschen?',
    actionError: 'Die Aktion wurde nicht abgeschlossen. Bitte erneut versuchen.', newLabel: 'Neu', replySubject: 'Re: Ihre Nachricht über mein Portfolio',
  },
};

/** Inbox of contact-form messages, shown inside the admin panel (admin token required by the backend). */
@Component({
  selector: 'app-message-inbox',
  imports: [DatePipe],
  templateUrl: './message-inbox.component.html',
  styleUrls: ['./message-inbox.component.css'],
})
export class MessageInboxComponent implements OnInit {
  private readonly contact = inject(ContactService);

  readonly locale = input.required<Locale>();
  readonly items = signal<ContactMessage[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly unread = computed(() => this.items().filter((m) => !m.read).length);

  get t(): Record<string, string> {
    return TEXT[this.locale()];
  }

  ngOnInit(): void {
    this.load();
  }

  replyLink(message: ContactMessage): string {
    return `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(this.t['replySubject'])}`;
  }

  toggleRead(message: ContactMessage): void {
    this.contact.markRead(message.id, !message.read).subscribe({
      next: (updated) => this.items.update((list) => list.map((m) => (m.id === updated.id ? updated : m))),
      error: () => this.error.set(this.t['actionError']),
    });
  }

  remove(message: ContactMessage): void {
    if (!window.confirm(this.t['removeConfirm'])) {
      return;
    }
    this.contact.remove(message.id).subscribe({
      next: () => this.items.update((list) => list.filter((m) => m.id !== message.id)),
      error: () => this.error.set(this.t['actionError']),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.contact.list().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.t['error']);
        this.loading.set(false);
      },
    });
  }
}
