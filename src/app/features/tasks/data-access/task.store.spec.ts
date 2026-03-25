import { TestBed } from '@angular/core/testing';
import { TaskStore } from './task.store';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TaskStore', () => {
  let store: InstanceType<typeof TaskStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(TaskStore);
  });

  it('should initialize with seed tasks', () => {
    expect(store.tasks().length).toBeGreaterThan(0);
    expect(store.totalTasks()).toBe(store.tasks().length);
  });

  it('should group tasks by status for Kanban view', () => {
    const grouped = store.tasksByStatus();

    expect(grouped['todo']).toBeDefined();
    expect(grouped['in-progress']).toBeDefined();
    expect(grouped['review']).toBeDefined();
    expect(grouped['done']).toBeDefined();

    // All tasks should be accounted for
    const totalGrouped = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
    expect(totalGrouped).toBe(store.totalTasks());
  });

  it('should compute status counts correctly', () => {
    const counts = store.statusCounts();
    const tasks = store.tasks();

    expect(counts['todo']).toBe(tasks.filter((t) => t.status === 'todo').length);
    expect(counts['done']).toBe(tasks.filter((t) => t.status === 'done').length);
  });

  it('should update task status (state transition)', () => {
    const todoTask = store.tasks().find((t) => t.status === 'todo')!;

    store.updateStatus(todoTask.id, 'in-progress');

    const updated = store.tasks().find((t) => t.id === todoTask.id)!;
    expect(updated.status).toBe('in-progress');
  });

  it('should add a new task', () => {
    const before = store.totalTasks();

    store.addTask({
      title: 'New Task',
      description: 'Test task',
      status: 'todo',
      priority: 'high',
      projectId: '1',
    });

    expect(store.totalTasks()).toBe(before + 1);
  });

  it('should remove a task', () => {
    const task = store.tasks()[0];
    const before = store.totalTasks();

    store.removeTask(task.id);

    expect(store.totalTasks()).toBe(before - 1);
  });

  it('should update task properties', () => {
    const task = store.tasks()[0];

    store.updateTask(task.id, { title: 'Updated Title', priority: 'critical' });

    const updated = store.tasks().find((t) => t.id === task.id)!;
    expect(updated.title).toBe('Updated Title');
    expect(updated.priority).toBe('critical');
  });
});
