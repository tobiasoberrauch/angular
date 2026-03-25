import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'ecommerce', pathMatch: 'full' },
  {
    path: 'ecommerce',
    loadChildren: () =>
      import('./features/ecommerce/ecommerce.routes').then((m) => m.ecommerceRoutes),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks/tasks.routes').then((m) => m.tasksRoutes),
  },
  {
    path: 'hr',
    loadChildren: () =>
      import('./features/hr/hr.routes').then((m) => m.hrRoutes),
  },
  {
    path: 'crm',
    loadChildren: () =>
      import('./features/crm/crm.routes').then((m) => m.crmRoutes),
  },
  {
    // Legacy module uses loadChildren with NgModule (migration demo)
    path: 'legacy',
    loadChildren: () =>
      import('./legacy/legacy.module').then((m) => m.LegacyModule),
  },
];
