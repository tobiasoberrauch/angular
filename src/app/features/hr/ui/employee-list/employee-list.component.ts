import { Component, signal, computed } from '@angular/core';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
}

@Component({
  selector: 'app-employee-list',
  template: `
    <h2 class="page-title">Employee Directory</h2>
    <div class="toolbar">
      <select (change)="selectedDepartment.set($any($event.target).value)">
        <option value="">All Departments</option>
        @for (dept of departments(); track dept) {
          <option [value]="dept">{{ dept }}</option>
        }
      </select>
      <span class="count">{{ filteredEmployees().length }} employees</span>
    </div>
    <div class="employee-grid">
      @for (emp of filteredEmployees(); track emp.id) {
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
  readonly selectedDepartment = signal('');

  readonly employees = signal<Employee[]>([
    { id: '1', firstName: 'Anna', lastName: 'Schmidt', email: 'a.schmidt@dvc.de', department: 'Engineering', position: 'Senior Developer' },
    { id: '2', firstName: 'Max', lastName: 'Mueller', email: 'm.mueller@dvc.de', department: 'Engineering', position: 'Tech Lead' },
    { id: '3', firstName: 'Lisa', lastName: 'Weber', email: 'l.weber@dvc.de', department: 'Design', position: 'UX Designer' },
    { id: '4', firstName: 'Tom', lastName: 'Fischer', email: 't.fischer@dvc.de', department: 'Product', position: 'Product Manager' },
  ]);

  readonly departments = computed(() =>
    [...new Set(this.employees().map((e) => e.department))].sort()
  );

  readonly filteredEmployees = computed(() => {
    const dept = this.selectedDepartment();
    return dept ? this.employees().filter((e) => e.department === dept) : this.employees();
  });
}
