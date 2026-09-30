import { Component, OnDestroy, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ContactTranslations, I18nService } from '../../services/i18n.service';
import { injectLocale } from '../../services/locale';

interface ProfileLink {
  label: string;
  handle: string;
  href: string;
  description: string;
}

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class ContactComponent implements OnDestroy {
  private readonly i18n = inject(I18nService);
  private readonly document = inject(DOCUMENT);
  private resetTimer?: ReturnType<typeof setTimeout>;

  readonly locale = injectLocale();
  readonly email = 'tiagorodrigues@alunos.utfpr.edu.br';
  readonly emailUser = this.email.split('@')[0];
  readonly emailDomain = this.email.split('@')[1];
  readonly profileImage = 'assets/images/perfil_foto.jpeg';
  readonly copyMessage = signal('');

  get t(): ContactTranslations {
    return this.i18n.contact[this.locale()];
  }

  get newTab(): string {
    return this.i18n.shell[this.locale()].newTab;
  }

  get profiles(): ProfileLink[] {
    return [
      {
        label: this.t.linkedInLabel,
        handle: 'in/tiagorodriguesde',
        href: 'https://www.linkedin.com/in/tiagorodriguesde/',
        description: this.t.linkedInDescription,
      },
      {
        label: this.t.githubLabel,
        handle: 'TiagoRodrigues-GitH',
        href: 'https://github.com/TiagoRodrigues-GitH',
        description: this.t.githubDescription,
      },
    ];
  }

  async copyEmail(): Promise<void> {
    try {
      await this.document.defaultView?.navigator.clipboard.writeText(this.email);
      this.copyMessage.set(this.t.copied);
    } catch {
      this.copyMessage.set(this.t.copyFailed);
    }
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copyMessage.set(''), 5000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.resetTimer);
  }
}
