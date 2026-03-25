import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductStore } from '../../data-access/product.store';
import { CartStore } from '../../data-access/cart.store';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  template: `
    <h2 class="page-title">Product Catalog</h2>
    <div class="toolbar">
      <input
        type="text"
        placeholder="Search products..."
        [value]="productStore.searchTerm()"
        (input)="productStore.setSearchTerm($any($event.target).value)"
      />
      <span class="count">{{ productStore.filteredProducts().length }} products</span>
      @if (cartStore.itemCount() > 0) {
        <span class="cart-badge">Cart: {{ cartStore.itemCount() }} items ({{ cartStore.total() | currency:'EUR' }})</span>
      }
    </div>
    <div class="product-grid">
      @for (product of productStore.filteredProducts(); track product.id) {
        <div class="card product-card">
          <h3>{{ product.name }}</h3>
          <p class="price">{{ product.price | currency:'EUR' }}</p>
          <p class="category">{{ product.category }}</p>
          <p class="stock" [class.out-of-stock]="!product.inStock">
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </p>
          <button
            class="btn btn--primary"
            [disabled]="!product.inStock"
            (click)="cartStore.addItem(product.id, product.name, product.price)"
          >
            Add to Cart
          </button>
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
    .cart-badge {
      margin-left: auto;
      padding: 4px 12px;
      background: var(--color-primary);
      color: white;
      border-radius: var(--radius);
      font-size: 13px;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--spacing-md);
    }

    .product-card h3 { margin-bottom: var(--spacing-sm); }
    .price { font-size: 18px; font-weight: 600; color: var(--color-primary); }
    .category { color: var(--color-text-secondary); margin: var(--spacing-sm) 0; }
    .stock { font-size: 12px; color: var(--color-success); }
    .out-of-stock { color: var(--color-warn); }
  `,
})
export class ProductListComponent {
  // SIGNALSTORE INJECTION: inject() replaces constructor injection.
  // The store is a singleton (providedIn: 'root') — all components
  // share the same reactive state automatically.
  readonly productStore = inject(ProductStore);
  readonly cartStore = inject(CartStore);
}
