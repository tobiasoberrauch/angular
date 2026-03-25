import { Routes } from '@angular/router';

export const hrRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/employee-list/employee-list.component').then((m) => m.EmployeeListComponent),
  },
  {
    path: 'leave-request',
    loadComponent: () =>
      import('./ui/leave-request/leave-request.component').then((m) => m.LeaveRequestComponent),
  },
];
