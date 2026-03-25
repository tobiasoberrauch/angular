# Trainer Guide - Angular 21 Advanced Workshop

> **Trainer:** Tobias Oberrauch
> **Dauer:** 5 Tage (Mo-Fr, jeweils 09:00-16:30)
> **Zielgruppe:** Erfahrene Angular-Entwickler (mind. Angular 14+ Erfahrung)
> **Dokument-Typ:** Internes Trainer-Dokument -- nicht an Teilnehmer weitergeben
> **Letzte Aktualisierung:** 2026-03-25

---

## Inhaltsverzeichnis

1. [Vorbereitung](#1-vorbereitung)
2. [Tagesablauf](#2-tagesablauf)
3. [Didaktische Hinweise](#3-didaktische-hinweise)
4. [Übungsaufgaben pro Tag](#4-übungsaufgaben-pro-tag)
5. [Notfall-Plan](#5-notfall-plan)
6. [Nachbereitung](#6-nachbereitung)

---

## 1. Vorbereitung

### 1.1 System-Anforderungen (pro Teilnehmer)

| Komponente        | Minimum                    | Empfohlen                  |
| ----------------- | -------------------------- | -------------------------- |
| OS                | Windows 10, macOS 12, Ubuntu 22.04 | Windows 11, macOS 14+, Ubuntu 24.04 |
| Node.js           | 22.x LTS                  | 22.x LTS (aktuellster Patch) |
| npm               | 10.x                      | 10.x                      |
| RAM               | 8 GB                      | 16 GB                     |
| Festplatte (frei) | 10 GB                     | 20 GB                     |
| Bildschirm        | 1920x1080                 | 2560x1440 oder Dual-Monitor |
| Browser           | Chrome 120+ oder Firefox 120+ | Chrome aktuell             |

### 1.2 Vorab installierte Tools

Folgende Tools müssen **vor Workshop-Beginn** auf jedem Teilnehmer-Rechner installiert sein:

```
- Node.js 22.x LTS
- npm 10.x (kommt mit Node.js)
- Git 2.40+
- Visual Studio Code (aktuellste Version)
  - Extension: Angular Language Service
  - Extension: ESLint
  - Extension: Prettier
  - Extension: GitLens (optional)
  - Extension: Error Lens (optional)
- Angular CLI 21.x (`npm install -g @angular/cli@21`)
- Chrome DevTools (Angular DevTools Extension)
```

**Vorab-Check-Script** -- als `setup-check.sh` im Repository hinterlegt:

```bash
#!/bin/bash
echo "=== Angular 21 Workshop Setup Check ==="
echo ""
echo "Node.js: $(node --version 2>/dev/null || echo 'NICHT INSTALLIERT')"
echo "npm:     $(npm --version 2>/dev/null || echo 'NICHT INSTALLIERT')"
echo "Git:     $(git --version 2>/dev/null || echo 'NICHT INSTALLIERT')"
echo "ng CLI:  $(ng version 2>/dev/null | grep 'Angular CLI' || echo 'NICHT INSTALLIERT')"
echo ""
echo "=== VS Code Extensions ==="
code --list-extensions 2>/dev/null | grep -i angular || echo "Angular Language Service: NICHT INSTALLIERT"
code --list-extensions 2>/dev/null | grep -i eslint || echo "ESLint: NICHT INSTALLIERT"
echo ""
echo "=== Netzwerk ==="
curl -s --max-time 5 https://registry.npmjs.org > /dev/null && echo "npm Registry: OK" || echo "npm Registry: NICHT ERREICHBAR"
curl -s --max-time 5 https://github.com > /dev/null && echo "GitHub: OK" || echo "GitHub: NICHT ERREICHBAR"
```

### 1.3 Repository-Setup pro Teilnehmer

**Vor dem Workshop:**

1. Repository klonen und alle Step-Branches prüfen:
   ```bash
   git clone <workshop-repo-url>
   cd angular-workshop
   git branch -a  # Alle step-XX Branches müssen vorhanden sein
   ```

2. Für jeden Step-Branch einmal `npm install` und `npm run build` ausführen, um sicherzustellen, dass alle Branches funktionsfähig sind.

3. **Teilnehmer-Zugang:** Jedem Teilnehmer ein eigenes Fork oder einen Clone-Link bereitstellen. Empfehlung: GitHub Classroom oder ein gemeinsames GitLab mit individuellen Forks.

4. **Pre-Populated `node_modules`:** Einen USB-Stick oder Netzlaufwerk mit fertigem `node_modules`-Ordner bereithalten (siehe Notfall-Plan).

**Branch-Struktur im Repository:**

```
main                        # Fertiges Endprodukt
step-01/project-scaffold    # Tag 1, Session 1
step-02/standalone-migration # Tag 1, Session 2
step-03/signals-basics      # Tag 2, Session 1
step-04/zoneless            # Tag 2, Session 2
step-05/ngrx-signalstore    # Tag 3, Session 1
step-06/mock-api            # Tag 3, Session 2
step-07/vitest-migration    # Tag 3, Session 3
step-08/signal-forms        # Tag 4, Session 1
step-09/accessibility       # Tag 4, Session 2
step-10/production-ci       # Tag 5, Session 1
```

Jeder Branch enthält:
- `README.md` mit Aufgabenbeschreibung
- `SOLUTION.md` mit Lösungshinweisen (nur für Trainer sichtbar, in `.gitignore` der Teilnehmer-Forks)
- Vorkonfigurierte Dateien, damit Teilnehmer direkt starten können

### 1.4 Netzwerk- und Firewall-Überlegungen

**Benötigte Domains (Whitelist für Firmennetzwerke):**

```
registry.npmjs.org          # npm Pakete
github.com                  # Repository
*.githubusercontent.com     # GitHub Assets
cdn.jsdelivr.net            # CDN für Libraries
fonts.googleapis.com        # Google Fonts (falls verwendet)
fonts.gstatic.com           # Google Fonts Assets
update.code.visualstudio.com # VS Code Updates
marketplace.visualstudio.com # VS Code Extensions
```

**Ports:**

```
443   (HTTPS) -- npm, GitHub, CDN
80    (HTTP)  -- Fallback
4200  (dev server) -- Angular CLI
4300  (alt dev server) -- Zweite Instanz falls nötig
9876  (Karma, falls Legacy-Tests gezeigt werden)
5173  (Vitest UI)
```

**Checkliste vor Ort:**

- [ ] WLAN-Zugang für alle Teilnehmer getestet
- [ ] Bandbreite ausreichend (mind. 10 Mbit/s pro Person für npm install)
- [ ] Proxy-Einstellungen dokumentiert (falls Firmennetzwerk)
- [ ] npm Proxy konfiguriert: `npm config set proxy http://proxy:port`
- [ ] Git Proxy konfiguriert: `git config --global http.proxy http://proxy:port`
- [ ] Beamer/Monitor-Anschluss getestet (HDMI, USB-C, DisplayPort)
- [ ] Schriftgröße im Editor auf 18-20px für Beamer-Sichtbarkeit

---

## 2. Tagesablauf

### Tag 1: Fundamentals & Migration

**Lernziele:** Teilnehmer verstehen die Neuerungen in Angular 21 und können ein bestehendes NgModule-Projekt auf Standalone Components migrieren.

| Zeit          | Thema                                          | Typ         | Branch/Step |
| ------------- | ---------------------------------------------- | ----------- | ----------- |
| 09:00 - 09:30 | Vorstellung & Setup-Check                     | Interaktiv  | --          |
| 09:30 - 10:30 | Angular 21 Überblick: Was ist neu?            | Vortrag     | --          |
| 10:30 - 10:45 | **Pause**                                      |             |             |
| 10:45 - 12:00 | Live-Coding: Projekt-Scaffold                  | Live-Coding | step-01     |
| 12:00 - 13:00 | **Mittagspause**                               |             |             |
| 13:00 - 14:30 | NgModule -> Standalone Migration (Hands-on)    | Workshop    | step-02     |
| 14:30 - 14:45 | **Pause**                                      |             |             |
| 14:45 - 16:00 | Übung: Eigene Komponenten migrieren           | Übung      | step-02     |
| 16:00 - 16:30 | Tagesrückblick & Q&A                          | Diskussion  | --          |

**Detailplanung:**

**09:00 - 09:30 -- Vorstellung & Setup-Check**
- Vorstellungsrunde: Name, Rolle, Angular-Erfahrung, Erwartungen an den Workshop
- Setup-Check-Script ausführen lassen
- Bei Problemen: Teilnehmer mit funktionierendem Setup helfen Nachbarn (Pair-Setup)
- Erwartungen auf Whiteboard/Flipchart sammeln

**09:30 - 10:30 -- Angular 21 Überblick**
- Folien: Angular Release-Historie (v14 -> v21 Zeitstrahl)
- Kernthemen vorstellen:
  - Standalone Components (seit v14, jetzt Default)
  - Signals (seit v16, jetzt stabil und empfohlen)
  - Zoneless Change Detection (seit v18 experimental, jetzt stabil)
  - Signal Forms (neu in v21)
  - Vitest als Default-Test-Runner (seit v20)
  - NgRx SignalStore als empfohlenes State Management
- Diskussion: Welche dieser Features nutzen die Teilnehmer bereits?

**10:45 - 12:00 -- Live-Coding: Projekt-Scaffold (step-01)**
- `ng new workshop-app --style=scss --routing --ssr=false`
- Projektstruktur erklären
- Erste Komponente erstellen
- Routing einrichten
- Angular DevTools zeigen
- **Wichtig:** Langsam tippen, jeden Schritt erklären, Teilnehmer sollen mitmachen

**13:00 - 14:30 -- NgModule -> Standalone Migration (step-02)**
- Theorie: Warum Standalone? (Tree-Shaking, Lazy Loading, Einfachheit)
- `ng generate @angular/core:standalone` Schematic zeigen
- Manuell Schritt für Schritt migrieren:
  1. `standalone: true` in Komponenten setzen
  2. `imports` Array in Komponenten statt in Modulen
  3. `bootstrapApplication()` statt `platformBrowserDynamic().bootstrapModule()`
  4. `provideRouter()` statt `RouterModule.forRoot()`
  5. Module entfernen
- Hands-on: Teilnehmer migrieren vorbereitete Beispiel-Komponenten

**14:45 - 16:00 -- Übung**
- Teilnehmer migrieren eigenständig 3-5 weitere Komponenten
- Trainer geht herum und unterstützt individuell
- Fortgeschrittene: Lazy-Loading der migrierten Komponenten einrichten

---

### Tag 2: Reactivity Revolution

**Lernziele:** Teilnehmer beherrschen Signals als primäres Reactivity-Modell und können die Applikation zoneless betreiben.

| Zeit          | Thema                                              | Typ         | Branch/Step |
| ------------- | -------------------------------------------------- | ----------- | ----------- |
| 09:00 - 10:30 | Signals Deep Dive: signal(), computed(), effect()  | Vortrag+Code | step-03    |
| 10:30 - 10:45 | **Pause**                                          |             |             |
| 10:45 - 12:00 | Live-Coding: Feature-Komponenten mit Signals       | Live-Coding | step-03     |
| 12:00 - 13:00 | **Mittagspause**                                   |             |             |
| 13:00 - 14:30 | Zoneless Change Detection: Theorie & Praxis        | Workshop    | step-04     |
| 14:30 - 14:45 | **Pause**                                          |             |             |
| 14:45 - 16:00 | Übung: Zone.js-Abhängigkeiten identifizieren     | Übung      | step-04     |
| 16:00 - 16:30 | Tagesrückblick & Q&A                              | Diskussion  | --          |

**Detailplanung:**

**09:00 - 10:30 -- Signals Deep Dive (step-03)**
- Theorie: Push vs. Pull Reactivity
- `signal()` -- Grundlagen und Typen
  - WritableSignal, ReadonlySignal
  - `.set()`, `.update()`, `.mutate()` (falls noch vorhanden)
- `computed()` -- Abgeleitete Werte
  - Lazy Evaluation erklären
  - Abhängigkeitsgraph zeichnen (Whiteboard)
- `effect()` -- Seiteneffekte
  - Wann verwenden, wann vermeiden
  - Cleanup-Funktion
  - `untracked()` für bewusste Nicht-Tracking
- `input()` und `output()` -- Signal-basierte Component API
  - `input<string>()` statt `@Input()`
  - `input.required<string>()` für Pflichtfelder
  - `output()` statt `@Output()`
  - `model()` für Two-Way Binding
- Live-Vergleich: Vorher (RxJS/Decorator) vs. Nachher (Signals)

**10:45 - 12:00 -- Live-Coding: Feature-Komponenten**
- Produktliste mit `signal()` für den State
- Filter-Komponente mit `computed()` für gefilterte Ergebnisse
- Warenkorb mit `effect()` für localStorage-Persistenz
- Kommunikation zwischen Komponenten über `input()`/`output()`

**13:00 - 14:30 -- Zoneless Change Detection (step-04)**
- Theorie:
  - Wie Zone.js funktioniert (Monkey-Patching, Zones)
  - Warum das problematisch ist (Performance, Bundle-Size, Debugging)
  - Wie Angular ohne Zone.js Change Detection triggert (Signal-basiert)
- Praxis:
  - `provideExperimentalZonelessChangeDetection()` -> `provideZonelessChangeDetection()`
  - Zone.js aus `angular.json` und `polyfills` entfernen
  - `ChangeDetectionStrategy.OnPush` als Default setzen
  - Typische Probleme: `setTimeout`, `setInterval`, `addEventListener` -- was bricht?
- Debugging: Angular DevTools Profiler für Change Detection Zyklen

**14:45 - 16:00 -- Übung: Zone.js Migration**
- Teilnehmer bekommen eine App mit Zone.js-Abhängigkeiten
- Aufgabe: Alle `setTimeout`/`setInterval` durch Signal-basierte Alternativen ersetzen
- Alle manuellen DOM-Events durch Angular-Events oder `afterRender` ersetzen
- Zone.js entfernen und App zum Laufen bringen

---

### Tag 3: State Management & Testing

**Lernziele:** Teilnehmer können NgRx SignalStore für Feature-State einsetzen und Tests mit Vitest schreiben.

| Zeit          | Thema                                          | Typ         | Branch/Step |
| ------------- | ---------------------------------------------- | ----------- | ----------- |
| 09:00 - 10:30 | NgRx SignalStore Architektur                   | Vortrag+Code | step-05    |
| 10:30 - 10:45 | **Pause**                                      |             |             |
| 10:45 - 12:00 | Live-Coding: 10 Feature-Stores implementieren  | Live-Coding | step-05     |
| 12:00 - 13:00 | **Mittagspause**                               |             |             |
| 13:00 - 14:00 | Mock API & HTTP Services                       | Workshop    | step-06     |
| 14:00 - 14:15 | **Pause**                                      |             |             |
| 14:15 - 15:30 | Vitest Migration & Testing Patterns            | Workshop    | step-07     |
| 15:30 - 16:00 | Übung: Eigene Store-Tests schreiben           | Übung      | step-07     |
| 16:00 - 16:30 | Tagesrückblick & Q&A                          | Diskussion  | --          |

**Detailplanung:**

**09:00 - 10:30 -- NgRx SignalStore (step-05)**
- Vergleich: Classic NgRx Store vs. SignalStore
  - Weniger Boilerplate, kein Actions/Reducers/Effects-Pattern
  - Signal-basiert statt Observable-basiert
- SignalStore Konzepte:
  - `signalStore()` -- Store Definition
  - `withState()` -- Initial State
  - `withComputed()` -- Abgeleitete Werte
  - `withMethods()` -- Mutationen und Seiteneffekte
  - `withEntities()` -- Entity Management
  - `withHooks()` -- Lifecycle Hooks (onInit, onDestroy)
  - `patchState()` -- Immutable Updates
- Custom Store Features:
  - `withRequestStatus()` -- Loading/Error/Success Pattern
  - `withLogger()` -- Debugging

**10:45 - 12:00 -- Live-Coding: Feature-Stores**
- 10 Stores implementieren (jeweils ca. 7 Minuten):
  1. `ProductStore` -- Produktkatalog mit Entities
  2. `CartStore` -- Warenkorb mit berechneten Summen
  3. `UserStore` -- Authentifizierung und Profil
  4. `CategoryStore` -- Kategorien-Hierarchie
  5. `SearchStore` -- Suchfilter und Ergebnisse
  6. `OrderStore` -- Bestellungen mit Status-Tracking
  7. `NotificationStore` -- Toast-Messages
  8. `ThemeStore` -- Dark/Light Mode
  9. `PaginationStore` -- Wiederverwendbare Pagination
  10. `FormStore` -- Formular-State Management
- Dabei zeigen: Wie Stores miteinander kommunizieren

**13:00 - 14:00 -- Mock API & HTTP Services (step-06)**
- `json-server` oder eigene Mock-API aufsetzen
- `HttpClient` mit `provideHttpClient(withInterceptorsFromDi())`
- Interceptoren für:
  - Auth-Token
  - Error-Handling
  - Loading-State
- Functional Interceptors (neue API)
- Integration mit SignalStore: `rxMethod` und `tapResponse`

**14:15 - 15:30 -- Vitest Migration (step-07)**
- Warum Vitest statt Karma/Jest?
  - Schneller (ESM-nativ, kein Browser nötig)
  - Bessere DX (Watch-Mode, UI)
  - Angular CLI 21 Default
- Migration:
  - Karma-Konfiguration entfernen
  - Vitest-Konfiguration anlegen
  - Test-Dateien anpassen (minimale Änderungen)
- Testing Patterns:
  - Component Testing mit `TestBed`
  - Store Testing (isoliert)
  - Service Testing mit HTTP-Mocks
  - Signal Testing: `TestBed.flushEffects()`
- Vitest UI zeigen: `npx vitest --ui`

---

### Tag 4: Forms & Accessibility

**Lernziele:** Teilnehmer können Signal Forms einsetzen und barrierefreie Komponenten entwickeln.

| Zeit          | Thema                                          | Typ         | Branch/Step |
| ------------- | ---------------------------------------------- | ----------- | ----------- |
| 09:00 - 10:30 | Signal Forms vs Reactive Forms                 | Vortrag+Code | step-08    |
| 10:30 - 10:45 | **Pause**                                      |             |             |
| 10:45 - 12:00 | Live-Coding: Checkout & Task Forms             | Live-Coding | step-08     |
| 12:00 - 13:00 | **Mittagspause**                               |             |             |
| 13:00 - 14:30 | Angular Aria & WAI-ARIA Patterns               | Workshop    | step-09     |
| 14:30 - 14:45 | **Pause**                                      |             |             |
| 14:45 - 16:00 | Übung: Barrierefreie Komponenten erstellen    | Übung      | step-09     |
| 16:00 - 16:30 | Tagesrückblick & Q&A                          | Diskussion  | --          |

**Detailplanung:**

**09:00 - 10:30 -- Signal Forms (step-08)**
- Vergleich: Template-Driven vs Reactive Forms vs Signal Forms
- Signal Forms API:
  - `SignalFormControl` -- Einzelnes Feld
  - `SignalFormGroup` -- Grupierung
  - `SignalFormArray` -- Dynamische Listen
  - Validierung als Signal-basierte Pipelines
  - Async Validation mit Signals
- Vorteile:
  - Kein Subscription-Management
  - Typ-sicher ohne Workarounds
  - Bessere Performance durch granulare Updates
  - Einfacheres Testing

**10:45 - 12:00 -- Live-Coding: Forms**
- Checkout-Formular (Adresse, Zahlung, Bestätigung):
  - Multi-Step Form mit Signal-basiertem State
  - Dynamische Validierung (PLZ-Abhängigkeit von Land)
  - Conditional Fields (Firmenadresse nur bei Geschäftskunden)
- Task-Formular:
  - FormArray: Dynamische Subtask-Liste
  - Drag & Drop Sortierung (CDK)
  - Auto-Save mit `effect()` und Debounce

**13:00 - 14:30 -- Accessibility (step-09)**
- WAI-ARIA Grundlagen:
  - Rollen, Zustände, Eigenschaften
  - Landmark Regions
  - Live Regions für dynamische Inhalte
- Angular CDK A11y Modul:
  - `FocusTrap` -- Modale Dialoge
  - `LiveAnnouncer` -- Screen Reader Benachrichtigungen
  - `FocusMonitor` -- Focus-Ursprung erkennen
  - `ListKeyManager` -- Tastaturnavigation in Listen
- Praktische Patterns:
  - Barrierefreie Tabs
  - Barrierefreie Dropdown-Menus
  - Skip-Links
  - Formulare mit korrekten Labels und Fehlermeldungen
- Tools:
  - axe DevTools (Chrome Extension)
  - Lighthouse Accessibility Audit
  - Screen Reader Demo (VoiceOver / NVDA)

**14:45 - 16:00 -- Übung: Barrierefreiheit**
- Teilnehmer erhalten eine Komponente mit Accessibility-Mängeln
- Aufgabe: Alle axe-Violations fixen
- Tastaturnavigation implementieren
- Screen Reader Kompatibilität sicherstellen

---

### Tag 5: Production & Wrap-Up

**Lernziele:** Teilnehmer können eine Angular 21 App produktionsreif machen und wissen, wie sie bestehende Projekte migrieren.

| Zeit          | Thema                                          | Typ         | Branch/Step |
| ------------- | ---------------------------------------------- | ----------- | ----------- |
| 09:00 - 10:30 | CI/CD Pipeline & Production Build              | Vortrag+Code | step-10    |
| 10:30 - 10:45 | **Pause**                                      |             |             |
| 10:45 - 12:00 | Migration Checklists Review & Praxis           | Workshop    | --          |
| 12:00 - 13:00 | **Mittagspause**                               |             |             |
| 13:00 - 15:00 | Abschlussprojekt: Eigenes Feature              | Projekt     | --          |
| 15:00 - 15:15 | **Pause**                                      |             |             |
| 15:15 - 16:00 | Präsentation der Teilnehmer-Projekte          | Präsentationen | --      |
| 16:00 - 16:30 | Feedback, nächste Schritte, Nachbereitung     | Diskussion  | --          |

**Detailplanung:**

**09:00 - 10:30 -- CI/CD & Production Build (step-10)**
- Angular Build-Optimierungen:
  - `ng build --configuration production`
  - Budget-Limits in `angular.json`
  - Bundle-Analyse mit `source-map-explorer`
  - Deferred Loading (`@defer`) für grosse Komponenten
- CI/CD Pipeline (GitHub Actions):
  - Lint -> Test -> Build -> Deploy
  - Caching von `node_modules` und `.angular/cache`
  - Parallelisierung von Lint und Test
  - Environment-spezifische Builds
- Docker-Setup (optional):
  - Multi-Stage Build
  - nginx-Konfiguration für SPA-Routing
- Performance-Monitoring:
  - Core Web Vitals erklären
  - Lighthouse CI in Pipeline integrieren

**10:45 - 12:00 -- Migration Checklists**
- Konsolidierte Checkliste für die Migration eines bestehenden Projekts:
  1. Angular CLI Update (`ng update`)
  2. TypeScript-Version aktualisieren
  3. Standalone Migration
  4. Signal-Migration (RxJS -> Signals wo sinnvoll)
  5. Zone.js entfernen
  6. Vitest Migration
  7. Signal Forms Migration
  8. Accessibility Audit
  9. CI/CD anpassen
  10. Performance Baseline messen
- Diskussion: Teilnehmer besprechen ihre konkreten Migrations-Szenarien
- Best Practices: Schrittweise Migration, Feature-Flags, Parallel-Betrieb

**13:00 - 15:00 -- Abschlussprojekt**
- Jeder Teilnehmer (oder 2er-Team) implementiert ein Feature nach Wahl:
  - Vorschläge: Dashboard-Widget, Admin-Bereich, Reporting-Ansicht, Chat-Komponente
  - Muss mindestens enthalten:
    - Standalone Components
    - Signals für State
    - Mindestens einen SignalStore
    - Signal Forms oder interaktive UI
    - Mindestens 2 Tests mit Vitest
    - Grundlegende Barrierefreiheit
- Trainer steht für Fragen zur Verfügung
- Fortgeschrittene können Zoneless und CI/CD integrieren

**15:15 - 16:00 -- Präsentationen**
- Jeder Teilnehmer/Team präsentiert kurz (3-5 Minuten):
  - Was wurde gebaut?
  - Welche Patterns wurden verwendet?
  - Was war die größte Herausforderung?
- Konstruktives Feedback von Trainer und Gruppe

**16:00 - 16:30 -- Abschluss**
- Feedback-Formulare ausfüllen lassen (digital oder Papier)
- Nächste Schritte und Ressourcen
- Zugang zum Repository und Nachbereitungsdokument
- Kontaktdaten für Rückfragen

---

## 3. Didaktische Hinweise

### 3.1 Live-Coding Best Practices

**Vorbereitung:**
- Alle Live-Coding-Sessions vorher mindestens einmal durchspielen
- VS Code Profil "Workshop" anlegen mit größerer Schrift (18-20px) und reduzierter UI
- Snippet-Dateien vorbereiten für häufig benötigte Code-Blöcke
- Terminal-Schriftgröße ebenfalls anpassen (16-18px)
- Zwei VS Code Fenster vorbereiten: eines für den fertigen Code (Spickzettel), eines für Live-Coding

**Während des Codings:**
- Langsam tippen -- Teilnehmer müssen mitlesen können
- Jeden Schritt verbal erklären, bevor getippt wird
- Regelmäßig fragen: "Kommt jeder mit?" / "Soll ich etwas wiederholen?"
- Bei Fehlern: Bewusst den Debugging-Prozess zeigen, nicht sofort korrigieren
- Alle 15-20 Minuten kurz innehalten und Fragen zulassen
- Browser und Terminal nebeneinander zeigen (Split Screen)

**Typische Fehler bewusst einbauen:**
- Import vergessen -> zeigt die Fehlermeldung und wie man sie liest
- Falschen Typ verwenden -> zeigt TypeScript-Hilfe
- Signal nicht korrekt updaten -> zeigt das Debugging

### 3.2 Häufige Teilnehmer-Fragen und Antworten

**Q: "Müssen wir jetzt komplett auf Signals umsteigen? Was ist mit RxJS?"**
A: Nein, RxJS bleibt ein vollwertiges Tool in Angular. Signals und RxJS ergänzen sich. Faustregeln:
- Signals für synchronen State und UI-State
- RxJS für asynchrone Streams, Events, komplexe Transformationen
- `toSignal()` und `toObservable()` als Brücken
- Schrittweise Migration, kein Big Bang

**Q: "Ist Zoneless schon produktionsreif?"**
A: In Angular 21 ist Zoneless stabil. Für Produktionsprojekte empfohlen, aber sorgfältige Migration nötig. Zone.js-abhängiger Code (z.B. Third-Party Libraries) muss geprüft werden.

**Q: "Warum SignalStore statt normalem NgRx Store?"**
A: SignalStore ist für neue Projekte und Feature-State empfohlen. Der klassische NgRx Store bleibt für grosse Enterprise-Apps mit komplexem State-Management relevant. Koexistenz ist möglich und empfohlen bei schrittweiser Migration.

**Q: "Wie teste ich Signal-basierte Komponenten?"**
A: `TestBed` funktioniert weiterhin. Neu: `TestBed.flushEffects()` um Effects auszulösen. Signals können direkt gelesen werden ohne `async`/`fakeAsync`. Vitest ist deutlich schneller als Karma.

**Q: "Was passiert mit Template-Driven Forms?"**
A: Template-Driven Forms bleiben verfügbar. Signal Forms sind ein neues drittes Modell, kein Ersatz. Für einfache Formulare sind Template-Driven Forms weiterhin OK.

**Q: "Lohnt sich die Migration für ein Projekt, das in 6 Monaten abgelöst wird?"**
A: Nein. Migration lohnt sich für Projekte mit > 12 Monaten Lebenserwartung. Für kurzlebige Projekte: nur kritische Sicherheitsupdates.

### 3.3 Schwierigkeitsgrade pro Thema

| Thema                    | Schwierigkeit | Typische Stolpersteine                        |
| ------------------------ | ------------- | --------------------------------------------- |
| Standalone Migration     | Mittel        | Circular Dependencies bei Modul-Auflösung    |
| Signals Grundlagen       | Leicht        | `computed()` vs `effect()` Abgrenzung         |
| Signal Input/Output      | Leicht        | Umgewöhnung von Decorators                    |
| Zoneless                 | Schwer        | Third-Party Libraries, setTimeout-Pattern      |
| NgRx SignalStore         | Mittel-Schwer | `withEntities()`, Custom Features             |
| Mock API                 | Leicht        | CORS-Probleme bei externen APIs               |
| Vitest Migration         | Leicht        | Wenige Anpassungen nötig                     |
| Signal Forms             | Mittel        | Neue API, mentale Umstellung                  |
| Accessibility            | Mittel        | Oft unterschätzt, braucht Geduld             |
| CI/CD                    | Mittel        | Umgebungsspezifisch, schwer zu verallgemeinern |

### 3.4 Umgang mit gemischten Skill-Levels

**Strategie: "Dreischichten-Modell"**

1. **Basis-Aufgabe:** Muss jeder schaffen. Klar strukturiert, Schritt-für-Schritt Anleitung.
2. **Erweiterung:** Für schnellere Teilnehmer. Offener formuliert, erfordert eigenes Nachdenken.
3. **Challenge:** Für Fortgeschrittene. Nur Problemstellung, keine Hinweise.

**Konkrete Maßnahmen:**
- Pair Programming bei Übungen: Stärkere mit Schwächeren zusammensetzen
- "Parking Lot" auf dem Whiteboard für fortgeschrittene Fragen, die später beantwortet werden
- Bonus-Material in jedem Step-Branch für schnelle Teilnehmer
- Niemals jemanden blossstellen -- Fragen sind immer willkommen
- Bei großem Gefälle: Fortgeschrittene als "Mentoren" einsetzen

---

## 4. Übungsaufgaben pro Tag

### Tag 1: Fundamentals & Migration

**Übung 1.1 -- Standalone Migration (Basis)**
> Migriere die drei vorgegebenen Komponenten (`HeaderComponent`, `FooterComponent`, `SidebarComponent`) von NgModule-basiert auf Standalone. Stelle sicher, dass die App weiterhin korrekt baut und alle Tests gruen sind.

**Übung 1.2 -- Routing Migration (Erweiterung)**
> Ersetze `RouterModule.forRoot()` durch `provideRouter()` mit Lazy Loading. Erstelle mindestens zwei Lazy-Loaded Routes.

**Übung 1.3 -- Volle Migration (Challenge)**
> Entferne alle verbleibenden NgModules aus dem Projekt. Die App darf keine Module mehr enthalten. Bonus: Implementiere Route Guards als funktionale Guards.

---

### Tag 2: Reactivity Revolution

**Übung 2.1 -- Signals Basics (Basis)**
> Ersetze in der `ProductListComponent` alle `@Input()` Decorators durch `input()` und alle `@Output()` durch `output()`. Verwende `signal()` für den lokalen State und `computed()` für die gefilterte Produktliste.

**Übung 2.2 -- Effect & Computed (Erweiterung)**
> Implementiere einen Warenkorb, der seinen Inhalt per `effect()` in `localStorage` persistiert. Berechne Zwischensumme, Steuern und Gesamtpreis als `computed()` Signals.

**Übung 2.3 -- Zoneless Migration (Challenge)**
> Entferne Zone.js komplett aus der Applikation. Identifiziere und ersetze alle Zone.js-abhängigen Patterns (`setTimeout`, `setInterval`, Event Listener). Die App muss ohne Zone.js korrekt rendern und auf Benutzerinteraktionen reagieren.

---

### Tag 3: State Management & Testing

**Übung 3.1 -- SignalStore Basics (Basis)**
> Erstelle einen `TodoStore` mit folgenden Features: Todo-Liste laden, Todo hinzufügen, Todo als erledigt markieren, erledigte Todos zählen (computed).

**Übung 3.2 -- Store mit HTTP (Erweiterung)**
> Erweitere den `TodoStore` um HTTP-Kommunikation mit der Mock API. Implementiere Loading-State und Error-Handling. Verwende `rxMethod` für die HTTP-Aufrufe.

**Übung 3.3 -- Store Testing (Challenge)**
> Schreibe umfassende Vitest-Tests für deinen Store: Unit-Tests für jede Methode, Tests für Computed Values, Tests mit gemocktem HTTP-Client. Erreichtes Ziel: 90%+ Code Coverage für den Store.

---

### Tag 4: Forms & Accessibility

**Übung 4.1 -- Signal Form (Basis)**
> Erstelle ein Kontaktformular mit Signal Forms: Name (required, min 2 Zeichen), E-Mail (required, Email-Validator), Nachricht (required, min 10 Zeichen). Zeige Validierungsfehler an.

**Übung 4.2 -- Dynamisches Formular (Erweiterung)**
> Erweitere das Formular um ein dynamisches `FormArray` für Telefonnummern. Der Benutzer soll beliebig viele Telefonnummern hinzufügen und entfernen können. Jede Nummer hat einen Typ (Mobil, Festnetz, Arbeit).

**Übung 4.3 -- Accessibility Audit (Challenge)**
> Fuehre einen vollständigen Accessibility-Audit der bestehenden App durch. Verwende axe DevTools und Lighthouse. Behebe alle gefundenen Violations. Implementiere Tastaturnavigation für die Produktliste und den Warenkorb. Teste mit einem Screen Reader.

---

### Tag 5: Production & Wrap-Up

**Übung 5.1 -- Build Optimierung (Basis)**
> Konfiguriere Budget-Limits in `angular.json`. Analysiere das Bundle mit `source-map-explorer`. Identifiziere die größten Abhängigkeiten.

**Übung 5.2 -- CI Pipeline (Erweiterung)**
> Erstelle eine GitHub Actions Pipeline, die bei jedem Push Lint, Test und Build ausführt. Konfiguriere Caching für `node_modules`.

**Übung 5.3 -- Abschlussprojekt (Challenge)**
> Implementiere ein vollständiges Feature mit allen Workshop-Patterns: Standalone Components, Signals, SignalStore, Signal Forms, Tests, Accessibility. Präsentiere das Ergebnis der Gruppe.

---

## 5. Notfall-Plan

### 5.1 Build schlägt fehl

**Problem:** `ng build` oder `ng serve` schlägt bei einem Teilnehmer fehl.

**Sofort-Maßnahme:**
```bash
# Pre-built Branch auschecken
git stash
git checkout step-XX-solution
npm install
ng serve
```

**Alle Solution-Branches sind getestet und funktionsfähig.**

Liegt das Problem am eigenen Code des Teilnehmers:
1. Fehler gemeinsam analysieren (Lerneffekt!)
2. Falls zu komplex: Solution-Branch verwenden und im Nachgang debuggen
3. Diff zwischen eigenem Branch und Solution zeigen: `git diff step-XX..step-XX-solution`

### 5.2 npm install schlägt fehl

**Problem:** Netzwerkprobleme, Proxy, Firewall blockieren npm.

**Sofort-Maßnahme:**
```bash
# Option 1: Offline-Backup von USB/Netzlaufwerk
cp -r /backup/node_modules ./node_modules

# Option 2: npm-Cache vom Trainer-Rechner
npm cache ls  # Prüfen ob Cache vorhanden
npm install --prefer-offline

# Option 3: Verdaccio lokaler Registry Mirror
# (vorab auf Trainer-Laptop einrichten)
npm set registry http://trainer-laptop:4873
npm install
```

**Vorbereitung:**
- USB-Stick mit `node_modules` (gezippt, ca. 500 MB) für jede Step-Branch
- Verdaccio auf Trainer-Laptop vorinstalliert als lokaler npm Mirror
- Alternativ: `npm pack` für alle benötigten Pakete

### 5.3 IDE-Probleme

**Problem:** VS Code startet nicht, Extensions fehlen, Performance-Probleme.

**Sofort-Maßnahme:**
- **StackBlitz:** https://stackblitz.com -- Angular-Projekte direkt im Browser
- **CodeSandbox:** https://codesandbox.io -- Alternative
- **GitHub Codespaces:** Falls Firmen-Account vorhanden
- **Trainer-Rechner:** Im Notfall kann der Teilnehmer am Trainer-Laptop mitarbeiten

**Vorbereitung:**
- StackBlitz-Links für jede Step-Branch vorbereiten
- Getestete Codespace-Konfiguration im Repository (`.devcontainer/devcontainer.json`)

### 5.4 Git-Probleme

**Problem:** Merge-Konflikte, falsche Branch, verlorene Änderungen.

**Sofort-Maßnahme:**
```bash
# Aktuellen Stand sichern
git stash

# Sauberen Branch auschecken
git checkout -b teilnehmer-backup
git stash pop
git add -A && git commit -m "Backup"

# Gewünschten Step-Branch auschecken
git checkout step-XX
```

### 5.5 Timing-Probleme

**Problem:** Ein Thema dauert länger als geplant.

**Strategie:**
- **Kürzbar:** Accessibility-Theorie (Tag 4) kann gekürzt werden, wenn Grundlagen bekannt
- **Kürzbar:** CI/CD Details (Tag 5) -- Checkliste statt Live-Demo
- **Verschiebbar:** Mock API (Tag 3) kann als Selbststudium-Material gegeben werden
- **Nicht kürzbar:** Signals Deep Dive (Tag 2) -- Kernthema des Workshops
- **Nicht kürzbar:** Abschlussprojekt (Tag 5) -- Wichtig für Praxis-Transfer

**Puffer-Zeiten:** Jeder Tag hat 30 Minuten Puffer im Q&A-Block, die für Überziehungen genutzt werden können.

### 5.6 Teilnehmer mit Schwierigkeiten

**Problem:** Ein Teilnehmer kommt nicht mit, blockiert den Fortschritt.

**Maßnahmen:**
1. Pair Programming mit fortgeschrittenem Teilnehmer
2. Solution-Branch bereitstellen, damit der Teilnehmer aufschließen kann
3. Separate Erklärung in der Pause anbieten
4. Bei grundlegenden Wissensluecken: Angular-Grundlagen-Ressourcen zur Verfügung stellen

---

## 6. Nachbereitung

### 6.1 Nachbereitungsdokument

Das Nachbereitungsdokument wird innerhalb von **3 Werktagen** nach dem Workshop verschickt und enthält:

**Inhalt:**
1. **Zusammenfassung** jedes Workshop-Tags mit Kernaussagen
2. **Code-Referenzen** -- Links zu allen Step-Branches im Repository
3. **Checklisten**
   - Standalone Migration Checkliste
   - Signal Migration Checkliste
   - Zoneless Migration Checkliste
   - Vitest Migration Checkliste
   - Accessibility Audit Checkliste
   - Production Readiness Checkliste
4. **FAQ** -- Gesammelte Fragen aus dem Workshop mit ausführlichen Antworten
5. **Weitergehende Ressourcen**
   - Offizielle Angular Dokumentation
   - Angular Blog
   - NgRx Dokumentation
   - WAI-ARIA Authoring Practices
   - Empfohlene Konferenz-Talks
6. **Kontaktinformationen** für Rückfragen
7. **Feedback-Link** (falls nicht vor Ort ausgefuellt)

**Format:** PDF und Markdown (im Repository)

### 6.2 Repository-Zugang

**Während des Workshops:**
- Alle Teilnehmer haben Lese- und Schreibzugang zu ihrem Fork
- Solution-Branches sind nur für den Trainer sichtbar

**Nach dem Workshop:**
- Solution-Branches werden für alle Teilnehmer freigeschaltet
- Repository bleibt mindestens **6 Monate** erreichbar
- Teilnehmer erhalten eine E-Mail mit:
  - Repository-URL
  - Branch-Übersicht
  - Installationsanleitung für spätere Nutzung
  - Hinweis auf mögliche API-Änderungen bei zukuenftigen Angular-Updates

**Repository-Archivierung:**
```bash
# Nach 6 Monaten: Repository archivieren (read-only)
# Vorher: Teilnehmer informieren und Empfehlung zum Forken geben
```

### 6.3 Feedback-Erhebung

**Vor Ort (Tag 5, 16:00-16:30):**
- Digitales Formular (Google Forms oder Microsoft Forms)
- Alternativ: Papier-Fragebogen

**Fragen:**
1. Gesamtbewertung (1-5 Sterne)
2. Bewertung pro Tag (1-5 Sterne)
3. Tempo: zu langsam / genau richtig / zu schnell
4. Praxisnaehe: zu theoretisch / genau richtig / zu praktisch
5. Was war am hilfreichsten?
6. Was hat gefehlt?
7. Was würde ich ändern?
8. Würde ich den Workshop weiterempfehlen? (NPS)
9. Welche Themen wünscht sich der Teilnehmer für einen Aufbau-Workshop?
10. Freie Kommentare

**Nach dem Workshop (1 Woche später):**
- Kurze Follow-up E-Mail mit:
  - Nachbereitungsdokument
  - Bitte um Feedback auf LinkedIn/Xing (optional)
  - Angebot für 30-minütiges Follow-up-Gespräch bei Fragen
  - Hinweis auf weitere Workshop-Angebote

### 6.4 Eigene Nachbereitung (Trainer)

**Innerhalb von 1 Woche nach dem Workshop:**
- [ ] Feedback-Ergebnisse auswerten
- [ ] Nachbereitungsdokument erstellen und versenden
- [ ] Solution-Branches freischalten
- [ ] Notizen zu Verbesserungen für nächsten Workshop
- [ ] Probleme/Bugs im Workshop-Repository dokumentieren und fixen
- [ ] Timing-Anpassungen notieren (was hat länger/kürzer gedauert?)
- [ ] Neue FAQ-Eintraege aus Teilnehmer-Fragen ergänzen
- [ ] Workshop-Material bei Angular-Updates aktualisieren

---

> **Hinweis:** Dieses Dokument ist ein lebendes Dokument. Nach jedem Workshop-Durchlauf sollte es basierend auf den Erfahrungen aktualisiert werden.
