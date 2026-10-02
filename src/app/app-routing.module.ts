import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { page: 'home' } },
  { path: 'projects', component: ProjectsComponent, data: { page: 'projects' } },
  {
    path: 'projects/compact-llm',
    loadComponent: () => import('./pages/llm-lab/llm-lab.component').then((m) => m.LlmLabComponent),
    data: { page: 'llmLab' },
  },
  { path: 'about', component: AboutComponent, data: { page: 'about' } },
  { path: 'contact', component: ContactComponent, data: { page: 'contact' } },
  { path: 'privacy', component: PrivacyComponent, data: { page: 'privacy' } },
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
