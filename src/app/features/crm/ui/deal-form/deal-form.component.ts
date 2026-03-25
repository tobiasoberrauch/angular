import { Component, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DealStore, Deal } from '../../data-access/deal.store';
import { ContactStore } from '../../data-access/contact.store';

/**
 * DEAL FORM: Demonstrates Reactive Forms + Signals for CRM deal creation.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SIGNAL FORMS — COMPUTED DERIVED STATE WORKSHOP NOTES          ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                 ║
 * ║  One of the biggest wins of Signal Forms is composability       ║
 * ║  with other signals (stores, computed values, etc.).            ║
 * ║                                                                 ║
 * ║  FUTURE Signal Forms example:                                   ║
 * ║                                                                 ║
 * ║    dealForm = new SignalFormGroup({ ... });                      ║
 * ║    dealStore = inject(DealStore);                               ║
 * ║                                                                 ║
 * ║    // Compose form signals with store signals:                   ║
 * ║    formattedValue = computed(() => {                             ║
 * ║      const val = this.dealForm.controls.value.value();          ║
 * ║      const cur = this.dealForm.controls.currency.value();       ║
 * ║      return new Intl.NumberFormat('de-DE', {                    ║
 * ║        style: 'currency', currency: cur || 'EUR'               ║
 * ║      }).format(val || 0);                                      ║
 * ║    });                                                          ║
 * ║                                                                 ║
 * ║    // New pipeline total including the form value:               ║
 * ║    projectedPipeline = computed(() =>                            ║
 * ║      this.dealStore.totalPipelineValue() +                      ║
 * ║      (this.dealForm.controls.value.value() || 0)                ║
 * ║    );                                                           ║
 * ║                                                                 ║
 * ║  This seamless composition between form state and store state   ║
 * ║  is impossible with Observable-based forms without manual       ║
 * ║  bridging via toSignal() / toObservable().                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
@Component({
  selector: 'app-deal-form',
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <h2 class="page-title">New Deal</h2>

    <div class="layout">
      <form [formGroup]="dealForm" (ngSubmit)="onSubmit()" class="deal-form">
        <div class="form-group">
          <label for="title">Deal Title *</label>
          <input id="title" formControlName="title" placeholder="e.g. Enterprise License Agreement" />
          @if (dealForm.get('title')?.invalid && dealForm.get('title')?.touched) {
            <span class="error">Title is required</span>
          }
        </div>

        <div class="form-group">
          <label for="contactId">Contact *</label>
          <select id="contactId" formControlName="contactId">
            <option value="">Select contact</option>
            @for (contact of contactStore.filteredContacts(); track contact.id) {
              <option [value]="contact.id">
                {{ contact.firstName }} {{ contact.lastName }} ({{ contact.company }})
              </option>
            }
          </select>
          @if (dealForm.get('contactId')?.invalid && dealForm.get('contactId')?.touched) {
            <span class="error">Please select a contact</span>
          }
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="value">Deal Value *</label>
            <input id="value" type="number" formControlName="value" placeholder="0" min="0" />
            @if (dealForm.get('value')?.touched && dealForm.get('value')?.hasError('required')) {
              <span class="error">Value is required</span>
            }
            @if (dealForm.get('value')?.touched && dealForm.get('value')?.hasError('min')) {
              <span class="error">Value must be positive</span>
            }
          </div>

          <div class="form-group">
            <label for="currency">Currency *</label>
            <select id="currency" formControlName="currency">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="stage">Pipeline Stage *</label>
            <select id="stage" formControlName="stage">
              <option value="lead">Lead</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
            </select>
          </div>

          <div class="form-group">
            <label for="expectedCloseDate">Expected Close Date *</label>
            <input id="expectedCloseDate" type="date" formControlName="expectedCloseDate" />
            @if (dealForm.get('expectedCloseDate')?.invalid && dealForm.get('expectedCloseDate')?.touched) {
              <span class="error">Close date is required</span>
            }
          </div>
        </div>

        <div class="form-status">
          @if (isSubmitted()) {
            <span class="success">Deal created successfully!</span>
          }
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="dealForm.invalid">
            Create Deal
          </button>
          <button type="button" class="btn-secondary"
                  (click)="dealForm.reset({ currency: 'EUR', stage: 'lead' })">
            Reset
          </button>
        </div>
      </form>

      <!-- Pipeline Impact Sidebar -->
      <aside class="pipeline-sidebar">
        <h4>Pipeline Impact</h4>

        <!--
          SIGNAL FORMS FUTURE:
          These computed values would read directly from form signals:

            formattedDealValue = computed(() => {
              const val = this.dealForm.controls.value.value();
              const cur = this.dealForm.controls.currency.value();
              return formatCurrency(val, cur);
            });

            projectedPipeline = computed(() =>
              this.dealStore.totalPipelineValue() +
              (this.dealForm.controls.value.value() || 0)
            );

          Currently we track these via manual signal + subscription.
        -->
        <div class="metric">
          <span class="metric-label">Current Pipeline</span>
          <span class="metric-value">{{ dealStore.totalPipelineValue() | number:'1.0-0' }} EUR</span>
        </div>

        <div class="metric highlight">
          <span class="metric-label">+ This Deal</span>
          <span class="metric-value">{{ formValue() | number:'1.0-0' }} {{ formCurrency() }}</span>
        </div>

        <div class="metric total">
          <span class="metric-label">Projected Pipeline</span>
          <span class="metric-value">{{ projectedPipeline() | number:'1.0-0' }} EUR</span>
        </div>

        <hr />

        <div class="metric">
          <span class="metric-label">Won Deals</span>
          <span class="metric-value">{{ dealStore.wonValue() | number:'1.0-0' }} EUR</span>
        </div>

        <div class="metric">
          <span class="metric-label">Total Deals</span>
          <span class="metric-value">{{ dealStore.dealCount() }}</span>
        </div>
      </aside>
    </div>
  `,
  styles: `
    :host {
      display: block;
      max-width: 900px;
    }

    .layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: var(--spacing-lg);
      align-items: start;
    }

    .deal-form {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--spacing-lg);
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

      input, select {
        width: 100%;
        padding: var(--spacing-sm);
        border: 1px solid var(--color-border);
        border-radius: var(--radius);
        font-size: 14px;
        box-sizing: border-box;
      }
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

    .pipeline-sidebar {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--spacing-md);
      position: sticky;
      top: var(--spacing-lg);

      h4 {
        margin: 0 0 var(--spacing-md);
        font-size: 14px;
        text-transform: uppercase;
        color: var(--color-text-secondary);
        letter-spacing: 0.5px;
      }

      hr {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: var(--spacing-sm) 0;
      }
    }

    .metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xs) 0;

      &.highlight {
        background: #ebf8ff;
        margin: 0 calc(-1 * var(--spacing-sm));
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius);
      }

      &.total {
        font-weight: 700;
        font-size: 15px;
        padding-top: var(--spacing-sm);
        border-top: 2px solid var(--color-border);
        margin-top: var(--spacing-xs);
      }
    }

    .metric-label {
      font-size: 13px;
      color: var(--color-text-secondary);
    }

    .metric-value {
      font-weight: 600;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .pipeline-sidebar {
        position: static;
      }
    }
  `,
})
export class DealFormComponent {
  readonly dealStore = inject(DealStore);
  readonly contactStore = inject(ContactStore);

  /**
   * Standard Reactive Forms FormGroup.
   *
   * SIGNAL FORMS EQUIVALENT (future):
   *   dealForm = new SignalFormGroup({
   *     title:             new SignalFormControl('', Validators.required),
   *     contactId:         new SignalFormControl('', Validators.required),
   *     value:             new SignalFormControl<number | null>(null, [Validators.required, Validators.min(0)]),
   *     currency:          new SignalFormControl('EUR'),
   *     stage:             new SignalFormControl<Deal['stage']>('lead'),
   *     expectedCloseDate: new SignalFormControl('', Validators.required),
   *   });
   *
   * Then: this.dealForm.controls.value.value() is a Signal<number | null>
   *       this.dealForm.controls.currency.value() is a Signal<string>
   *       These compose naturally with computed() and store signals.
   */
  readonly dealForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contactId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    value: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    currency: new FormControl('EUR', { nonNullable: true }),
    stage: new FormControl<Deal['stage']>('lead', { nonNullable: true }),
    expectedCloseDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  /** Signal-based submission state */
  readonly isSubmitted = signal(false);

  /**
   * Manual signal mirrors for form values used in the pipeline sidebar.
   *
   * SIGNAL FORMS FUTURE: These would be unnecessary.
   * You'd just read: this.dealForm.controls.value.value()
   * directly inside computed(), and Angular would track the dependency.
   */
  readonly formValue = signal(0);
  readonly formCurrency = signal('EUR');

  /**
   * Projected pipeline value = current pipeline + this deal's value.
   *
   * SIGNAL FORMS FUTURE:
   *   projectedPipeline = computed(() =>
   *     this.dealStore.totalPipelineValue() +
   *     (this.dealForm.controls.value.value() || 0)
   *   );
   *
   * Currently we compose a computed() from our manual mirror signals.
   */
  readonly projectedPipeline = computed(
    () => this.dealStore.totalPipelineValue() + this.formValue()
  );

  constructor() {
    // Mirror form value/currency changes into signals.
    // SIGNAL FORMS FUTURE: completely unnecessary — form controls ARE signals.
    this.dealForm.valueChanges.subscribe((val) => {
      this.formValue.set(val.value ?? 0);
      this.formCurrency.set(val.currency ?? 'EUR');
    });
  }

  onSubmit(): void {
    if (this.dealForm.invalid) {
      this.dealForm.markAllAsTouched();
      return;
    }

    const raw = this.dealForm.getRawValue();

    this.dealStore.addDeal({
      title: raw.title,
      contactId: raw.contactId,
      value: raw.value ?? 0,
      currency: raw.currency,
      stage: raw.stage,
      expectedCloseDate: raw.expectedCloseDate,
    });

    console.log('[DealForm] Deal created:', raw.title, raw.value, raw.currency);
    this.isSubmitted.set(true);
    this.dealForm.reset({ currency: 'EUR', stage: 'lead' });

    setTimeout(() => this.isSubmitted.set(false), 3000);
  }
}
