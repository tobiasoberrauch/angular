# Migration Checklist: Zone.js → Zoneless Change Detection

## Prerequisites
- [ ] Angular 18+ (zoneless available as developer preview)
- [ ] All components use Signals for state management
- [ ] No reliance on Zone.js-specific patterns (see checklist below)

## Step 1: Add Signals to All Components
- [ ] Replace class properties with `signal()`:
  ```typescript
  // Before: title = 'Hello';
  // After:  title = signal('Hello');
  ```
- [ ] Replace computed getters with `computed()`:
  ```typescript
  // Before: get fullName() { return this.first + ' ' + this.last; }
  // After:  fullName = computed(() => this.first() + ' ' + this.last());
  ```
- [ ] Replace imperative side effects with `effect()`:
  ```typescript
  // Before: ngOnChanges() { console.log(this.value); }
  // After:  constructor() { effect(() => console.log(this.value())); }
  ```

## Step 2: Identify Zone.js-Dependent Patterns
Check for these patterns that won't trigger change detection without Zone.js:

- [ ] `setTimeout()` / `setInterval()` — Wrap in signal updates
- [ ] `Promise.then()` — Use signal updates in callback
- [ ] Manual DOM manipulation — Replace with template bindings
- [ ] `ChangeDetectorRef.detectChanges()` — Remove (signals auto-detect)
- [ ] `NgZone.run()` — Remove (not needed)
- [ ] `@HostListener` without signal — Convert to signal-based

## Step 3: Enable Hybrid Mode (Optional)
```typescript
// app.config.ts — Keep Zone.js during migration
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Components can use both Zone.js and Signals during migration
  ],
};
```

## Step 4: Remove Zone.js
- [ ] Remove `provideZoneChangeDetection()` from `app.config.ts`
- [ ] Remove `zone.js` from `package.json` dependencies
- [ ] Remove `import 'zone.js'` from `polyfills.ts` (if exists)
- [ ] Delete `polyfills.ts` if empty
- [ ] Run `npm install` to clean node_modules

## Step 5: Update Tests
- [ ] Replace `fixture.detectChanges()` with `await fixture.whenStable()`
- [ ] Replace `fakeAsync/tick` with `vi.useFakeTimers()` (Vitest)
- [ ] Remove `NgZone` injections from tests
- [ ] Add `await` before assertions that depend on async state

### Test Pattern Migration
```typescript
// Before (Zone.js):
it('should update', () => {
  component.name = 'test';
  fixture.detectChanges();
  expect(el.textContent).toContain('test');
});

// After (Zoneless):
it('should update', async () => {
  component.name.set('test');
  await fixture.whenStable();
  expect(el.textContent).toContain('test');
});
```

## Step 6: Verify
- [ ] Run `ng serve` — all pages render correctly
- [ ] Run `ng test` — all tests pass
- [ ] Check async operations (HTTP, timers) still update UI
- [ ] Verify third-party libraries work without Zone.js
- [ ] Check bundle size reduction (~45KB less)

## Common Issues
| Issue | Solution |
|-------|----------|
| UI doesn't update after HTTP | Use `toSignal()` or update signals in subscribe |
| setTimeout doesn't trigger CD | Update a signal inside the callback |
| Third-party lib breaks | Check if lib depends on Zone.js patches |
| Form value changes not detected | Use Reactive Forms (auto-detects) or Signal Forms |

## Project Files Reference
- `src/app/app.config.ts` — Zoneless configuration with migration docs
- `src/app/app.spec.ts` — `await fixture.whenStable()` pattern
