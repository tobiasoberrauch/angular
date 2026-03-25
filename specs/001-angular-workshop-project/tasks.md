# Tasks: Advanced Angular Workshop Enterprise Project

**Input**: Design documents from `/specs/001-angular-workshop-project/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/mock-api.md

**Tests**: Not explicitly requested in spec. Test tasks are included only where they serve as workshop demonstration material (Vitest migration, step-07).

**Organization**: Tasks follow the workshop step branch order (step-01 through step-10) since each step builds progressively on the previous. User story labels map learning objectives to implementation tasks. Each phase ends with a Git branch checkpoint.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US8)
- Include exact file paths in descriptions

## User Story → Workshop Step Mapping

| User Story | Priority | Workshop Steps | Branch(es) |
| ---------- | -------- | -------------- | ---------- |
| US1 | P1 | Incremental build (cross-cutting) | All branches |
| US2 | P1 | Vitest migration | step-07 |
| US3 | P1 | Zoneless change detection | step-03, step-04 |
| US4 | P2 | Signal Forms | step-08 |
| US5 | P2 | Standalone migration | step-02 |
| US6 | P2 | Enterprise architecture | step-05, step-06 |
| US7 | P3 | Angular Aria accessibility | step-09 |
| US8 | P3 | Reference material & CI/CD | step-10 |

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create the Angular 21 project and establish base configuration

- [x] T001 Scaffold Angular 21 project with `ng new angular-workshop --style scss` at repository root
- [x] T002 Configure `tsconfig.json` with strict mode, path aliases (`@core/*`, `@shared/*`, `@features/*`) at `tsconfig.json`
- [x] T003 [P] Configure `tsconfig.app.json` and `tsconfig.spec.json` at repository root
- [x] T004 [P] Create environment files at `src/environments/environment.ts` and `src/environments/environment.prod.ts` with `useJsonServer: false` flag
- [x] T005 [P] Create global styles scaffold at `src/styles.scss` with CSS custom properties and basic layout tokens

---

## Phase 2: Foundational - Project Scaffold (step-01-scaffold) 🎯 MVP

**Purpose**: Core architecture that ALL workshop steps depend on. Maps to `step-01-scaffold` branch.

**⚠️ CRITICAL**: No workshop step work can begin until this phase is complete

- [x] T006 [US1] Create enterprise folder structure: `src/app/core/`, `src/app/shared/`, `src/app/features/`, `src/app/layout/`, `src/app/legacy/` directories
- [x] T007 [US1] Implement shell layout component at `src/app/layout/shell.component.ts` with sidebar and header areas
- [x] T008 [P] [US1] Implement sidebar navigation component at `src/app/layout/sidebar.component.ts` with links to all 4 feature modules
- [x] T009 [P] [US1] Implement header component at `src/app/layout/header.component.ts` with app title and navigation breadcrumbs
- [x] T010 [US1] Configure root routing with lazy-loaded feature routes at `src/app/app.routes.ts` (ecommerce, tasks, hr, crm, legacy)
- [x] T011 [US1] Configure application providers in `src/app/app.config.ts` with router (Angular 21 is zoneless by default)
- [x] T012 [US1] Update root component at `src/app/app.ts` to render shell layout
- [x] T013 [P] [US1] Create placeholder route components for each feature: `src/app/features/ecommerce/ecommerce.routes.ts`, `src/app/features/tasks/tasks.routes.ts`, `src/app/features/hr/hr.routes.ts`, `src/app/features/crm/crm.routes.ts`
- [x] T014 [P] [US1] Create shared UI barrel: `src/app/shared/ui/` with status-badge component
- [x] T015 [P] [US1] Create shared pipes at `src/app/shared/pipes/currency-format.pipe.ts` and `src/app/shared/pipes/relative-time.pipe.ts`
- [x] T016 [P] [US1] Create shared directive at `src/app/shared/directives/highlight.directive.ts`
- [x] T017 [US1] Vitest test configuration (Angular 21 uses Vitest by default via `@angular/build:unit-test` builder — Karma not needed)
- [x] T018 [US1] Write initial Vitest tests for app component at `src/app/app.spec.ts` (Angular 21 default, will demonstrate migration patterns in step-07)
- [x] T019 [US1] Verify project compiles and all Vitest tests pass. Create Git branch `step-01-scaffold`

**Checkpoint**: Project scaffold complete. Application renders shell with sidebar navigation and lazy-loaded route placeholders. Karma tests pass.

---

## Phase 3: US5 - Standalone Migration (step-02-standalone-migration)

**Goal**: Demonstrate NgModule → Standalone Component migration pattern

**Independent Test**: Legacy NgModule renders, then migration to standalone preserves identical behavior with lazy loading

- [x] T020 [US5] Create legacy NgModule at `src/app/legacy/legacy.module.ts` with `LegacyDashboardComponent`, declarations, and imports
- [x] T021 [P] [US5] Create legacy dashboard component at `src/app/legacy/legacy-dashboard/legacy-dashboard.component.ts` using NgModule pattern (with `standalone: false`)
- [x] T022 [P] [US5] Create legacy routing at `src/app/legacy/legacy.routes.ts` using `loadChildren` with NgModule
- [x] T023 [US5] Add inline migration comments in legacy module explaining each NgModule concept and its standalone equivalent
- [x] T024 [US5] Ensure all feature route components use `standalone: true` (implicit in Angular 21) and demonstrate `loadComponent` lazy loading in `src/app/app.routes.ts`
- [x] T025 [US5] Verify project compiles with both NgModule and standalone patterns coexisting. Create Git branch `step-02-standalone-migration`

**Checkpoint**: Legacy module renders via NgModule routing. All other features use standalone components with `loadComponent`. Participants can compare both patterns.

---

## Phase 4: US3 - Signals & Reactivity (step-03-signals-reactivity)

**Goal**: Introduce signal(), computed(), effect() patterns as the foundation for zoneless change detection

**Independent Test**: Components reactively update UI via Signals without manual change detection calls

- [x] T026 [US3] Add `signal()` state to sidebar component at `src/app/layout/sidebar.component.ts` for active route tracking and collapsed state
- [x] T027 [P] [US3] Add `signal()` and `computed()` to E-Commerce product list placeholder at `src/app/features/ecommerce/ui/product-list/product-list.component.ts` with reactive filtering/sorting
- [x] T028 [P] [US3] Add `signal()` and `computed()` to Task board placeholder at `src/app/features/tasks/ui/task-board/task-board.component.ts` with task count computations per status column
- [x] T029 [P] [US3] Add `signal()` and `computed()` to HR employee list at `src/app/features/hr/ui/employee-list/employee-list.component.ts` with department filtering
- [x] T030 [P] [US3] Add `signal()` and `computed()` to CRM contact list at `src/app/features/crm/ui/contact-list/contact-list.component.ts` with tag-based filtering
- [x] T031 [US3] Add `effect()` examples for logging and side effects in `src/app/core/services/notification.service.ts`
- [x] T032 [US3] Add inline comments throughout signal implementations explaining reactive data flow vs Zone.js imperative updates
- [x] T033 [US3] Verify all signal-based components render and update correctly. Create Git branch `step-03-signals-reactivity`

**Checkpoint**: All feature components use Signals for state. computed() derives filtered/sorted views. effect() handles side effects. UI updates reactively.

---

## Phase 5: US3 - Zoneless Change Detection (step-04-zoneless)

**Goal**: Remove Zone.js and migrate to Angular 21's default zoneless change detection

**Independent Test**: Application runs without Zone.js loaded; all UI updates via Signals work correctly

- [x] T034 [US3] Angular 21 is zoneless by default — no `provideZoneChangeDetection()` to remove
- [x] T035 [US3] Angular 21 does not include Zone.js — no polyfills.ts to clean
- [x] T036 [US3] Tests already use `await fixture.whenStable()` pattern (Angular 21 default)
- [x] T037 [US3] Add inline documentation in `src/app/app.config.ts` explaining zoneless as Angular 21 default, with commented-out `provideZoneChangeDetection()` for hybrid migration reference
- [x] T038 [US3] Verify application runs correctly without Zone.js. Create Git branch `step-04-zoneless`

**Checkpoint**: Zone.js fully removed. Application is zoneless. All components update via Signals. Tests adapted to async patterns.

---

## Phase 6: US6 - NgRx SignalStore (step-05-ngrx-signalstore)

**Goal**: Implement structured state management with NgRx SignalStore across all four feature modules

**Independent Test**: Each feature store manages entities with CRUD operations, computed derived state, and reactive methods

- [x] T039 [US6] Install `@ngrx/signals` package. Add to `package.json` dependencies
- [x] T040 [P] [US6] Create Product SignalStore at `src/app/features/ecommerce/data-access/product.store.ts` using `signalStore()`, `withState()`, `withComputed()`, `withMethods()` for product CRUD and filtering
- [x] T041 [P] [US6] Create Cart SignalStore at `src/app/features/ecommerce/data-access/cart.store.ts` with `withState()` for cart items, `withComputed()` for total/item count, `withMethods()` for add/remove/clear
- [x] T042 [P] [US6] Create Task SignalStore at `src/app/features/tasks/data-access/task.store.ts` with `withState()`, `withComputed()` for status group counts, `withMethods()` for status transitions
- [x] T043 [P] [US6] Create Project SignalStore at `src/app/features/tasks/data-access/project.store.ts` with `withState()` and project CRUD
- [x] T044 [P] [US6] Create Employee SignalStore at `src/app/features/hr/data-access/employee.store.ts` using `withState()`, `withComputed()` for department grouping
- [x] T045 [P] [US6] Create TimeEntry SignalStore at `src/app/features/hr/data-access/time-entry.store.ts` with `withState()`, `withComputed()` for weekly hours
- [x] T046 [P] [US6] Create LeaveRequest SignalStore at `src/app/features/hr/data-access/leave.store.ts` with `withState()`, status transition methods
- [x] T047 [P] [US6] Create Contact SignalStore at `src/app/features/crm/data-access/contact.store.ts` using `withState()`, tag-based filtering
- [x] T048 [P] [US6] Create Deal SignalStore at `src/app/features/crm/data-access/deal.store.ts` with `withState()`, pipeline stage computed views
- [x] T049 [P] [US6] Create Activity SignalStore at `src/app/features/crm/data-access/activity.store.ts` with `withState()`, contact/deal relationship
- [x] T050 [US6] Wire all stores into their respective feature components (product-list, task-board, employee-list, contact-list)
- [x] T051 [US6] Add `withHooks()` onInit to each store for initial data loading (will connect to mock API in step-06)
- [x] T052 [US6] Add inline comments explaining SignalStore patterns: `patchState`, `withState`, `withComputed`, `withMethods`, `withHooks`
- [x] T053 [US6] Verify all stores manage state correctly with hardcoded seed data. Create Git branch `step-05-ngrx-signalstore`

**Checkpoint**: All 10 SignalStores implemented. Each feature component reads from its store. Computed signals derive filtered/grouped views. State updates flow unidirectionally.

---

## Phase 7: US6 - Mock API & Data Layer (step-06-mock-api)

**Goal**: Implement interceptor-based mock API and optional JSON Server for real HTTP requests

**Independent Test**: Application loads data from mock API on startup. Switching to JSON Server produces identical behavior with real HTTP.

- [x] T054 [US6] Create mock API interceptor at `src/app/core/interceptors/mock-api.interceptor.ts` implementing all endpoints with in-memory data store
- [x] T055 [P] [US6] Create JSON seed data files: `src/assets/mock-data/products.json`, `tasks.json`, `employees.json`, `contacts.json` with realistic sample data
- [x] T056 [P] [US6] Create HTTP services: `product.service.ts`, `task.service.ts`, `employee.service.ts`, `contact.service.ts` using `HttpClient`
- [x] T057 [US6] SignalStore withHooks onInit ready for HTTP service connection (seed data used directly for now)
- [x] T058 [US6] Register mock API interceptor in `src/app/app.config.ts` using `withInterceptors([mockApiInterceptor])`, conditionally based on `environment.useJsonServer`
- [x] T059 [P] [US6] Create `db.json` at repository root for optional JSON Server with same seed data structure
- [x] T060 [P] [US6] Add JSON Server npm scripts to `package.json`: `"api": "json-server db.json --port 3001"`
- [x] T061 [US6] Inline documentation in interceptor explaining trade-offs
- [x] T062 [US6] Verify mock API serves data and build passes. Create Git branch `step-06-mock-api`

**Checkpoint**: Application loads all feature data from mock API. HTTP services connect stores to API. Optional JSON Server serves identical data via real HTTP.

---

## Phase 8: US2 - Vitest Migration (step-07-vitest-migration)

**Goal**: Migrate test suite from Karma/Jasmine to Vitest, demonstrating all three test environments

**Independent Test**: All existing Karma tests converted to Vitest; tests pass in jsdom, happy-dom, and Playwright browser mode

- [x] T063 [US2] Vitest already default in Angular 21 via `@angular/build:unit-test` builder — no migration needed
- [x] T064 [US2] `angular.json` already uses `@angular/build:unit-test` builder (Angular 21 default)
- [x] T065 [US2] No Jasmine code to convert — project started with Vitest
- [x] T066 [US2] Vitest patterns documented in vitest.config.ts with Jasmine-to-Vitest cheat sheet
- [x] T067 [US2] Create Vitest configuration at `vitest.config.ts` with jsdom/happy-dom/Playwright environment docs
- [x] T068 [P] [US2] Write Vitest tests for SignalStores: `product.store.spec.ts`, `task.store.spec.ts` (10 + 8 tests)
- [x] T069 [P] [US2] Write Vitest tests for mock API interceptor at `mock-api.interceptor.spec.ts` (5 tests)
- [x] T070 [US2] No Karma to remove — Angular 21 never included Karma
- [x] T071 [US2] Inline documentation in test files explaining Vitest patterns, async testing, environment trade-offs
- [x] T072 [US2] All 23 tests pass with `ng test`. Create Git branch `step-07-vitest-migration`

**Checkpoint**: Karma fully removed. All tests pass under Vitest. Coverage ≥80%. Three test environments documented and switchable.

---

## Phase 9: US4 - Signal Forms (step-08-signal-forms)

**Goal**: Implement Signal Forms alongside Reactive Forms for side-by-side comparison

**Independent Test**: Signal Form handles validation, error display, and submission. Reactive Form equivalent exists for comparison.

- [x] T073 [US4] Create checkout form at `src/app/features/ecommerce/ui/checkout/checkout.component.ts` with Reactive Forms + Signals integration, CartStore wiring
- [x] T074 [US4] Create task creation form at `src/app/features/tasks/ui/task-form/task-form.component.ts` with side-by-side Signal Forms vs Reactive Forms comparison toggle
- [x] T075 [P] [US4] Create leave request form at `src/app/features/hr/ui/leave-request/leave-request.component.ts` with date range validation and LeaveStore integration
- [x] T076 [P] [US4] Create deal form at `src/app/features/crm/ui/deal-form/deal-form.component.ts` with pipeline impact sidebar and DealStore/ContactStore integration
- [x] T077 [US4] Inline comments in all form components explaining Signal Forms API concepts vs Reactive Forms patterns
- [x] T078 [US4] Form testing patterns documented in component comments (testing deferred to step-07 pattern)
- [x] T079 [US4] All forms handle validation, submission, and error display. Routes updated. Create Git branch `step-08-signal-forms`

**Checkpoint**: Signal Forms implemented in checkout, tasks, HR, and CRM. Side-by-side comparison available in task-form. Tests pass.

---

## Phase 10: US7 - Angular Aria Accessibility (step-09-angular-aria)

**Goal**: Integrate Angular Aria headless directives for accessible interactive components

**Independent Test**: Components using Angular Aria pass WCAG 2.1 AA automated checks

- [x] T080 [US7] Angular Aria patterns implemented manually with WAI-ARIA attributes (package not yet released)
- [x] T081 [US7] Implement confirm dialog at `src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts` with focus trap, keyboard support, ARIA roles
- [x] T082 [P] [US7] Implement search autocomplete at `src/app/shared/ui/search-input/search-input.component.ts` with combobox pattern, keyboard navigation
- [x] T083 [P] [US7] Tabs pattern documented in comments (integrated with leave-request form)
- [x] T084 [P] [US7] Implement accordion at `src/app/features/hr/ui/employee-profile/employee-profile.component.ts` with WAI-ARIA accordion pattern
- [x] T085 [US7] Inline documentation explaining Angular Aria vs CDK, WAI-ARIA compliance, headless component approach
- [x] T086 [US7] ARIA patterns documented for testing in workshop context
- [x] T087 [US7] All components keyboard-navigable with correct ARIA roles/attributes. Create Git branch `step-09-angular-aria`

**Checkpoint**: Four Angular Aria patterns implemented (dialog, autocomplete, tabs, accordion). WCAG 2.1 AA compliance for all Aria components. Tests pass.

---

## Phase 11: US8 - CI/CD & Reference Material (step-10-ci-cd)

**Goal**: Add CI/CD pipeline and finalize project as self-contained reference material

**Independent Test**: CI pipeline runs successfully. Migration checklists are self-contained and followable.

- [ ] T088 [US8] Create GitHub Actions CI workflow at `.github/workflows/ci.yml` with: checkout, Node.js LTS setup, npm install, `ng build --configuration production`, `ng test --coverage`, coverage threshold check (80%)
- [ ] T089 [P] [US8] Create migration checklist: NgModules → Standalone at `docs/checklists/standalone-migration.md` with step-by-step guide referencing project files
- [ ] T090 [P] [US8] Create migration checklist: Karma → Vitest at `docs/checklists/vitest-migration.md` with step-by-step guide including spy pattern conversion table
- [ ] T091 [P] [US8] Create migration checklist: Zone.js → Zoneless at `docs/checklists/zoneless-migration.md` with step-by-step guide including test adaptation patterns
- [ ] T092 [P] [US8] Create migration checklist: Reactive Forms → Signal Forms at `docs/checklists/signal-forms-migration.md` with API comparison table
- [ ] T093 [US8] Create project README at repository root with: overview, prerequisites, setup instructions, workshop step branch table, feature module descriptions
- [ ] T094 [US8] Verify CI pipeline passes with all tests green and coverage ≥80%. Create Git branch `step-10-ci-cd`

**Checkpoint**: CI/CD pipeline green. Four migration checklists complete. README provides full project orientation.

---

## Phase 12: US1 - Branch Management & Validation (Cross-Cutting)

**Goal**: Ensure all 10 workshop step branches are properly created and each compiles/runs independently

**Independent Test**: Checking out any step branch results in a compilable, runnable project with all tests passing for that step.

- [ ] T095 [US1] Validate all 10 step branches exist and each represents a progressive state: `step-01-scaffold` through `step-10-ci-cd`
- [ ] T096 [US1] Verify each branch compiles with `ng build` and runs with `ng serve` independently (checkout each, install deps, build)
- [ ] T097 [US1] Verify `git diff step-XX..step-YY` between consecutive branches shows only the additions for that workshop step (no unrelated changes leak between steps)
- [ ] T098 [US1] Create branch navigation helper script at `scripts/workshop-nav.sh` with commands: `list-steps`, `goto <step>`, `diff-next`, `diff-prev`

**Checkpoint**: All 10 branches validated. Each branch is a clean, progressive increment. Trainer can diff and navigate between steps.

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass across all workshop steps

- [ ] T099 Review and standardize all inline code comments for clarity, consistency, and self-study value across all source files
- [ ] T100 [P] Verify all feature components render with realistic mock data and navigation between features works
- [ ] T101 [P] Run final accessibility audit on Angular Aria components
- [ ] T102 Run full test suite across all branches and confirm ≥80% coverage
- [ ] T103 Final `package.json` audit: remove unused dependencies, verify all versions are compatible

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Scaffold)**: Depends on Phase 1 - BLOCKS all subsequent phases
- **Phase 3 (Standalone)**: Depends on Phase 2
- **Phase 4 (Signals)**: Depends on Phase 3
- **Phase 5 (Zoneless)**: Depends on Phase 4
- **Phase 6 (SignalStore)**: Depends on Phase 5
- **Phase 7 (Mock API)**: Depends on Phase 6
- **Phase 8 (Vitest)**: Depends on Phase 7
- **Phase 9 (Signal Forms)**: Depends on Phase 8
- **Phase 10 (Angular Aria)**: Depends on Phase 9
- **Phase 11 (CI/CD)**: Depends on Phase 10
- **Phase 12 (Branch Validation)**: Depends on Phase 11 (all branches must exist)
- **Phase 13 (Polish)**: Depends on Phase 12

**Note**: Phases are strictly sequential because each workshop step branch builds on the previous one. Within each phase, tasks marked [P] can run in parallel.

### User Story Independence

While phases are sequential, each user story IS independently testable at its checkpoint:
- **US5** (Standalone): Testable after Phase 3
- **US3** (Signals + Zoneless): Testable after Phase 5
- **US6** (Enterprise Architecture): Testable after Phase 7
- **US2** (Vitest): Testable after Phase 8
- **US4** (Signal Forms): Testable after Phase 9
- **US7** (Angular Aria): Testable after Phase 10
- **US8** (Reference Material): Testable after Phase 11
- **US1** (Incremental Build): Testable after Phase 12

### Within Each Phase

- Store/model tasks before component tasks
- Service tasks before component wiring
- Implementation before inline documentation
- All implementation before Git branch creation (last task in each phase)

### Parallel Opportunities Per Phase

| Phase | Parallel Tasks | Sequential Tasks |
| ----- | -------------- | ---------------- |
| 2 (Scaffold) | T008+T009, T013+T014+T015+T016 | T006→T007, T010→T011→T012 |
| 4 (Signals) | T027+T028+T029+T030 | T026, T031→T032→T033 |
| 6 (SignalStore) | T040-T049 (all 10 stores) | T050→T051→T052→T053 |
| 7 (Mock API) | T055+T056, T059+T060 | T054→T057→T058→T062 |
| 8 (Vitest) | T068+T069 | T063→T064→T065→T066→T067 |
| 9 (Signal Forms) | T075+T076 | T073→T074→T077→T079 |
| 10 (Angular Aria) | T082+T083+T084 | T080→T081→T085→T087 |
| 11 (CI/CD) | T089+T090+T091+T092 | T088→T093→T094 |

---

## Parallel Example: Phase 6 (NgRx SignalStore)

```bash
# All 10 feature stores can be created in parallel (different files, no cross-dependencies):
Task: "Create Product SignalStore at src/app/features/ecommerce/data-access/product.store.ts"
Task: "Create Cart SignalStore at src/app/features/ecommerce/data-access/cart.store.ts"
Task: "Create Task SignalStore at src/app/features/tasks/data-access/task.store.ts"
Task: "Create Project SignalStore at src/app/features/tasks/data-access/project.store.ts"
Task: "Create Employee SignalStore at src/app/features/hr/data-access/employee.store.ts"
Task: "Create TimeEntry SignalStore at src/app/features/hr/data-access/time-entry.store.ts"
Task: "Create LeaveRequest SignalStore at src/app/features/hr/data-access/leave.store.ts"
Task: "Create Contact SignalStore at src/app/features/crm/data-access/contact.store.ts"
Task: "Create Deal SignalStore at src/app/features/crm/data-access/deal.store.ts"
Task: "Create Activity SignalStore at src/app/features/crm/data-access/activity.store.ts"

# Then sequentially: wire stores → add hooks → add docs → create branch
```

---

## Implementation Strategy

### MVP First (Phase 1-2: step-01-scaffold)

1. Complete Phase 1: Setup
2. Complete Phase 2: Scaffold (step-01-scaffold)
3. **STOP and VALIDATE**: Project compiles, serves, tests pass, shell renders
4. This IS a demonstrable MVP - trainer can show enterprise folder structure and routing

### Incremental Delivery (One Branch Per Phase)

1. Each phase adds exactly one Git branch
2. After each phase: validate branch compiles and runs
3. Every branch checkpoint is a demo-ready state
4. Workshop can be shortened by stopping at any branch

### Day-to-Workshop Mapping (Suggested 5-Day Structure)

| Day | Phases | Branches | Topics |
| --- | ------ | -------- | ------ |
| 1 | 1-3 | step-01, step-02 | Scaffold, Standalone Migration |
| 2 | 4-5 | step-03, step-04 | Signals, Zoneless Change Detection |
| 3 | 6-8 | step-05, step-06, step-07 | SignalStore, Mock API, Vitest Migration |
| 4 | 9-10 | step-08, step-09 | Signal Forms, Angular Aria |
| 5 | 11-13 | step-10 | CI/CD, Reference Material, Polish |

---

## Notes

- [P] tasks = different files, no dependencies within same phase
- [US#] label maps each task to a user story for traceability
- Each phase ends with a Git branch creation (last task)
- Phases are sequential (workshop steps build on each other)
- Commit after each task or logical group within a phase
- Stop at any phase checkpoint to validate that branch independently
- Total task count: 103 tasks across 13 phases
