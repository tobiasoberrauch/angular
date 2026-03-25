import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LegacyDashboardComponent } from './legacy-dashboard/legacy-dashboard.component';
import { legacyRoutes } from './legacy.routes';

/**
 * LEGACY MODULE - NgModule Pattern (Pre-Angular 15)
 *
 * This module demonstrates the traditional NgModule-based architecture.
 * It exists for migration demonstration purposes:
 *
 * - Components use `standalone: false` (explicit opt-out in Angular 21)
 * - Imports are managed at the module level, not per-component
 * - Routing uses `loadChildren` with NgModule instead of `loadComponent`
 *
 * In step-02 of the workshop, participants will migrate this to
 * standalone components and compare the patterns.
 */
@NgModule({
  declarations: [LegacyDashboardComponent],
  imports: [CommonModule, RouterModule.forChild(legacyRoutes)],
})
export class LegacyModule {}
