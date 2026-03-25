# Feature Specification: Advanced Angular Workshop Enterprise Project

**Feature Branch**: `001-angular-workshop-project`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Enterprise-ready Angular workshop project covering Angular v17-v21 features, serving as training material and reference implementation for an Advanced Angular Schulung (DVC - Digital Venture Consultants). The project must demonstrate all modern Angular mechanisms including Vitest, Zoneless Change Detection, Signal Forms, Standalone Components, and migration paths from legacy patterns."

## Clarifications

### Session 2026-03-25

- Q: What application domain should the workshop project use? → A: Multi-domain enterprise platform combining E-Commerce (product catalog, cart, checkout), Task/Project Management (boards, tasks, assignments, status tracking), HR/Employee Portal (profiles, time tracking, leave management), and CRM (contacts, deals, pipeline, activity feed). Each domain serves as a separate feature module.
- Q: How should the project handle backend/API data? → A: Mixed approach - interceptor-based in-memory mock API as default (zero-dependency, works offline), with optional JSON Server configuration for advanced exercises requiring real HTTP calls.
- Q: Which state management pattern should the project use? → A: NgRx SignalStore (`@ngrx/signals`) - the Signal-native, officially supported state management solution. Best practice for Angular 21 enterprise applications.
- Q: How should workshop steps be organized in the repository? → A: Git branches per step (e.g., `step-01-scaffold`, `step-02-vitest-migration`). Participants checkout branches to jump between states; trainer diffs between branches to show changes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Workshop Trainer Builds Project Incrementally (Priority: P1)

As a workshop trainer, I set up and extend the project step-by-step during a multi-day training so that participants can follow along and understand each Angular concept in isolation and in combination.

**Why this priority**: The core purpose of the project is to serve as a live-coding vehicle during the workshop. Without incremental buildability, the training cannot function.

**Independent Test**: Can be tested by following the workshop agenda day-by-day, building the project from scratch, and verifying that each module compiles and runs independently after each step.

**Acceptance Scenarios**:

1. **Given** a fresh checkout of the project skeleton, **When** the trainer runs the setup commands, **Then** the project installs all dependencies and starts successfully within 2 minutes.
2. **Given** the project at any workshop step, **When** a new feature module is added following the provided instructions, **Then** the project compiles without errors and all existing tests pass.
3. **Given** the completed project, **When** all workshop modules have been built, **Then** the application demonstrates a cohesive, functional enterprise application with all covered Angular features.

---

### User Story 2 - Participant Learns Vitest Migration (Priority: P1)

As a workshop participant, I migrate the project's test suite from Karma/Jasmine to Vitest so that I understand the new default test runner in Angular 21 and can apply this migration to my own codebase.

**Why this priority**: Vitest as Angular 21's new default test runner is the primary topic requested by the client (DVC). Participants must gain hands-on migration experience.

**Independent Test**: Can be tested by running the existing Karma/Jasmine test suite, performing the migration steps, and verifying all tests pass under Vitest with equivalent coverage.

**Acceptance Scenarios**:

1. **Given** a project module with Karma/Jasmine tests, **When** the participant follows the migration checklist, **Then** all tests are converted to Vitest using `vi.fn()` instead of `jasmine.createSpy()` and pass successfully.
2. **Given** the migrated test suite, **When** tests are run with the `@angular/build:unit-test` builder, **Then** all tests execute and produce a coverage report.
3. **Given** the Vitest configuration, **When** the participant switches between `jsdom`, `happy-dom`, and `@vitest/browser-playwright` environments, **Then** tests run correctly in each environment with documented trade-offs.

---

### User Story 3 - Participant Implements Zoneless Change Detection (Priority: P1)

As a workshop participant, I migrate components from Zone.js-based change detection to the new zoneless approach using Signals so that I understand Angular 21's default behavior for new projects.

**Why this priority**: Zoneless change detection is a fundamental shift in Angular 21 that affects every existing codebase. Senior teams must understand migration strategies.

**Independent Test**: Can be tested by removing Zone.js from the project, running the application, and verifying all components update correctly using Signals-based reactivity.

**Acceptance Scenarios**:

1. **Given** components using Zone.js for change detection, **When** the participant applies the zoneless migration pattern, **Then** all components render and update correctly without Zone.js loaded.
2. **Given** a zoneless application, **When** async operations (HTTP calls, timers, user events) occur, **Then** the UI updates reactively through Signals without manual change detection triggers.
3. **Given** a mixed codebase (some Zone.js, some zoneless), **When** the hybrid configuration is applied, **Then** both patterns coexist during incremental migration.

---

### User Story 4 - Participant Explores Signal Forms (Priority: P2)

As a workshop participant, I build forms using the new Signals-based Forms API so that I understand the paradigm shift from Reactive Forms and can evaluate adoption for my projects.

