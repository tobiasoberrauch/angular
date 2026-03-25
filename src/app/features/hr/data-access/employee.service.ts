import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Employee } from './employee.store';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/employees';

  getAll(): Observable<Employee[]> {
    return this.http.get<{ data: Employee[]; total: number }>(this.baseUrl).pipe(
      map(res => res.data)
    );
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  create(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee);
  }

  update(id: string, changes: Partial<Employee>): Observable<Employee> {
    return this.http.patch<Employee>(`${this.baseUrl}/${id}`, changes);
  }
}
