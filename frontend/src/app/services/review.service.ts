import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PublicReview {
  id: number;
  project: string;
  name: string;
  text: string;
  rating: number | null;
  createdAt: string;
}

export interface AdminReview extends PublicReview {
  status: ReviewStatus;
  moderatedAt: string | null;
}

/** What the form sends. `website` is a honeypot: hidden from people, filled by bots, discarded by the backend. */
export interface ReviewDraft {
  project: string;
  name: string;
  text: string;
  rating: number | null;
  website: string;
}

/** Limits enforced by the backend (ReviewRules.java), repeated here for the form's hints. */
export const REVIEW_LIMITS = { name: 60, textMin: 3, textMax: 1000 } as const;

/** Visitor comments on projects: /api/reviews (public) and /api/admin/reviews (moderation, admin token). */
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  /** False until a backend URL is configured: the comment section then explains it is unavailable. */
  get available(): boolean {
    return this.auth.backendConfigured;
  }

  approved(project: string): Observable<PublicReview[]> {
    return this.http.get<PublicReview[]>(`${this.auth.apiUrl}/reviews`, { params: { project } });
  }

  submit(draft: ReviewDraft): Observable<unknown> {
    return this.http.post(`${this.auth.apiUrl}/reviews`, draft);
  }

  list(status: ReviewStatus): Observable<AdminReview[]> {
    return this.http.get<AdminReview[]>(`${this.auth.apiUrl}/admin/reviews`, {
      params: { status },
      headers: this.auth.authHeaders(),
    });
  }

  moderate(id: number, status: ReviewStatus): Observable<AdminReview> {
    return this.http.put<AdminReview>(`${this.auth.apiUrl}/admin/reviews/${id}/status`, { status }, {
      headers: this.auth.authHeaders(),
    });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.auth.apiUrl}/admin/reviews/${id}`, { headers: this.auth.authHeaders() });
  }
}
