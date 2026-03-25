import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <div class="header__breadcrumb">
        Advanced Angular Workshop — Enterprise Demo
      </div>
      <div class="header__actions">
        <span class="header__badge">Angular 21</span>
      </div>
    </header>
  `,
  styles: `
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--header-height);
      padding: 0 var(--spacing-lg);
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }

    .header__breadcrumb {
      font-size: 15px;
      color: var(--color-text-secondary);
    }

    .header__badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--color-primary);
      color: white;
      font-size: 12px;
      font-weight: 500;
    }
  `,
})
export class HeaderComponent {}
