import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'parental';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

interface LeaveState {
  requests: LeaveRequest[];
  loading: boolean;
}

export const LeaveStore = signalStore(
  { providedIn: 'root' },

  withState<LeaveState>({
    requests: [
      { id: '1', employeeId: '1', type: 'vacation', startDate: '2026-04-10', endDate: '2026-04-18', status: 'approved', reason: 'Spring break' },
      { id: '2', employeeId: '3', type: 'personal', startDate: '2026-03-28', endDate: '2026-03-28', status: 'pending', reason: 'Appointment' },
      { id: '3', employeeId: '2', type: 'sick', startDate: '2026-03-20', endDate: '2026-03-21', status: 'approved', reason: 'Flu' },
    ],
    loading: false,
  }),

  withComputed((store) => ({
    pendingRequests: computed(() => store.requests().filter((r) => r.status === 'pending')),
    approvedRequests: computed(() => store.requests().filter((r) => r.status === 'approved')),
    pendingCount: computed(() => store.requests().filter((r) => r.status === 'pending').length),
    requestCount: computed(() => store.requests().length),
  })),

  withMethods((store) => ({
    // Status transitions: pending → approved | rejected
    approve(id: string): void {
      patchState(store, {
        requests: store.requests().map((r) =>
          r.id === id ? { ...r, status: 'approved' as const } : r
        ),
      });
    },
    reject(id: string): void {
      patchState(store, {
        requests: store.requests().map((r) =>
          r.id === id ? { ...r, status: 'rejected' as const } : r
        ),
      });
    },
    addRequest(request: Omit<LeaveRequest, 'id' | 'status'>): void {
      patchState(store, {
        requests: [
          ...store.requests(),
          { ...request, id: crypto.randomUUID(), status: 'pending' as const },
        ],
      });
    },
    removeRequest(id: string): void {
      patchState(store, {
        requests: store.requests().filter((r) => r.id !== id),
      });
    },
  }))
);
