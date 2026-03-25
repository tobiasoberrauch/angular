# Migration Checklist: Karma/Jasmine → Vitest

## Prerequisites
- [ ] Angular 21+ (Vitest is the default test runner)
- [ ] Backup existing test configuration
- [ ] Review `karma.conf.js` and `src/test.ts` for custom configuration

## Step 1: Install Vitest Dependencies
```bash
npm install --save-dev vitest jsdom
# Optional: npm install --save-dev happy-dom @vitest/browser-playwright
```

## Step 2: Update angular.json
- [ ] Replace test builder:
  ```json
  // Before:
  "test": {
    "builder": "@angular-devkit/build-angular:karma"
  }

  // After:
  "test": {
    "builder": "@angular/build:unit-test"
  }
  ```

## Step 3: Auto-Convert Spy Patterns
```bash
ng g @schematics/angular:refactor-jasmine-vitest
```

## Step 4: Manual Pattern Conversion

### Spy Patterns
| Jasmine | Vitest |
|---------|--------|
| `jasmine.createSpy('name')` | `vi.fn()` |
| `spyOn(obj, 'method')` | `vi.spyOn(obj, 'method')` |
| `spy.and.returnValue(x)` | `spy.mockReturnValue(x)` |
| `spy.and.callFake(fn)` | `spy.mockImplementation(fn)` |
| `spy.and.callThrough()` | Remove (default behavior) |
| `spy.calls.count()` | `spy.mock.calls.length` |
| `spy.calls.argsFor(0)` | `spy.mock.calls[0]` |
| `spy.calls.reset()` | `spy.mockClear()` |

### Matcher Patterns
| Jasmine | Vitest |
|---------|--------|
| `jasmine.any(Number)` | `expect.any(Number)` |
| `jasmine.objectContaining({})` | `expect.objectContaining({})` |
| `jasmine.arrayContaining([])` | `expect.arrayContaining([])` |
| `jasmine.stringMatching(/re/)` | `expect.stringMatching(/re/)` |

### Async Patterns
| Jasmine | Vitest |
|---------|--------|
| `fakeAsync(() => { tick(1000) })` | `vi.useFakeTimers(); vi.advanceTimersByTime(1000)` |
| `waitForAsync(() => {})` | `async () => { await ... }` |
| `fixture.detectChanges()` | `await fixture.whenStable()` (zoneless) |

## Step 5: Remove Karma
- [ ] Delete `karma.conf.js`
- [ ] Delete `src/test.ts`
- [ ] Uninstall packages:
  ```bash
  npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
  ```

## Step 6: Create Vitest Config (Optional)
- [ ] Create `vitest.config.ts` for advanced configuration
- [ ] Configure coverage thresholds
- [ ] Set up test environment (jsdom/happy-dom/browser)

## Step 7: Verify
- [ ] Run `ng test` — all tests pass
- [ ] Run `ng test --coverage` — check coverage meets threshold
- [ ] Verify CI pipeline works with new test runner

## Test Environment Comparison
| Feature | jsdom | happy-dom | Playwright |
|---------|-------|-----------|------------|
| Speed | Fast | Fastest | Slow |
| Browser APIs | Good | Basic | Full |
| Best for | Components | Services/Pipes | Visual/E2E |
| Bundle size | Medium | Small | Large |

## Project Files Reference
- `vitest.config.ts` — Vitest configuration with environment docs
- `src/app/app.spec.ts` — Example of Vitest component test
- `src/app/features/ecommerce/data-access/product.store.spec.ts` — Store testing
- `src/app/core/interceptors/mock-api.interceptor.spec.ts` — Interceptor testing