**Why this priority**: Signal Forms are experimental but represent Angular's future direction. Participants need practical exposure to make informed adoption decisions.

**Independent Test**: Can be tested by building a complete form (validation, submission, error handling) using Signal Forms and comparing behavior with an equivalent Reactive Forms implementation.

**Acceptance Scenarios**:

1. **Given** a form requirement, **When** the participant implements it using Signal Forms, **Then** the form handles validation, error display, and submission without importing `ReactiveFormsModule`.
2. **Given** an existing Reactive Form, **When** compared side-by-side with the Signal Form equivalent, **Then** participants can articulate the differences in data flow, validation approach, and reactivity model.

---

### User Story 5 - Participant Migrates to Standalone Components (Priority: P2)

As a workshop participant, I convert NgModule-based components to Standalone Components so that I understand the modern Angular architecture pattern.

**Why this priority**: Standalone Components are the recommended pattern since Angular 15+ and essential for understanding modern Angular architecture.

**Independent Test**: Can be tested by converting a module-based feature to standalone and verifying it renders and functions identically.

**Acceptance Scenarios**:

1. **Given** a feature built with NgModules, **When** the participant applies the standalone migration, **Then** the feature works identically with `standalone: true` components, directives, and pipes.
2. **Given** standalone components, **When** lazy loading is configured, **Then** routes load feature components without NgModule wrappers.

---

### User Story 6 - Participant Uses Enterprise Architecture Patterns (Priority: P2)

As a workshop participant, I apply enterprise architecture patterns (state management, dependency injection, layered architecture) so that I can structure large-scale Angular applications.

**Why this priority**: Enterprise patterns are essential for the target audience (senior teams at DVC) who work on large-scale applications.

**Independent Test**: Can be tested by verifying that the project structure follows defined layers (feature, data-access, UI, utility) and that state management flows are traceable.

**Acceptance Scenarios**:

1. **Given** the project architecture, **When** a new feature is added, **Then** it follows the established folder structure, naming conventions, and layer boundaries.
2. **Given** a state management pattern, **When** data flows through the application, **Then** the flow is traceable, testable, and follows a unidirectional data flow.
3. **Given** the dependency injection setup, **When** services are provided at different levels (root, feature, component), **Then** the injection hierarchy behaves as documented.

---

### User Story 7 - Participant Explores Angular Aria & Accessibility (Priority: P3)

As a workshop participant, I integrate Angular Aria headless accessibility components so that I understand how to build accessible applications without custom ARIA implementations.

**Why this priority**: Accessibility is important but is a newer, supplementary topic compared to the core migration topics.

**Independent Test**: Can be tested by building an interactive component (e.g., dropdown, dialog) using Angular Aria and verifying it passes automated accessibility checks.

**Acceptance Scenarios**:

1. **Given** a UI component requirement, **When** built using Angular Aria primitives, **Then** the component passes WCAG 2.1 AA automated checks and works with screen readers.

---

### User Story 8 - Trainer Provides Reference Material (Priority: P3)

As a workshop trainer, I use the completed project as the basis for post-training reference material (migration checklists, architecture guides, code examples) so that participants can continue learning after the workshop.

**Why this priority**: Post-training material extends the workshop's value but is not critical during the live sessions.

**Independent Test**: Can be tested by having a non-participant developer use the repository and checklists to perform a migration on a sample project without trainer assistance.

**Acceptance Scenarios**:

1. **Given** the completed repository, **When** a developer reads the project structure and inline documentation, **Then** they can understand the purpose and pattern of each module without external explanation.
2. **Given** the migration checklists, **When** applied to a standard Angular 17+ project, **Then** the developer can complete each migration (NgModules to Standalone, Karma to Vitest, Zone.js to Zoneless) following the documented steps.

---

### Edge Cases

