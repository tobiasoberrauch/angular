import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { LeaveStore, LeaveRequest } from '../../data-access/leave.store';

/**
 * LEAVE REQUEST FORM: Demonstrates custom validators and cross-field
 * validation with Reactive Forms + Signals.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SIGNAL FORMS — CUSTOM VALIDATORS WORKSHOP NOTES               ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                 ║
 * ║  With Signal Forms, custom validators would work with signals:  ║
 * ║                                                                 ║
 * ║    // Cross-field validator with Signal Forms (future):          ║
 * ║    function dateRangeValidator(group: SignalFormGroup) {         ║
 * ║      const start = group.controls.startDate.value();            ║
 * ║      const end = group.controls.endDate.value();                ║
 * ║      // Returns Signal<ValidationErrors | null>                 ║
 * ║      return start && end && end < start                         ║
 * ║        ? { dateRange: true } : null;                            ║
 * ║    }                                                            ║
 * ║                                                                 ║
 * ║    // The validator result is itself reactive — no need to       ║
 * ║    // re-run on each change, Angular tracks the signal deps.    ║
 * ║                                                                 ║
 * ║  CURRENT approach: standard validator function that Angular     ║
 * ║  re-runs on every form value change.                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

/**
 * Custom cross-field validator: ensures end date is after start date.
 *
 * SIGNAL FORMS FUTURE: This would return a reactive validation result
 * that automatically updates when either date signal changes.
 */
function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;

  if (start && end && new Date(end) < new Date(start)) {
    return { dateRange: 'End date must be after start date' };
  }
  return null;
}

