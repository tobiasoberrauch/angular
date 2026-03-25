import { Component } from '@angular/core';

/**
 * LEGACY COMPONENT - NgModule Pattern
 *
 * Note: `standalone: false` must be explicitly set in Angular 21
 * because standalone is now the default.
 *
 * This component is declared in LegacyModule and uses:
 * - NgModule-level imports (CommonModule directives)
 * - Traditional change detection (Zone.js-based)
 * - No Signals (imperative state management)
 *
 * Workshop Exercise: Migrate this to a standalone component.
 */
@Component({
  standalone: false,
  selector: 'app-legacy-dashboard',
  template: `
    <h2 class="page-title">Legacy Dashboard (NgModule)</h2>
    <div class="card legacy-info">
      <h3>This component uses the legacy NgModule pattern</h3>
      <p>
        In Angular 21, standalone components are the default.
        This module demonstrates the traditional approach for migration exercises.
      </p>
      <ul>
        <li><code>standalone: false</code> — explicit opt-out from standalone default</li>
        <li>Declared in <code>LegacyModule</code> with <code>declarations</code> array</li>
        <li>Uses <code>CommonModule</code> via module-level imports</li>
        <li>Loaded via <code>loadChildren</code> (module-based lazy loading)</li>
      </ul>
      <h4>Workshop Task:</h4>
      <p>Convert this component to standalone and compare the patterns.</p>
    </div>
    <div class="stats">
      <div class="card stat-card" *ngFor="let stat of stats">
        <p class="stat-card__value">{{ stat.value }}</p>
        <p class="stat-card__label">{{ stat.label }}</p>
      </div>
    </div>
  `,
  styles: [
    `
    .legacy-info {
      margin-bottom: var(--spacing-lg);
      ul { margin: var(--spacing-sm) 0 var(--spacing-sm) var(--spacing-lg); }
      li { margin-bottom: var(--spacing-xs); }
      code { background: var(--color-bg); padding: 1px 4px; border-radius: 2px; font-size: 13px; }
    }
    .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--spacing-md); }
    .stat-card { text-align: center; }
    .stat-card__value { font-size: 32px; font-weight: 700; color: var(--color-primary); }
    .stat-card__label { color: var(--color-text-secondary); margin-top: var(--spacing-xs); }
    `,
  ],
})
export class LegacyDashboardComponent {
  stats = [
    { value: '4', label: 'Feature Modules' },
    { value: '10', label: 'Workshop Steps' },
    { value: '21', label: 'Angular Version' },
    { value: '103', label: 'Tasks' },
  ];
}
