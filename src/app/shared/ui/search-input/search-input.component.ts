import {
  Component,
  input,
  output,
  signal,
  computed,
  model,
  ElementRef,
  viewChild,
} from '@angular/core';

/**
 * ============================================================================
 * WORKSHOP: Accessible Search Autocomplete (Combobox)
 * ============================================================================
 *
 * This component implements the WAI-ARIA Combobox pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * Key accessibility features implemented manually:
 *   - role="combobox" on the input with aria-expanded, aria-autocomplete
 *   - role="listbox" on the suggestion list
 *   - role="option" on each suggestion item with aria-selected
 *   - aria-activedescendant tracks the visually focused option
 *   - Keyboard: ArrowDown/Up navigate, Enter selects, Escape closes
 *   - Live region announces result count to screen readers
 *
 * --------------------------------------------------------------------------
 * WHAT @angular/aria WOULD PROVIDE:
 * --------------------------------------------------------------------------
 * If/when @angular/aria ships, it would offer:
 *
 *   import { CdkCombobox, CdkComboboxPopup, CdkOption } from '@angular/aria';
 *
 *   - CdkCombobox directive: Applies role="combobox", manages aria-expanded,
 *     aria-activedescendant, aria-owns, and aria-autocomplete automatically.
 *     Handles all keyboard navigation internally.
 *
 *   - CdkComboboxPopup: Manages the listbox popup positioning (via Overlay),
 *     open/close animations, and dynamic option registration.
 *
 *   - CdkOption: Automatically assigns role="option", manages aria-selected,
 *     and generates unique IDs for aria-activedescendant linking.
 *
 *   - CdkListboxSelection: Handles single/multi selection, typeahead search,
 *     and Home/End key navigation.
 *
 * With @angular/aria, the template would simplify to:
 *
 *   <input cdkCombobox [cdkComboboxPopup]="dropdown" />
 *   <div #dropdown cdkComboboxPopup>
 *     @for (option of filtered(); track option) {
 *       <div cdkOption [value]="option">{{ option }}</div>
 *     }
 *   </div>
 *
 * ...and all ARIA attributes + keyboard handling would be automatic.
 * ============================================================================
 */
