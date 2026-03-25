import {
  Component,
  input,
  output,
  signal,
  effect,
  ElementRef,
  viewChild,
  afterNextRender,
  OnDestroy,
} from '@angular/core';

/**
 * ============================================================================
 * WORKSHOP: Accessible Confirm Dialog
 * ============================================================================
 *
 * This component demonstrates the WAI-ARIA Dialog (Modal) pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Key accessibility features implemented manually:
 *   - role="dialog" + aria-modal="true" to announce modal context
 *   - aria-labelledby / aria-describedby for screen reader context
 *   - Focus trap: Tab/Shift+Tab cycle stays within the dialog
 *   - Escape key closes the dialog
 *   - Focus returns to the trigger element on close
 *
 * --------------------------------------------------------------------------
 * WHAT @angular/aria WOULD PROVIDE:
 * --------------------------------------------------------------------------
 * If/when @angular/aria ships (expected post-Angular 21), it would offer:
 *
 *   import { CdkDialog, CdkDialogContainer } from '@angular/aria';
 *
 *   - CdkDialog service: Opens/closes dialogs programmatically, manages
 *     a stack of open dialogs, and handles z-index layering automatically.
 *   - CdkDialogContainer: A reusable container directive that auto-applies
 *     role="dialog", aria-modal="true", focus trap, and Escape handling
 *     without any manual ARIA attributes.
 *   - Built-in focus restoration: Automatically returns focus to the
 *     element that triggered the dialog upon close.
 *   - Backdrop click handling: Configurable via disableClose option.
 *   - Animation hooks: onOpened / onClosed observables for transitions.
 *
 * With @angular/aria, this entire component could be reduced to:
 *
 *   @Component({
 *     hostDirectives: [CdkDialogContainer],
 *     template: `<ng-content />`
 *   })
 *   export class ConfirmDialog { }
 *
 * ...and the dialog service would handle all ARIA, focus, and keyboard logic.
 * ============================================================================
 */
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <!--
      WORKSHOP NOTE: We manually set role="dialog" and aria-modal="true".
      @angular/aria's CdkDialogContainer would apply these automatically.
    -->
    @if (open()) {
      <div
        class="dialog-backdrop"
        (click)="onBackdropClick()"
        (keydown)="onBackdropKeydown($event)"
      >
        <div
          #dialogPanel
          class="dialog-panel"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="descriptionId"
          (click)="$event.stopPropagation()"
          (keydown)="onDialogKeydown($event)"
        >
          <h2 [id]="titleId" class="dialog-title">{{ title() }}</h2>
          <p [id]="descriptionId" class="dialog-message">{{ message() }}</p>

          <div class="dialog-actions">
            <!--
              WORKSHOP NOTE: The cancel button receives initial focus
              as a safe default. @angular/aria would support cdkFocusInitial
              directive to mark which element gets focus on open.
            -->
            <button
              #cancelBtn
              class="btn btn--secondary"
              (click)="onCancel()"
            >
              {{ cancelLabel() }}
            </button>
            <button
              class="btn btn--primary"
              (click)="onConfirm()"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 150ms ease-out;
    }

    .dialog-panel {
      background: white;
      border-radius: 12px;
      padding: 24px;
      min-width: 360px;
      max-width: 480px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 200ms ease-out;
    }

    .dialog-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .dialog-message {
      margin: 0 0 24px;
      font-size: 14px;
      color: #555;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .btn {
      padding: 8px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 150ms, box-shadow 150ms;
    }

    .btn:focus-visible {
      outline: 2px solid #4361ee;
      outline-offset: 2px;
    }

    .btn--primary {
      background: #4361ee;
      color: white;
    }

    .btn--primary:hover {
      background: #3a56d4;
    }

    .btn--secondary {
      background: #e9ecef;
      color: #333;
    }

    .btn--secondary:hover {
      background: #dee2e6;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(16px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
})
export class ConfirmDialogComponent implements OnDestroy {
  // ---------------------------------------------------------------------------
  // Inputs (Angular 21 signal-based input API)
  // ---------------------------------------------------------------------------
  readonly title = input<string>('Confirm Action');
  readonly message = input<string>('Are you sure you want to proceed?');
  readonly confirmLabel = input<string>('Confirm');
  readonly cancelLabel = input<string>('Cancel');
  readonly open = input<boolean>(false);

