import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Locale } from '../../services/i18n.service';
import { PublicReview, ReviewDraft, ReviewService } from '../../services/review.service';
import { ProjectReviewsComponent } from './project-reviews.component';
import { REVIEW_TEXT } from './review-text';

// The test build uses environment.ts, where apiUrl is '' (same origin): calls go to /api/...
const APPROVED: PublicReview = {
  id: 7,
  project: 'compact-llm',
  name: 'Ana',
  text: 'Clear write-up of the fine-tuning.',
  rating: 5,
  createdAt: '2026-10-01T12:00:00Z',
};

function setUp(): HttpTestingController {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  return TestBed.inject(HttpTestingController);
}

describe('Review text', () => {
  it('has the same entries in every language', () => {
    const keys = Object.keys(REVIEW_TEXT.pt).sort();
    for (const locale of ['en', 'de'] as Locale[]) {
      expect(Object.keys(REVIEW_TEXT[locale]).sort()).toEqual(keys);
    }
  });
});

describe('ReviewService', () => {
  let http: HttpTestingController;
  let service: ReviewService;

  beforeEach(() => {
    http = setUp();
    service = TestBed.inject(ReviewService);
  });

  afterEach(() => http.verify());

  it('reads the approved comments of one project without credentials', () => {
    service.approved('compact-llm').subscribe();
    const request = http.expectOne((r) => r.url === '/api/reviews');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('project')).toBe('compact-llm');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([]);
  });

  it('posts a draft, honeypot included, for the backend to judge', () => {
    const draft: ReviewDraft = { project: 'compact-llm', name: 'Ana', text: 'Nice', rating: null, website: '' };
    service.submit(draft).subscribe();
    const request = http.expectOne('/api/reviews');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(draft);
    request.flush({ message: 'ok' }, { status: 202, statusText: 'Accepted' });
  });

  it('sends the admin token on moderation calls', () => {
    service.list('PENDING').subscribe();
    service.moderate(7, 'APPROVED').subscribe();
    service.remove(7).subscribe();

    const list = http.expectOne((r) => r.url === '/api/admin/reviews');
    expect(list.request.params.get('status')).toBe('PENDING');
    const moderate = http.expectOne('/api/admin/reviews/7/status');
    expect(moderate.request.method).toBe('PUT');
    expect(moderate.request.body).toEqual({ status: 'APPROVED' });
    const remove = http.expectOne((r) => r.method === 'DELETE' && r.url === '/api/admin/reviews/7');

    for (const request of [list, moderate, remove]) {
      expect(request.request.headers.get('Authorization')).toMatch(/^Bearer /);
      request.flush(null);
    }
  });
});

describe('ProjectReviewsComponent', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<ProjectReviewsComponent>;
  let element: HTMLElement;

  const text = REVIEW_TEXT.en;
  const typeInto = (selector: string, value: string) => {
    const field = element.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
    field.value = value;
    field.dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    http = setUp();
    fixture = TestBed.createComponent(ProjectReviewsComponent);
    fixture.componentRef.setInput('projectKey', 'compact-llm');
    fixture.componentRef.setInput('projectTitle', 'Compact LLM');
    fixture.componentRef.setInput('locale', 'en');
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('lists the approved comments once rendered in the browser', async () => {
    http.expectOne((r) => r.url === '/api/reviews' && r.params.get('project') === 'compact-llm').flush([APPROVED]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(element.querySelector('.reviews-title')?.textContent).toContain('(1)');
    expect(element.querySelector('.review-text')?.textContent).toBe(APPROVED.text);
    expect(element.querySelector('.review-stars')?.getAttribute('aria-label')).toBe(text.stars(5));
  });

  it('keeps Send disabled until the comment is long enough, then explains a rate limit', async () => {
    http.expectOne((r) => r.url === '/api/reviews').flush([]);
    element.querySelector<HTMLButtonElement>('.reviews-open')!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const sendButton = () => element.querySelector<HTMLButtonElement>('.review-form button[type="submit"]')!;
    typeInto('#review-name-compact-llm', 'Ana');
    typeInto('#review-text-compact-llm', 'ok');
    fixture.detectChanges();
    expect(sendButton().disabled).toBe(true);

    typeInto('#review-text-compact-llm', 'Clear and useful.');
    fixture.detectChanges();
    expect(sendButton().disabled).toBe(false);

    sendButton().click();
    const post = http.expectOne((r) => r.method === 'POST' && r.url === '/api/reviews');
    expect(post.request.body).toEqual({
      project: 'compact-llm', name: 'Ana', text: 'Clear and useful.', rating: null, website: '',
    });
    post.flush({ message: 'slow down' }, { status: 429, statusText: 'Too Many Requests' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(element.querySelector('.reviews-error')?.textContent).toBe(text.tooMany);
  });
});
