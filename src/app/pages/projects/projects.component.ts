import {
  Component,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  ViewChild,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { I18nService, ProjectsTranslations } from '../../services/i18n.service';
import { injectLocale } from '../../services/locale';
import { getPortfolioProjects } from '../../shared/portfolio-projects';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
})
export class ProjectsComponent implements OnDestroy {
  private readonly i18n = inject(I18nService);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  readonly locale = injectLocale();
  readonly projects = computed(() => getPortfolioProjects(this.locale()));
  readonly chassis = 'assets/images/blueprints/chassis.webp';

  private readonly viewer = signal<{ project: number; image: number } | null>(null);
  readonly activeProject = computed(() => {
    const viewer = this.viewer();
    return viewer ? this.projects()[viewer.project] : null;
  });
  readonly activeImage = computed(() => {
    const viewer = this.viewer();
    return viewer ? (this.activeProject()?.gallery[viewer.image] ?? null) : null;
  });

  @ViewChild('dialog') private dialog?: ElementRef<HTMLElement>;
  @ViewChild('closeButton') private closeButton?: ElementRef<HTMLButtonElement>;
  private returnFocus: HTMLElement | null = null;

  get t(): ProjectsTranslations {
    return this.i18n.projects[this.locale()];
  }

  get counter(): string {
    const total = this.activeProject()?.gallery.length ?? 0;
    const current = (this.viewer()?.image ?? 0) + 1;
    return this.t.counter.replace('{current}', String(current)).replace('{total}', String(total));
  }

  openImage(projectIndex: number, imageIndex: number, trigger: EventTarget | null): void {
    this.returnFocus = trigger instanceof HTMLElement ? trigger : null;
    this.viewer.set({ project: projectIndex, image: imageIndex });
    this.document.body.style.overflow = 'hidden';
    afterNextRender(() => this.closeButton?.nativeElement.focus(), { injector: this.injector });
  }

  closeImage(): void {
    if (!this.viewer()) {
      return;
    }
    this.viewer.set(null);
    this.document.body.style.overflow = '';
    this.returnFocus?.focus();
    this.returnFocus = null;
  }

  step(delta: number): void {
    const viewer = this.viewer();
    const total = this.activeProject()?.gallery.length ?? 0;
    if (!viewer || total < 2) {
      return;
    }
    this.viewer.set({ ...viewer, image: (viewer.image + delta + total) % total });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.viewer()) {
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeImage();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.step(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.step(1);
        break;
      case 'Tab':
        this.trapFocus(event);
        break;
    }
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
  }

  /** Keeps keyboard focus inside the open dialog (WCAG 2.4.3). */
  private trapFocus(event: KeyboardEvent): void {
    const buttons = Array.from(this.dialog?.nativeElement.querySelectorAll<HTMLElement>('button') ?? []);
    if (!buttons.length) {
      return;
    }
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    const active = this.document.activeElement;
    if (event.shiftKey && (active === first || !this.dialog?.nativeElement.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
