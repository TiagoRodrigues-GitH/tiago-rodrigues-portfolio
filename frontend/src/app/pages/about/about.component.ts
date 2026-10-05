import { Component, inject } from '@angular/core';
import { AboutTranslations, I18nService } from '../../services/i18n.service';
import { injectLocale } from '../../services/locale';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class AboutComponent {
  private readonly i18n = inject(I18nService);

  readonly locale = injectLocale();
  readonly resumeUrl = 'curriculo.pdf';
  readonly profileImage = 'assets/images/perfil_foto.jpeg';

  get t(): AboutTranslations {
    return this.i18n.about[this.locale()];
  }
}
