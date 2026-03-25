# Quickstart: Advanced Angular Workshop Enterprise Project

**Branch**: `001-angular-workshop-project`

## Prerequisites

- Node.js LTS (v22+)
- npm 10+ or pnpm 9+
- Angular CLI v21: `npm install -g @angular/cli@21`
- Git
- IDE: VS Code recommended (with Angular Language Service extension)

## Setup

```bash
# Clone the repository
git clone <repo-url> angular-workshop
cd angular-workshop

# Start at the beginning (scaffold)
git checkout step-01-scaffold

# Install dependencies
npm install

# Start development server
ng serve

# Open browser at http://localhost:4200
```

## Workshop Step Branches

Navigate between workshop steps using Git branches:

```bash
# List all workshop steps
git branch -a | grep step-

# Jump to a specific step
git checkout step-03-signals-reactivity

# See what changed between steps
git diff step-02-standalone-migration..step-03-signals-reactivity
```

### Step Overview

| Branch                       | Topic                            | Key Concepts                                                 |
| ---------------------------- | -------------------------------- | ------------------------------------------------------------ |
| `step-01-scaffold`           | Project Scaffold                 | Angular 21 project structure, enterprise folder layout       |
| `step-02-standalone-migration` | Standalone Migration           | NgModule → Standalone, lazy loading without modules          |
| `step-03-signals-reactivity` | Signals & Reactivity             | signal(), computed(), effect(), template binding              |
| `step-04-zoneless`           | Zoneless Change Detection        | Remove Zone.js, provideZoneChangeDetection() removal         |
| `step-05-ngrx-signalstore`   | State Management                 | NgRx SignalStore, withState, withMethods, withEntities       |
| `step-06-mock-api`           | Data Layer                       | HttpInterceptor mock API, optional JSON Server               |
| `step-07-vitest-migration`   | Testing with Vitest              | Karma→Vitest migration, jsdom/happy-dom/Playwright           |
| `step-08-signal-forms`       | Signal Forms                     | @angular/forms/signals, form(), FormField, validation        |
| `step-09-angular-aria`       | Accessibility                    | @angular/aria headless directives, WCAG 2.1 AA               |
| `step-10-ci-cd`              | CI/CD & Final Polish             | Pipeline config, build optimization, final integration       |

## Running Tests

```bash
# Run tests with Vitest (step-07 onwards)
ng test

# Run tests with coverage
ng test --coverage

# Run tests in browser mode (requires Playwright)
ng test --browsers chromium

# Run legacy Karma tests (step-01 through step-06)
ng test  # uses Karma before migration step
```

## Optional: JSON Server

For advanced exercises with real HTTP requests (step-06 onwards):

```bash
# Install JSON Server
npm install -D json-server

# Start JSON Server (separate terminal)
npx json-server db.json --port 3001

# Switch app to use JSON Server
# Set environment.useJsonServer = true in src/environments/environment.ts
```

## Project Structure

```
src/
├── app/
│   ├── app.component.ts           # Root component
│   ├── app.config.ts              # Application config (providers)
│   ├── app.routes.ts              # Root routes with lazy loading
│   ├── core/                      # Singleton services, guards, interceptors
│   │   ├── interceptors/
│   │   │   └── mock-api.interceptor.ts
│   │   ├── guards/
│   │   └── services/
│   ├── shared/                    # Reusable UI, pipes, directives
│   │   ├── ui/
│   │   ├── pipes/
│   │   └── directives/
│   ├── features/
│   │   ├── ecommerce/             # E-Commerce feature
│   │   │   ├── data-access/       # SignalStore, services
│   │   │   ├── ui/                # Components
│   │   │   └── ecommerce.routes.ts
│   │   ├── tasks/                 # Task Management feature
│   │   │   ├── data-access/
│   │   │   ├── ui/
│   │   │   └── tasks.routes.ts
│   │   ├── hr/                    # HR Portal feature
│   │   │   ├── data-access/
│   │   │   ├── ui/
│   │   │   └── hr.routes.ts
│   │   └── crm/                   # CRM feature
│   │       ├── data-access/
│   │       ├── ui/
│   │       └── crm.routes.ts
│   ├── legacy/                    # NgModule-based module (migration demo)
│   │   ├── legacy.module.ts
│   │   └── ...
│   └── layout/                    # Shell, sidebar, header
├── environments/
├── assets/
└── styles/
```

## Feature Modules Summary

| Module     | Domain         | Key Angular Patterns Demonstrated                |
| ---------- | -------------- | ------------------------------------------------ |
| E-Commerce | Products, Cart | SignalStore with entities, computed signals       |
| Tasks      | Project Mgmt   | Signal Forms, state transitions, Reactive Forms   |
| HR         | Employee Portal| Angular Aria, time tracking, leave management     |
| CRM        | Contacts, Deals| Pipeline/Kanban views, activity feed, filtering   |