@Component({
  selector: 'app-leave-request',
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="page-title">Leave Request</h2>

    <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()" class="leave-form">
      <div class="form-group">
        <label for="type">Leave Type *</label>
        <select id="type" formControlName="type">
          <option value="">Select type</option>
          <option value="vacation">Vacation</option>
          <option value="sick">Sick Leave</option>
          <option value="personal">Personal</option>
          <option value="parental">Parental Leave</option>
        </select>
        @if (leaveForm.get('type')?.invalid && leaveForm.get('type')?.touched) {
          <span class="error">Please select a leave type</span>
        }
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startDate">Start Date *</label>
          <input id="startDate" type="date" formControlName="startDate" />
          @if (leaveForm.get('startDate')?.invalid && leaveForm.get('startDate')?.touched) {
            <span class="error">Start date is required</span>
          }
        </div>

        <div class="form-group">
          <label for="endDate">End Date *</label>
          <input id="endDate" type="date" formControlName="endDate" />
          @if (leaveForm.get('endDate')?.invalid && leaveForm.get('endDate')?.touched) {
            <span class="error">End date is required</span>
          }
        </div>
      </div>

      <!--
        Cross-field validation error.
        SIGNAL FORMS FUTURE:
          @if (leaveForm.hasError('dateRange')) {
            // The error signal would automatically update
            // when either startDate or endDate signals change.
          }
      -->
      @if (leaveForm.hasError('dateRange')) {
        <div class="error cross-field-error">
          {{ leaveForm.getError('dateRange') }}
        </div>
      }

      <div class="form-group">
        <label for="reason">Reason *</label>
        <textarea id="reason" formControlName="reason" rows="4"
                  placeholder="Please provide a reason for your leave request..."></textarea>
        @if (leaveForm.get('reason')?.invalid && leaveForm.get('reason')?.touched) {
          <span class="error">
            @if (leaveForm.get('reason')?.hasError('required')) {
              Reason is required
            } @else if (leaveForm.get('reason')?.hasError('minlength')) {
              Reason must be at least 10 characters
            }
          </span>
        }
      </div>

      <!-- Computed leave duration display -->
      <div class="duration-info">
        @if (leaveDuration() > 0) {
          <span class="duration-badge">
            {{ leaveDuration() }} {{ leaveDuration() === 1 ? 'day' : 'days' }}
          </span>
        }
        <!--
          SIGNAL FORMS FUTURE:
          leaveDuration would be a computed() that reads directly from
          form control signals:

            leaveDuration = computed(() => {
              const start = this.form.controls.startDate.value();
              const end = this.form.controls.endDate.value();
              if (!start || !end) return 0;
              return differenceInDays(new Date(end), new Date(start)) + 1;
            });

          No subscription needed! The computed automatically tracks deps.
        -->
      </div>

      <div class="form-status">
        @if (isSubmitted()) {
          <span class="success">Leave request submitted successfully!</span>
        }
      </div>

      <div class="form-actions">
        <button type="submit" [disabled]="leaveForm.invalid">
          Submit Request
        </button>
        <button type="button" class="btn-secondary" (click)="leaveForm.reset()">
          Cancel
        </button>
      </div>
    </form>

    <!-- Pending requests summary from store -->
    <div class="pending-summary">
      <h4>Pending Requests ({{ leaveStore.pendingCount() }})</h4>
      @for (request of leaveStore.pendingRequests(); track request.id) {
        <div class="request-card">
          <span class="type-badge type-{{ request.type }}">{{ request.type }}</span>
          <span>{{ request.startDate }} - {{ request.endDate }}</span>
          <span class="reason">{{ request.reason }}</span>
        </div>
      } @empty {
        <p class="empty">No pending requests.</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      max-width: 600px;
    }

    .leave-form {
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

    .cross-field-error {
      background: #fff5f5;
      border: 1px solid #feb2b2;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius);
      margin-bottom: var(--spacing-md);
    }

    .duration-info {
      margin-bottom: var(--spacing-md);
    }

    .duration-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #ebf8ff;
      color: #2b6cb0;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
    }

    .form-status {
      min-height: 20px;
      margin-bottom: var(--spacing-sm);
    }

    .success {
      color: #38a169;
      font-weight: 600;
      font-size: 13px;
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

    .pending-summary {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--spacing-md);

      h4 {
        margin: 0 0 var(--spacing-sm);
        font-size: 14px;
      }
    }

    .request-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-xs) 0;
      border-bottom: 1px solid var(--color-border);
      font-size: 13px;

      &:last-child { border-bottom: none; }
    }

    .type-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
    }

    .type-vacation { background: #c6f6d5; color: #276749; }
    .type-sick { background: #fed7d7; color: #c53030; }
    .type-personal { background: #fefcbf; color: #975a16; }
    .type-parental { background: #e9d8fd; color: #553c9a; }

    .reason {
      color: var(--color-text-secondary);
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .empty {
      color: var(--color-text-secondary);
      font-style: italic;
      font-size: 13px;
    }
  `,
})
export class LeaveRequestComponent {
  readonly leaveStore = inject(LeaveStore);

  /**
   * Standard Reactive Forms with a cross-field validator.
   *
   * SIGNAL FORMS EQUIVALENT (future):
   *   leaveForm = new SignalFormGroup({
   *     type:      new SignalFormControl('', Validators.required),
   *     startDate: new SignalFormControl('', Validators.required),
   *     endDate:   new SignalFormControl('', Validators.required),
   *     reason:    new SignalFormControl('', [Validators.required, Validators.minLength(10)]),
   *   }, { validators: dateRangeSignalValidator });
   *
   * The cross-field validator would automatically re-evaluate
   * when any control signal it reads from changes.
   */
  readonly leaveForm = new FormGroup(
    {
      type: new FormControl<LeaveRequest['type'] | ''>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      startDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      endDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      reason: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10)],
      }),
    },
    { validators: dateRangeValidator }
  );

  /** Signal-based submission state */
  readonly isSubmitted = signal(false);

  /**
   * Computed leave duration in days.
   *
   * SIGNAL FORMS FUTURE: This would be a computed() reading directly
   * from form control signals — no subscription needed.
   * For now, we use a signal updated via valueChanges subscription.
   */
  readonly leaveDuration = signal(0);

  constructor() {
    // Mirror date changes into a duration signal.
    // SIGNAL FORMS FUTURE: this would be a simple computed() reading
    // this.leaveForm.controls.startDate.value() and endDate.value().
    this.leaveForm.valueChanges.subscribe((value) => {
      if (value.startDate && value.endDate) {
        const start = new Date(value.startDate);
        const end = new Date(value.endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        this.leaveDuration.set(diffDays > 0 ? diffDays : 0);
      } else {
        this.leaveDuration.set(0);
      }
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const { type, startDate, endDate, reason } = this.leaveForm.getRawValue();

    this.leaveStore.addRequest({
      employeeId: '1', // In a real app, from auth context
      type: type as LeaveRequest['type'],
      startDate,
      endDate,
      reason,
    });

    console.log('[LeaveRequest] Submitted:', { type, startDate, endDate, reason });
    this.isSubmitted.set(true);
    this.leaveForm.reset();

    setTimeout(() => this.isSubmitted.set(false), 3000);
  }
}
