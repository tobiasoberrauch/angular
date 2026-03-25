import { Component, inject, input, signal, computed } from '@angular/core';
import { EmployeeStore, Employee } from '../../data-access/employee.store';
import { TimeEntryStore, TimeEntry } from '../../data-access/time-entry.store';
import { LeaveStore, LeaveRequest } from '../../data-access/leave.store';

/**
 * ============================================================================
 * WORKSHOP: Accessible Employee Profile Accordion
 * ============================================================================
 *
 * This component implements the WAI-ARIA Accordion pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * Key accessibility features implemented manually:
 *   - Each header is a <button> with role within an element with <h3>
 *   - aria-expanded on each trigger button
 *   - aria-controls links the button to its panel
 *   - role="region" + aria-labelledby on each panel
 *   - Keyboard: Enter/Space toggles, ArrowUp/Down navigates between
 *     headers, Home/End jump to first/last header
 *
 * --------------------------------------------------------------------------
 * WHAT @angular/aria WOULD PROVIDE:
 * --------------------------------------------------------------------------
 * If/when @angular/aria ships, it would offer:
 *
 *   import { CdkAccordion, CdkAccordionItem } from '@angular/aria';
 *
 *   - CdkAccordion: Container directive that manages expand/collapse state
 *     across items. Supports single-expand or multi-expand modes.
 *     Automatically applies aria-expanded and aria-controls.
 *
 *   - CdkAccordionItem: Wraps each accordion section. Provides:
 *     - expanded signal for open/close state
 *     - toggle(), open(), close() methods
 *     - Automatic unique ID generation for aria-controls/aria-labelledby
 *     - Keyboard navigation between items (ArrowUp/Down, Home/End)
 *     - Animation hooks via @angular/animations integration
 *
 *   - CdkAccordionToggle: Directive for the trigger element, applies
 *     role="button", aria-expanded, and click/keydown handlers.
 *
 * With @angular/aria, the template would simplify to:
 *
 *   <div cdkAccordion [multi]="true">
 *     @for (section of sections; track section.id) {
 *       <div cdkAccordionItem #item="cdkAccordionItem">
 *         <h3>
 *           <button cdkAccordionToggle>{{ section.title }}</button>
 *         </h3>
 *         <div cdkAccordionContent>{{ section.content }}</div>
 *       </div>
 *     }
 *   </div>
 *
 * ...and all ARIA, keyboard, and state management would be automatic.
 * ============================================================================
 */

