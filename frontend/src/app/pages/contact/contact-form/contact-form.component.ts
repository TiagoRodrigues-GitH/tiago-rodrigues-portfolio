import { Component, OnDestroy, computed, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Locale } from '../../../services/i18n.service';
import { CONTACT_LIMITS, ContactService } from '../../../services/contact.service';
import { CONTACT_FORM_TEXT } from '../contact-form-text';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

/** After this long without an answer the free server is probably waking up: say so instead of looking stuck. */
const SLOW_MS = 3000;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Contact form; messages go to the owner's inbox in the admin panel (and, if configured, by e-mail). */
@Component({
  selector: 'app-contact-form',
  imports: [RouterLink],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent implements OnDestroy {
  private readonly contact = inject(ContactService);
  private slowTimer?: ReturnType<typeof setTimeout>;

  readonly locale = input.required<Locale>();
  readonly t = computed(() => CONTACT_FORM_TEXT[this.locale()]);
  readonly limits = CONTACT_LIMITS;
  readonly available = this.contact.available;

  readonly name = signal('');
  readonly email = signal('');
  readonly message = signal('');
  readonly honeypot = signal('');
  readonly state = signal<SendState>('idle');
  readonly slow = signal(false);
  readonly errorMessage = signal('');
  readonly charsLeft = computed(() => this.limits.messageMax - this.message().length);
  readonly valid = computed(
    () =>
      this.name().trim().length > 0 &&
      EMAIL.test(this.email().trim()) &&
      this.message().trim().length >= this.limits.messageMin,
  );

  send(event: Event): void {
    event.preventDefault();
    if (this.state() === 'sending') {
      return;
    }
    if (!this.valid()) {
      this.fail(this.t().invalid);
      return;
    }
    this.state.set('sending');
    this.slowTimer = setTimeout(() => this.slow.set(true), SLOW_MS);
    this.contact
      .send({
        name: this.name().trim(),
        email: this.email().trim(),
        message: this.message().trim(),
        website: this.honeypot(),
      })
      .subscribe({
        next: () => {
          this.settle();
          this.state.set('sent');
          this.name.set('');
          this.email.set('');
          this.message.set('');
        },
        error: (error: HttpErrorResponse) => {
          this.settle();
          this.fail(error.status === 429 ? this.t().tooMany : error.status === 400 ? this.t().invalid : this.t().failed);
        },
      });
  }

  again(): void {
    this.state.set('idle');
  }

  ngOnDestroy(): void {
    clearTimeout(this.slowTimer);
  }

  private settle(): void {
    clearTimeout(this.slowTimer);
    this.slow.set(false);
  }

  private fail(message: string): void {
    this.errorMessage.set(message);
    this.state.set('error');
  }
}
