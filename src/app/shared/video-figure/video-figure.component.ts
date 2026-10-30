import { Component, ElementRef, Input, OnDestroy, ViewChild, afterNextRender, signal } from '@angular/core';
import { Locale } from '../../services/i18n.service';
import { VIDEO_CONTROLS, VIDEO_ORIGIN, VIDEO_THEME, VideoSlot, VideoSource, VideoTheme, videoSource } from '../../content/videos';

/** Neural graph of the `cinematic` (pt) overlay, in a 160 × 90 box. */
const NODES: Array<[number, number]> = [
  [14, 18], [38, 10], [62, 24], [88, 12], [112, 28], [140, 16],
  [26, 52], [52, 70], [78, 46], [104, 64], [130, 50], [150, 76],
];
const EDGES: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6], [1, 8], [2, 8], [6, 7], [7, 8],
  [8, 9], [3, 8], [4, 10], [9, 10], [10, 11], [5, 10], [9, 11], [6, 8],
];
/** Pointer reach (fraction of the width) within which a node lights up. */
const REACH = 0.2;
/** Crosshair snap of the `minimal` (de) overlay, in CSS pixels; 1 px reads as 0.25 mm. */
const SNAP = 8;

/**
 * A muted video loop in place of a still figure, or (`background`) a full-bleed section background
 * behind the content. It plays by itself whenever it is on screen and pauses off screen; the pause
 * button lets readers stop it (WCAG 2.2.2), and that choice sticks. The overlay is themed per language (see VideoTheme) and reacts to the pointer.
 * The stage is an image whose text alternative describes the loop (or hidden when `decorative`).
 */
@Component({
  selector: 'app-video-figure',
  standalone: false,
  templateUrl: './video-figure.component.html',
  styleUrls: ['./video-figure.component.css'],
  host: { '[class.is-bg]': 'background' },
})
export class VideoFigureComponent implements OnDestroy {
  @Input({ required: true }) slot!: VideoSlot;
  @Input() locale: Locale = 'pt';
  /** Hidden from assistive technology: the surrounding figcaption already describes the loop. */
  @Input() decorative = false;
  /** Full-bleed background of the parent section: loads at once, follows the pointer anywhere in the section. */
  @Input() background = false;
  /** Fill the parent's box (cards, tiles) instead of keeping a 16:9 frame. */
  @Input() fill = false;

  @ViewChild('video') private videoRef?: ElementRef<HTMLVideoElement>;

  readonly nodes = NODES;
  readonly edges = EDGES;

  /** The source is attached once the figure nears the viewport. */
  readonly near = signal(false);
  readonly playing = signal(false);
  /** Pointer position as fractions of the figure (0..1), or null when away. */
  readonly pointer = signal<{ x: number; y: number } | null>(null);
  /** Snapped crosshair of the minimal overlay, in pixels. */
  readonly cross = signal({ x: 0, y: 0 });

  /** Paused by the reader: visibility never restarts it. */
  private held = false;
  private visible = false;
  private observer?: IntersectionObserver;
  private readonly onDocumentPointer = (event: PointerEvent) => this.trackIfInside(event);

  constructor(private readonly host: ElementRef<HTMLElement>) {
    afterNextRender(() => this.start());
  }

  get theme(): VideoTheme {
    return VIDEO_THEME[this.locale];
  }

  get source(): VideoSource {
    return videoSource(this.slot, this.locale);
  }

  get origin(): string {
    return VIDEO_ORIGIN[this.locale];
  }

  get controls(): { pause: string; play: string } {
    return VIDEO_CONTROLS[this.locale];
  }

  get crossReadout(): string {
    const { x, y } = this.cross();
    const mm = (px: number) => String(Math.round(px / 4)).padStart(4, '0');
    return `X ${mm(x)} · Y ${mm(y)} mm`;
  }

  lit(index: number): boolean {
    const pointer = this.pointer();
    if (!pointer) {
      return false;
    }
    const [x, y] = NODES[index];
    return Math.hypot(x / 160 - pointer.x, (y / 90 - pointer.y) * 0.5625) < REACH;
  }

  track(event: PointerEvent): void {
    const box = this.host.nativeElement.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - box.left, 0), box.width);
    const y = Math.min(Math.max(event.clientY - box.top, 0), box.height);
    this.pointer.set({ x: x / box.width, y: y / box.height });
    this.cross.set({ x: Math.round(x / SNAP) * SNAP, y: Math.round(y / SNAP) * SNAP });
    this.host.nativeElement.style.setProperty('--px', (x / box.width - 0.5).toFixed(3));
    this.host.nativeElement.style.setProperty('--py', (y / box.height - 0.5).toFixed(3));
  }

  leave(): void {
    this.pointer.set(null);
    this.host.nativeElement.style.setProperty('--px', '0');
    this.host.nativeElement.style.setProperty('--py', '0');
  }

  toggle(): void {
    this.held = this.playing();
    if (this.held) {
      this.video?.pause();
    } else {
      this.near.set(true);
      this.play();
    }
  }

  /** A new source (language change) loads paused; resume it if it should be playing. */
  loaded(): void {
    if (this.visible && !this.held) {
      this.play();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    // Only the browser added it (start() runs after render); prerendering has no document.
    if (this.observer && this.background) {
      document.removeEventListener('pointermove', this.onDocumentPointer);
    }
  }

  /** Backgrounds sit under the section's content, so they listen to the whole document. */
  private trackIfInside(event: PointerEvent): void {
    const box = this.host.nativeElement.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (inside) {
      this.track(event);
    } else if (this.pointer()) {
      this.leave();
    }
  }

  private get video(): HTMLVideoElement | undefined {
    return this.videoRef?.nativeElement;
  }

  private start(): void {
    if (this.video) {
      this.video.muted = true;
    }
    if (this.background) {
      this.near.set(true);
      document.addEventListener('pointermove', this.onDocumentPointer, { passive: true });
    }
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible) {
          this.near.set(true);
          if (!this.held) {
            this.play();
          }
        } else {
          this.video?.pause();
        }
      },
      { rootMargin: '200px 0px' },
    );
    this.observer.observe(this.host.nativeElement);
  }

  private play(): void {
    // Runs after the src binding is rendered: the next frame has the source attached.
    requestAnimationFrame(() => this.video?.play().catch(() => this.playing.set(false)));
  }
}
