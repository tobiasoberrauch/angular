import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  tags: string[];
  phone?: string;
}

interface ContactState {
  contacts: Contact[];
  searchTerm: string;
  loading: boolean;
}

export const ContactStore = signalStore(
  { providedIn: 'root' },

  withState<ContactState>({
    contacts: [
      { id: '1', firstName: 'Konstantin', lastName: 'Merker', email: 'k.merker@dvc.de', company: 'DVC', tags: ['lead', 'angular'], phone: '+49 170 1234567' },
      { id: '2', firstName: 'Sarah', lastName: 'Koch', email: 's.koch@example.de', company: 'TechCorp', tags: ['prospect'] },
      { id: '3', firstName: 'Jan', lastName: 'Braun', email: 'j.braun@example.de', company: 'DataFlow', tags: ['customer', 'enterprise'] },
      { id: '4', firstName: 'Maria', lastName: 'Lang', email: 'm.lang@example.de', company: 'CloudNine', tags: ['prospect', 'angular'] },
    ],
    searchTerm: '',
    loading: false,
  }),

  withComputed((store) => ({
    // Tag-based filtering
    filteredContacts: computed(() => {
      const term = store.searchTerm().toLowerCase();
      if (!term) return store.contacts();
      return store.contacts().filter(
        (c) =>
          c.firstName.toLowerCase().includes(term) ||
          c.lastName.toLowerCase().includes(term) ||
          c.company.toLowerCase().includes(term) ||
          c.tags.some((t) => t.includes(term))
      );
    }),
    allTags: computed(() =>
      [...new Set(store.contacts().flatMap((c) => c.tags))].sort()
    ),
    contactCount: computed(() => store.contacts().length),
  })),

  withMethods((store) => ({
    setSearchTerm(term: string): void {
      patchState(store, { searchTerm: term });
    },
    addContact(contact: Omit<Contact, 'id'>): void {
      patchState(store, {
        contacts: [...store.contacts(), { ...contact, id: crypto.randomUUID() }],
      });
    },
    updateContact(id: string, updates: Partial<Contact>): void {
      patchState(store, {
        contacts: store.contacts().map((c) => (c.id === id ? { ...c, ...updates } : c)),
      });
    },
    removeContact(id: string): void {
      patchState(store, {
        contacts: store.contacts().filter((c) => c.id !== id),
      });
    },
    addTag(contactId: string, tag: string): void {
      patchState(store, {
        contacts: store.contacts().map((c) =>
          c.id === contactId && !c.tags.includes(tag)
            ? { ...c, tags: [...c.tags, tag] }
            : c
        ),
      });
    },
  })),

  withHooks({
    onInit(store) {
      console.log('[ContactStore] initialized with', store.contactCount(), 'contacts');
    },
  })
);
