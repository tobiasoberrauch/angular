import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
}

export const ProjectStore = signalStore(
  { providedIn: 'root' },

  withState<ProjectState>({
    projects: [
      { id: '1', name: 'Angular Workshop', description: 'Enterprise Angular 21 training project', status: 'active' },
      { id: '2', name: 'API Migration', description: 'Migrate REST endpoints to GraphQL', status: 'active' },
      { id: '3', name: 'Legacy Cleanup', description: 'Remove deprecated NgModule patterns', status: 'completed' },
    ],
    loading: false,
  }),

  withComputed((store) => ({
    activeProjects: computed(() => store.projects().filter((p) => p.status === 'active')),
    projectCount: computed(() => store.projects().length),
  })),

  withMethods((store) => ({
    addProject(project: Omit<Project, 'id'>): void {
      patchState(store, {
        projects: [...store.projects(), { ...project, id: crypto.randomUUID() }],
      });
    },
    updateStatus(id: string, status: Project['status']): void {
      patchState(store, {
        projects: store.projects().map((p) => (p.id === id ? { ...p, status } : p)),
      });
    },
    removeProject(id: string): void {
      patchState(store, {
        projects: store.projects().filter((p) => p.id !== id),
      });
    },
  })),

  withHooks({
    onInit(store) {
      console.log('[ProjectStore] initialized with', store.projectCount(), 'projects');
    },
  })
);
