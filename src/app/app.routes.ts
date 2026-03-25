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
    // LEGACY: Uses loadChildren with NgModule — the pre-v15 pattern.
    // Compare with feature routes above that use loadComponent (standalone).
    //
    // Migration: Replace loadChildren → loadComponent, point to component directly:
    //   loadComponent: () => import('./legacy/legacy-dashboard/legacy-dashboard.component')
    //     .then(m => m.LegacyDashboardComponent)
    // Then delete legacy.module.ts entirely.
    path: 'legacy',
    loadChildren: () =>
      import('./legacy/legacy.module').then((m) => m.LegacyModule),
  },
];
