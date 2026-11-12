import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Pages load with their route, so the first download is the framework and the shell only.
const loadHome = () => import('./pages/home/home.component').then((m) => m.HomeComponent);
const loadProjects = () => import('./pages/projects/projects.component').then((m) => m.ProjectsComponent);
const loadContact = () => import('./pages/contact/contact.component').then((m) => m.ContactComponent);
const loadAbout = () => import('./pages/about/about.component').then((m) => m.AboutComponent);
const loadPrivacy = () => import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent);

const routes: Routes = [
  { path: '', loadComponent: loadHome, data: { page: 'home' } },
  { path: 'projects', loadComponent: loadProjects, data: { page: 'projects' } },
  // one tab per portfolio area (shared/areas.ts)
  { path: 'projects/automotive', loadComponent: loadProjects, data: { page: 'projects', area: 'automotive' } },
  { path: 'projects/ai', loadComponent: loadProjects, data: { page: 'projects', area: 'ai' } },
  { path: 'projects/security', loadComponent: loadProjects, data: { page: 'projects', area: 'security' } },
  {
    path: 'projects/defect-triage',
    loadComponent: () => import('./pages/llm-lab/triage-page.component').then((m) => m.TriagePageComponent),
    data: { page: 'defectTriage' },
  },
  {
    path: 'projects/patent-assistant',
    loadComponent: () => import('./pages/llm-lab/patent-page.component').then((m) => m.PatentPageComponent),
    data: { page: 'patentAssistant' },
  },
  // the two projects shared one page until October 2026
  { path: 'projects/compact-llm', redirectTo: '/projects/defect-triage' },
  {
    path: 'projects/street-routing',
    loadComponent: () => import('./pages/street-routing/street-routing.component').then((m) => m.StreetRoutingComponent),
    data: { page: 'streetRouting' },
  },
  {
    path: 'game/capybara',
    loadComponent: () => import('./pages/capybara-game/capybara-game.component').then((m) => m.CapybaraGameComponent),
    data: { page: 'capybaraGame' },
  },
  { path: 'about', loadComponent: loadAbout, data: { page: 'about' } },
  { path: 'contact', loadComponent: loadContact, data: { page: 'contact' } },
  { path: 'privacy', loadComponent: loadPrivacy, data: { page: 'privacy' } },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    data: { page: 'login' },
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [AuthGuard],
    data: { page: 'admin' },
  },
  // Legacy URLs from earlier versions of the site
  { path: 'projects/:id', redirectTo: 'projects' },
  {
    path: 'language/:lang',
    redirectTo: ({ params }) => inject(Router).createUrlTree(['/'], { queryParams: { lang: params['lang'] } }),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  // Scrolling is handled in AppComponent so a language switch keeps the reader's position.
  // View transitions: pages cross-fade on navigation where the browser supports it (styles.css).
  imports: [RouterModule.forRoot(routes, { enableViewTransitions: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
