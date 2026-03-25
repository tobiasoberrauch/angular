import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [class]="badgeClass()">{{ status() }}</span>`,
  styles: `
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
    }
    .badge--success { background: #e8f5e9; color: #2e7d32; }
    .badge--warning { background: #fff3e0; color: #ef6c00; }
    .badge--error { background: #ffebee; color: #c62828; }
    .badge--info { background: #e3f2fd; color: #1565c0; }
    .badge--default { background: var(--color-bg); color: var(--color-text-secondary); }
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
  readonly variant = input<'success' | 'warning' | 'error' | 'info' | 'default'>('default');

  readonly badgeClass = computed(() => `badge badge--${this.variant()}`);
}