@Component({
  selector: 'app-search-input',
  template: `
    <div class="search-container">
      <!--
        WORKSHOP NOTE: aria-activedescendant lets screen readers track which
        option is "focused" without moving DOM focus away from the input.
        @angular/aria's CdkCombobox directive manages this ID linkage.
      -->
      <label [for]="inputId" class="search-label">
        {{ label() }}
      </label>

      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18"
             aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" stroke="currentColor"
                  stroke-width="2" fill="none"/>
          <line x1="16.5" y1="16.5" x2="21" y2="21"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>

        <input
          #searchInput
          [id]="inputId"
          type="text"
          role="combobox"
          [attr.aria-expanded]="isOpen()"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          [attr.aria-controls]="listboxId"
          [attr.aria-activedescendant]="activeDescendantId()"
          [placeholder]="placeholder()"
          [value]="searchTerm()"
          (input)="onInput($event)"
          (keydown)="onKeydown($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          class="search-input"
        />

        @if (searchTerm()) {
          <button
            class="clear-btn"
            (click)="onClear()"
            aria-label="Clear search"
            tabindex="-1"
          >
            <svg viewBox="0 0 24 24" width="16" height="16"
                 aria-hidden="true" focusable="false">
              <line x1="6" y1="6" x2="18" y2="18"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18" y1="6" x2="6" y2="18"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        }
      </div>

      <!--
        WORKSHOP NOTE: The listbox dropdown with role="listbox".
        @angular/aria's CdkComboboxPopup would manage open/close state,
        overlay positioning, and scroll-into-view for the active option.
      -->
      @if (isOpen() && filteredOptions().length > 0) {
        <ul
          [id]="listboxId"
          role="listbox"
          [attr.aria-label]="placeholder() + ' suggestions'"
          class="search-listbox"
        >
          @for (option of filteredOptions(); track option; let i = $index) {
            <!--
              WORKSHOP NOTE: Each option gets a unique ID for
              aria-activedescendant. @angular/aria's CdkOption generates
              these IDs automatically and registers/deregisters options
              dynamically as the filtered list changes.
            -->
            <li
              [id]="optionId(i)"
              role="option"
              [attr.aria-selected]="i === activeIndex()"
              [class.active]="i === activeIndex()"
              class="search-option"
              (mouseenter)="activeIndex.set(i)"
              (mousedown)="selectOption(option)"
            >
              <!--
                Highlight the matching portion of the option text.
                @angular/aria would support this via CdkHighlight directive.
              -->
              <span [innerHTML]="highlightMatch(option)"></span>
            </li>
          }
        </ul>
      }

      <!--
        WORKSHOP NOTE: Live region for screen reader announcements.
        @angular/aria's LiveAnnouncer service provides a cleaner API:
          this.liveAnnouncer.announce('3 results available');
        This avoids manual aria-live DOM manipulation.
      -->
      <div
        class="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ liveAnnouncement() }}
      </div>
    </div>
  `,
  styles: `
    .search-container {
      position: relative;
      width: 100%;
      max-width: 400px;
    }

    .search-label {
      display: block;
      margin-bottom: 4px;
      font-size: 13px;
      font-weight: 500;
      color: #555;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 10px;
      color: #999;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 10px 36px 10px 36px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      background: white;
      color: #1a1a2e;
      transition: border-color 150ms, box-shadow 150ms;
    }

    .search-input::placeholder {
      color: #999;
    }

    .search-input:focus {
      outline: none;
      border-color: #4361ee;
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
    }

    .clear-btn {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clear-btn:hover {
      color: #333;
      background: #f0f0f0;
    }

    .search-listbox {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin: 4px 0 0;
      padding: 4px;
      list-style: none;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      max-height: 240px;
      overflow-y: auto;
      z-index: 100;
    }

    .search-option {
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      color: #333;
      transition: background 100ms;
    }

    .search-option:hover,
    .search-option.active {
      background: #f0f4ff;
      color: #1a1a2e;
    }

    .search-option[aria-selected="true"] {
      background: #e8edff;
      font-weight: 500;
    }

    /* Screen-reader only utility */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Highlight matching text */
    :host ::ng-deep .match-highlight {
      font-weight: 700;
      text-decoration: underline;
      text-decoration-color: #4361ee;
      text-underline-offset: 2px;
    }
  `,
})
export class SearchInputComponent {
  // ---------------------------------------------------------------------------
  // Inputs (Angular 21 signal-based input API)
  // ---------------------------------------------------------------------------
  readonly placeholder = input<string>('Search...');
  readonly label = input<string>('Search');
  readonly options = input<string[]>([]);

  // ---------------------------------------------------------------------------
  // Two-way binding via model() (Angular 21 signal-based model API)
  // ---------------------------------------------------------------------------
  /**
   * WORKSHOP NOTE: model() provides two-way binding with signals.
   * The parent can bind: <app-search-input [(searchTerm)]="myTerm" />
   * This replaces the old @Input() + @Output() searchTermChange pattern.
   */
  readonly searchTerm = model<string>('');

  // ---------------------------------------------------------------------------
  // Outputs
  // ---------------------------------------------------------------------------
  /** Emitted when the user selects an option from the list. */
  readonly selected = output<string>();

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------
  /**
   * WORKSHOP NOTE: We use signal() for internal reactive state.
   * @angular/aria's CdkListboxSelection would manage activeIndex,
   * isOpen, and selection state as an integrated unit.
   */
  readonly isOpen = signal(false);
  readonly activeIndex = signal(-1);

  /** Unique IDs for ARIA attribute linkage */
  private readonly uid = crypto.randomUUID().slice(0, 8);
  readonly inputId = `search-input-${this.uid}`;
  readonly listboxId = `search-listbox-${this.uid}`;

  /** ViewChild reference for the input element */
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // ---------------------------------------------------------------------------
  // Computed signals
  // ---------------------------------------------------------------------------