/** Describes one section of the accordion */
interface AccordionSection {
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-employee-profile',
  template: `
    @if (employee(); as emp) {
      <div class="profile">
        <!-- Employee header -->
        <div class="profile-header">
          <div class="profile-avatar" [attr.aria-hidden]="true">
            {{ emp.firstName[0] }}{{ emp.lastName[0] }}
          </div>
          <div>
            <h2 class="profile-name">{{ emp.firstName }} {{ emp.lastName }}</h2>
            <p class="profile-position">{{ emp.position }} &middot; {{ emp.department }}</p>
          </div>
        </div>

        <!--
          WORKSHOP NOTE: The accordion container.
          @angular/aria's CdkAccordion directive would be placed here,
          managing the multi-expand state and keyboard navigation scope.
        -->
        <div
          class="accordion"
          role="presentation"
          (keydown)="onAccordionKeydown($event)"
        >
          @for (section of sections; track section.id; let i = $index) {
            <div class="accordion-item">
              <!--
                WORKSHOP NOTE: Accordion trigger per WAI-ARIA spec.
                - The heading level wraps the button (semantic structure)
                - aria-expanded reflects the open/closed state
                - aria-controls points to the associated panel ID
                - @angular/aria's CdkAccordionToggle applies all of these
                  automatically plus manages the unique ID linkage
              -->
              <h3 class="accordion-header">
                <button
                  [id]="triggerId(section.id)"
                  class="accordion-trigger"
                  [attr.aria-expanded]="isSectionOpen(section.id)"
                  [attr.aria-controls]="panelId(section.id)"
                  (click)="toggleSection(section.id)"
                  [attr.data-section-index]="i"
                >
                  <span class="accordion-trigger__icon" aria-hidden="true">
                    {{ section.icon }}
                  </span>
                  <span class="accordion-trigger__title">{{ section.title }}</span>
                  <span
                    class="accordion-trigger__chevron"
                    [class.accordion-trigger__chevron--open]="isSectionOpen(section.id)"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </button>
              </h3>

              <!--
                WORKSHOP NOTE: Accordion panel per WAI-ARIA spec.
                - role="region" provides a landmark for screen readers
                - aria-labelledby links back to the trigger button
                - @angular/aria's CdkAccordionContent would handle this
                  plus deferred rendering and animations
              -->
              @if (isSectionOpen(section.id)) {
                <div
                  [id]="panelId(section.id)"
                  role="region"
                  [attr.aria-labelledby]="triggerId(section.id)"
                  class="accordion-panel"
                >
                  @switch (section.id) {
                    @case ('personal') {
                      <dl class="info-grid">
                        <div class="info-item">
                          <dt>Full Name</dt>
                          <dd>{{ emp.firstName }} {{ emp.lastName }}</dd>
                        </div>
                        <div class="info-item">
                          <dt>Email</dt>
                          <dd>
                            <a [href]="'mailto:' + emp.email">{{ emp.email }}</a>
                          </dd>
                        </div>
                        <div class="info-item">
                          <dt>Department</dt>
                          <dd>{{ emp.department }}</dd>
                        </div>
                        <div class="info-item">
                          <dt>Employee ID</dt>
                          <dd>{{ emp.id }}</dd>
                        </div>
                      </dl>
                    }
                    @case ('employment') {
                      <dl class="info-grid">
                        <div class="info-item">
                          <dt>Position</dt>
                          <dd>{{ emp.position }}</dd>
                        </div>
                        <div class="info-item">
                          <dt>Start Date</dt>
                          <dd>{{ emp.startDate }}</dd>
                        </div>
                        <div class="info-item">
                          <dt>Department</dt>
                          <dd>{{ emp.department }}</dd>
                        </div>
                        <div class="info-item">
                          <dt>Leave Requests</dt>
                          <dd>
                            {{ employeeLeaveRequests().length }} total
                            ({{ pendingLeaveCount() }} pending)
                          </dd>
                        </div>
                      </dl>

                      @if (employeeLeaveRequests().length > 0) {
                        <h4 class="subsection-title">Recent Leave Requests</h4>
                        <table class="data-table" role="table" aria-label="Leave requests">
                          <thead>
                            <tr>
                              <th scope="col">Type</th>
                              <th scope="col">Dates</th>
                              <th scope="col">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (req of employeeLeaveRequests(); track req.id) {
                              <tr>
                                <td>{{ req.type }}</td>
                                <td>{{ req.startDate }} - {{ req.endDate }}</td>
                                <td>
                                  <span class="status-pill"
                                    [class]="'status-pill--' + req.status">
                                    {{ req.status }}
                                  </span>
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      }
                    }
                    @case ('time-entries') {
                      @if (employeeTimeEntries().length === 0) {
                        <p class="empty-state">No time entries recorded.</p>
                      } @else {
                        <p class="summary-text">
                          Total hours logged: <strong>{{ totalHours() }}</strong>
                        </p>

                        <table class="data-table" role="table" aria-label="Time entries">
                          <thead>
                            <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Hours</th>
                              <th scope="col">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (entry of employeeTimeEntries(); track entry.id) {
                              <tr>
                                <td>{{ entry.date }}</td>
                                <td>{{ entry.hours }}h</td>
                                <td>{{ entry.description }}</td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      }
                    }
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    } @else {
      <p class="empty-state" role="status">
        No employee selected. Choose an employee from the directory.
      </p>
    }
  `,
  styles: `
    .profile {
      max-width: 640px;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .profile-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4361ee, #7c3aed);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      flex-shrink: 0;
    }

    .profile-name {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .profile-position {
      margin: 2px 0 0;
      font-size: 14px;
      color: #666;
    }

    /* ---- Accordion ---- */

    .accordion {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
    }

    .accordion-item + .accordion-item {
      border-top: 1px solid #e5e7eb;
    }

    .accordion-header {
      margin: 0;
    }

    .accordion-trigger {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 14px 16px;
      background: #fafbfc;
      border: none;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      color: #1a1a2e;
      text-align: left;
      gap: 10px;
      transition: background 120ms;
    }

    .accordion-trigger:hover {
      background: #f0f2f5;
    }

    .accordion-trigger:focus-visible {
      outline: 2px solid #4361ee;
      outline-offset: -2px;
      z-index: 1;
      position: relative;
    }

    .accordion-trigger__icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .accordion-trigger__title {
      flex: 1;
    }

    .accordion-trigger__chevron {
      transition: transform 200ms ease;
      color: #999;
      display: flex;
    }

    .accordion-trigger__chevron--open {
      transform: rotate(180deg);
    }

    .accordion-panel {
      padding: 16px 20px 20px;
      background: white;
      animation: panelSlideDown 200ms ease-out;
    }

    @keyframes panelSlideDown {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ---- Info grid (definition list) ---- */

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin: 0;
    }

    .info-item dt {
      font-size: 12px;
      font-weight: 500;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }

    .info-item dd {
      margin: 0;
      font-size: 14px;
      color: #1a1a2e;
    }

    .info-item dd a {
      color: #4361ee;
      text-decoration: none;
    }

    .info-item dd a:hover {
      text-decoration: underline;
    }

    /* ---- Data tables ---- */

    .subsection-title {
      margin: 20px 0 8px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .data-table th {
      text-align: left;
      padding: 8px 10px;
      font-weight: 500;
      color: #666;
      border-bottom: 2px solid #e5e7eb;
    }

    .data-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
    }

    .data-table tbody tr:hover {
      background: #fafbfc;
    }

    .status-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-pill--approved { background: #e8f5e9; color: #2e7d32; }
    .status-pill--pending  { background: #fff3e0; color: #ef6c00; }
    .status-pill--rejected { background: #ffebee; color: #c62828; }

    .summary-text {
      margin: 0 0 12px;
      font-size: 14px;
      color: #555;
    }

    .empty-state {
      font-size: 14px;
      color: #888;
      font-style: italic;
      padding: 12px 0;
    }
  `,
})
export class EmployeeProfileComponent {
  // ---------------------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------------------
  private readonly employeeStore = inject(EmployeeStore);
  private readonly timeEntryStore = inject(TimeEntryStore);
  private readonly leaveStore = inject(LeaveStore);

  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------
  /**
   * The ID of the employee to display. The component looks up the full
   * Employee record from the EmployeeStore.
   */
  readonly employeeId = input.required<string>();

