import { Component, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  template: `
    <h2 class="page-title">Product Catalog</h2>
    <div class="toolbar">
      <input
        type="text"
        placeholder="Search products..."
        [value]="searchTerm()"
        (input)="searchTerm.set($any($event.target).value)"
      />
      <span class="count">{{ filteredCount() }} products</span>
    </div>
    <div class="product-grid">
      @for (product of filteredProducts(); track product.id) {
        <div class="card product-card">
          <h3>{{ product.name }}</h3>
          <p class="price">{{ product.price | currency:'EUR' }}</p>
          <p class="category">{{ product.category }}</p>
          <button class="btn btn--primary" (click)="addToCart(product)">Add to Cart</button>
        </div>
      } @empty {
        <p>No products found.</p>
      }
    </div>
  `,
  styles: `
    .toolbar {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);

      input {
        padding: var(--spacing-sm);
        border: 1px solid var(--color-border);
        border-radius: var(--radius);
        flex: 1;
        max-width: 300px;
      }
    }

    .count { color: var(--color-text-secondary); }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--spacing-md);
    }

    .product-card h3 { margin-bottom: var(--spacing-sm); }
    .price { font-size: 18px; font-weight: 600; color: var(--color-primary); }
    .category { color: var(--color-text-secondary); margin: var(--spacing-sm) 0; }
  `,
})
export class ProductListComponent {
  // Signals for reactive state management
  readonly searchTerm = signal('');
  readonly products = signal([
    { id: '1', name: 'Angular Workshop Book', price: 49.99, category: 'Books', inStock: true },
    { id: '2', name: 'TypeScript Masterclass', price: 39.99, category: 'Courses', inStock: true },
    { id: '3', name: 'RxJS Deep Dive', price: 29.99, category: 'Courses', inStock: false },
    { id: '4', name: 'NgRx Signals Guide', price: 19.99, category: 'Books', inStock: true },
  ]);

  // Computed signal for filtered products
  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.products().filter(
      (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    );
  });

  readonly filteredCount = computed(() => this.filteredProducts().length);

  addToCart(product: { id: string; name: string }): void {
    console.log(`Added ${product.name} to cart`);
  }
}
