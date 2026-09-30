import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';
import { injectLocale } from '../../services/locale';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly locale = injectLocale();
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly showPassword = signal(false);

  credentials: LoginRequest = {
    email: '',
    password: '',
  };

  ngOnInit(): void {
    // If already authenticated, redirect to admin
    this.authService.isAuthenticated().subscribe((isAuth) => {
      if (isAuth) {
        this.router.navigate(['/admin'], { queryParams: { lang: this.locale() } });
      }
    });
  }

  login(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage.set(this.t.required);
      return;
    }

    if (!this.isValidEmail(this.credentials.email)) {
      this.errorMessage.set(this.t.invalidEmail);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin'], { queryParams: { lang: this.locale() } });
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || this.t.loginError);
        console.error('Erro de autenticação:', error);
      },
    });
  }

  get t() {
    const locale = this.locale();
    return {
      eyebrow: locale === 'en' ? 'Restricted area' : locale === 'de' ? 'Geschützter Bereich' : 'Área restrita',
      title: locale === 'en' ? 'Administrative access' : locale === 'de' ? 'Administrativer Zugang' : 'Acesso administrativo',
      intro: locale === 'en' ? 'Sign in with your credentials.' : locale === 'de' ? 'Melden Sie sich mit Ihren Zugangsdaten an.' : 'Entre com suas credenciais.',
      email: locale === 'de' ? 'E-Mail' : locale === 'en' ? 'Email' : 'E-mail',
      password: locale === 'en' ? 'Password' : locale === 'de' ? 'Passwort' : 'Senha',
      showPassword: locale === 'en' ? 'Show password' : locale === 'de' ? 'Passwort anzeigen' : 'Mostrar senha',
      loading: locale === 'en' ? 'Signing in…' : locale === 'de' ? 'Anmeldung läuft …' : 'Entrando…',
      submit: locale === 'en' ? 'Sign in' : locale === 'de' ? 'Anmelden' : 'Entrar',
      footer: locale === 'en' ? 'No access? Contact the administrator.' : locale === 'de' ? 'Kein Zugang? Wenden Sie sich an die Administration.' : 'Não tem acesso? Entre em contato com o administrador.',
      required: locale === 'en' ? 'Please fill in all fields.' : locale === 'de' ? 'Bitte füllen Sie alle Felder aus.' : 'Preencha todos os campos.',
      invalidEmail: locale === 'en' ? 'Please enter a valid email address.' : locale === 'de' ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : 'Digite um endereço de e-mail válido.',
      loginError: locale === 'en' ? 'Sign-in failed. Check your credentials.' : locale === 'de' ? 'Die Anmeldung ist fehlgeschlagen. Bitte prüfen Sie Ihre Zugangsdaten.' : 'Não foi possível entrar. Verifique suas credenciais.',
    };
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