  /**
   * Filter options based on the current search term.
   * WORKSHOP NOTE: @angular/aria's CdkCombobox could integrate with
   * a filtering strategy (startsWith, contains, fuzzy) via configuration.
   */
  readonly filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.options();
    return this.options().filter(opt =>
      opt.toLowerCase().includes(term)
    );
  });

  /**
   * Build the aria-activedescendant ID for the currently active option.
   * Returns null when no option is active (screen reader stays on input).
   */
  readonly activeDescendantId = computed(() => {
    const idx = this.activeIndex();
    return idx >= 0 ? this.optionId(idx) : null;
  });

  /**
   * WORKSHOP NOTE: Live region announcement for screen readers.
   * @angular/aria's LiveAnnouncer service would debounce these
   * announcements and handle concurrent announcement conflicts.
   */
  readonly liveAnnouncement = computed(() => {
    if (!this.isOpen()) return '';
    const count = this.filteredOptions().length;
    if (count === 0) return 'No results found.';
    return `${count} result${count === 1 ? '' : 's'} available. Use arrow keys to navigate.`;
  });

  // ---------------------------------------------------------------------------
  // Public helpers
  // ---------------------------------------------------------------------------

  optionId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  /**
   * Highlight the matching substring in an option.
   * Returns safe HTML with <span class="match-highlight"> around matches.
   */
  highlightMatch(option: string): string {
    const term = this.searchTerm().trim();
    if (!term) return this.escapeHtml(option);

    const escaped = this.escapeHtml(option);
    const escapedTerm = this.escapeHtml(term);
    const regex = new RegExp(`(${escapedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<span class="match-highlight">$1</span>');
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.isOpen.set(true);
    this.activeIndex.set(-1);
  }

  onFocus(): void {
    if (this.searchTerm()) {
      this.isOpen.set(true);
    }
  }

  /**
   * WORKSHOP NOTE: We use a small delay before closing on blur to allow
   * mousedown events on options to fire first. @angular/aria's CdkCombobox
   * handles this race condition internally with a FocusMonitor.
   */
  onBlur(): void {
    setTimeout(() => {
      this.isOpen.set(false);
      this.activeIndex.set(-1);
    }, 200);
  }

  /**
   * WORKSHOP NOTE: Full keyboard navigation per WAI-ARIA Combobox spec.
   * @angular/aria's CdkCombobox handles all of these key bindings plus
   * additional ones like Home/End, PageUp/PageDown, and typeahead.
   */
  onKeydown(event: KeyboardEvent): void {
    const options = this.filteredOptions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        }
        this.activeIndex.set(
          this.activeIndex() < options.length - 1
            ? this.activeIndex() + 1
            : 0 // wrap to top
        );
        this.scrollActiveOptionIntoView();
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        }
        this.activeIndex.set(
          this.activeIndex() > 0
            ? this.activeIndex() - 1
            : options.length - 1 // wrap to bottom
        );
        this.scrollActiveOptionIntoView();
        break;

      case 'Enter':
        event.preventDefault();
        if (this.isOpen() && this.activeIndex() >= 0) {
          this.selectOption(options[this.activeIndex()]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.isOpen.set(false);
        this.activeIndex.set(-1);
        break;

      case 'Home':
        if (this.isOpen() && options.length > 0) {
          event.preventDefault();
          this.activeIndex.set(0);
          this.scrollActiveOptionIntoView();
        }
        break;

      case 'End':
        if (this.isOpen() && options.length > 0) {
          event.preventDefault();
          this.activeIndex.set(options.length - 1);
          this.scrollActiveOptionIntoView();
        }
        break;
    }
  }

  selectOption(option: string): void {
    this.searchTerm.set(option);
    this.selected.emit(option);
    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.searchInput()?.nativeElement.focus();
  }

  onClear(): void {
    this.searchTerm.set('');
    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.searchInput()?.nativeElement.focus();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * WORKSHOP NOTE: Scroll the active option into view within the listbox.
   * @angular/aria's CdkOption would handle scroll-into-view automatically
   * when the option becomes active via keyboard navigation.
   */
  private scrollActiveOptionIntoView(): void {
    const idx = this.activeIndex();
    if (idx < 0) return;

    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      const el = document.getElementById(this.optionId(idx));
      el?.scrollIntoView({ block: 'nearest' });
    });
  }
}
