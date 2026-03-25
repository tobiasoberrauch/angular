import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { mockApiInterceptor } from './mock-api.interceptor';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

/**
 * INTERCEPTOR TESTING WITH VITEST
 *
 * Key patterns:
 * - Provide real HttpClient with the interceptor registered
 * - Use firstValueFrom() to convert Observable to Promise for async/await
 * - The interceptor returns HttpResponse objects, so we test the full pipeline
 *
 * Vitest async pattern:
 *   const result = await firstValueFrom(http.get('/api/products'));
 *   expect(result).toBeDefined();
 *
 * vs Jasmine async pattern (legacy):
 *   fakeAsync(() => {
 *     let result: any;
 *     http.get('/api/products').subscribe(r => result = r);
 *     tick();
 *     expect(result).toBeDefined();
 *   })
 */
describe('MockApiInterceptor', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
      ],
    });
    http = TestBed.inject(HttpClient);
  });

  it('should return products list', async () => {
    const result = await firstValueFrom(
      http.get<{ data: unknown[]; total: number }>('/api/products')
    );

    expect(result.data).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBe(result.data.length);
  });

  it('should return tasks list', async () => {
    const result = await firstValueFrom(
      http.get<{ data: unknown[]; total: number }>('/api/tasks')
    );

    expect(result.data).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should return employees list', async () => {
    const result = await firstValueFrom(
      http.get<{ data: unknown[]; total: number }>('/api/employees')
    );

    expect(result.data).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should return contacts list', async () => {
    const result = await firstValueFrom(
      http.get<{ data: unknown[]; total: number }>('/api/contacts')
    );

    expect(result.data).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should return deals list', async () => {
    const result = await firstValueFrom(
      http.get<{ data: unknown[]; total: number }>('/api/deals')
    );

    expect(result.data).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
  });
});
