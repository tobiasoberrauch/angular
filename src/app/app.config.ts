import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { mockApiInterceptor } from './core/interceptors/mock-api.interceptor';
import { environment } from '../environments/environment';

/**
 * ZONELESS CHANGE DETECTION (Angular 21 Default)
 *
 * Angular 21 is zoneless by default — Zone.js is NOT loaded.
 * Change detection is driven entirely by Signals.
 *
 * HOW IT WORKS:
 * - signal() / computed() mark components as dirty when values change
 * - Angular schedules a targeted re-render for only affected components
 * - No more Zone.js monkey-patching of setTimeout, Promise, addEventListener
 * - Result: smaller bundle (~45KB saved), faster async operations
 *
 * FOR MIGRATING EXISTING APPS (pre-Angular 21):
 * 1. First add Signals to all components (step-03)
 * 2. Then enable hybrid mode:
 *    providers: [
 *      provideZoneChangeDetection({ eventCoalescing: true }),
 *      // ↑ Keep Zone.js during migration
 *    ]
 * 3. Remove Zone.js once all components use Signals:
 *    // provideZoneChangeDetection() — removed, zoneless is default
 *
 * TESTING IMPLICATIONS:
 * - Use `await fixture.whenStable()` instead of `fixture.detectChanges()`
 * - Async operations complete via microtask queue, not Zone.js interception
 * - See app.spec.ts for the pattern
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // HTTP CLIENT with interceptor-based mock API
    // When environment.useJsonServer is false (default), the mockApiInterceptor
    // intercepts /api/* requests and returns in-memory data.
    // When useJsonServer is true, requests pass through to a real JSON Server.
    provideHttpClient(
      ...(!environment.useJsonServer ? [withInterceptors([mockApiInterceptor])] : [])
    ),

    // Zone.js is NOT loaded in Angular 21.
    // Uncomment below for hybrid migration from older versions:
    // provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
