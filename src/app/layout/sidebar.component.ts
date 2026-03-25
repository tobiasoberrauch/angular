import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.sidebar--collapsed]="collapsed()">
      <div class="sidebar__header">
        <h1 class="sidebar__title">
          @if (!collapsed()) {
            Angular Workshop
          } @else {
            AW
          }
        </h1>
        <button class="sidebar__toggle" (click)="toggleCollapsed()">
          {{ collapsed() ? '▶' : '◀' }}
        </button>
      </div>
      <nav class="sidebar__nav">
        @for (item of navItems; track item.path) {
          <a
            class="sidebar__link"
            [routerLink]="item.path"
            routerLinkActive="sidebar__link--active"
          >
            <span class="sidebar__icon">{{ item.icon }}</span>
            @if (!collapsed()) {
              <span>{{ item.label }}</span>
            }
          </a>
        }
      </nav>
    </aside>
  `,
  styles: `
    .sidebar {
      width: var(--sidebar-width);
      background: var(--color-primary);
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.2s;
    }

    .sidebar--collapsed {
      width: 60px;
    }

    .sidebar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar__title {
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
    }

    .sidebar__toggle {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 12px;
      padding: var(--spacing-xs);
    }

    .sidebar__nav {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-sm) 0;
    }

    .sidebar__link {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: background-color 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        text-decoration: none;
      }
    }

    .sidebar__link--active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-weight: 500;
    }

    .sidebar__icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }
  `,
})
export class SidebarComponent {
  readonly collapsed = signal(false);

  readonly navItems = [
    { path: '/ecommerce', label: 'E-Commerce', icon: '🛒' },
    { path: '/tasks', label: 'Task Management', icon: '📋' },
    { path: '/hr', label: 'HR Portal', icon: '👥' },
    { path: '/crm', label: 'CRM', icon: '🤝' },
    { path: '/legacy', label: 'Legacy Module', icon: '📦' },
  ];

  toggleCollapsed(): void {
    this.collapsed.update((v) => !v);
  }
}
