import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CinemaComponent } from './shared/cinema/cinema.component';
import { WelcomeSoundComponent } from './shared/welcome-sound/welcome-sound.component';

@NgModule({
  declarations: [AppComponent],
  // Only what the shell (AppComponent) needs. Every page is a standalone component loaded by its route
  // (app-routing.module.ts), so the first download carries the framework, the shell and the translations.
  imports: [BrowserModule, AppRoutingModule, CinemaComponent, WelcomeSoundComponent],
  // Hydration reuses the prerendered DOM instead of re-creating it (less main-thread work, lower TBT/INP).
  // No event replay: it would need an inline script, which the Content-Security-Policy forbids.
  providers: [provideHttpClient(withFetch()), provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
