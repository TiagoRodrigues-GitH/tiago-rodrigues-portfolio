import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, numberAttribute } from '@angular/core';

/**
 * Subtle 3D tilt toward the pointer, with a light reflection that follows it (--tilt-x/--tilt-y
 * drive the transform and the highlight in styles.css). Only with a fine pointer and when motion
 * is allowed; keyboard and touch users see the card unchanged. Added after hydration, browser only.
 *
 *   <li class="project-card" appTilt>…</li>
 */
@Directive({
  selector: '[appTilt]',
  host: { class: 'tilt' },
})
export class TiltDirective {
  /** Maximum rotation in degrees. */
  readonly appTilt = input(6, { transform: (value: unknown) => numberAttribute(value, 6) });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;
      const win = el.ownerDocument.defaultView;
      if (!win || !win.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
        return;
      }
      let frame = 0;
      const move = (e: PointerEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          const max = this.appTilt();
          el.style.setProperty('--tilt-x', `${(-y * max).toFixed(2)}deg`);
          el.style.setProperty('--tilt-y', `${(x * max).toFixed(2)}deg`);
          el.style.setProperty('--glare-x', `${((x + 0.5) * 100).toFixed(1)}%`);
          el.style.setProperty('--glare-y', `${((y + 0.5) * 100).toFixed(1)}%`);
          el.classList.add('tilting');
        });
      };
      const leave = () => {
        cancelAnimationFrame(frame);
        el.classList.remove('tilting');
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
  }
}
