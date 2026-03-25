import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartStore } from '../../data-access/cart.store';

/**
 * CHECKOUT FORM: Demonstrates Reactive Forms + Signals integration.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ANGULAR 21 SIGNAL FORMS — WORKSHOP NOTES                      ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                 ║
 * ║  Signal Forms is an EXPERIMENTAL API proposed for Angular 21    ║
 * ║  via `@angular/forms/signals`. It replaces Observable-based     ║
 * ║  valueChanges/statusChanges with Signal-based reactivity.       ║
 * ║                                                                 ║
 * ║  FUTURE Signal Forms API (when available):                      ║
 * ║                                                                 ║
 * ║    import { SignalFormGroup, SignalFormControl }                 ║
 * ║      from '@angular/forms/signals';                             ║
 * ║                                                                 ║
 * ║    form = new SignalFormGroup({                                  ║
 * ║      name: new SignalFormControl('', Validators.required),      ║
 * ║      email: new SignalFormControl('', Validators.email),        ║
 * ║    });                                                          ║
 * ║                                                                 ║
 * ║    // No subscribe needed — .value() is a Signal!               ║
 * ║    nameValue = this.form.controls.name.value;   // Signal<T>    ║
 * ║    isValid = this.form.valid;                   // Signal<bool> ║
 * ║    isDirty = this.form.dirty;                   // Signal<bool> ║
 * ║                                                                 ║
 * ║  CURRENT approach (this file):                                  ║
 * ║  We use standard Reactive Forms and mirror state into Signals   ║
 * ║  manually to achieve a similar developer experience.            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <h2 class="page-title">Checkout</h2>

    <!-- Cart Summary -->
    <div class="cart-summary">
      <h3>Order Summary</h3>
      @for (item of cartStore.items(); track item.productId) {
        <div class="cart-item">
          <span>{{ item.productName }} x{{ item.quantity }}</span>
          <span>{{ item.price * item.quantity | currency:'EUR' }}</span>
        </div>
      } @empty {
        <p class="empty">Your cart is empty.</p>
      }
      <div class="cart-total">
        <strong>Total: {{ cartStore.total() | currency:'EUR' }}</strong>
      </div>
    </div>

    <!-- Checkout Form -->
    <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="checkout-form">
      <div class="form-group">
        <label for="name">Full Name *</label>
        <input id="name" formControlName="name" placeholder="John Doe" />
        <!--
          SIGNAL FORMS FUTURE:
          @if (form.controls.name.hasError('required') && form.controls.name.touched()) {
            <span class="error">Name is required</span>
          }
          No need for .get()! Controls are direct signal-based properties.
        -->
        @if (checkoutForm.get('name')?.invalid && checkoutForm.get('name')?.touched) {
          <span class="error">Name is required</span>
        }
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input id="email" type="email" formControlName="email" placeholder="john@example.com" />
        @if (checkoutForm.get('email')?.touched && checkoutForm.get('email')?.hasError('required')) {
          <span class="error">Email is required</span>
        }
        @if (checkoutForm.get('email')?.touched && checkoutForm.get('email')?.hasError('email')) {
          <span class="error">Please enter a valid email</span>
        }
      </div>

      <div class="form-group">
        <label for="street">Street Address *</label>
        <input id="street" formControlName="street" placeholder="123 Main St" />
        @if (checkoutForm.get('street')?.invalid && checkoutForm.get('street')?.touched) {
          <span class="error">Street address is required</span>
        }
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="city">City *</label>
          <input id="city" formControlName="city" placeholder="Berlin" />
          @if (checkoutForm.get('city')?.invalid && checkoutForm.get('city')?.touched) {
            <span class="error">City is required</span>
          }
        </div>

        <div class="form-group">
          <label for="zip">ZIP Code *</label>
          <input id="zip" formControlName="zip" placeholder="10115" />
          @if (checkoutForm.get('zip')?.invalid && checkoutForm.get('zip')?.touched) {
            <span class="error">ZIP code is required</span>
          }
        </div>
      </div>

      <div class="form-group">
        <label for="country">Country *</label>
        <select id="country" formControlName="country">
          <option value="">Select country</option>
          <option value="DE">Germany</option>
          <option value="AT">Austria</option>
          <option value="CH">Switzerland</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
        </select>
        @if (checkoutForm.get('country')?.invalid && checkoutForm.get('country')?.touched) {
          <span class="error">Please select a country</span>
        }
      </div>

      <!--
        SIGNAL FORMS — Signal-based form state tracking:

        With Signal Forms, these would be direct signal reads:
          formValid = this.form.valid;        // Signal<boolean>
          formDirty = this.form.dirty;        // Signal<boolean>
          formValue = this.form.value;        // Signal<FormValue>

        Currently we mirror these into signals manually (see component class).
      -->
      <div class="form-status">
        <span [class.valid]="isFormValid()">
          {{ isFormValid() ? 'Form is valid' : 'Please fill all required fields' }}
        </span>
        @if (isSubmitted()) {
          <span class="success">Order placed successfully!</span>
        }
      </div>

      <button type="submit" [disabled]="!isFormValid() || cartStore.isEmpty()">
        Place Order
      </button>
    </form>
  `,
  styles: `
    :host {
      display: block;
      max-width: 600px;
    }

    .cart-summary {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-lg);

      h3 { margin: 0 0 var(--spacing-sm); }
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-xs) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .cart-total {
      padding-top: var(--spacing-sm);
      text-align: right;
      font-size: 1.1em;
    }

    .empty { color: var(--color-text-secondary); font-style: italic; }

    .checkout-form {
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
      grid-template-columns: 2fr 1fr;
      gap: var(--spacing-md);
    }

    .error {
      color: #e53e3e;
      font-size: 12px;
      margin-top: 2px;
      display: block;
    }

    .form-status {
      margin-bottom: var(--spacing-md);
      font-size: 13px;

      .valid { color: #38a169; }
      .success {
        display: block;
        color: #38a169;
        font-weight: 600;
        margin-top: var(--spacing-xs);
      }
    }

    button {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--color-primary, #3b82f6);
      color: white;
      border: none;
      border-radius: var(--radius);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        filter: brightness(0.9);
      }
    }
  `,
})
export class CheckoutComponent {
  readonly cartStore = inject(CartStore);

  /**
   * Standard Reactive Forms FormGroup.
   *
   * SIGNAL FORMS EQUIVALENT (future):
   *   checkoutForm = new SignalFormGroup({
   *     name:    new SignalFormControl('', Validators.required),
   *     email:   new SignalFormControl('', [Validators.required, Validators.email]),
   *     street:  new SignalFormControl('', Validators.required),
   *     city:    new SignalFormControl('', Validators.required),
   *     zip:     new SignalFormControl('', Validators.required),
   *     country: new SignalFormControl('', Validators.required),
   *   });
   *
   * With Signal Forms, .valid / .dirty / .value would all be Signals.
   */
  readonly checkoutForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    zip: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  /**
   * Signal-based form state tracking.
   *
   * With Signal Forms, these would be unnecessary — the form itself
   * would expose .valid(), .dirty(), etc. as Signals.
   * For now, we maintain manual signal mirrors.
   */
  readonly isFormValid = signal(false);
  readonly isSubmitted = signal(false);

  constructor() {
    // Mirror form validity into a signal.
    // SIGNAL FORMS FUTURE: this.checkoutForm.valid is already a Signal — no subscription needed.
    this.checkoutForm.statusChanges.subscribe(() => {
      this.isFormValid.set(this.checkoutForm.valid);
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const value = this.checkoutForm.getRawValue();
    console.log('[Checkout] Order submitted:', value);
    console.log('[Checkout] Cart items:', this.cartStore.items());
    console.log('[Checkout] Total:', this.cartStore.total());

    this.isSubmitted.set(true);
    this.cartStore.clear();
    this.checkoutForm.reset();
  }
}
