import { Routes } from '@angular/router';

export const tasksRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/task-board/task-board.component').then((m) => m.TaskBoardComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./ui/task-form/task-form.component').then((m) => m.TaskFormComponent),
  },
];
