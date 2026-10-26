import {
  DestroyRef, Directive, ElementRef, Renderer2, afterNextRender, effect, inject, input, output, signal,
} from '@angular/core';

/**
 * Photo behind a page hero that follows the pointer and the scroll a little (parallax), under a light veil that
 * keeps the text readable. With several sources the photos cross-fade every `backdropInterval` ms. Added in the
 * browser only, after hydration, so the prerendered HTML stays the same; with reduced motion the first photo
 * is shown still, without parallax or rotation.
 *
 *   <section class="page-hero" [appBackdrop]="['a.webp', 'b.webp']" (backdropIndex)="place.set($event)">
 */
@Directive({
  selector: '[appBackdrop]',
  host: { class: 'has-backdrop' },
})
export class BackdropDirective {
  readonly appBackdrop = input.required<string | readonly string[]>();
  readonly backdropInterval = input(7000);
  /** Index of the photo now on screen. */
  readonly backdropIndex = output<number>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly layer = signal<HTMLElement | null>(null);
  private reduced = false;
  private index = 0;
  private timer = 0;

  constructor() {
    effect(() => {
      const layer = this.layer();
      const sources = this.sources();
      if (!layer || !sources.length) {
        return;
      }
      this.index = 0;
      this.show(layer, sources[0]);
      this.backdropIndex.emit(0);
      clearInterval(this.timer);
      if (sources.length > 1 && !this.reduced) {
        this.timer = window.setInterval(() => {
          if (document.hidden) {
            return;
          }
          this.index = (this.index + 1) % sources.length;
          this.show(layer, sources[this.index]);
          this.backdropIndex.emit(this.index);
        }, this.backdropInterval());
      }
    });

    afterNextRender(() => {
      const host = this.host.nativeElement;
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const layer = this.renderer.createElement('div') as HTMLElement;
      layer.className = 'backdrop';
      layer.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 2; i++) {
        const img = this.renderer.createElement('img') as HTMLImageElement;
        img.alt = '';
        img.decoding = 'async';
        layer.appendChild(img);
      }
      host.prepend(layer);
      this.layer.set(layer);
      this.destroyRef.onDestroy(() => clearInterval(this.timer));

      if (this.reduced) {
        return;
      }
      let frame = 0;
      const set = (x: number, y: number) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          layer.style.setProperty('--px', x.toFixed(3));
          layer.style.setProperty('--py', y.toFixed(3));
        });
      };
      const move = (event: PointerEvent) => {
        const box = host.getBoundingClientRect();
        set((event.clientX - box.left) / box.width - 0.5, (event.clientY - box.top) / box.height - 0.5);
      };
      const scroll = () => layer.style.setProperty('--scroll', String(Math.min(window.scrollY, 800)));
      host.addEventListener('pointermove', move);
      host.addEventListener('pointerleave', () => set(0, 0));
      window.addEventListener('scroll', scroll, { passive: true });
      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', scroll);
      });
    });
  }

  private sources(): readonly string[] {
    const value = this.appBackdrop();
    return typeof value === 'string' ? [value] : value;
  }

  /** Loads `src` into the hidden image and fades it in over the one on screen. */
  private show(layer: HTMLElement, src: string): void {
    const [a, b] = Array.from(layer.querySelectorAll('img'));
    const current = a.classList.contains('on') ? a : b.classList.contains('on') ? b : null;
    if (current?.getAttribute('src') === src) {
      return;
    }
    const next = current === a ? b : a;
    next.onload = () => {
      next.classList.add('on');
      current?.classList.remove('on');
      layer.classList.add('loaded');
    };
    if (next.getAttribute('src') === src && next.complete) {
      next.onload(new Event('load'));
    } else {
      next.src = src;
    }
  }
}
