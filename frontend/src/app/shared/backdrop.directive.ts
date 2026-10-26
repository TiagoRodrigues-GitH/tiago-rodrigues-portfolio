import { DestroyRef, Directive, ElementRef, Renderer2, afterNextRender, inject, input } from '@angular/core';

/**
 * Photo behind a page hero that follows the pointer and the scroll a little (parallax), under a light veil that
 * keeps the text readable. Added in the browser only, after hydration, so the prerendered HTML stays the same;
 * with reduced motion the photo is shown still.
 *
 *   <section class="page-hero" appBackdrop="assets/images/photos/stelvio-pass.webp">
 */
@Directive({
  selector: '[appBackdrop]',
  host: { class: 'has-backdrop' },
})
export class BackdropDirective {
  readonly appBackdrop = input.required<string>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const host = this.host.nativeElement;
      const layer = this.renderer.createElement('div') as HTMLElement;
      layer.className = 'backdrop';
      layer.setAttribute('aria-hidden', 'true');
      const img = this.renderer.createElement('img') as HTMLImageElement;
      img.alt = '';
      img.decoding = 'async';
      img.src = this.appBackdrop();
      img.addEventListener('load', () => layer.classList.add('loaded'), { once: true });
      layer.appendChild(img);
      host.prepend(layer);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
}
