import { Component, inject } from '@angular/core';
import { EmployeeStore } from '../../data-access/employee.store';

@Component({
  selector: 'app-employee-list',
  template: `
    <h2 class="page-title">Employee Directory</h2>
    <div class="toolbar">
      <select (change)="employeeStore.selectDepartment($any($event.target).value)">
        <option value="">All Departments</option>
        @for (dept of employeeStore.departments(); track dept) {
          <option [value]="dept">{{ dept }}</option>
        }
      </select>
      <span class="count">{{ employeeStore.filteredEmployees().length }} employees</span>
    </div>
    <div class="employee-grid">
      @for (emp of employeeStore.filteredEmployees(); track emp.id) {
        <div class="card employee-card">
          <div class="employee-card__avatar">{{ emp.firstName[0] }}{{ emp.lastName[0] }}</div>
          <div>
            <h3>{{ emp.firstName }} {{ emp.lastName }}</h3>
            <p class="employee-card__position">{{ emp.position }}</p>
            <p class="employee-card__dept">{{ emp.department }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .toolbar {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);

      select {
        padding: var(--spacing-sm);
        border: 1px solid var(--color-border);
        border-radius: var(--radius);
      }
    }

    .count { color: var(--color-text-secondary); }

    .employee-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacing-md);
    }

    .employee-card {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .employee-card__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .employee-card__position { color: var(--color-text-secondary); }
    .employee-card__dept { font-size: 12px; color: var(--color-text-secondary); }
  `,
})
export class EmployeeListComponent {
  readonly employeeStore = inject(EmployeeStore);
}
