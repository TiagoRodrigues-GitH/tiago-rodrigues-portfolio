import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { AuthService } from '../../services/auth.service';
import { injectLocale } from '../../services/locale';

const EMPTY_PROJECT: Project = {
  title: '',
  description: '',
  mediaUrl: '',
  mediaType: 'IMAGE',
  thumbnailUrl: '',
  projectUrl: '',
  published: false,
  displayOrder: 0,
};

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals: HTTP callbacks do not trigger change detection in this zoneless app.
  readonly locale = injectLocale();
  readonly projects = signal<Project[]>([]);
  readonly isLoading = signal(false);
  readonly isCheckingAuth = signal(true);
  readonly editingId = signal<number | null>(null);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  newProject: Project = { ...EMPTY_PROJECT };

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin', lang: this.locale() } });
        return;
      }

      this.isCheckingAuth.set(false);
      this.loadProjects();
    });
  }

  get t() {
    const locale = this.locale();
    return {
      panel: locale === 'en' ? 'Admin panel' : locale === 'de' ? 'Admin-Bereich' : 'Painel administrativo',
      verify: locale === 'en' ? 'Verifying authentication…' : locale === 'de' ? 'Authentifizierung wird überprüft …' : 'Verificando autenticação…',
      createNew: locale === 'en' ? 'Create new project' : locale === 'de' ? 'Neues Projekt erstellen' : 'Criar novo projeto',
      editProject: locale === 'en' ? 'Edit project' : locale === 'de' ? 'Projekt bearbeiten' : 'Editar projeto',
      title: locale === 'en' ? 'Title' : locale === 'de' ? 'Titel' : 'Título',
      description: locale === 'en' ? 'Description' : locale === 'de' ? 'Beschreibung' : 'Descrição',
      requiredHint: locale === 'en' ? 'Fields marked with * are required.' : locale === 'de' ? 'Mit * markierte Felder sind Pflichtfelder.' : 'Campos marcados com * são obrigatórios.',
      published: locale === 'en' ? 'Published' : locale === 'de' ? 'Veröffentlicht' : 'Publicado',
      order: locale === 'en' ? 'Display order' : locale === 'de' ? 'Anzeigereihenfolge' : 'Ordem de exibição',
      create: locale === 'en' ? 'Create project' : locale === 'de' ? 'Projekt erstellen' : 'Criar projeto',
      update: locale === 'en' ? 'Update project' : locale === 'de' ? 'Projekt aktualisieren' : 'Atualizar projeto',
      cancel: locale === 'en' ? 'Cancel' : locale === 'de' ? 'Abbrechen' : 'Cancelar',
      list: locale === 'en' ? 'My projects' : locale === 'de' ? 'Meine Projekte' : 'Meus projetos',
      loading: locale === 'en' ? 'Loading projects…' : locale === 'de' ? 'Projekte werden geladen …' : 'Carregando projetos…',
      empty: locale === 'en' ? 'No project created yet.' : locale === 'de' ? 'Noch kein Projekt erstellt.' : 'Nenhum projeto criado ainda.',
      mediaUrl: locale === 'en' ? 'Media URL (image or video)' : locale === 'de' ? 'Medien-URL (Bild oder Video)' : 'URL da mídia (imagem ou vídeo)',
      mediaType: locale === 'en' ? 'Media type' : locale === 'de' ? 'Medientyp' : 'Tipo de mídia',
      thumbnailUrl: locale === 'en' ? 'Thumbnail URL' : locale === 'de' ? 'Vorschaubild-URL' : 'URL da miniatura',
      projectUrl: locale === 'en' ? 'Project URL' : locale === 'de' ? 'Projekt-URL' : 'URL do projeto',
      image: locale === 'en' ? 'Image' : locale === 'de' ? 'Bild' : 'Imagem',
      video: locale === 'en' ? 'Video' : locale === 'de' ? 'Video' : 'Vídeo',
      id: 'ID',
      actions: locale === 'en' ? 'Actions' : locale === 'de' ? 'Aktionen' : 'Ações',
      yes: locale === 'en' ? 'Yes' : locale === 'de' ? 'Ja' : 'Sim',
      no: locale === 'en' ? 'No' : locale === 'de' ? 'Nein' : 'Não',
      edit: locale === 'en' ? 'Edit' : locale === 'de' ? 'Bearbeiten' : 'Editar',
      delete: locale === 'en' ? 'Delete' : locale === 'de' ? 'Löschen' : 'Excluir',
      mediaUrlPlaceholder: locale === 'en' ? 'https://example.com/image.jpg' : locale === 'de' ? 'https://beispiel.de/bild.jpg' : 'https://exemplo.com/imagem.jpg',
      thumbnailUrlPlaceholder: locale === 'en' ? 'https://example.com/thumbnail.jpg' : locale === 'de' ? 'https://beispiel.de/vorschau.jpg' : 'https://exemplo.com/miniatura.jpg',
      projectUrlPlaceholder: locale === 'en' ? 'https://example.com' : locale === 'de' ? 'https://beispiel.de' : 'https://exemplo.com',
      loadError: locale === 'en' ? 'The projects could not be loaded.' : locale === 'de' ? 'Die Projekte konnten nicht geladen werden.' : 'Não foi possível carregar os projetos.',
      required: locale === 'en' ? 'Please fill in all required fields.' : locale === 'de' ? 'Bitte füllen Sie alle Pflichtfelder aus.' : 'Preencha todos os campos obrigatórios.',
      createSuccess: locale === 'en' ? 'Project created successfully.' : locale === 'de' ? 'Projekt erfolgreich erstellt.' : 'Projeto criado com sucesso.',
      createError: locale === 'en' ? 'Could not create the project. Check the backend and your permissions.' : locale === 'de' ? 'Das Projekt konnte nicht erstellt werden. Bitte prüfen Sie Backend und Berechtigungen.' : 'Não foi possível criar o projeto. Verifique o backend e suas permissões.',
      updateSuccess: locale === 'en' ? 'Project updated successfully.' : locale === 'de' ? 'Projekt erfolgreich aktualisiert.' : 'Projeto atualizado com sucesso.',
      updateError: locale === 'en' ? 'Could not update the project.' : locale === 'de' ? 'Das Projekt konnte nicht aktualisiert werden.' : 'Não foi possível atualizar o projeto.',
      deleteSuccess: locale === 'en' ? 'Project deleted successfully.' : locale === 'de' ? 'Projekt erfolgreich gelöscht.' : 'Projeto excluído com sucesso.',
      deleteError: locale === 'en' ? 'Could not delete the project.' : locale === 'de' ? 'Das Projekt konnte nicht gelöscht werden.' : 'Não foi possível excluir o projeto.',
      deleteConfirm: locale === 'en' ? 'Delete this project? This cannot be undone.' : locale === 'de' ? 'Dieses Projekt löschen? Das kann nicht rückgängig gemacht werden.' : 'Excluir este projeto? Esta ação não pode ser desfeita.',
    };
  }

  loadProjects() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.projectService.getProjects().subscribe({
      next: (data: Project[]) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Erro ao carregar projetos:', error);
        this.errorMessage.set(this.t.loadError);
        this.isLoading.set(false);
      },
    });
  }

  createProject() {
    if (!this.newProject.title || !this.newProject.description) {
      this.errorMessage.set(this.t.required);
      return;
    }

    this.projectService.createProject(this.newProject).subscribe({
      next: (data: Project) => {
        this.projects.update((projects) => [...projects, data]);
        this.resetForm();
        this.showSuccess(this.t.createSuccess);
      },
      error: (error: any) => {
        console.error('Erro:', error);
        this.errorMessage.set(this.t.createError);
      },
    });
  }

  updateProject() {
    const editingId = this.editingId();
    if (editingId === null || !this.newProject.title || !this.newProject.description) {
      this.errorMessage.set(this.t.required);
      return;
    }

    this.projectService.updateProject(editingId, this.newProject).subscribe({
      next: (data: Project) => {
        this.projects.update((projects) => projects.map((p) => (p.id === editingId ? data : p)));
        this.resetForm();
        this.showSuccess(this.t.updateSuccess);
      },
      error: (error: any) => {
        console.error('Erro:', error);
        this.errorMessage.set(this.t.updateError);
      },
    });
  }

  deleteProject(id: number | undefined) {
    if (!id) return;

    if (confirm(this.t.deleteConfirm)) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.projects.update((projects) => projects.filter((p) => p.id !== id));
          this.showSuccess(this.t.deleteSuccess);
        },
        error: (error: any) => {
          console.error('Erro:', error);
          this.errorMessage.set(this.t.deleteError);
        },
      });
    }
  }

  editProject(project: Project) {
    this.newProject = { ...project };
    this.editingId.set(project.id ?? null);
  }

  resetForm() {
    this.newProject = { ...EMPTY_PROJECT };
    this.editingId.set(null);
    this.errorMessage.set('');
  }

  submitForm() {
    if (this.editingId()) {
      this.updateProject();
    } else {
      this.createProject();
    }
  }

  private showSuccess(message: string) {
    this.errorMessage.set('');
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(''), 4000);
  }
}