  // ---------------------------------------------------------------------------
  // Outputs (Angular 21 signal-based output API)
  // ---------------------------------------------------------------------------
  /** Emitted when the user confirms the action. */
  readonly confirmed = output<void>();
  /** Emitted when the user cancels (button, Escape, or backdrop click). */
  readonly cancelled = output<void>();

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------
  readonly titleId = `dialog-title-${crypto.randomUUID().slice(0, 8)}`;
  readonly descriptionId = `dialog-desc-${crypto.randomUUID().slice(0, 8)}`;

  /**
   * WORKSHOP NOTE: We track the previously focused element manually to
   * restore focus on close. @angular/aria's CdkDialog service would
   * handle this automatically via its FocusMonitor integration.
   */
  private previouslyFocusedElement: HTMLElement | null = null;

  /** ViewChild references for focus management */
  private readonly dialogPanel = viewChild<ElementRef<HTMLElement>>('dialogPanel');
  private readonly cancelBtn = viewChild<ElementRef<HTMLButtonElement>>('cancelBtn');

  constructor() {
    /**
     * WORKSHOP NOTE: This effect manages focus when the dialog opens/closes.
     * @angular/aria's CdkDialogContainer handles this lifecycle automatically,
     * including edge cases like nested dialogs and shadow DOM boundaries.
     */
    effect(() => {
      if (this.open()) {
        this.previouslyFocusedElement = document.activeElement as HTMLElement;

        // Use afterNextRender to wait for the DOM to be ready
        afterNextRender(() => {
          this.cancelBtn()?.nativeElement.focus();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.restoreFocus();
  }

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  onConfirm(): void {
    this.confirmed.emit();
    this.restoreFocus();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.restoreFocus();
  }

  onBackdropClick(): void {
    this.onCancel();
  }

  onBackdropKeydown(event: KeyboardEvent): void {
    // Prevent backdrop from handling keys; let the dialog panel handle them
    if (event.key === 'Escape') {
      this.onCancel();
    }
  }

  /**
   * WORKSHOP NOTE: Focus trap implementation.
   *
   * This is one of the most complex accessibility requirements for dialogs.
   * @angular/aria would provide this via the CdkTrapFocus directive, which:
   *   - Automatically finds all focusable elements within the container
   *   - Wraps Tab/Shift+Tab at the boundaries
   *   - Handles dynamic content (elements added/removed while open)
   *   - Supports deferred focus trapping for animated content
   *   - Integrates with the InteractivityChecker for disabled/hidden elements
   *
   * Our manual implementation below covers the common case but does NOT
   * handle dynamic content changes or shadow DOM piercing.
   */
  onDialogKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.onCancel();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.dialogPanel()?.nativeElement;
    if (!panel) return;

    /**
     * WORKSHOP NOTE: This selector covers common focusable elements.
     * @angular/aria's InteractivityChecker is far more thorough -- it
     * accounts for tabindex, disabled, inert, visibility, and aria-hidden.
     */
    const focusableSelector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(focusableSelector)
    );

    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstEl) {
      event.preventDefault();
      lastEl.focus();
    } else if (!event.shiftKey && document.activeElement === lastEl) {
      event.preventDefault();
      firstEl.focus();
    }
  }

  private restoreFocus(): void {
    /**
     * WORKSHOP NOTE: @angular/aria's FocusMonitor would restore focus
     * with the correct focus-visible state (keyboard vs. mouse).
     */
    this.previouslyFocusedElement?.focus();
    this.previouslyFocusedElement = null;
  }
}
