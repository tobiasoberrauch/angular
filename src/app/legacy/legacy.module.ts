import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LegacyDashboardComponent } from './legacy-dashboard/legacy-dashboard.component';
import { legacyRoutes } from './legacy.routes';

/**
 * LEGACY MODULE - NgModule Pattern (Pre-Angular 15)
 *
 * This module demonstrates the traditional NgModule-based architecture.
 * It exists for migration demonstration purposes.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  NgModule Concept          │  Standalone Equivalent                │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  declarations: [Comp]      │  Not needed — component is self-      │
 * │                            │  contained with standalone: true      │
 * │  imports: [CommonModule]   │  Per-component imports: [NgFor, ...]  │
 * │  imports: [RouterModule    │  Route uses loadComponent instead     │
 * │    .forChild(routes)]      │  of loadChildren with module          │
 * │  @NgModule({})             │  Not needed — removed entirely        │
 * │  standalone: false         │  standalone: true (default in v21)    │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * MIGRATION STEPS:
 * 1. Add `standalone: true` to component (or remove `standalone: false` in v21)
 * 2. Move CommonModule directives to component `imports` (NgFor → import {NgFor})
 *    In Angular 21, use control flow (@for, @if) instead of *ngFor, *ngIf
 * 3. Update route from `loadChildren` → `loadComponent`
 * 4. Delete this module file entirely
 *
 * See: src/app/features/ for standalone equivalents
 */
@NgModule({
  // declarations: Components owned by this module (not needed with standalone)
  declarations: [LegacyDashboardComponent],
  // imports: Dependencies shared across all declared components
  // With standalone, each component imports only what it needs
  imports: [CommonModule, RouterModule.forChild(legacyRoutes)],
})
export class LegacyModule {}
