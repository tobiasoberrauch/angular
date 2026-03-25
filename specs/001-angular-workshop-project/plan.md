# Implementation Plan: Advanced Angular Workshop Enterprise Project

**Branch**: `001-angular-workshop-project` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-angular-workshop-project/spec.md`

## Summary

Build a multi-domain enterprise Angular 21 application structured as a progressive workshop project. The project covers 10 workshop steps organized as Git branches, each introducing one major Angular concept: enterprise architecture, standalone migration, Signals reactivity, zoneless change detection, NgRx SignalStore, mock API patterns, Vitest testing, Signal Forms, Angular Aria accessibility, and CI/CD. Four feature modules (E-Commerce, Task Management, HR Portal, CRM) provide realistic domain contexts.

## Technical Context

**Language/Version**: TypeScript 5.7+, Angular 21
**Primary Dependencies**: Angular 21, @ngrx/signals (v21), @angular/aria, @angular/forms/signals, Vitest, @vitest/browser-playwright, json-server (optional)
**Storage**: In-memory mock API via HttpInterceptors (default), JSON Server (optional)
**Testing**: Vitest via `@angular/build:unit-test` builder (primary), Karma/Jasmine (legacy, for migration demo)
**Target Platform**: Web (modern browsers), Node.js LTS (v22+)
**Project Type**: Web application (Angular SPA)
**Performance Goals**: <2min setup, <3min CI build, 80%+ test coverage
**Constraints**: Must work offline (no external backend required), corporate network compatible
**Scale/Scope**: 4 feature modules, 10 workshop step branches, ~50 components

## Constitution Check

*No constitution file found (`.specify/memory/constitution.md` does not exist). No gates to evaluate.*

## Project Structure

### Documentation (this feature)

```text
specs/001-angular-workshop-project/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Angular 21 research findings
├── data-model.md        # Phase 1: Entity definitions for all 4 domains
├── quickstart.md        # Phase 1: Setup and navigation guide
├── contracts/
│   └── mock-api.md      # Phase 1: REST API contract for mock/JSON Server
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── app.component.ts               # Root component
│   ├── app.component.spec.ts           # Root component test
│   ├── app.config.ts                   # Application config (providers, zoneless, router)
│   ├── app.routes.ts                   # Root routes with lazy loading
│   │
│   ├── core/                           # Singleton services, guards, interceptors
│   │   ├── interceptors/
│   │   │   └── mock-api.interceptor.ts # In-memory mock API (default data layer)
│   │   ├── guards/
│   │   │   └── auth.guard.ts           # Route guard example
│   │   └── services/
│   │       └── notification.service.ts # Cross-cutting service example
│   │
│   ├── shared/                         # Reusable components, pipes, directives
│   │   ├── ui/
│   │   │   ├── data-table/             # Generic data table component
│   │   │   ├── confirm-dialog/         # Angular Aria dialog
│   │   │   ├── status-badge/           # Status display component
│   │   │   └── search-input/           # Search with Angular Aria autocomplete
│   │   ├── pipes/
│   │   │   ├── currency-format.pipe.ts
│   │   │   └── relative-time.pipe.ts
│   │   └── directives/
│   │       └── highlight.directive.ts
│   │
│   ├── features/
│   │   ├── ecommerce/                  # E-Commerce feature module
│   │   │   ├── data-access/
│   │   │   │   ├── product.store.ts    # NgRx SignalStore (withEntities)
│   │   │   │   ├── cart.store.ts       # Cart SignalStore
│   │   │   │   └── product.service.ts  # HTTP service
│   │   │   ├── ui/
│   │   │   │   ├── product-list/       # Product catalog
│   │   │   │   ├── product-detail/     # Product detail view
│   │   │   │   ├── cart/               # Shopping cart
│   │   │   │   └── checkout/           # Checkout (Signal Forms demo)
│   │   │   └── ecommerce.routes.ts     # Lazy-loaded routes
│   │   │
│   │   ├── tasks/                      # Task/Project Management feature
│   │   │   ├── data-access/
│   │   │   │   ├── task.store.ts       # NgRx SignalStore
│   │   │   │   ├── project.store.ts
│   │   │   │   └── task.service.ts
│   │   │   ├── ui/
│   │   │   │   ├── task-board/         # Kanban board view
│   │   │   │   ├── task-detail/        # Task detail/edit
│   │   │   │   ├── task-form/          # Task creation (Reactive Forms + Signal Forms comparison)
│   │   │   │   └── project-list/       # Project overview
│   │   │   └── tasks.routes.ts
│   │   │
│   │   ├── hr/                         # HR/Employee Portal feature
│   │   │   ├── data-access/
│   │   │   │   ├── employee.store.ts   # NgRx SignalStore
│   │   │   │   ├── time-entry.store.ts
│   │   │   │   └── leave.store.ts
│   │   │   ├── ui/
│   │   │   │   ├── employee-list/      # Employee directory
│   │   │   │   ├── employee-profile/   # Profile detail
│   │   │   │   ├── time-tracking/      # Time entry form & list
│   │   │   │   ├── leave-request/      # Leave request (Angular Aria tabs/accordion)
│   │   │   │   └── leave-calendar/     # Calendar view
│   │   │   └── hr.routes.ts
│   │   │
│   │   └── crm/                        # CRM feature
│   │       ├── data-access/
│   │       │   ├── contact.store.ts    # NgRx SignalStore (withEntities)
│   │       │   ├── deal.store.ts
│   │       │   └── activity.store.ts
│   │       ├── ui/
│   │       │   ├── contact-list/       # Contact directory with search
│   │       │   ├── contact-detail/     # Contact profile + activities
│   │       │   ├── deal-pipeline/      # Pipeline/Kanban view
│   │       │   ├── deal-form/          # Deal creation/edit
│   │       │   └── activity-feed/      # Activity timeline
│   │       └── crm.routes.ts
│   │
│   ├── legacy/                         # NgModule-based module (migration demo)
│   │   ├── legacy.module.ts            # Traditional NgModule
│   │   ├── legacy-dashboard/           # NgModule component
│   │   └── legacy.routes.ts            # Module-based routing
│   │
│   └── layout/                         # Application shell
│       ├── shell.component.ts          # Main layout wrapper
│       ├── sidebar.component.ts        # Navigation sidebar
│       └── header.component.ts         # App header
│
├── environments/
│   ├── environment.ts                  # Development (useJsonServer: false)
│   └── environment.prod.ts             # Production
│
├── assets/
│   └── mock-data/                      # JSON seed data for mock API
│       ├── products.json
│       ├── tasks.json
│       ├── employees.json
│       └── contacts.json
│
├── styles/
│   └── styles.scss                     # Global styles
│
├── main.ts                             # Bootstrap
└── index.html

