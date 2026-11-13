import { Component, Input, OnChanges, OnDestroy, SimpleChanges, signal } from '@angular/core';
import { MUSIC } from '../../content/music';
import { Locale } from '../../services/i18n.service';

/** The files are already very quiet (content/music.ts); this trims them a little more where the browser allows. */
const VOLUME = 0.6;
/** Cross-fade when the language (and so the piece) changes, in ms. */
const SWITCH_FADE_MS = 800;

const TEXT: Record<Locale, { play: string; pause: string; resume: string }> = {
  pt: { play: 'Tocar música de fundo', pause: 'Pausar a música', resume: 'Continuar a música' },
  en: { play: 'Play background music', pause: 'Pause music', resume: 'Resume music' },
  de: { play: 'Hintergrundmusik abspielen', pause: 'Musik anhalten', resume: 'Musik fortsetzen' },
};

type State = 'idle' | 'playing' | 'paused';

/**
 * Music button of the site shell, twin of the film's pause button (other corner). Nothing plays until the visitor
 * presses it (no autoplay, WCAG 1.4.2): then the piece of the page language (content/music.ts) plays once, very
 * quietly, and fades out at its end. Pressing while it plays pauses it; pressing again resumes. When the visitor
 * changes language while it plays, it cross-fades to that language's piece. The shell keeps it alive across pages.
 */
@Component({
  selector: 'app-welcome-sound',
  templateUrl: './welcome-sound.component.html',
  styleUrls: ['./welcome-sound.component.css'],
})
export class WelcomeSoundComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) locale: Locale = 'pt';

  readonly state = signal<State>('idle');

  private audio: HTMLAudioElement | null = null;

  get label(): string {
    const text = TEXT[this.locale];
    const action = { idle: text.play, playing: text.pause, paused: text.resume }[this.state()];
    return `${action}: ${MUSIC[this.locale].title}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const previous = this.audio;
    if (!changes['locale'] || changes['locale'].firstChange || !previous) {
      return;
    }
    if (this.state() === 'playing') {
      this.fade(previous, 0, () => previous.pause());
      this.start(0);
    } else {
      // paused on the other language's piece: the next press starts this language's piece
      this.audio = null;
      this.state.set('idle');
    }
  }

  toggle(): void {
    switch (this.state()) {
      case 'idle':
        this.start(VOLUME);
        break;
      case 'playing':
        this.audio?.pause();
        this.state.set('paused');
        break;
      case 'paused':
        this.state.set('playing');
        this.audio?.play().catch(() => this.finish(this.audio));
        break;
    }
  }

  ngOnDestroy(): void {
    this.audio?.pause();
    this.audio = null;
  }

  /** Plays the piece of the current language from its beginning, fading in from `from` when it is below VOLUME. */
  private start(from: number): void {
    const audio = new Audio(MUSIC[this.locale].src);
    audio.volume = from;
    audio.addEventListener('ended', () => this.finish(audio), { once: true });
    audio.addEventListener('error', () => this.finish(audio), { once: true });
    this.audio = audio;
    this.state.set('playing');
    audio.play().catch(() => this.finish(audio));
    if (from < VOLUME) {
      this.fade(audio, VOLUME);
    }
  }

  /** The piece ended (or could not play): back to the start, unless another piece has taken over. */
  private finish(audio: HTMLAudioElement | null): void {
    if (audio && this.audio === audio) {
      this.audio = null;
      this.state.set('idle');
    }
  }

  private fade(audio: HTMLAudioElement, to: number, done?: () => void): void {
    const from = audio.volume;
    const steps = 16;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      audio.volume = Math.min(1, Math.max(0, from + ((to - from) * step) / steps));
      if (step >= steps) {
        clearInterval(timer);
        done?.();
      }
    }, SWITCH_FADE_MS / steps);
  }
}
