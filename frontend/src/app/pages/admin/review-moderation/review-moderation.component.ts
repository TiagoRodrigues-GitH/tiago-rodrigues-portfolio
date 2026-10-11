import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Locale } from '../../../services/i18n.service';
import { AdminReview, ReviewService, ReviewStatus } from '../../../services/review.service';

const TEXT: Record<Locale, Record<string, string>> = {
  pt: {
    heading: 'Comentários', hint: 'Comentários de visitantes só aparecem no site depois de aprovados.',
    PENDING: 'Aguardando', APPROVED: 'Aprovados', REJECTED: 'Recusados', show: 'Mostrar',
    none: 'Nenhum comentário aqui.', loading: 'Carregando comentários…', error: 'Não foi possível carregar os comentários.',
    approve: 'Aprovar', reject: 'Recusar', remove: 'Excluir', removeConfirm: 'Excluir este comentário definitivamente?',
    actionError: 'A ação não foi concluída. Tente de novo.', project: 'Projeto',
  },
  en: {
    heading: 'Comments', hint: 'Visitor comments appear on the site only after approval.',
    PENDING: 'Waiting', APPROVED: 'Approved', REJECTED: 'Rejected', show: 'Show',
    none: 'No comments here.', loading: 'Loading comments…', error: 'The comments could not be loaded.',
    approve: 'Approve', reject: 'Reject', remove: 'Delete', removeConfirm: 'Delete this comment permanently?',
    actionError: 'The action did not complete. Please try again.', project: 'Project',
  },
  de: {
    heading: 'Kommentare', hint: 'Besucherkommentare erscheinen erst nach der Freigabe auf der Website.',
    PENDING: 'Wartend', APPROVED: 'Freigegeben', REJECTED: 'Abgelehnt', show: 'Anzeigen',
    none: 'Keine Kommentare hier.', loading: 'Kommentare werden geladen …', error: 'Die Kommentare konnten nicht geladen werden.',
    approve: 'Freigeben', reject: 'Ablehnen', remove: 'Löschen', removeConfirm: 'Diesen Kommentar endgültig löschen?',
    actionError: 'Die Aktion wurde nicht abgeschlossen. Bitte erneut versuchen.', project: 'Projekt',
  },
};

/** Moderation queue of visitor comments, shown inside the admin panel (admin token required by the backend). */
@Component({
  selector: 'app-review-moderation',
  imports: [DatePipe],
  templateUrl: './review-moderation.component.html',
  styleUrls: ['./review-moderation.component.css'],
})
export class ReviewModerationComponent implements OnInit {
  private readonly reviews = inject(ReviewService);

  readonly locale = input.required<Locale>();
  readonly statuses: ReviewStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];
  readonly status = signal<ReviewStatus>('PENDING');
  readonly items = signal<AdminReview[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  get t(): Record<string, string> {
    return TEXT[this.locale()];
  }

  ngOnInit(): void {
    this.load();
  }

  show(status: ReviewStatus): void {
    this.status.set(status);
    this.load();
  }

  setStatus(review: AdminReview, status: ReviewStatus): void {
    this.reviews.moderate(review.id, status).subscribe({
      next: () => this.items.update((list) => list.filter((r) => r.id !== review.id)),
      error: () => this.error.set(this.t['actionError']),
    });
  }

  remove(review: AdminReview): void {
    if (!window.confirm(this.t['removeConfirm'])) {
      return;
    }
    this.reviews.remove(review.id).subscribe({
      next: () => this.items.update((list) => list.filter((r) => r.id !== review.id)),
      error: () => this.error.set(this.t['actionError']),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.reviews.list(this.status()).subscribe({
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
