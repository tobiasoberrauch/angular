import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface ProductState {
  products: Product[];
  searchTerm: string;
  loading: boolean;
}

const initialState: ProductState = {
  products: [
    { id: '1', name: 'Angular Workshop Book', price: 49.99, category: 'Books', inStock: true },
    { id: '2', name: 'TypeScript Masterclass', price: 39.99, category: 'Courses', inStock: true },
    { id: '3', name: 'RxJS Deep Dive', price: 29.99, category: 'Courses', inStock: false },
    { id: '4', name: 'NgRx Signals Guide', price: 19.99, category: 'Books', inStock: true },
    { id: '5', name: 'Angular Testing Pro', price: 44.99, category: 'Courses', inStock: true },
  ],
  searchTerm: '',
  loading: false,
};

/**
 * SIGNALSTORE PATTERN: signalStore() creates a reactive store with typed state.
 *
 * Building blocks:
 * - withState()    → defines initial state shape (each property becomes a signal)
 * - withComputed() → derives values from state signals (like computed())
 * - withMethods()  → defines actions that update state via patchState()
 * - withHooks()    → lifecycle hooks (onInit for data loading)
 *
 * Unlike NgRx Store (Redux pattern), SignalStore is:
 * - No actions/reducers/effects boilerplate
 * - Direct signal access (store.products() instead of store.select())
 * - patchState() for immutable updates (replaces reducers)
 */
export const ProductStore = signalStore(
  { providedIn: 'root' },

  // withState: Each property becomes a signal on the store instance
  withState(initialState),

  // withComputed: Derived state, recalculates only when dependencies change
  withComputed((store) => ({
    filteredProducts: computed(() => {
      const term = store.searchTerm().toLowerCase();
      if (!term) return store.products();
      return store.products().filter(
        (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
      );
    }),
    productCount: computed(() => store.products().length),
    inStockCount: computed(() => store.products().filter((p) => p.inStock).length),
    categories: computed(() => [...new Set(store.products().map((p) => p.category))].sort()),
  })),

  // withMethods: State mutations via patchState() — immutable updates
  withMethods((store) => ({
    setSearchTerm(term: string): void {
      // patchState: Merges partial state immutably (replaces Redux reducers)
      patchState(store, { searchTerm: term });
    },
    addProduct(product: Omit<Product, 'id'>): void {
      const newProduct = { ...product, id: crypto.randomUUID() };
      patchState(store, { products: [...store.products(), newProduct] });
    },
    toggleStock(id: string): void {
      patchState(store, {
        products: store.products().map((p) =>
          p.id === id ? { ...p, inStock: !p.inStock } : p
        ),
      });
    },
    removeProduct(id: string): void {
      patchState(store, {
        products: store.products().filter((p) => p.id !== id),
      });
    },
  })),

  // withHooks: Lifecycle — onInit runs when store is first injected
  withHooks({
    onInit(store) {
      console.log('[ProductStore] initialized with', store.productCount(), 'products');
      // In step-06, this will load data from the mock API via HTTP
    },
  })
);
