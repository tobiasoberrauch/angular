import { Component, inject } from '@angular/core';
import { TaskStore } from '../../data-access/task.store';

@Component({
  selector: 'app-task-board',
  template: `
    <h2 class="page-title">Task Board</h2>
    <div class="board">
      @for (column of columns; track column.status) {
        <div class="board__column">
          <h3 class="board__column-header">
            {{ column.label }} ({{ taskStore.statusCounts()[column.status] }})
          </h3>
          @for (task of taskStore.tasksByStatus()[column.status]; track task.id) {
            <div class="card task-card" [class]="'priority--' + task.priority">
              <span class="task-card__priority">{{ task.priority }}</span>
              <p class="task-card__title">{{ task.title }}</p>
              <p class="task-card__desc">{{ task.description }}</p>
            </div>
          } @empty {
            <p class="board__empty">No tasks</p>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-md);
    }

    .board__column {
      background: var(--color-bg);
      border-radius: var(--radius);
      padding: var(--spacing-md);
      min-height: 300px;
    }

    .board__column-header {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: var(--spacing-md);
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    .board__empty { color: var(--color-text-secondary); font-style: italic; }

    .task-card {
      margin-bottom: var(--spacing-sm);
      border-left: 3px solid var(--color-border);
    }

    .priority--critical { border-left-color: var(--color-warn); }
    .priority--high { border-left-color: #ff9800; }
    .priority--medium { border-left-color: var(--color-primary); }
    .priority--low { border-left-color: var(--color-success); }

    .task-card__priority {
      font-size: 11px;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    .task-card__title { margin-top: var(--spacing-xs); }
    .task-card__desc { font-size: 12px; color: var(--color-text-secondary); margin-top: 2px; }
  `,
})
export class TaskBoardComponent {
  // Store injection — component has zero local state.
  // All state lives in the SignalStore, making it testable and shareable.
  readonly taskStore = inject(TaskStore);

  readonly columns = [
    { status: 'todo' as const, label: 'To Do' },
    { status: 'in-progress' as const, label: 'In Progress' },
    { status: 'review' as const, label: 'Review' },
    { status: 'done' as const, label: 'Done' },
  ];
}