# Root config files
├── angular.json                        # Angular CLI configuration
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── vitest.config.ts                    # Vitest configuration (step-07+)
├── db.json                             # JSON Server data (optional)
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI pipeline
└── karma.conf.js                       # Legacy Karma config (removed in step-07)
```

**Structure Decision**: Single Angular SPA with layered enterprise architecture. Feature modules are lazy-loaded via the router. Each feature follows the `data-access/` + `ui/` separation pattern. The `legacy/` module exists solely for NgModule-to-Standalone migration demonstration.

## Workshop Step Branches (Progressive)

| Branch | Topic | Builds On | Key Changes |
| ------ | ----- | --------- | ----------- |
| `step-01-scaffold` | Project Scaffold | - | Angular 21 `ng new`, enterprise folder structure, layout shell, routing skeleton |
| `step-02-standalone-migration` | Standalone Migration | step-01 | Add `legacy/` NgModule, demonstrate migration to standalone, lazy loading |
| `step-03-signals-reactivity` | Signals & Reactivity | step-02 | Add `signal()`, `computed()`, `effect()` throughout components, template binding |
| `step-04-zoneless` | Zoneless Detection | step-03 | Remove Zone.js, remove `provideZoneChangeDetection()`, adapt tests to `whenStable()` |
| `step-05-ngrx-signalstore` | State Management | step-04 | Add `@ngrx/signals`, create stores for all 4 features, `withEntities`, `patchState` |
| `step-06-mock-api` | Data Layer | step-05 | Add `mock-api.interceptor.ts`, JSON seed data, optional JSON Server config |
| `step-07-vitest-migration` | Vitest Testing | step-06 | Replace Karma with Vitest, convert spy patterns, configure jsdom/happy-dom/Playwright |
| `step-08-signal-forms` | Signal Forms | step-07 | Add `@angular/forms/signals` forms alongside Reactive Forms in tasks/ecommerce |
| `step-09-angular-aria` | Accessibility | step-08 | Add `@angular/aria` directives to shared UI (dialog, autocomplete, tabs, accordion) |
| `step-10-ci-cd` | CI/CD & Polish | step-09 | GitHub Actions workflow, build optimization, final integration test |

## Complexity Tracking

No constitution violations to justify. The project is a single Angular SPA with standard enterprise patterns.