- What happens when participants have different Angular versions (v17, v18, v19) in their existing projects? The workshop material must address version-specific migration paths.
- How does the project handle conflicting dependencies when both Zone.js and zoneless patterns coexist during migration?
- What happens when Vitest browser mode is not available in restricted corporate environments? Fallback configurations must be documented.
- How does the project behave when Signal Forms APIs change between Angular versions (experimental status)?
- What happens when participants attempt to run the project without the correct Node.js version?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Project MUST be scaffoldable from a clean state and reach a running application within 2 minutes of setup.
- **FR-002**: Project MUST include working examples of Vitest test configurations using `@angular/build:unit-test` builder.
- **FR-003**: Project MUST demonstrate migration from `jasmine.createSpy()` to `vi.fn()` with before/after examples.
- **FR-004**: Project MUST support three Vitest environments (`jsdom`, `happy-dom`, `@vitest/browser-playwright`) with switchable configuration.
- **FR-005**: Project MUST include components that work without Zone.js loaded (zoneless change detection).
- **FR-006**: Project MUST demonstrate Signals-based reactivity patterns (`signal()`, `computed()`, `effect()`) as Zone.js replacements.
- **FR-007**: Project MUST include a hybrid configuration allowing incremental Zone.js to zoneless migration.
- **FR-008**: Project MUST contain at least one form implemented with Signal Forms API alongside an equivalent Reactive Forms implementation for comparison.
- **FR-009**: Project MUST use Standalone Components as the primary component pattern, with at least one NgModule-based module for migration demonstration.
- **FR-010**: Project MUST follow a layered enterprise architecture (feature modules, data-access layer, shared UI components, utility libraries).
- **FR-011**: Project MUST include CI/CD pipeline configuration compatible with Vitest test runner.
- **FR-012**: Project MUST include at least one Angular Aria headless component integration.
- **FR-013**: Project MUST support lazy loading of feature routes without NgModule wrappers.
- **FR-014**: Project MUST use NgRx SignalStore (`@ngrx/signals`) as the state management pattern, demonstrating unidirectional data flow with Signal-native stores across feature modules.
- **FR-015**: Project MUST provide inline code comments explaining architectural decisions at key points for self-study reference.
- **FR-019**: Project MUST organize workshop steps as separate Git branches (e.g., `step-01-scaffold`, `step-02-vitest-migration`) so participants can checkout any step and trainers can diff between branches to demonstrate changes.
- **FR-016**: Project MUST target the latest Angular 21 release and be compatible with Node.js LTS.
- **FR-017**: Project MUST include an interceptor-based in-memory mock API as the default data layer, requiring no external processes to run.
- **FR-018**: Project MUST include an optional JSON Server configuration for advanced exercises requiring real HTTP requests against a separate process.

### Key Entities

- **Workshop Module**: A self-contained unit of the training covering one Angular concept (e.g., "Vitest Migration", "Zoneless Detection"). Contains source code, tests, and documentation. Maps to a workshop day/session. Each module corresponds to a Git branch representing a progressive project state.
- **Feature Module**: An application domain area implemented using enterprise patterns. The project includes four feature modules: (1) E-Commerce - product catalog, cart, checkout; (2) Task/Project Management - boards, tasks, assignments, status tracking; (3) HR/Employee Portal - profiles, time tracking, leave management; (4) CRM - contacts, deals, pipeline, activity feed. Each module demonstrates real-world architecture within the workshop context.
- **Migration Example**: A before/after pair showing legacy Angular pattern alongside its modern equivalent. Includes step-by-step transformation guide.
- **Test Suite**: Collection of unit and integration tests demonstrating both legacy (Karma/Jasmine) and modern (Vitest) test patterns for comparison and migration practice.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer with Angular 17+ experience can set up and run the project within 5 minutes following the provided instructions.
- **SC-002**: All workshop modules can be completed independently - removing any single module does not break the remaining application.
- **SC-003**: The test suite achieves at least 80% code coverage across all feature modules.
- **SC-004**: The application runs correctly in both Zone.js and zoneless configurations without code changes beyond the documented configuration switch.
- **SC-005**: Workshop participants can complete each migration exercise (Standalone, Vitest, Zoneless) within 30-45 minutes of guided practice.
- **SC-006**: The project passes automated accessibility checks (WCAG 2.1 AA) for all components using Angular Aria.
- **SC-007**: All migration checklists are self-contained - a developer can follow them without additional external resources.
- **SC-008**: The project builds and all tests pass in a standard CI/CD environment within 3 minutes.

## Assumptions

- Target audience is senior Angular developers (3+ years experience) who are familiar with Angular 17+ concepts but need hands-on experience with Angular 21 changes.
- Participants have Node.js LTS and a modern IDE (VS Code recommended) pre-installed.
- The workshop is structured as a multi-day training (approximately 3-5 days based on the email exchange).
- The project represents a multi-domain enterprise platform with four feature modules (E-Commerce, Task/Project Management, HR/Employee Portal, CRM) - each complex enough to demonstrate specific patterns, but scoped to be buildable during a workshop session.
- Corporate network restrictions may limit certain features (e.g., Playwright browser testing); offline-capable alternatives must be documented.
- The default data layer uses interceptor-based in-memory mocks (no external backend required). JSON Server is available as an optional add-on for advanced exercises.
- Signal Forms are experimental in Angular 21 - the implementation serves as a forward-looking preview, not production guidance.
- The project will be hosted as a Git repository that participants receive as training material.
- The DVC team uses standard web development tooling and CI/CD pipelines.
- Angular Aria and MCP Developer Server topics are supplementary and can be adjusted based on workshop time constraints.
