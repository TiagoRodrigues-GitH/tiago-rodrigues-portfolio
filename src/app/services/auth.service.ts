// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

/**
 * JWT login against portfolio-backend (POST /api/auth/login).
 * The token lives in sessionStorage (gone when the tab closes) and is dropped
 * as soon as it expires; the backend re-checks it on every admin request.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Base of the API ('' + '/api' = same origin through the dev proxy). */
  readonly apiUrl = environment.apiUrl === null ? '' : `${environment.apiUrl}/api`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private tokenKey = 'auth_token';
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.isAuthenticatedSubject.next(this.hasToken());
    }
  }

  /** False on GitHub Pages until a backend URL is configured in environment.prod.ts. */
  get backendConfigured(): boolean {
    return environment.apiUrl !== null;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (!this.backendConfigured) {
      return throwError(() => ({ status: 0, error: { message: 'backend-not-configured' } }));
    }
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            sessionStorage.setItem(this.tokenKey, response.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.tokenKey);
      this.isAuthenticatedSubject.next(false);
    }
  }

  isAuthenticated(): Observable<boolean> {
    if (this.isBrowser && this.isAuthenticatedSubject.value && !this.hasToken()) {
      this.isAuthenticatedSubject.next(false);
    }
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    const token = sessionStorage.getItem(this.tokenKey);
    if (token && this.isExpired(token)) {
      sessionStorage.removeItem(this.tokenKey);
      return null;
    }
    return token;
  }

  private hasToken(): boolean {
    return this.isBrowser && !!this.getToken();
  }

  /** Reads the `exp` claim; the signature is verified by the backend, not here. */
  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
