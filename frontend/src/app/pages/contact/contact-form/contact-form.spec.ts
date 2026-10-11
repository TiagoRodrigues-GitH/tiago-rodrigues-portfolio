import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Locale } from '../../../services/i18n.service';
import { ContactService } from '../../../services/contact.service';
import { CONTACT_FORM_TEXT } from '../contact-form-text';
import { ContactFormComponent } from './contact-form.component';

// The test build uses environment.ts, where apiUrl is '' (same origin): calls go to /api/...
function setUp(): HttpTestingController {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
  return TestBed.inject(HttpTestingController);
}

describe('Contact form text', () => {
  it('has the same entries in every language', () => {
    const keys = Object.keys(CONTACT_FORM_TEXT.pt).sort();
    for (const locale of ['en', 'de'] as Locale[]) {
      expect(Object.keys(CONTACT_FORM_TEXT[locale]).sort()).toEqual(keys);
    }
  });
});

describe('ContactService', () => {
  let http: HttpTestingController;
  let service: ContactService;

  beforeEach(() => {
    http = setUp();
    service = TestBed.inject(ContactService);
  });

  afterEach(() => http.verify());

  it('posts the message without credentials', () => {
    service.send({ name: 'Ana', email: 'ana@example.org', message: 'Hello there!', website: '' }).subscribe();
    const request = http.expectOne('/api/contact');
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ message: 'ok' }, { status: 202, statusText: 'Accepted' });
  });

  it('sends the admin token on inbox calls', () => {
    service.list().subscribe();
    service.markRead(3, true).subscribe();
    service.remove(3).subscribe();

    const list = http.expectOne((r) => r.method === 'GET' && r.url === '/api/admin/messages');
    const read = http.expectOne('/api/admin/messages/3/read');
    expect(read.request.method).toBe('PUT');
    expect(read.request.body).toEqual({ read: true });
    const remove = http.expectOne((r) => r.method === 'DELETE' && r.url === '/api/admin/messages/3');

    for (const request of [list, read, remove]) {
      expect(request.request.headers.get('Authorization')).toMatch(/^Bearer /);
      request.flush(null);
    }
  });
});

describe('ContactFormComponent', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<ContactFormComponent>;
  let element: HTMLElement;

  const text = CONTACT_FORM_TEXT.en;
  const typeInto = (selector: string, value: string) => {
    const field = element.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
    field.value = value;
    field.dispatchEvent(new Event('input'));
  };
  const submit = async () => {
    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    http = setUp();
    fixture = TestBed.createComponent(ContactFormComponent);
    fixture.componentRef.setInput('locale', 'en');
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('explains what is wrong instead of sending an invalid message', async () => {
    typeInto('#contact-name', 'Ana');
    typeInto('#contact-email', 'not-an-email');
    typeInto('#contact-message', 'Hello, a long enough message.');
    await submit();

    http.expectNone('/api/contact');
    expect(element.querySelector('.form-error')?.textContent).toBe(text.invalid);
  });

  it('sends the trimmed message with the honeypot and thanks the visitor', async () => {
    typeInto('#contact-name', '  Ana  ');
    typeInto('#contact-email', 'ana@example.org');
    typeInto('#contact-message', 'We have a Java position for you.');
    await submit();

    const post = http.expectOne('/api/contact');
    expect(post.request.body).toEqual({
      name: 'Ana', email: 'ana@example.org', message: 'We have a Java position for you.', website: '',
    });
    post.flush({ message: 'ok' }, { status: 202, statusText: 'Accepted' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(element.querySelector('.form-status')?.textContent).toBe(text.thanks);
  });

  it('explains the hourly limit', async () => {
    typeInto('#contact-name', 'Ana');
    typeInto('#contact-email', 'ana@example.org');
    typeInto('#contact-message', 'Another message, long enough.');
    await submit();

    http.expectOne('/api/contact').flush({ message: 'slow down' }, { status: 429, statusText: 'Too Many Requests' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(element.querySelector('.form-error')?.textContent).toBe(text.tooMany);
  });
});
