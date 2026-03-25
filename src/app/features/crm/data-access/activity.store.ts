import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  contactId: string;
  dealId?: string;
  subject: string;
  date: string;
  completed: boolean;
}

interface ActivityState {
  activities: Activity[];
  loading: boolean;
}

export const ActivityStore = signalStore(
  { providedIn: 'root' },

  withState<ActivityState>({
    activities: [
      { id: '1', type: 'call', contactId: '1', dealId: '1', subject: 'Discuss training scope', date: '2026-03-24', completed: true },
      { id: '2', type: 'email', contactId: '2', subject: 'Send proposal', date: '2026-03-25', completed: false },
      { id: '3', type: 'meeting', contactId: '3', dealId: '3', subject: 'License review meeting', date: '2026-03-26', completed: false },
      { id: '4', type: 'note', contactId: '1', subject: 'Follow up on pricing', date: '2026-03-25', completed: false },
    ],
    loading: false,
  }),

  withComputed((store) => ({
    pendingActivities: computed(() =>
      store.activities().filter((a) => !a.completed)
    ),
    completedActivities: computed(() =>
      store.activities().filter((a) => a.completed)
    ),
    // Activities grouped by contact for the contact detail view
    byContact: computed(() => {
      const grouped: Record<string, Activity[]> = {};
      for (const activity of store.activities()) {
        (grouped[activity.contactId] ??= []).push(activity);
      }
      return grouped;
    }),
    activityCount: computed(() => store.activities().length),
  })),

  withMethods((store) => ({
    addActivity(activity: Omit<Activity, 'id'>): void {
      patchState(store, {
        activities: [...store.activities(), { ...activity, id: crypto.randomUUID() }],
      });
    },
    toggleCompleted(id: string): void {
      patchState(store, {
        activities: store.activities().map((a) =>
          a.id === id ? { ...a, completed: !a.completed } : a
        ),
      });
    },
    removeActivity(id: string): void {
      patchState(store, {
        activities: store.activities().filter((a) => a.id !== id),
      });
    },
  }))
);
