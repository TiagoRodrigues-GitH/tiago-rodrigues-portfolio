import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeSoundComponent } from './welcome-sound.component';

/** Stands in for the browser's Audio: records what the component asks for, plays nothing. */
class FakeAudio {
  static created: FakeAudio[] = [];
  volume = 1;
  paused = true;
  private readonly listeners: Record<string, () => void> = {};

  constructor(readonly src: string) {
    FakeAudio.created.push(this);
  }

  addEventListener(type: string, listener: () => void): void {
    this.listeners[type] = listener;
  }

  play(): Promise<void> {
    this.paused = false;
    return Promise.resolve();
  }

  pause(): void {
    this.paused = true;
  }

  emit(type: string): void {
    this.listeners[type]?.();
  }
}

describe('WelcomeSoundComponent', () => {
  let fixture: ComponentFixture<WelcomeSoundComponent>;
  let button: HTMLButtonElement;
  const realAudio = globalThis.Audio;
  const last = () => FakeAudio.created[FakeAudio.created.length - 1];

  beforeEach(async () => {
    FakeAudio.created = [];
    (globalThis as unknown as { Audio: unknown }).Audio = FakeAudio;
    await TestBed.configureTestingModule({ imports: [WelcomeSoundComponent] }).compileComponents();
    fixture = TestBed.createComponent(WelcomeSoundComponent);
    fixture.componentRef.setInput('locale', 'pt');
    fixture.detectChanges();
    button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
  });

  afterEach(() => {
    fixture.destroy();
    (globalThis as unknown as { Audio: unknown }).Audio = realAudio;
  });

  it('plays nothing until the visitor presses the button', () => {
    expect(FakeAudio.created.length).toBe(0);
    expect(button.getAttribute('title')).toBe('Tocar música de fundo: Ernesto Nazareth — Odeon');
  });

  it('plays the piece of the page language, then pauses and resumes it', () => {
    button.click();
    expect(last().src).toBe('assets/audio/music-pt.mp3');
    expect(last().paused).toBe(false);
    expect(fixture.componentInstance.state()).toBe('playing');

    button.click();
    expect(last().paused).toBe(true);
    expect(fixture.componentInstance.state()).toBe('paused');

    button.click();
    expect(last().paused).toBe(false);
    expect(FakeAudio.created.length).toBe(1);
  });

  it('changes to the piece of the new language while playing', () => {
    button.click();
    fixture.componentRef.setInput('locale', 'de');
    fixture.detectChanges();
    expect(last().src).toBe('assets/audio/music-de.mp3');
    expect(last().paused).toBe(false);
    expect(fixture.componentInstance.state()).toBe('playing');
  });

  it('goes back to the start when the piece ends', () => {
    button.click();
    last().emit('ended');
    expect(fixture.componentInstance.state()).toBe('idle');
  });
});
