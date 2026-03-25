# Research: Advanced Angular Workshop Enterprise Project

**Date**: 2026-03-25
**Branch**: `001-angular-workshop-project`

## Decision 1: Angular 21 Vitest Integration

**Decision**: Use `@angular/build:unit-test` builder with Vitest as default test runner.

**Rationale**: Vitest became the default test framework in Angular 21 (stable, replacing Karma). The `@angular/build:unit-test` builder integrates natively. Angular CLI provides `ng g @schematics/angular:refactor-jasmine-vitest` for automated Jasmine-to-Vitest syntax conversion.

**Alternatives considered**:
- Karma/Jasmine (legacy, officially replaced)
- Jest (community-supported but not Angular's official choice)
- Web Test Runner (considered by Angular team but Vitest won)

**Key details**:
- Builder options: `browsers` (jsdom/happy-dom/@vitest/browser-playwright), `coverage`, `setupFiles`, `providersFile`, `ui`, `runnerConfig`
- Migration: Update `angular.json` builder, convert spy patterns (`jasmine.createSpy` → `vi.fn`, `spyOn` → `vi.spyOn`), use automated schematic, remove Karma config/packages
- Zone.js helpers (`fakeAsync`, `waitForAsync`) are NOT supported in Vitest; use native async patterns and Vitest fake timers (`vi.useFakeTimers()`)

## Decision 2: Zoneless Change Detection

**Decision**: Use zoneless change detection as default (Angular 21 behavior), with explicit `provideZoneChangeDetection()` opt-in for migration demos.

**Rationale**: Angular 21 makes zoneless the default for new projects. Zone.js is no longer included. For migration demos, the project will explicitly add `provideZoneChangeDetection()` in legacy branches and show removal.

**Alternatives considered**:
- Zone.js as default with opt-in zoneless (outdated as of Angular 21)
- Hybrid only (doesn't demonstrate the new default)

**Key details**:
- `provideZonelessChangeDetection()` is no longer needed in new Angular 21 apps (it's implicit)
- To keep Zone.js, apps must explicitly add `provideZoneChangeDetection()`
- Change detection triggers: Signal updates in templates, `markForCheck()`, `async` pipe, `ChangeDetectorRef` calls
- Tests use `await fixture.whenStable()` instead of `fixture.detectChanges()`
- Angular CLI includes `onpush_zoneless_migration` MCP tool for guided migration

## Decision 3: Signal Forms API

**Decision**: Use `@angular/forms/signals` (experimental in Angular 21) for Signal Forms demonstrations, alongside traditional Reactive Forms for comparison.

**Rationale**: Signal Forms are experimental (`@experimental 21.0.0`) but represent Angular's future direction. The workshop provides hands-on exposure without recommending production adoption.

**Alternatives considered**:
- Skip Signal Forms entirely (misses key Angular 21 feature)
- Use only Signal Forms (too risky for production guidance)

**Key details**:
- Import from `@angular/forms/signals`
- Compatibility layer at `@angular/forms/signals/compat` for gradual migration
- Core API: `form(signal, schemaFn?)` creates form from signal, `FormField` directive for binding, `FieldState` for reactive signals (`value()`, `valid()`, `touched()`, `errors()`)
- Validation via schema function: `required()`, `email()`, `debounce()`
- Model is the source of truth; real TypeScript typing; single `[formField]` directive

## Decision 4: NgRx SignalStore

**Decision**: Use `@ngrx/signals` (NgRx v21) as the state management solution.

**Rationale**: NgRx SignalStore is the official Signal-native state management for Angular. Production-ready, aligned with Angular 21, and provides structured patterns for enterprise apps.

**Alternatives considered**:
- Custom signal services (too simple for enterprise patterns)
- NgRx Component Store (older, not Signal-native)
- RxAngular state (less mainstream)

**Key details**:
- Core API: `signalStore()`, `withState()`, `withComputed()`, `withMethods()`, `withHooks()`, `withProps()`
- Entity management: `withEntities()` from `@ngrx/signals/entities` with full CRUD updaters
- State updates via `patchState(store, partialState)`
- Reactive methods via `rxMethod(operator)` for Observable integration
- Reusable features via `signalStoreFeature()`
- NgRx v20+ additions: `withLinkedState`, Event API

## Decision 5: Angular Aria

**Decision**: Use `@angular/aria` package (Developer Preview) for headless accessible components.

**Rationale**: Angular Aria is a new package in Angular 21 providing headless, WAI-ARIA-compliant directives. It enables building accessible custom design systems without opinionated styling.

**Alternatives considered**:
- Angular CDK only (lower-level, more manual ARIA work)
- Angular Material (opinionated styling, not headless)
- Third-party a11y libraries (not Angular-native)

**Key details**:
- Separate package: `@angular/aria` (not part of CDK, though built on `@angular/cdk/a11y`)
- Provides directives (not components): Autocomplete, Listbox, Select, Multiselect, Combobox, Menu, Menubar, Toolbar, Accordion, Tabs, Tree, Grid
- Developer Preview status - API may change

## Decision 6: Angular 21 CLI & Project Defaults

**Decision**: Use Angular 21 CLI defaults for the workshop project.

**Rationale**: Demonstrates the latest project structure and conventions participants will encounter in new Angular 21 projects.

**Key details**:
- Standalone components implicit (no `standalone: true` needed)
- Vitest default test runner
- Zoneless change detection default
- 2025 file naming convention: `app.ts` instead of `app.component.ts` (opt-out with `--file-name-style-guide=2016`)
- Tailwind CSS available at project creation: `ng new --style tailwind`
- HttpClient provided by default in root injector (no `provideHttpClient()` needed)
- `ng mcp` command for AI-assisted development
- `SimpleChanges` now generic for type-safe `ngOnChanges`
- RegExp literals work in templates
- Router `scroll` option: `'manual'` or `'after-transition'`

## Decision 7: Project File Naming Convention

**Decision**: Use **2016 classic naming** (`*.component.ts`, `*.service.ts`) for the workshop project.

**Rationale**: Workshop participants will primarily work with existing codebases using classic naming. Teaching them modern Angular features is more effective when the file naming is familiar. The 2025 concise naming can be demonstrated as a separate topic.

**Alternatives considered**:
- 2025 concise naming (`app.ts`, `user.ts`) - too unfamiliar for participants maintaining existing projects
- Mixed naming (confusing)

## Decision 8: Workshop Branch Structure

**Decision**: 10 progressive Git branches mapping to workshop flow.

**Rationale**: Each branch builds on the previous, adding one concept. Trainer can diff between branches. Participants can reset to any step.

**Branch plan**:
1. `step-01-scaffold` - Angular 21 project scaffold with enterprise folder structure
2. `step-02-standalone-migration` - NgModule-based legacy module + standalone migration
3. `step-03-signals-reactivity` - signal(), computed(), effect() patterns throughout the app
4. `step-04-zoneless` - Remove Zone.js, migrate to zoneless change detection
5. `step-05-ngrx-signalstore` - NgRx SignalStore for state management across features
6. `step-06-mock-api` - Interceptor-based mock API + optional JSON Server
7. `step-07-vitest-migration` - Karma/Jasmine to Vitest migration
8. `step-08-signal-forms` - Signal Forms experimental API (comparison with Reactive Forms)
9. `step-09-angular-aria` - Accessibility with Angular Aria headless directives
10. `step-10-ci-cd` - CI/CD pipeline, final polish
