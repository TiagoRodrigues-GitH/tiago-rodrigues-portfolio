import { Component, ElementRef, Input, QueryList, ViewChildren, signal } from '@angular/core';
import { GuideTab, GuideText } from './guide-content';
import { LINKS } from './guide-links';
import { PatentStatsComponent } from './patent-stats.component';

const TABS: GuideTab[] = ['assistant', 'intro', 'eligibility', 'search', 'steps', 'costs', 'stats', 'sources'];

/**
 * The patent section as tabs (WAI-ARIA tabs pattern: arrow keys, Home and End move between tabs): the question
 * assistant (projected), an introduction, eligibility, prior-art search, the filing steps, costs and deadlines,
 * statistics of the largest applicants, and the official sources.
 */
@Component({
  selector: 'app-patent-guide',
  imports: [PatentStatsComponent],
  templateUrl: './patent-guide.html',
  styleUrls: ['./patent-guide.css'],
})
export class PatentGuideComponent {
  @Input({ required: true }) t!: GuideText;
  @Input({ required: true }) lang = 'pt-BR';
  @ViewChildren('tabButton') private buttons?: QueryList<ElementRef<HTMLButtonElement>>;

  readonly tabs = TABS;
  readonly links = LINKS;
  readonly active = signal<GuideTab>('assistant');

  select(tab: GuideTab): void {
    this.active.set(tab);
  }

  onKey(event: KeyboardEvent, index: number): void {
    const last = TABS.length - 1;
    const next = event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0 : event.key === 'End' ? last : -1;
    if (next < 0) return;
    event.preventDefault();
    this.select(TABS[next]);
    this.buttons?.get(next)?.nativeElement.focus();
  }
}