  // ---------------------------------------------------------------------------
  // Accordion sections definition
  // ---------------------------------------------------------------------------
  readonly sections: AccordionSection[] = [
    { id: 'personal', title: 'Personal Information', icon: '\u{1F464}' },
    { id: 'employment', title: 'Employment Details', icon: '\u{1F4BC}' },
    { id: 'time-entries', title: 'Time Entries', icon: '\u{1F552}' },
  ];

  /**
   * WORKSHOP NOTE: We track open sections as a Set inside a signal.
   * @angular/aria's CdkAccordion would manage this via an expanded
   * signal on each CdkAccordionItem, supporting both single-expand
   * and multi-expand modes without manual Set management.
   */
  private readonly openSections = signal<Set<string>>(new Set(['personal']));

  // ---------------------------------------------------------------------------
  // Unique ID prefix for ARIA linkage
  // ---------------------------------------------------------------------------
  private readonly uid = crypto.randomUUID().slice(0, 8);

  // ---------------------------------------------------------------------------
  // Computed data from stores
  // ---------------------------------------------------------------------------

  readonly employee = computed((): Employee | undefined => {
    return this.employeeStore.employees().find(e => e.id === this.employeeId());
  });

  readonly employeeTimeEntries = computed((): TimeEntry[] => {
    return this.timeEntryStore.entries().filter(
      e => e.employeeId === this.employeeId()
    );
  });

  readonly totalHours = computed((): number => {
    return this.employeeTimeEntries().reduce((sum, e) => sum + e.hours, 0);
  });

  readonly employeeLeaveRequests = computed((): LeaveRequest[] => {
    return this.leaveStore.requests().filter(
      r => r.employeeId === this.employeeId()
    );
  });

  readonly pendingLeaveCount = computed((): number => {
    return this.employeeLeaveRequests().filter(r => r.status === 'pending').length;
  });

  // ---------------------------------------------------------------------------
  // Accordion helpers
  // ---------------------------------------------------------------------------

  triggerId(sectionId: string): string {
    return `accordion-trigger-${this.uid}-${sectionId}`;
  }

  panelId(sectionId: string): string {
    return `accordion-panel-${this.uid}-${sectionId}`;
  }

  isSectionOpen(sectionId: string): boolean {
    return this.openSections().has(sectionId);
  }

  toggleSection(sectionId: string): void {
    const current = new Set(this.openSections());
    if (current.has(sectionId)) {
      current.delete(sectionId);
    } else {
      current.add(sectionId);
    }
    this.openSections.set(current);
  }

  // ---------------------------------------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------------------------------------

  /**
   * WORKSHOP NOTE: Full keyboard navigation per WAI-ARIA Accordion spec.
   * @angular/aria's CdkAccordion would implement this internally,
   * including support for:
   *   - ArrowDown/ArrowUp: Move focus to next/previous header
   *   - Home: Move focus to first header
   *   - End: Move focus to last header
   *   - Enter/Space: Toggle the focused section (handled by button default)
   *
   * The manual implementation below queries trigger buttons by class name
   * and manages focus programmatically. @angular/aria would use a
   * FocusKeyManager that integrates with the component tree directly.
   */
  onAccordionKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;

    // Only handle keys when focus is on an accordion trigger button
    if (!target.classList.contains('accordion-trigger')) return;

    const triggers = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>(
        '.accordion-trigger'
      )
    );
    const currentIndex = triggers.indexOf(target as HTMLButtonElement);

    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
        break;

      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
        break;

      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        nextIndex = triggers.length - 1;
        break;
    }

    if (nextIndex !== null) {
      triggers[nextIndex].focus();
    }
  }
}
