import { Routes } from '@angular/router';

export const crmRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/contact-list/contact-list.component').then((m) => m.ContactListComponent),
  },
];
