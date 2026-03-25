import { Component, signal, computed } from '@angular/core';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  tags: string[];
}

@Component({
  selector: 'app-contact-list',
  template: `
    <h2 class="page-title">Contacts</h2>
    <div class="toolbar">
      <input
        type="text"
        placeholder="Search contacts..."
        [value]="searchTerm()"
        (input)="searchTerm.set($any($event.target).value)"
      />
      <span class="count">{{ filteredContacts().length }} contacts</span>
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
        @for (contact of filteredContacts(); track contact.id) {
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
  readonly searchTerm = signal('');

  readonly contacts = signal<Contact[]>([
    { id: '1', firstName: 'Konstantin', lastName: 'Merker', email: 'k.merker@dvc.de', company: 'DVC', tags: ['lead', 'angular'] },
    { id: '2', firstName: 'Sarah', lastName: 'Koch', email: 's.koch@example.de', company: 'TechCorp', tags: ['prospect'] },
    { id: '3', firstName: 'Jan', lastName: 'Braun', email: 'j.braun@example.de', company: 'DataFlow', tags: ['customer', 'enterprise'] },
  ]);

  readonly filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.contacts();
    return this.contacts().filter(
      (c) =>
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.company.toLowerCase().includes(term) ||
        c.tags.some((t) => t.includes(term))
    );
  });
}
