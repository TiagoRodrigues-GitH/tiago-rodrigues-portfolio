import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewEncapsulation, afterNextRender, computed, effect, inject, input, signal,
  viewChild,
} from '@angular/core';
import { CINEMA_CONTROLS, CinemaClip, cinemaSource } from '../../content/cinema';
import { Locale } from '../../services/i18n.service';

const PAUSE_KEY = 'cinema_paused';
/** Sections that bring their own film: <section data-film="earth">. */
const FILM_SECTIONS = '[data-film]';
/** Films kept loaded (the one on screen, the ones just left and the ones coming next). */
const CACHE = 6;
/** Cross-fade between films, in ms (also in cinema.component.css). */
const FADE = 1600;

/**
 * Realistic films behind the whole page (content/cinema.ts), fixed to the viewport. The page has its film (`clip`);
 * a section marked `data-film` brings its own, which slowly cross-fades in when the section reaches the middle of
 * the screen, so the page reads as a sequence of shots, never as a cut. Hero windows show the film clearly; reading
 * sections are dark glass over it.
 *
 * Interaction: the film drifts against the pointer (depth), a soft light follows the cursor and lifts the veil
 * around it, and the shot pushes in slowly as the page is read.
 *
 * Accessibility and cost: decorative (aria-hidden); a pause button that is remembered (WCAG 2.2.2); posters only
 * with reduced motion or Save-Data; 960 px files on small screens; a section's film loads only when the section is
 * near; playback stops while the tab is hidden. Created in the browser only, after hydration, so the prerendered
 * HTML has no video.
 */
