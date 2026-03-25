import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  date: string;
  hours: number;
  description: string;
}

interface TimeEntryState {
  entries: TimeEntry[];
  loading: boolean;
}

export const TimeEntryStore = signalStore(
  { providedIn: 'root' },

  withState<TimeEntryState>({
    entries: [
      { id: '1', employeeId: '1', projectId: '1', date: '2026-03-24', hours: 8, description: 'Signal Forms implementation' },
      { id: '2', employeeId: '1', projectId: '1', date: '2026-03-25', hours: 6, description: 'Angular Aria integration' },
      { id: '3', employeeId: '2', projectId: '2', date: '2026-03-24', hours: 7, description: 'API migration planning' },
      { id: '4', employeeId: '2', projectId: '1', date: '2026-03-25', hours: 4, description: 'Code review' },
    ],
    loading: false,
  }),

  withComputed((store) => ({
    totalHours: computed(() =>
      store.entries().reduce((sum, e) => sum + e.hours, 0)
    ),
    // Weekly hours grouped by employee
    hoursByEmployee: computed(() => {
      const grouped: Record<string, number> = {};
      for (const entry of store.entries()) {
        grouped[entry.employeeId] = (grouped[entry.employeeId] ?? 0) + entry.hours;
      }
      return grouped;
    }),
    entryCount: computed(() => store.entries().length),
  })),

  withMethods((store) => ({
    addEntry(entry: Omit<TimeEntry, 'id'>): void {
      patchState(store, {
        entries: [...store.entries(), { ...entry, id: crypto.randomUUID() }],
      });
    },
    updateEntry(id: string, updates: Partial<TimeEntry>): void {
      patchState(store, {
        entries: store.entries().map((e) => (e.id === id ? { ...e, ...updates } : e)),
      });
    },
    removeEntry(id: string): void {
      patchState(store, {
        entries: store.entries().filter((e) => e.id !== id),
      });
    },
  }))
);
