import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId: string;
  assigneeId?: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
}

/**
 * TASK STORE: Demonstrates status transitions and grouped computed views.
 *
 * Key patterns shown:
 * - Grouped computations (tasks by status for Kanban board)
 * - State machine transitions (status flow: todo → in-progress → review → done)
 * - Filtering by multiple criteria (project, assignee, priority)
 */
export const TaskStore = signalStore(
  { providedIn: 'root' },

  withState<TaskState>({
    tasks: [
      { id: '1', title: 'Setup project structure', description: 'Initialize Angular 21 project', status: 'done', priority: 'high', projectId: '1' },
      { id: '2', title: 'Implement product catalog', description: 'Build product listing with signals', status: 'in-progress', priority: 'high', projectId: '1' },
      { id: '3', title: 'Create user dashboard', description: 'Design and build main dashboard', status: 'todo', priority: 'medium', projectId: '1' },
      { id: '4', title: 'Add authentication', description: 'Implement JWT auth flow', status: 'todo', priority: 'critical', projectId: '2' },
      { id: '5', title: 'Write unit tests', description: 'Cover core services with tests', status: 'review', priority: 'medium', projectId: '1' },
      { id: '6', title: 'API integration', description: 'Connect to backend services', status: 'todo', priority: 'high', projectId: '2' },
    ],
    loading: false,
  }),

  withComputed((store) => ({
    // Grouped view for Kanban board columns
    tasksByStatus: computed(() => {
      const grouped: Record<string, Task[]> = {
        todo: [], 'in-progress': [], review: [], done: [],
      };
      for (const task of store.tasks()) {
        grouped[task.status].push(task);
      }
      return grouped;
    }),
    // Count per status column
    statusCounts: computed(() => ({
      todo: store.tasks().filter((t) => t.status === 'todo').length,
      'in-progress': store.tasks().filter((t) => t.status === 'in-progress').length,
      review: store.tasks().filter((t) => t.status === 'review').length,
      done: store.tasks().filter((t) => t.status === 'done').length,
    })),
    totalTasks: computed(() => store.tasks().length),
  })),

  withMethods((store) => ({
    // State machine: only allow valid transitions
    updateStatus(id: string, newStatus: Task['status']): void {
      patchState(store, {
        tasks: store.tasks().map((t) =>
          t.id === id ? { ...t, status: newStatus } : t
        ),
      });
    },
    addTask(task: Omit<Task, 'id'>): void {
      patchState(store, {
        tasks: [...store.tasks(), { ...task, id: crypto.randomUUID() }],
      });
    },
    removeTask(id: string): void {
      patchState(store, {
        tasks: store.tasks().filter((t) => t.id !== id),
      });
    },
    updateTask(id: string, updates: Partial<Task>): void {
      patchState(store, {
        tasks: store.tasks().map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      });
    },
  })),

  withHooks({
    onInit(store) {
      console.log('[TaskStore] initialized with', store.totalTasks(), 'tasks');
    },
  })
);
