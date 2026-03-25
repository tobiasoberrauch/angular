import { Component, signal, computed } from '@angular/core';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

@Component({
  selector: 'app-task-board',
  template: `
    <h2 class="page-title">Task Board</h2>
    <div class="board">
      @for (column of columns; track column.status) {
        <div class="board__column">
          <h3 class="board__column-header">
            {{ column.label }} ({{ columnCounts()[column.status] }})
          </h3>
          @for (task of tasksByStatus()[column.status]; track task.id) {
            <div class="card task-card" [class]="'priority--' + task.priority">
              <span class="task-card__priority">{{ task.priority }}</span>
              <p class="task-card__title">{{ task.title }}</p>
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
  `,
})
export class TaskBoardComponent {
  readonly columns = [
    { status: 'todo' as const, label: 'To Do' },
    { status: 'in-progress' as const, label: 'In Progress' },
    { status: 'review' as const, label: 'Review' },
    { status: 'done' as const, label: 'Done' },
  ];

  readonly tasks = signal<Task[]>([
    { id: '1', title: 'Setup project structure', status: 'done', priority: 'high' },
    { id: '2', title: 'Implement product catalog', status: 'in-progress', priority: 'high' },
    { id: '3', title: 'Create user dashboard', status: 'todo', priority: 'medium' },
    { id: '4', title: 'Add authentication', status: 'todo', priority: 'critical' },
    { id: '5', title: 'Write unit tests', status: 'review', priority: 'medium' },
  ]);

  readonly tasksByStatus = computed(() => {
    const grouped: Record<string, Task[]> = { todo: [], 'in-progress': [], review: [], done: [] };
    for (const task of this.tasks()) {
      grouped[task.status].push(task);
    }
    return grouped;
  });

  readonly columnCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const col of this.columns) {
      counts[col.status] = this.tasksByStatus()[col.status].length;
    }
    return counts;
  });
}
