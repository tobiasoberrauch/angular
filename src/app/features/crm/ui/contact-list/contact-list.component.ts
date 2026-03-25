import { Component, inject } from '@angular/core';
import { ContactStore } from '../../data-access/contact.store';

@Component({
  selector: 'app-contact-list',
  template: `
    <h2 class="page-title">Contacts</h2>
    <div class="toolbar">
      <input
        type="text"
        placeholder="Search contacts..."
        [value]="contactStore.searchTerm()"
        (input)="contactStore.setSearchTerm($any($event.target).value)"
      />
      <span class="count">{{ contactStore.filteredContacts().length }} contacts</span>
    </div>
    <table class="contact-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Company</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        @for (contact of contactStore.filteredContacts(); track contact.id) {
          <tr>
            <td>{{ contact.firstName }} {{ contact.lastName }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.company }}</td>
            <td>
              @for (tag of contact.tags; track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </td>
          </tr>
        } @empty {
          <tr><td colspan="4">No contacts found.</td></tr>
        }
      </tbody>
    </table>
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

    .contact-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);

      th, td {
        padding: var(--spacing-sm) var(--spacing-md);
        text-align: left;
        border-bottom: 1px solid var(--color-border);
      }

      th {
        background: var(--color-bg);
        font-weight: 600;
        font-size: 12px;
        text-transform: uppercase;
        color: var(--color-text-secondary);
      }
    }

    .tag {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 10px;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      font-size: 11px;
      margin-right: 4px;
    }
  `,
})
export class ContactListComponent {
  readonly contactStore = inject(ContactStore);
}
