import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskStore, Task } from '../../data-access/task.store';
import { ProjectStore } from '../../data-access/project.store';

/**
 * TASK FORM: Demonstrates Reactive Forms + Signals with a side-by-side
 * comparison of current Reactive Forms vs future Signal Forms API.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  SIGNAL FORMS vs REACTIVE FORMS — SIDE-BY-SIDE COMPARISON          ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║                                                                     ║
 * ║  ┌─────────────────────────┬──────────────────────────────────────┐ ║
 * ║  │ REACTIVE FORMS (current)│ SIGNAL FORMS (future @angular/forms/ │ ║
 * ║  │                         │ signals)                             │ ║
 * ║  ├─────────────────────────┼──────────────────────────────────────┤ ║
 * ║  │ new FormControl('')     │ new SignalFormControl('')             │ ║
 * ║  │ new FormGroup({})       │ new SignalFormGroup({})               │ ║
 * ║  │ form.value              │ form.value()  // Signal<T>           │ ║
 * ║  │ form.valid              │ form.valid()  // Signal<boolean>     │ ║
 * ║  │ form.valueChanges       │ form.value    // already reactive!   │ ║
 * ║  │   .subscribe(v => ...)  │ effect(() => console.log(form.value))│ ║
 * ║  │ form.statusChanges      │ form.status   // Signal<FormStatus>  │ ║
 * ║  │   .subscribe(s => ...)  │ computed(() => form.status())        │ ║
 * ║  │ form.get('name')        │ form.controls.name // strongly typed │ ║
 * ║  │ form.get('name')?.value │ form.controls.name.value()           │ ║
 * ║  └─────────────────────────┴──────────────────────────────────────┘ ║
 * ║                                                                     ║
 * ║  KEY BENEFITS OF SIGNAL FORMS:                                      ║
 * ║  1. No subscriptions to manage (no memory leaks)                    ║
 * ║  2. Works with computed() and effect() natively                     ║
 * ║  3. Better type inference (no .get() string keys)                   ║
 * ║  4. Automatic change detection (no OnPush issues)                   ║
 * ║  5. Composable with other signals (stores, inputs, etc.)            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */
@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="page-title">New Task</h2>

    <!-- Toggle to show Signal Forms comparison notes -->
    <div class="comparison-toggle">
      <label>
        <input type="checkbox" [checked]="showComparison()" (change)="showComparison.set(!showComparison())" />
        Show Signal Forms API comparison
      </label>
    </div>

    @if (showComparison()) {
      <div class="comparison-panel">
        <h4>Signal Forms API (Future)</h4>
        <pre><code>// Future: import from '@angular/forms/signals'
import {{ '{' }} SignalFormGroup, SignalFormControl {{ '}' }}
  from '&#64;angular/forms/signals';

taskForm = new SignalFormGroup({{ '{' }}
  title: new SignalFormControl('', Validators.required),
  description: new SignalFormControl(''),
  priority: new SignalFormControl('medium'),
  projectId: new SignalFormControl('', Validators.required),
{{ '}' }});

// Reactive reads — no .subscribe()!
titleLength = computed(() =>
  this.taskForm.controls.title.value().length
);

isValid = this.taskForm.valid; // Signal&lt;boolean&gt;
</code></pre>
        <h4>Reactive Forms (Current — used below)</h4>
        <pre><code>import {{ '{' }} FormGroup, FormControl {{ '}' }}
  from '&#64;angular/forms';

taskForm = new FormGroup({{ '{' }}
  title: new FormControl('', Validators.required),
  description: new FormControl(''),
  priority: new FormControl('medium'),
  projectId: new FormControl('', Validators.required),
{{ '}' }});

// Must subscribe to track changes:
this.taskForm.statusChanges.subscribe(
  status => this.isValid.set(status === 'VALID')
);</code></pre>
      </div>
    }

    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
      <div class="form-group">
        <label for="title">Title *</label>
        <input id="title" formControlName="title" placeholder="Task title" />
        @if (taskForm.get('title')?.invalid && taskForm.get('title')?.touched) {
          <span class="error">Title is required</span>
        }
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" formControlName="description" rows="3"
                  placeholder="Describe the task..."></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="priority">Priority *</label>
          <select id="priority" formControlName="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div class="form-group">
          <label for="projectId">Project *</label>
          <select id="projectId" formControlName="projectId">
            <option value="">Select project</option>
            @for (project of projectStore.activeProjects(); track project.id) {
              <option [value]="project.id">{{ project.name }}</option>
            }
          </select>
          @if (taskForm.get('projectId')?.invalid && taskForm.get('projectId')?.touched) {
            <span class="error">Please select a project</span>
          }
        </div>
      </div>

      <div class="form-status">
        @if (isSubmitted()) {
          <span class="success">Task created successfully!</span>
        }
      </div>

      <div class="form-actions">
        <button type="submit" [disabled]="taskForm.invalid">
          Create Task
        </button>
        <button type="button" class="btn-secondary" (click)="taskForm.reset({ priority: 'medium' })">
          Reset
        </button>
      </div>
    </form>

    <!-- Live preview of the task being created -->
    <div class="preview">
      <h4>Live Preview</h4>
      <!--
        SIGNAL FORMS FUTURE:
        These would read directly from signal-based controls:
          {{ taskForm.controls.title.value() }}
        Instead of using .getRawValue() or manual tracking.
      -->
      <div class="preview-card">
        <strong>{{ taskForm.get('title')?.value || 'Untitled task' }}</strong>
        <p>{{ taskForm.get('description')?.value || 'No description' }}</p>
        <div class="preview-meta">
          <span class="badge priority-{{ taskForm.get('priority')?.value }}">
            {{ taskForm.get('priority')?.value }}
          </span>
          <span class="badge">Status: todo</span>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      max-width: 700px;
    }

    .comparison-toggle {
      margin-bottom: var(--spacing-md);

      label {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        cursor: pointer;
        font-size: 13px;
        color: var(--color-text-secondary);
      }
    }

    .comparison-panel {
      background: #1a1a2e;
      color: #e0e0e0;
      border-radius: var(--radius);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
      font-size: 13px;

      h4 {
        color: #7dd3fc;
        margin: var(--spacing-sm) 0 var(--spacing-xs);
        &:first-child { margin-top: 0; }
      }

      pre {
        background: #0f0f23;
        padding: var(--spacing-sm);
        border-radius: 4px;
        overflow-x: auto;
        margin: 0;
      }

      code { font-family: 'Fira Code', monospace; font-size: 12px; }
    }

    .task-form {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .form-group {
      margin-bottom: var(--spacing-md);

      label {
        display: block;
        font-weight: 600;
        font-size: 13px;
        margin-bottom: var(--spacing-xs);
        color: var(--color-text-secondary);
      }

      input, select, textarea {
        width: 100%;
        padding: var(--spacing-sm);
        border: 1px solid var(--color-border);
        border-radius: var(--radius);
        font-size: 14px;
        box-sizing: border-box;
        font-family: inherit;
      }

      textarea { resize: vertical; }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    .error {
      color: #e53e3e;
      font-size: 12px;
      margin-top: 2px;
      display: block;
    }

    .success {
      color: #38a169;
      font-weight: 600;
      font-size: 13px;
    }

    .form-status {
      min-height: 20px;
      margin-bottom: var(--spacing-sm);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-sm);

      button {
        padding: var(--spacing-sm) var(--spacing-lg);
        border: none;
        border-radius: var(--radius);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;

        &:first-child {
          background: var(--color-primary, #3b82f6);
          color: white;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &:hover:not(:disabled) {
          filter: brightness(0.9);
        }
      }

      .btn-secondary {
        background: var(--color-bg);
        color: var(--color-text);
        border: 1px solid var(--color-border);
      }
    }

    .preview {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--spacing-md);

      h4 {
        margin: 0 0 var(--spacing-sm);
        font-size: 13px;
        color: var(--color-text-secondary);
        text-transform: uppercase;
      }
    }

    .preview-card {
      padding: var(--spacing-sm);
      border: 1px dashed var(--color-border);
      border-radius: var(--radius);

      strong { display: block; margin-bottom: var(--spacing-xs); }

      p {
        margin: 0 0 var(--spacing-sm);
        font-size: 13px;
        color: var(--color-text-secondary);
      }
    }

    .preview-meta {
      display: flex;
      gap: var(--spacing-xs);
    }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
    }

    .priority-critical { background: #fed7d7; color: #c53030; border-color: #feb2b2; }
    .priority-high { background: #feebc8; color: #c05621; border-color: #fbd38d; }
    .priority-medium { background: #fefcbf; color: #975a16; border-color: #f6e05e; }
    .priority-low { background: #c6f6d5; color: #276749; border-color: #9ae6b4; }
  `,
})
export class TaskFormComponent {
  readonly taskStore = inject(TaskStore);
  readonly projectStore = inject(ProjectStore);

  /**
   * SIGNAL FORMS EQUIVALENT (future):
   *   taskForm = new SignalFormGroup({
   *     title:       new SignalFormControl('', Validators.required),
   *     description: new SignalFormControl(''),
   *     priority:    new SignalFormControl<Task['priority']>('medium'),
   *     projectId:   new SignalFormControl('', Validators.required),
   *   });
   *
   * Then: this.taskForm.valid() is already a signal.
   *       this.taskForm.controls.title.value() reads the current value reactively.
   */
  readonly taskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    priority: new FormControl<Task['priority']>('medium', { nonNullable: true }),
    projectId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  /** Toggle for showing Signal Forms comparison panel */
  readonly showComparison = signal(false);

  /** Signal-based submission state */
  readonly isSubmitted = signal(false);

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { title, description, priority, projectId } = this.taskForm.getRawValue();

    this.taskStore.addTask({
      title,
      description,
      priority,
      projectId,
      status: 'todo',
    });

    console.log('[TaskForm] Task created:', title);
    this.isSubmitted.set(true);
    this.taskForm.reset({ priority: 'medium' });

    // Reset submission message after 3 seconds
    setTimeout(() => this.isSubmitted.set(false), 3000);
  }
}
