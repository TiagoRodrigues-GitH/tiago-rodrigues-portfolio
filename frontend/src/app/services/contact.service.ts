import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/** What the form sends. `website` is a honeypot: hidden from people, filled by bots, discarded by the backend. */
export interface ContactDraft {
  name: string;
  email: string;
  message: string;
  website: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  receivedAt: string;
}

/** Limits enforced by the backend (ContactRules.java), repeated here for the form's hints. */
export const CONTACT_LIMITS = { name: 100, email: 200, messageMin: 10, messageMax: 5000 } as const;

/** Contact form: /api/contact (public) and /api/admin/messages (inbox, admin token). */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  /** False until a backend URL is configured: the page then offers e-mail only. */
  get available(): boolean {
    return this.auth.backendConfigured;
  }

  send(draft: ContactDraft): Observable<unknown> {
    return this.http.post(`${this.auth.apiUrl}/contact`, draft);
  }

  list(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.auth.apiUrl}/admin/messages`, { headers: this.auth.authHeaders() });
  }

  markRead(id: number, read: boolean): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${this.auth.apiUrl}/admin/messages/${id}/read`, { read }, {
      headers: this.auth.authHeaders(),
    });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.auth.apiUrl}/admin/messages/${id}`, { headers: this.auth.authHeaders() });
  }
}
