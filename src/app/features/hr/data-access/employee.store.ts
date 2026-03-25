import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  startDate: string;
}

interface EmployeeState {
  employees: Employee[];
  selectedDepartment: string;
  loading: boolean;
}

export const EmployeeStore = signalStore(
  { providedIn: 'root' },

  withState<EmployeeState>({
    employees: [
      { id: '1', firstName: 'Anna', lastName: 'Schmidt', email: 'a.schmidt@dvc.de', department: 'Engineering', position: 'Senior Developer', startDate: '2022-03-15' },
      { id: '2', firstName: 'Max', lastName: 'Mueller', email: 'm.mueller@dvc.de', department: 'Engineering', position: 'Tech Lead', startDate: '2020-06-01' },
      { id: '3', firstName: 'Lisa', lastName: 'Weber', email: 'l.weber@dvc.de', department: 'Design', position: 'UX Designer', startDate: '2023-01-10' },
      { id: '4', firstName: 'Tom', lastName: 'Fischer', email: 't.fischer@dvc.de', department: 'Product', position: 'Product Manager', startDate: '2021-09-20' },
      { id: '5', firstName: 'Julia', lastName: 'Wagner', email: 'j.wagner@dvc.de', department: 'Engineering', position: 'Junior Developer', startDate: '2024-07-01' },
    ],
    selectedDepartment: '',
    loading: false,
  }),

  withComputed((store) => ({
    departments: computed(() =>
      [...new Set(store.employees().map((e) => e.department))].sort()
    ),
    filteredEmployees: computed(() => {
      const dept = store.selectedDepartment();
      return dept ? store.employees().filter((e) => e.department === dept) : store.employees();
    }),
    // Grouped view by department
    byDepartment: computed(() => {
      const grouped: Record<string, Employee[]> = {};
      for (const emp of store.employees()) {
        (grouped[emp.department] ??= []).push(emp);
      }
      return grouped;
    }),
    employeeCount: computed(() => store.employees().length),
  })),

  withMethods((store) => ({
    selectDepartment(dept: string): void {
      patchState(store, { selectedDepartment: dept });
    },
    addEmployee(employee: Omit<Employee, 'id'>): void {
      patchState(store, {
        employees: [...store.employees(), { ...employee, id: crypto.randomUUID() }],
      });
    },
    updateEmployee(id: string, updates: Partial<Employee>): void {
      patchState(store, {
        employees: store.employees().map((e) => (e.id === id ? { ...e, ...updates } : e)),
      });
    },
    removeEmployee(id: string): void {
      patchState(store, {
        employees: store.employees().filter((e) => e.id !== id),
      });
    },
  })),

  withHooks({
    onInit(store) {
      console.log('[EmployeeStore] initialized with', store.employeeCount(), 'employees');
    },
  })
);
