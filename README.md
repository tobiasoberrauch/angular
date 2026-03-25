# Angular 21 Advanced Workshop

**Enterprise-Referenzprojekt für das 5-tägige Angular Advanced Training**

> Veranstalter: DVC - Digital Venture Consultants, Frankfurt
> Trainer: Tobias Oberrauch
> Angular Version: 21 | TypeScript 5.9 | Standalone & Zoneless

---

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Voraussetzungen](#voraussetzungen)
- [Schnellstart](#schnellstart)
- [Workshop-Struktur](#workshop-struktur)
- [Branch-Übersicht](#branch-übersicht)
- [Projektstruktur](#projektstruktur)
- [Feature-Module](#feature-module)
- [Technologie-Stack](#technologie-stack)
- [Migrations-Checklisten](#migrations-checklisten)
- [Workshop-Navigation](#workshop-navigation)
- [Übungen](#übungen)
- [Lizenz & Kontakt](#lizenz--kontakt)

---

## Überblick

Dieses Repository ist das zentrale Referenzprojekt für den **Angular 21 Advanced Workshop**. Es dient als praxisnahe Grundlage für ein 5-tägiges Training, das sich an erfahrene Angular-Entwickler richtet.

Das Projekt bildet eine realitätsnahe Enterprise-Anwendung ab und deckt folgende Schwerpunkte ab:

- Migration von NgModules zu Standalone Components
- Signals und Zoneless Change Detection
- State Management mit NgRx SignalStore
- Signal-basierte Formulare und Barrierefreiheit
- CI/CD-Pipelines und Migrations-Strategien

Jeder Workshop-Tag baut auf dem vorherigen auf. Die einzelnen Schritte sind als Git-Branches organisiert, sodass Teilnehmer jederzeit zu einem definierten Zustand zurückspringen können.

---

## Voraussetzungen

| Software       | Mindestversion | Empfohlen       |
| -------------- | -------------- | --------------- |
| Node.js        | 22.0           | 22 LTS          |
| npm            | 10.0           | 10+             |
| Git            | 2.40           | 2.45+           |
| IDE            | --             | VS Code 1.95+   |

### Empfohlene VS Code Erweiterungen

- Angular Language Service
- ESLint
- Prettier
- GitLens

---

## Schnellstart

```bash
# Repository klonen
git clone https://github.com/tobiasoberrauch/angular.git
cd angular

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
ng serve
```

Die Anwendung ist unter `http://localhost:4200` erreichbar.

### Weitere Befehle

```bash
# Unit-Tests ausführen
ng test

# Linting
ng lint

# Produktions-Build
ng build --configuration production
```

---

## Workshop-Struktur

### Tag 1: Projekt-Scaffold & Standalone Migration

| Schritt   | Thema                                    |
| --------- | ---------------------------------------- |
| step-01   | Projekt-Scaffold und Grundstruktur       |
| step-02   | Migration zu Standalone Components       |

**Lernziele:** Enterprise-Projektstruktur verstehen, NgModule-basierte Komponenten zu Standalone Components migrieren, Dependency Injection ohne Module konfigurieren.

### Tag 2: Signals & Zoneless Change Detection

| Schritt   | Thema                                    |
| --------- | ---------------------------------------- |
| step-03   | Einführung in Signals                   |
| step-04   | Zoneless Change Detection                |

**Lernziele:** Signal-Primitiven (signal, computed, effect) einsetzen, Zone.js entfernen, Change Detection mit Signals steuern, Performance-Vergleich mit und ohne Zone.js.

### Tag 3: NgRx SignalStore & Mock API

| Schritt   | Thema                                    |
| --------- | ---------------------------------------- |
| step-05   | NgRx SignalStore Grundlagen              |
| step-06   | Erweitertes State Management             |
| step-07   | Mock API und HTTP-Integration            |

**Lernziele:** SignalStore als leichtgewichtige State-Management-Lösung einsetzen, Custom Store Features entwickeln, HTTP-Requests mit Mock-Backend integrieren.

### Tag 4: Signal Forms & Angular Aria

| Schritt   | Thema                                    |
| --------- | ---------------------------------------- |
| step-08   | Signal-basierte Formulare                |
| step-09   | Barrierefreiheit mit Angular Aria        |

**Lernziele:** Reaktive Formulare mit Signals umsetzen, Validierung und Fehlerbehandlung, ARIA-Attribute und Accessibility-Patterns implementieren.

### Tag 5: CI/CD, Migration & Abschlussprojekt

| Schritt   | Thema                                    |
| --------- | ---------------------------------------- |
| step-10   | CI/CD, Migrations-Checklisten, Abschluss |

**Lernziele:** CI/CD-Pipeline für Angular-Projekte aufsetzen, Migrations-Strategien für bestehende Projekte, erworbenes Wissen im Abschlussprojekt anwenden.

---

## Branch-Übersicht

Jeder Schritt ist als eigener Branch verfügbar. So können Teilnehmer bei Bedarf einen definierten Ausgangszustand laden.

| Branch       | Beschreibung                                         |
| ------------ | ---------------------------------------------------- |
| `main`                        | Fertiges Endprodukt (alle Features)              |
| `step-01-scaffold`            | Projekt-Scaffold mit Enterprise-Ordnerstruktur   |
| `step-02-standalone-migration`| Migration zu Standalone Components               |
| `step-03-signals-reactivity`  | Signals: signal(), computed(), effect()          |
| `step-04-zoneless`            | Zoneless Change Detection aktiviert              |
| `step-05-ngrx-signalstore`    | NgRx SignalStore Grundkonfiguration              |
| `step-06-mock-api`            | Mock API mit json-server und HTTP-Client         |
| `step-07-vitest-migration`    | Vitest als Test-Runner konfigurieren             |
| `step-08-signal-forms`        | Signal-basierte reaktive Formulare               |
| `step-09-angular-aria`        | Barrierefreiheit und WAI-ARIA Patterns           |
| `step-10-ci-cd`               | CI/CD-Pipeline und Migrations-Checklisten        |

```bash
# Zu einem bestimmten Schritt wechseln
git checkout step-03-signals-reactivity
```

---

## Projektstruktur

```
src/
  app/
    core/                     # Singleton-Services, Guards, Interceptors
      auth/
      http/
      error-handling/
    shared/                   # Wiederverwendbare Komponenten, Pipes, Directives
      components/
      directives/
      pipes/
      models/
    features/                 # Feature-Module nach Domäne
      e-commerce/
      tasks/
      hr/
      crm/
    layout/                   # App-Shell: Header, Sidebar, Footer
      header/
      sidebar/
      footer/
    legacy/                   # NgModule-basierte Komponenten (vor Migration)
  assets/
  environments/
  styles/
docs/
  checklists/                 # Migrations-Checklisten
scripts/
  workshop-nav.sh             # Workshop-Navigationsscript
  docs/exercises/               # Übungsaufgaben pro Tag
```

---

## Feature-Module

Die Anwendung bildet vier Geschäftsdomänen ab. Jede Domäne demonstriert unterschiedliche Angular-Patterns.

### E-Commerce

Produktkatalog, Warenkorb und Bestellprozess. Demonstriert **NgRx SignalStore** für komplexes State Management, **Lazy Loading** und **Route Guards**.

### Tasks

Aufgabenverwaltung mit Kanban-Board. Demonstriert **Signal-basierte Formulare**, **Drag & Drop** mit CDK und **Optimistic Updates**.

### HR

Mitarbeiterverwaltung und Organigramm. Demonstriert **Standalone Components**, **Dynamic Component Loading** und **Content Projection**.

### CRM

Kundenverwaltung und Kontakthistorie. Demonstriert **Barrierefreiheit mit Angular Aria**, **komplexe Tabellenkomponenten** und **Export-Funktionen**.

---

## Technologie-Stack

| Kategorie          | Technologie            | Version   |
| ------------------ | ---------------------- | --------- |
| Framework          | Angular                | 21        |
| Sprache            | TypeScript             | 5.9       |
| State Management   | NgRx Signals           | 21        |
| Testing            | Vitest                 | 4         |
| Styling            | SCSS                   | --        |
| Linting            | ESLint                 | 9+        |
| Build              | Angular CLI / esbuild  | 21        |
| Mock API           | json-server            | 1.x       |

---

## Migrations-Checklisten

Im Verzeichnis `docs/checklists/` befinden sich ausführliche Anleitungen für die Migration bestehender Angular-Projekte:

| Checkliste                           | Beschreibung                                          |
| ------------------------------------ | ----------------------------------------------------- |
| `standalone-migration.md`            | NgModules zu Standalone Components                    |
| `vitest-migration.md`               | Karma/Jasmine zu Vitest migrieren                     |
| `zoneless-migration.md`             | Zone.js entfernen, Zoneless aktivieren                |
| `signal-forms-migration.md`         | Reactive Forms zu Signal Forms migrieren              |

Jede Checkliste enthält eine Schritt-für-Schritt-Anleitung, häufige Fehlerquellen und Teststrategien.

---

## Workshop-Navigation

Das Script `scripts/workshop-nav.sh` erleichtert die Navigation zwischen den Workshop-Schritten:

```bash
# Zum nächsten Schritt wechseln
./scripts/workshop-nav.sh next

# Zum vorherigen Schritt zurückkehren
./scripts/workshop-nav.sh prev

# Zu einem bestimmten Schritt springen
./scripts/workshop-nav.sh goto 05

# Aktuellen Schritt und Fortschritt anzeigen
./scripts/workshop-nav.sh status
```

Das Script sichert lokale Änderungen automatisch in einem Stash, bevor es den Branch wechselt.

---

## Übungen

Im Verzeichnis `docs/exercises/` befinden sich die Übungsaufgaben für jeden Workshop-Tag:

```
docs/exercises/
  tag-01-fundamentals.md   # Standalone & Control Flow Übungen
  tag-02-reactivity.md     # Signals & Zoneless Übungen
  tag-03-state-testing.md  # SignalStore & Vitest Übungen
  tag-04-forms-a11y.md     # Formulare & Accessibility Übungen
  tag-05-production.md     # CI/CD & Abschlussprojekt
```

Jede Übung enthält eine Aufgabenbeschreibung, Hinweise und eine Musterlösungsvariante auf dem entsprechenden Branch.

---

## Lizenz & Kontakt

**Trainer:** Tobias Oberrauch
**Auftraggeber:** DVC - Digital Venture Consultants, Frankfurt
**E-Mail:** tobias.oberrauch@gmx.de
**Telefon:** 0176 416 348 17
**GitHub:** [github.com/tobiasoberrauch](https://github.com/tobiasoberrauch)

Dieses Material ist ausschließlich für Teilnehmer des Angular 21 Advanced Workshops bestimmt.

---

*Angular 21 Advanced Workshop | DVC - Digital Venture Consultants | Frankfurt*
