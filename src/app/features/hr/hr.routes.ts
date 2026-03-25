import { Routes } from '@angular/router';

export const hrRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/employee-list/employee-list.component').then((m) => m.EmployeeListComponent),
  },
];
