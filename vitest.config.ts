/**
 * VITEST CONFIGURATION (Angular 21)
 *
 * Angular 21 uses @angular/build:unit-test which wraps Vitest.
 * This file shows how to customize Vitest beyond Angular's defaults.
 *
 * THREE TEST ENVIRONMENTS:
 *
 * 1. jsdom (default) — Fast, browser-like DOM simulation
 *    Best for: Component rendering, template tests, most unit tests
 *    Limitation: No real browser APIs (WebGL, IntersectionObserver partial)
 *
 * 2. happy-dom — Even faster, lighter DOM simulation
 *    Best for: Pure logic tests, services, stores, pipes
 *    Limitation: Less browser API coverage than jsdom
 *
 * 3. @vitest/browser with Playwright — Real browser testing
 *    Best for: Visual regression, browser-specific behavior, E2E-lite
 *    Limitation: Slower, requires browser installation
 *
 * SWITCHING ENVIRONMENTS:
 * - Per-file: Add `// @vitest-environment happy-dom` at top of test file
 * - CLI: `npx vitest --environment happy-dom`
 * - Config: Change `environment` below
 *
 * VITEST vs JASMINE CHEAT SHEET:
 * ┌──────────────────────────┬──────────────────────────┐
 * │  Jasmine                  │  Vitest                  │
 * ├──────────────────────────┼──────────────────────────┤
 * │  jasmine.createSpy()     │  vi.fn()                 │
 * │  spyOn(obj, 'method')    │  vi.spyOn(obj, 'method') │
 * │  jasmine.any(Number)     │  expect.any(Number)      │
 * │  jasmine.objectContaining│  expect.objectContaining │
 * │  fakeAsync(() => { })    │  vi.useFakeTimers()      │
 * │  tick(1000)              │  vi.advanceTimersByTime() │
 * │  .and.returnValue(x)    │  .mockReturnValue(x)     │
 * │  .and.callFake(fn)      │  .mockImplementation(fn) │
 * │  .calls.count()         │  .mock.calls.length      │
 * │  .calls.argsFor(0)      │  .mock.calls[0]          │
 * └──────────────────────────┴──────────────────────────┘
 */

// Note: When using `ng test`, Angular's builder handles configuration.
// This file is for reference and advanced customization only.
// To use directly: `npx vitest --config vitest.config.ts`

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Default environment — jsdom for Angular component testing
    environment: 'jsdom',

    // Include Angular test files
    include: ['src/**/*.spec.ts'],

    // Global test utilities (no need to import describe/it/expect)
    globals: true,

    // Setup files for Angular TestBed
    // setupFiles: ['src/test-setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/app/**/*.ts'],
      exclude: [
        'src/app/**/*.spec.ts',
        'src/app/**/*.routes.ts',
        'src/main.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
