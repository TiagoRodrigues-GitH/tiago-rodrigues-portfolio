import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewEncapsulation, afterNextRender, computed, effect, inject, input, signal,
  viewChild,
} from '@angular/core';
import { CINEMA_CONTROLS, CinemaClip, cinemaSource } from '../../content/cinema';
import { Locale } from '../../services/i18n.service';

const PAUSE_KEY = 'cinema_paused';
/** Parts of the page through which the film is seen. */
const WINDOWS = '.has-backdrop, app-home-hero, .site-footer';

/**
 * One realistic film behind the whole page (content/cinema.ts). It is fixed to the viewport, so it keeps playing
 * the same shot while the reader scrolls and is seen through the dark "windows" of the page (heroes, the closing
 * call to action, the footer); reading sections scroll over it on their own light surface.
 *
 * Interaction: the film drifts against the pointer (depth), a soft light follows the cursor and lifts the veil
 * around it, and the shot pushes in slowly as the page is read. A new page cross-fades to its film.
 *
 * Accessibility and cost: decorative (aria-hidden); a pause button that is remembered (WCAG 2.2.2); a still poster
 * with reduced motion or Save-Data; 960 px files on small screens; playback stops while the tab is hidden.
 * Created in the browser only, after hydration, so the prerendered HTML has no video.
 */
@Component({
  selector: 'app-cinema',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #stage class="cinema" [attr.data-clip]="clip()" aria-hidden="true">
      <div #reel class="reel"></div>
      <div class="veil"></div>
      <div class="light"></div>
    </div>
    @if (motion()) {
      <button type="button" class="cinema-toggle" [class.away]="!inView()" [attr.aria-pressed]="paused()" (click)="toggle()">
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
  readonly clip = input.required<CinemaClip>();
  readonly locale = input<Locale>('pt');

  readonly controls = computed(() => CINEMA_CONTROLS[this.locale()]);
  /** Films play (true) or only their posters show (reduced motion, Save-Data). */
  readonly motion = signal(false);
  readonly paused = signal(false);
  /** A window onto the film (hero, call to action, footer) is on screen: the pause button shows. */
  readonly inView = signal(true);

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly reel = viewChild.required<ElementRef<HTMLElement>>('reel');
  private readonly destroyRef = inject(DestroyRef);
  private readonly ready = signal(false);
  private current: HTMLVideoElement | null = null;
  /** Re-reads pointer, scroll and windows on the next frame (set once the browser listeners exist). */
  private repaint = () => {};
  private small = false;

  constructor() {
    effect(() => {
      if (this.ready()) {
        this.show(this.clip());
        // the new page has rendered by the next tick: look for its windows again
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
      this.ready.set(true);
      if (!this.motion()) {
        return;
      }

      const el = this.stage().nativeElement;
      let frame = 0;
      let px = 0;
      let py = 0;
      const paint = () => {
        frame = 0;
        const max = document.documentElement.scrollHeight - win.innerHeight;
        el.style.setProperty('--px', px.toFixed(3));
        el.style.setProperty('--py', py.toFixed(3));
        el.style.setProperty('--progress', (max > 0 ? Math.min(win.scrollY / max, 1) : 0).toFixed(3));
        this.inView.set(Array.from(document.querySelectorAll(WINDOWS)).some((w) => {
          const box = w.getBoundingClientRect();
          return box.bottom > win.innerHeight * 0.25 && box.top < win.innerHeight * 0.85;
        }));
      };
      const queue = () => {
        frame ||= requestAnimationFrame(paint);
      };
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
      const visibility = () => (document.hidden ? this.current?.pause() : this.play(this.current));

      this.repaint = queue;
      win.addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('pointerleave', leave);
      win.addEventListener('scroll', queue, { passive: true });
      win.addEventListener('resize', queue, { passive: true });
      document.addEventListener('visibilitychange', visibility);
      queue();
      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        win.removeEventListener('pointermove', move);
        document.documentElement.removeEventListener('pointerleave', leave);
        win.removeEventListener('scroll', queue);
        win.removeEventListener('resize', queue);
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
      this.current?.pause();
    } else {
      this.play(this.current);
    }
  }

  /** Puts the clip's film on screen: the hidden video loads it and fades in over the one playing. */
  private show(clip: CinemaClip): void {
    const reel = this.reel().nativeElement;
    const source = cinemaSource(clip);
    const src = this.small ? source.small : source.large;
    if (this.current?.dataset['clip'] === clip) {
      return;
    }
    const previous = this.current;
    const next = document.createElement('video');
    next.dataset['clip'] = clip;
    next.muted = true;
    next.defaultMuted = true;
    next.loop = true;
    next.playsInline = true;
    next.setAttribute('playsinline', '');
    next.setAttribute('muted', '');
    next.setAttribute('tabindex', '-1');
    next.poster = source.poster;
    next.preload = this.motion() ? 'auto' : 'none';
    this.current = next;

    const reveal = () => {
      if (this.current !== next || next.classList.contains('on')) {
        return;
      }
      next.classList.add('on');
      if (previous) {
        previous.classList.remove('on');
        setTimeout(() => {
          previous.pause();
          previous.removeAttribute('src');
          previous.load();
          previous.remove();
        }, 1200);
      }
    };

    // fade in on the poster or the first frame, whichever is ready first (a paused film shows its poster)
    const still = new Image();
    still.onload = reveal;
    still.src = source.poster;
    if (this.motion()) {
      next.addEventListener('loadeddata', reveal, { once: true });
      next.src = src;
    }
    reel.appendChild(next);
    this.play(next);
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
