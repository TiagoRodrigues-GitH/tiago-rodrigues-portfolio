import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { AdasFigureComponent } from './shared/adas-figure/adas-figure.component';
import { LaneDiagramComponent } from './shared/lane-diagram/lane-diagram.component';
import { ProjectFigureComponent } from './shared/project-figure/project-figure.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    ContactComponent,
    AboutComponent,
    PrivacyComponent,
    AdasFigureComponent,
    LaneDiagramComponent,
    ProjectFigureComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  // Hydration reuses the prerendered DOM instead of re-creating it (less main-thread work, lower TBT/INP).
  // No event replay: it would need an inline script, which the Content-Security-Policy forbids.
  providers: [provideHttpClient(withFetch()), provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
