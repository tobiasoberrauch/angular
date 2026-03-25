import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Contact } from './contact.store';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/contacts';

  getAll(): Observable<Contact[]> {
    return this.http.get<{ data: Contact[]; total: number }>(this.baseUrl).pipe(
      map(res => res.data)
    );
  }

  getById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${id}`);
  }

  create(contact: Omit<Contact, 'id'>): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact);
  }

  update(id: string, changes: Partial<Contact>): Observable<Contact> {
    return this.http.patch<Contact>(`${this.baseUrl}/${id}`, changes);
  }
}
