// src/app/models/project.model.ts
export interface Project {
  id?: number;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType: 'IMAGE' | 'VIDEO';
  thumbnailUrl?: string;
  projectUrl?: string;
  published: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}
