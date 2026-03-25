import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  currency: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  expectedCloseDate: string;
}

interface DealState {
  deals: Deal[];
  loading: boolean;
}

/**
 * DEAL STORE: Demonstrates pipeline stage computations.
 *
 * The computed views group deals by stage for a pipeline view,
 * similar to how TaskStore groups by status for a Kanban board.
 */
export const DealStore = signalStore(
  { providedIn: 'root' },

  withState<DealState>({
    deals: [
      { id: '1', title: 'Angular Training Package', contactId: '1', value: 15000, currency: 'EUR', stage: 'negotiation', expectedCloseDate: '2026-04-15' },
      { id: '2', title: 'React Migration Consulting', contactId: '2', value: 8000, currency: 'EUR', stage: 'qualified', expectedCloseDate: '2026-05-01' },
      { id: '3', title: 'Enterprise License', contactId: '3', value: 45000, currency: 'EUR', stage: 'proposal', expectedCloseDate: '2026-06-30' },
      { id: '4', title: 'Support Contract', contactId: '1', value: 5000, currency: 'EUR', stage: 'closed-won', expectedCloseDate: '2026-03-01' },
    ],
    loading: false,
  }),

  withComputed((store) => ({
    // Pipeline view grouped by stage
    byStage: computed(() => {
      const stages: Record<string, Deal[]> = {
        lead: [], qualified: [], proposal: [],
        negotiation: [], 'closed-won': [], 'closed-lost': [],
      };
      for (const deal of store.deals()) {
        stages[deal.stage].push(deal);
      }
      return stages;
    }),
    totalPipelineValue: computed(() =>
      store.deals()
        .filter((d) => !d.stage.startsWith('closed'))
        .reduce((sum, d) => sum + d.value, 0)
    ),
    wonValue: computed(() =>
      store.deals()
        .filter((d) => d.stage === 'closed-won')
        .reduce((sum, d) => sum + d.value, 0)
    ),
    dealCount: computed(() => store.deals().length),
  })),

  withMethods((store) => ({
    advanceStage(id: string, newStage: Deal['stage']): void {
      patchState(store, {
        deals: store.deals().map((d) => (d.id === id ? { ...d, stage: newStage } : d)),
      });
    },
    addDeal(deal: Omit<Deal, 'id'>): void {
      patchState(store, {
        deals: [...store.deals(), { ...deal, id: crypto.randomUUID() }],
      });
    },
    updateDeal(id: string, updates: Partial<Deal>): void {
      patchState(store, {
        deals: store.deals().map((d) => (d.id === id ? { ...d, ...updates } : d)),
      });
    },
    removeDeal(id: string): void {
      patchState(store, {
        deals: store.deals().filter((d) => d.id !== id),
      });
    },
  })),

  withHooks({
    onInit(store) {
      console.log('[DealStore] initialized with', store.dealCount(), 'deals');
    },
  })
);
