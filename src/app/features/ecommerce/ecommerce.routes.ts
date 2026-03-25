import { Routes } from '@angular/router';

export const ecommerceRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/product-list/product-list.component').then((m) => m.ProductListComponent),
  },
];
