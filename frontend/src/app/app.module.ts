import { ProjectReviewsComponent } from './shared/project-reviews/project-reviews.component';
import { ContactFormComponent } from './pages/contact/contact-form/contact-form.component';
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
import { NeuralHeroComponent } from './shared/neural-hero/neural-hero.component';
import { HomeHeroComponent } from './shared/home-hero/home-hero.component';
import { TiltDirective } from './shared/tilt.directive';
import { CinemaComponent } from './shared/cinema/cinema.component';
import { AreaDoorsComponent } from './shared/area-doors/area-doors.component';
import { CodeCardComponent } from './shared/code-card/code-card.component';
import { LaneDiagramComponent } from './shared/lane-diagram/lane-diagram.component';
import { ProjectFigureComponent } from './shared/project-figure/project-figure.component';
import { BlueprintFigureComponent } from './shared/blueprint-figure/blueprint-figure.component';
import { PendencyChartComponent } from './shared/pendency-chart/pendency-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    ContactComponent,
    AboutComponent,
    PrivacyComponent,
    AdasFigureComponent,
    NeuralHeroComponent,
    HomeHeroComponent,
    LaneDiagramComponent,
    ProjectFigureComponent,
    BlueprintFigureComponent,
    PendencyChartComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ProjectReviewsComponent, ContactFormComponent, AreaDoorsComponent, CodeCardComponent, TiltDirective, CinemaComponent],
  // Hydration reuses the prerendered DOM instead of re-creating it (less main-thread work, lower TBT/INP).
  // No event replay: it would need an inline script, which the Content-Security-Policy forbids.
  providers: [provideHttpClient(withFetch()), provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
