import { Component, Injector, OnDestroy, OnInit, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Locale } from '../../services/i18n.service';
import { PublicReview, REVIEW_LIMITS, ReviewService } from '../../services/review.service';
import { REVIEW_TEXT } from './review-text';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

/** After this long without an answer the free server is probably waking up: say so instead of looking stuck. */
const SLOW_MS = 3000;

/**
 * Comments under a project: approved comments, and a form whose submissions wait for the owner's approval.
 * Loads in the browser only (the projects page is prerendered without calling the API).
 */
@Component({
  selector: 'app-project-reviews',
  templateUrl: './project-reviews.component.html',
  styleUrls: ['./project-reviews.component.css'],
})
export class ProjectReviewsComponent implements OnInit, OnDestroy {
  private readonly reviews = inject(ReviewService);
  private readonly injector = inject(Injector);
  private slowTimer?: ReturnType<typeof setTimeout>;

  readonly projectKey = input.required<string>();
  readonly projectTitle = input.required<string>();
  readonly locale = input.required<Locale>();

  readonly limits = REVIEW_LIMITS;
  readonly ratings = [5, 4, 3, 2, 1];
  readonly available = this.reviews.available;
  readonly t = computed(() => REVIEW_TEXT[this.locale()]);

  readonly items = signal<PublicReview[]>([]);
  /** True until the first answer: avoids showing "no comments yet" while the server is still waking up. */
  readonly loading = signal(this.reviews.available);
  readonly slow = signal(false);
  readonly loadFailed = signal(false);
  readonly formOpen = signal(false);
  readonly name = signal('');
  readonly text = signal('');
  readonly rating = signal<number | null>(null);
  readonly honeypot = signal('');
  readonly state = signal<SendState>('idle');
  readonly errorMessage = signal('');
  readonly charsLeft = computed(() => this.limits.textMax - this.text().length);
  readonly canSend = computed(
    () => this.name().trim().length > 0 && this.text().trim().length >= this.limits.textMin && this.state() !== 'sending',
  );

  ngOnInit(): void {
    if (this.available) {
      afterNextRender(() => this.load(), { injector: this.injector });
    }
  }

  dateOf(review: PublicReview): string {
    return new Date(review.createdAt).toLocaleDateString(this.locale() === 'pt' ? 'pt-BR' : this.locale());
  }

  starsOf(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  open(): void {
    this.state.set('idle');
    this.formOpen.set(true);
  }

  close(): void {
    this.formOpen.set(false);
  }

  send(event: Event): void {
    event.preventDefault();
    if (!this.canSend()) {
      this.fail(this.t().invalid);
      return;
    }
    this.state.set('sending');
    this.startSlowTimer();
    this.reviews
      .submit({
        project: this.projectKey(),
        name: this.name().trim(),
        text: this.text().trim(),
        rating: this.rating(),
        website: this.honeypot(),
      })
      .subscribe({
        next: () => {
          this.settle();
          this.state.set('sent');
          this.formOpen.set(false);
          this.name.set('');
          this.text.set('');
          this.rating.set(null);
        },
        error: (error: HttpErrorResponse) => {
          this.settle();
          this.fail(this.messageFor(error));
        },
      });
  }

  ngOnDestroy(): void {
    clearTimeout(this.slowTimer);
  }

  private load(): void {
    this.startSlowTimer();
    this.reviews.approved(this.projectKey()).subscribe({
      next: (items) => {
        this.settle();
        this.items.set(items);
      },
      error: () => {
        this.settle();
        this.loadFailed.set(true);
      },
    });
  }

  private startSlowTimer(): void {
    clearTimeout(this.slowTimer);
    this.slowTimer = setTimeout(() => this.slow.set(true), SLOW_MS);
  }

  private settle(): void {
    clearTimeout(this.slowTimer);
    this.slow.set(false);
    this.loading.set(false);
  }

  private messageFor(error: HttpErrorResponse): string {
    if (error.status === 429) {
      return this.t().tooMany;
    }
    return error.status === 400 ? this.t().invalid : this.t().failed;
  }

  private fail(message: string): void {
    this.errorMessage.set(message);
    this.state.set('error');
  }
}