@Component({
  selector: 'app-cinema',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #stage class="cinema" [attr.data-clip]="active()" aria-hidden="true">
      <div #reel class="reel"></div>
      <div class="veil"></div>
      <div class="light"></div>
    </div>
    @if (motion()) {
      <button type="button" class="cinema-toggle" [attr.aria-pressed]="paused()" (click)="toggle()">
        <span class="icon" aria-hidden="true">{{ paused() ? '▶' : '❚❚' }}</span>
        <span class="visually-hidden">{{ paused() ? controls().play : controls().pause }}</span>
      </button>
    }
  `,
  styleUrl: './cinema.component.css',
  // the videos are created at runtime and carry no encapsulation attribute; the styles are scoped by .cinema
  encapsulation: ViewEncapsulation.None,
})
export class CinemaComponent {
  /** Film of the page; sections with `data-film` override it while they fill the middle of the screen. */
  readonly clip = input.required<CinemaClip>();
  readonly locale = input<Locale>('pt');

  readonly controls = computed(() => CINEMA_CONTROLS[this.locale()]);
  /** Films play (true) or only their posters show (reduced motion, Save-Data). */
  readonly motion = signal(false);
  readonly paused = signal(false);
  /** Film on screen. */
  readonly active = signal<CinemaClip | null>(null);

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly reel = viewChild.required<ElementRef<HTMLElement>>('reel');
  private readonly destroyRef = inject(DestroyRef);
  private readonly ready = signal(false);
  /** Loaded films, most recently used last. */
  private readonly films = new Map<CinemaClip, HTMLVideoElement>();
  /** Re-reads sections, scroll and pointer on the next frame (set once the browser listeners exist). */
  private repaint = () => {};
  private small = false;

  constructor() {
    effect(() => {
      this.clip();
      if (this.ready()) {
        // the new page has rendered by the next tick: look for its sections
        setTimeout(() => this.repaint());
      }
    });

    afterNextRender(() => {
      const win = window;
      const reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
      this.small = win.matchMedia('(max-width: 900px)').matches;
      this.motion.set(!reduced && !saveData);
      this.paused.set(this.readPaused());

      const el = this.stage().nativeElement;
      let frame = 0;
      let px = 0;
      let py = 0;
      const paint = () => {
        frame = 0;
        this.pickFilm(win.innerHeight);
        if (!this.motion()) {
          return;
        }
        const max = document.documentElement.scrollHeight - win.innerHeight;
        el.style.setProperty('--px', px.toFixed(3));
        el.style.setProperty('--py', py.toFixed(3));
        el.style.setProperty('--progress', (max > 0 ? Math.min(win.scrollY / max, 1) : 0).toFixed(3));
      };
      const queue = () => {
        frame ||= requestAnimationFrame(paint);
      };
      this.repaint = queue;
      win.addEventListener('scroll', queue, { passive: true });
      win.addEventListener('resize', queue, { passive: true });
      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        win.removeEventListener('scroll', queue);
        win.removeEventListener('resize', queue);
      });
      this.ready.set(true);
      queue();
      if (!this.motion()) {
        return;
      }

      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') {
          return;
        }
        px = event.clientX / win.innerWidth - 0.5;
        py = event.clientY / win.innerHeight - 0.5;
        el.style.setProperty('--mx', `${event.clientX}px`);
        el.style.setProperty('--my', `${event.clientY}px`);
        el.classList.add('lit');
        queue();
      };
      const leave = () => {
        px = py = 0;
        el.classList.remove('lit');
        queue();
      };
      const visibility = () => (document.hidden ? this.current()?.pause() : this.play(this.current()));
      win.addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('pointerleave', leave);
      document.addEventListener('visibilitychange', visibility);
      this.destroyRef.onDestroy(() => {
        win.removeEventListener('pointermove', move);
        document.documentElement.removeEventListener('pointerleave', leave);
        document.removeEventListener('visibilitychange', visibility);
      });
    });
  }

  toggle(): void {
    const paused = !this.paused();
    this.paused.set(paused);
    try {
      localStorage.setItem(PAUSE_KEY, paused ? '1' : '0');
    } catch {
      // storage blocked: the choice lasts for this visit only
    }
    if (paused) {
      this.current()?.pause();
    } else {
      this.play(this.current());
    }
  }

  /** The film of the section across the middle of the screen, else the page's; sections close by start loading. */
  private pickFilm(height: number): void {
    let film: CinemaClip = this.clip();
    for (const section of Array.from(document.querySelectorAll<HTMLElement>(FILM_SECTIONS))) {
      const box = section.getBoundingClientRect();
      const clip = section.dataset['film'] as CinemaClip;
      if (box.top <= height * 0.5 && box.bottom > height * 0.5) {
        film = clip;
      } else if (box.top < height * 1.6 && box.bottom > -height * 0.6) {
        this.load(clip);
      }
    }
    if (film !== this.active()) {
      this.show(film);
    }
  }

  private current(): HTMLVideoElement | null {
    const active = this.active();
    return active ? this.films.get(active) ?? null : null;
  }

  /** The film's video element, created (and its file requested) on first use. */
  private load(clip: CinemaClip): HTMLVideoElement {
    const cached = this.films.get(clip);
    if (cached) {
      this.films.delete(clip);
      this.films.set(clip, cached);
      return cached;
    }
    const source = cinemaSource(clip);
    const video = document.createElement('video');
    video.dataset['clip'] = clip;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('tabindex', '-1');
    video.poster = source.poster;
    if (this.motion()) {
      video.preload = 'auto';
      video.src = this.small ? source.small : source.large;
    } else {
      video.preload = 'none';
    }
    this.reel().nativeElement.appendChild(video);
    this.films.set(clip, video);
    this.evict();
    return video;
  }

  /** Cross-fades to the film: it fades in over the one playing once its poster or first frame is ready. */
  private show(clip: CinemaClip): void {
    const previous = this.current();
    this.active.set(clip);
    const next = this.load(clip);
    const reveal = () => {
      if (this.active() !== clip) {
        return;
      }
      next.classList.add('on');
      for (const video of this.films.values()) {
        if (video !== next && video.classList.contains('on')) {
          video.classList.remove('on');
          setTimeout(() => video !== this.current() && video.pause(), FADE);
        }
      }
    };
    if (next.readyState >= 2) {
      reveal();
    } else {
      next.addEventListener('loadeddata', reveal, { once: true });
      const still = new Image();
      still.onload = reveal;
      still.src = next.poster;
    }
    if (previous !== next) {
      this.play(next);
    }
  }

  /** Drops the least recently used films beyond the cache size (never the one on screen). */
  private evict(): void {
    for (const [clip, video] of this.films) {
      if (this.films.size <= CACHE) {
        return;
      }
      if (clip === this.active() || video.classList.contains('on')) {
        continue;
      }
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
      this.films.delete(clip);
    }
  }

  private play(video: HTMLVideoElement | null): void {
    if (!video || !this.motion() || this.paused() || document.hidden) {
      return;
    }
    video.play().catch(() => {
      // autoplay refused (e.g. low-power mode): the poster stays on screen
    });
  }

  private readPaused(): boolean {
    try {
      return localStorage.getItem(PAUSE_KEY) === '1';
    } catch {
      return false;
    }
  }
}
