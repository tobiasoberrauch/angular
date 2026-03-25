import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

/**
 * CART STORE: Demonstrates withState() for non-entity state.
 *
 * Unlike ProductStore (entity collection), CartStore manages a simpler
 * list where items can have quantities. This shows that SignalStore
 * is flexible — use withEntities() for CRUD collections, withState()
 * for everything else.
 */
export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>({ items: [] }),

  withComputed((store) => ({
    itemCount: computed(() =>
      store.items().reduce((sum, item) => sum + item.quantity, 0)
    ),
    total: computed(() =>
      store.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
    ),
    isEmpty: computed(() => store.items().length === 0),
  })),

  withMethods((store) => ({
    addItem(productId: string, productName: string, price: number): void {
      const existing = store.items().find((i) => i.productId === productId);
      if (existing) {
        patchState(store, {
          items: store.items().map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        });
      } else {
        patchState(store, {
          items: [...store.items(), { productId, productName, price, quantity: 1 }],
        });
      }
    },
    removeItem(productId: string): void {
      patchState(store, {
        items: store.items().filter((i) => i.productId !== productId),
      });
    },
    updateQuantity(productId: string, quantity: number): void {
      if (quantity <= 0) {
        patchState(store, {
          items: store.items().filter((i) => i.productId !== productId),
        });
      } else {
        patchState(store, {
          items: store.items().map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      }
    },
    clear(): void {
      patchState(store, { items: [] });
    },
  }))
);
