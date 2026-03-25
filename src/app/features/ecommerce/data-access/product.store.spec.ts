import { TestBed } from '@angular/core/testing';
import { ProductStore } from './product.store';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * SIGNALSTORE TESTING PATTERNS (Vitest)
 *
 * Key differences from Jasmine:
 * - vi.fn() instead of jasmine.createSpy()
 * - No need for fakeAsync/tick — use vi.useFakeTimers() if needed
 * - expect().toEqual() works the same
 *
 * Testing SignalStore:
 * 1. Provide the store via TestBed (it's providedIn: 'root')
 * 2. Access state via signal reads: store.products()
 * 3. Call methods: store.setSearchTerm('test')
 * 4. Assert computed signals update reactively
 */
describe('ProductStore', () => {
  let store: InstanceType<typeof ProductStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ProductStore);
  });

  it('should initialize with seed products', () => {
    expect(store.products().length).toBeGreaterThan(0);
    expect(store.productCount()).toBe(store.products().length);
  });

  it('should filter products by search term', () => {
    const initialCount = store.productCount();

    store.setSearchTerm('Angular');

    const filtered = store.filteredProducts();
    expect(filtered.length).toBeLessThan(initialCount);
    expect(filtered.every((p) => p.name.toLowerCase().includes('angular'))).toBe(true);
  });

  it('should filter by category via search', () => {
    store.setSearchTerm('Courses');

    const filtered = store.filteredProducts();
    expect(filtered.every((p) => p.category === 'Courses')).toBe(true);
  });

  it('should return all products when search is empty', () => {
    store.setSearchTerm('test');
    store.setSearchTerm('');

    expect(store.filteredProducts().length).toBe(store.productCount());
  });

  it('should compute inStockCount correctly', () => {
    const inStock = store.products().filter((p) => p.inStock).length;
    expect(store.inStockCount()).toBe(inStock);
  });

  it('should compute categories as unique sorted list', () => {
    const categories = store.categories();
    expect(categories).toEqual([...new Set(categories)].sort());
  });

  it('should toggle product stock status', () => {
    const product = store.products()[0];
    const wasInStock = product.inStock;

    store.toggleStock(product.id);

    const updated = store.products().find((p) => p.id === product.id)!;
    expect(updated.inStock).toBe(!wasInStock);
  });

  it('should add a new product', () => {
    const before = store.productCount();

    store.addProduct({
      name: 'New Product',
      price: 99.99,
      category: 'Books',
      inStock: true,
    });

    expect(store.productCount()).toBe(before + 1);
    expect(store.products().some((p) => p.name === 'New Product')).toBe(true);
  });

  it('should remove a product', () => {
    const product = store.products()[0];
    const before = store.productCount();

    store.removeProduct(product.id);

    expect(store.productCount()).toBe(before - 1);
    expect(store.products().some((p) => p.id === product.id)).toBe(false);
  });
});
