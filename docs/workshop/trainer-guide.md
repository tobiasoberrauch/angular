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
4. [Uebungsaufgaben pro Tag](#4-uebungsaufgaben-pro-tag)
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

Folgende Tools muessen **vor Workshop-Beginn** auf jedem Teilnehmer-Rechner installiert sein:

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

1. Repository klonen und alle Step-Branches pruefen:
   ```bash
   git clone <workshop-repo-url>
   cd angular-workshop
   git branch -a  # Alle step-XX Branches muessen vorhanden sein
   ```

2. Fuer jeden Step-Branch einmal `npm install` und `npm run build` ausfuehren, um sicherzustellen, dass alle Branches funktionsfaehig sind.

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

Jeder Branch enthaelt:
- `README.md` mit Aufgabenbeschreibung
- `SOLUTION.md` mit Loesungshinweisen (nur fuer Trainer sichtbar, in `.gitignore` der Teilnehmer-Forks)
- Vorkonfigurierte Dateien, damit Teilnehmer direkt starten koennen

### 1.4 Netzwerk- und Firewall-Ueberlegungen

**Benoetigte Domains (Whitelist fuer Firmennetzwerke):**

```
registry.npmjs.org          # npm Pakete
github.com                  # Repository
*.githubusercontent.com     # GitHub Assets
cdn.jsdelivr.net            # CDN fuer Libraries
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
4300  (alt dev server) -- Zweite Instanz falls noetig
9876  (Karma, falls Legacy-Tests gezeigt werden)
5173  (Vitest UI)
```

**Checkliste vor Ort:**

- [ ] WLAN-Zugang fuer alle Teilnehmer getestet
- [ ] Bandbreite ausreichend (mind. 10 Mbit/s pro Person fuer npm install)
- [ ] Proxy-Einstellungen dokumentiert (falls Firmennetzwerk)
- [ ] npm Proxy konfiguriert: `npm config set proxy http://proxy:port`
- [ ] Git Proxy konfiguriert: `git config --global http.proxy http://proxy:port`
- [ ] Beamer/Monitor-Anschluss getestet (HDMI, USB-C, DisplayPort)
- [ ] Schriftgroesse im Editor auf 18-20px fuer Beamer-Sichtbarkeit

---

## 2. Tagesablauf

### Tag 1: Fundamentals & Migration

**Lernziele:** Teilnehmer verstehen die Neuerungen in Angular 21 und koennen ein bestehendes NgModule-Projekt auf Standalone Components migrieren.

| Zeit          | Thema                                          | Typ         | Branch/Step |
| ------------- | ---------------------------------------------- | ----------- | ----------- |
| 09:00 - 09:30 | Vorstellung & Setup-Check                     | Interaktiv  | --          |
| 09:30 - 10:30 | Angular 21 Ueberblick: Was ist neu?            | Vortrag     | --          |
| 10:30 - 10:45 | **Pause**                                      |             |             |
| 10:45 - 12:00 | Live-Coding: Projekt-Scaffold                  | Live-Coding | step-01     |
| 12:00 - 13:00 | **Mittagspause**                               |             |             |
| 13:00 - 14:30 | NgModule -> Standalone Migration (Hands-on)    | Workshop    | step-02     |
| 14:30 - 14:45 | **Pause**                                      |             |             |
| 14:45 - 16:00 | Uebung: Eigene Komponenten migrieren           | Uebung      | step-02     |
| 16:00 - 16:30 | Tagesrueckblick & Q&A                          | Diskussion  | --          |

**Detailplanung:**

**09:00 - 09:30 -- Vorstellung & Setup-Check**
- Vorstellungsrunde: Name, Rolle, Angular-Erfahrung, Erwartungen an den Workshop
- Setup-Check-Script ausfuehren lassen
- Bei Problemen: Teilnehmer mit funktionierendem Setup helfen Nachbarn (Pair-Setup)
- Erwartungen auf Whiteboard/Flipchart sammeln

**09:30 - 10:30 -- Angular 21 Ueberblick**
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
- Projektstruktur erklaeren
- Erste Komponente erstellen
- Routing einrichten
- Angular DevTools zeigen
- **Wichtig:** Langsam tippen, jeden Schritt erklaeren, Teilnehmer sollen mitmachen

**13:00 - 14:30 -- NgModule -> Standalone Migration (step-02)**
- Theorie: Warum Standalone? (Tree-Shaking, Lazy Loading, Einfachheit)
- `ng generate @angular/core:standalone` Schematic zeigen
- Manuell Schritt fuer Schritt migrieren:
  1. `standalone: true` in Komponenten setzen
  2. `imports` Array in Komponenten statt in Modulen
  3. `bootstrapApplication()` statt `platformBrowserDynamic().bootstrapModule()`
  4. `provideRouter()` statt `RouterModule.forRoot()`
  5. Module entfernen
- Hands-on: Teilnehmer migrieren vorbereitete Beispiel-Komponenten

**14:45 - 16:00 -- Uebung**
- Teilnehmer migrieren eigenstaendig 3-5 weitere Komponenten
- Trainer geht herum und unterstuetzt individuell
- Fortgeschrittene: Lazy-Loading der migrierten Komponenten einrichten

---

### Tag 2: Reactivity Revolution

**Lernziele:** Teilnehmer beherrschen Signals als primaeres Reactivity-Modell und koennen die Applikation zoneless betreiben.

| Zeit          | Thema                                              | Typ         | Branch/Step |
| ------------- | -------------------------------------------------- | ----------- | ----------- |
| 09:00 - 10:30 | Signals Deep Dive: signal(), computed(), effect()  | Vortrag+Code | step-03    |
| 10:30 - 10:45 | **Pause**                                          |             |             |
| 10:45 - 12:00 | Live-Coding: Feature-Komponenten mit Signals       | Live-Coding | step-03     |
| 12:00 - 13:00 | **Mittagspause**                                   |             |             |
| 13:00 - 14:30 | Zoneless Change Detection: Theorie & Praxis        | Workshop    | step-04     |
| 14:30 - 14:45 | **Pause**                                          |             |             |
| 14:45 - 16:00 | Uebung: Zone.js-Abhaengigkeiten identifizieren     | Uebung      | step-04     |
| 16:00 - 16:30 | Tagesrueckblick & Q&A                              | Diskussion  | --          |

**Detailplanung:**

**09:00 - 10:30 -- Signals Deep Dive (step-03)**
- Theorie: Push vs. Pull Reactivity
- `signal()` -- Grundlagen und Typen
  - WritableSignal, ReadonlySignal
  - `.set()`, `.update()`, `.mutate()` (falls noch vorhanden)
- `computed()` -- Abgeleitete Werte
  - Lazy Evaluation erklaeren
  - Abhaengigkeitsgraph zeichnen (Whiteboard)
- `effect()` -- Seiteneffekte
  - Wann verwenden, wann vermeiden
  - Cleanup-Funktion
  - `untracked()` fuer bewusste Nicht-Tracking
- `input()` und `output()` -- Signal-basierte Component API
  - `input<string>()` statt `@Input()`
  - `input.required<string>()` fuer Pflichtfelder
  - `output()` statt `@Output()`
  - `model()` fuer Two-Way Binding
- Live-Vergleich: Vorher (RxJS/Decorator) vs. Nachher (Signals)

**10:45 - 12:00 -- Live-Coding: Feature-Komponenten**
- Produktliste mit `signal()` fuer den State
- Filter-Komponente mit `computed()` fuer gefilterte Ergebnisse
- Warenkorb mit `effect()` fuer localStorage-Persistenz
- Kommunikation zwischen Komponenten ueber `input()`/`output()`

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
- Debugging: Angular DevTools Profiler fuer Change Detection Zyklen

**14:45 - 16:00 -- Uebung: Zone.js Migration**
- Teilnehmer bekommen eine App mit Zone.js-Abhaengigkeiten
- Aufgabe: Alle `setTimeout`/`setInterval` durch Signal-basierte Alternativen ersetzen
- Alle manuellen DOM-Events durch Angular-Events oder `afterRender` ersetzen
- Zone.js entfernen und App zum Laufen bringen

---

### Tag 3: State Management & Testing

**Lernziele:** Teilnehmer koennen NgRx SignalStore fuer Feature-State einsetzen und Tests mit Vitest schreiben.

| Zeit          | Thema                                          | Typ         | Branch/Step |
| ------------- | ---------------------------------------------- | ----------- | ----------- |
| 09:00 - 10:30 | NgRx SignalStore Architektur                   | Vortrag+Code | step-05    |
| 10:30 - 10:45 | **Pause**                                      |             |             |
| 10:45 - 12:00 | Live-Coding: 10 Feature-Stores implementieren  | Live-Coding | step-05     |
| 12:00 - 13:00 | **Mittagspause**                               |             |             |
| 13:00 - 14:00 | Mock API & HTTP Services                       | Workshop    | step-06     |
| 14:00 - 14:15 | **Pause**                                      |             |             |
| 14:15 - 15:30 | Vitest Migration & Testing Patterns            | Workshop    | step-07     |
| 15:30 - 16:00 | Uebung: Eigene Store-Tests schreiben           | Uebung      | step-07     |
| 16:00 - 16:30 | Tagesrueckblick & Q&A                          | Diskussion  | --          |

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
- Interceptoren fuer:
  - Auth-Token
  - Error-Handling
  - Loading-State
- Functional Interceptors (neue API)
- Integration mit SignalStore: `rxMethod` und `tapResponse`

**14:15 - 15:30 -- Vitest Migration (step-07)**
- Warum Vitest statt Karma/Jest?
  - Schneller (ESM-nativ, kein Browser noetig)
  - Bessere DX (Watch-Mode, UI)
  - Angular CLI 21 Default
- Migration:
  - Karma-Konfiguration entfernen
  - Vitest-Konfiguration anlegen
  - Test-Dateien anpassen (minimale Aenderungen)
- Testing Patterns:
  - Component Testing mit `TestBed`
  - Store Testing (isoliert)
  - Service Testing mit HTTP-Mocks
  - Signal Testing: `TestBed.flushEffects()`
- Vitest UI zeigen: `npx vitest --ui`

---

### Tag 4: Forms & Accessibility

**Lernziele:** Teilnehmer koennen Signal Forms einsetzen und barrierefreie Komponenten entwickeln.

| Zeit          | Thema                                          | Typ         | Branch/Step |
| ------------- | ---------------------------------------------- | ----------- | ----------- |
| 09:00 - 10:30 | Signal Forms vs Reactive Forms                 | Vortrag+Code | step-08    |
| 10:30 - 10:45 | **Pause**                                      |             |             |
| 10:45 - 12:00 | Live-Coding: Checkout & Task Forms             | Live-Coding | step-08     |
| 12:00 - 13:00 | **Mittagspause**                               |             |             |
| 13:00 - 14:30 | Angular Aria & WAI-ARIA Patterns               | Workshop    | step-09     |
| 14:30 - 14:45 | **Pause**                                      |             |             |
| 14:45 - 16:00 | Uebung: Barrierefreie Komponenten erstellen    | Uebung      | step-09     |
| 16:00 - 16:30 | Tagesrueckblick & Q&A                          | Diskussion  | --          |

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
- Checkout-Formular (Adresse, Zahlung, Bestaetigung):
  - Multi-Step Form mit Signal-basiertem State
  - Dynamische Validierung (PLZ-Abhaengigkeit von Land)
  - Conditional Fields (Firmenadresse nur bei Geschaeftskunden)
- Task-Formular:
  - FormArray: Dynamische Subtask-Liste
  - Drag & Drop Sortierung (CDK)
  - Auto-Save mit `effect()` und Debounce

**13:00 - 14:30 -- Accessibility (step-09)**
- WAI-ARIA Grundlagen:
  - Rollen, Zustaende, Eigenschaften
  - Landmark Regions
  - Live Regions fuer dynamische Inhalte
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

**14:45 - 16:00 -- Uebung: Barrierefreiheit**
- Teilnehmer erhalten eine Komponente mit Accessibility-Maengeln
- Aufgabe: Alle axe-Violations fixen
- Tastaturnavigation implementieren
- Screen Reader Kompatibilitaet sicherstellen

---

### Tag 5: Production & Wrap-Up

**Lernziele:** Teilnehmer koennen eine Angular 21 App produktionsreif machen und wissen, wie sie bestehende Projekte migrieren.

| Zeit          | Thema                                          | Typ         | Branch/Step |
| ------------- | ---------------------------------------------- | ----------- | ----------- |
| 09:00 - 10:30 | CI/CD Pipeline & Production Build              | Vortrag+Code | step-10    |
| 10:30 - 10:45 | **Pause**                                      |             |             |
| 10:45 - 12:00 | Migration Checklists Review & Praxis           | Workshop    | --          |
| 12:00 - 13:00 | **Mittagspause**                               |             |             |
| 13:00 - 15:00 | Abschlussprojekt: Eigenes Feature              | Projekt     | --          |
| 15:00 - 15:15 | **Pause**                                      |             |             |
| 15:15 - 16:00 | Praesentation der Teilnehmer-Projekte          | Praesentationen | --      |
| 16:00 - 16:30 | Feedback, naechste Schritte, Nachbereitung     | Diskussion  | --          |

**Detailplanung:**

**09:00 - 10:30 -- CI/CD & Production Build (step-10)**
- Angular Build-Optimierungen:
  - `ng build --configuration production`
  - Budget-Limits in `angular.json`
  - Bundle-Analyse mit `source-map-explorer`
  - Deferred Loading (`@defer`) fuer grosse Komponenten
- CI/CD Pipeline (GitHub Actions):
  - Lint -> Test -> Build -> Deploy
  - Caching von `node_modules` und `.angular/cache`
  - Parallelisierung von Lint und Test
  - Environment-spezifische Builds
- Docker-Setup (optional):
  - Multi-Stage Build
  - nginx-Konfiguration fuer SPA-Routing
- Performance-Monitoring:
  - Core Web Vitals erklaeren
  - Lighthouse CI in Pipeline integrieren

**10:45 - 12:00 -- Migration Checklists**
- Konsolidierte Checkliste fuer die Migration eines bestehenden Projekts:
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
  - Vorschlaege: Dashboard-Widget, Admin-Bereich, Reporting-Ansicht, Chat-Komponente
  - Muss mindestens enthalten:
    - Standalone Components
    - Signals fuer State
    - Mindestens einen SignalStore
    - Signal Forms oder interaktive UI
    - Mindestens 2 Tests mit Vitest
    - Grundlegende Barrierefreiheit
- Trainer steht fuer Fragen zur Verfuegung
- Fortgeschrittene koennen Zoneless und CI/CD integrieren

**15:15 - 16:00 -- Praesentationen**
- Jeder Teilnehmer/Team praesentiert kurz (3-5 Minuten):
  - Was wurde gebaut?
  - Welche Patterns wurden verwendet?
  - Was war die groesste Herausforderung?
- Konstruktives Feedback von Trainer und Gruppe

**16:00 - 16:30 -- Abschluss**
- Feedback-Formulare ausfuellen lassen (digital oder Papier)
- Naechste Schritte und Ressourcen
- Zugang zum Repository und Nachbereitungsdokument
- Kontaktdaten fuer Rueckfragen

---

## 3. Didaktische Hinweise

### 3.1 Live-Coding Best Practices

**Vorbereitung:**
- Alle Live-Coding-Sessions vorher mindestens einmal durchspielen
- VS Code Profil "Workshop" anlegen mit groesserer Schrift (18-20px) und reduzierter UI
- Snippet-Dateien vorbereiten fuer haeufig benoetigte Code-Bloecke
- Terminal-Schriftgroesse ebenfalls anpassen (16-18px)
- Zwei VS Code Fenster vorbereiten: eines fuer den fertigen Code (Spickzettel), eines fuer Live-Coding

**Waehrend des Codings:**
- Langsam tippen -- Teilnehmer muessen mitlesen koennen
- Jeden Schritt verbal erklaeren, bevor getippt wird
- Regelmaessig fragen: "Kommt jeder mit?" / "Soll ich etwas wiederholen?"
- Bei Fehlern: Bewusst den Debugging-Prozess zeigen, nicht sofort korrigieren
- Alle 15-20 Minuten kurz innehalten und Fragen zulassen
- Browser und Terminal nebeneinander zeigen (Split Screen)

**Typische Fehler bewusst einbauen:**
- Import vergessen -> zeigt die Fehlermeldung und wie man sie liest
- Falschen Typ verwenden -> zeigt TypeScript-Hilfe
- Signal nicht korrekt updaten -> zeigt das Debugging

### 3.2 Haeufige Teilnehmer-Fragen und Antworten

**Q: "Muessen wir jetzt komplett auf Signals umsteigen? Was ist mit RxJS?"**
A: Nein, RxJS bleibt ein vollwertiges Tool in Angular. Signals und RxJS ergaenzen sich. Faustregeln:
- Signals fuer synchronen State und UI-State
- RxJS fuer asynchrone Streams, Events, komplexe Transformationen
- `toSignal()` und `toObservable()` als Bruecken
- Schrittweise Migration, kein Big Bang

**Q: "Ist Zoneless schon produktionsreif?"**
A: In Angular 21 ist Zoneless stabil. Fuer Produktionsprojekte empfohlen, aber sorgfaeltige Migration noetig. Zone.js-abhaengiger Code (z.B. Third-Party Libraries) muss geprueft werden.

**Q: "Warum SignalStore statt normalem NgRx Store?"**
A: SignalStore ist fuer neue Projekte und Feature-State empfohlen. Der klassische NgRx Store bleibt fuer grosse Enterprise-Apps mit komplexem State-Management relevant. Koexistenz ist moeglich und empfohlen bei schrittweiser Migration.

**Q: "Wie teste ich Signal-basierte Komponenten?"**
A: `TestBed` funktioniert weiterhin. Neu: `TestBed.flushEffects()` um Effects auszuloesen. Signals koennen direkt gelesen werden ohne `async`/`fakeAsync`. Vitest ist deutlich schneller als Karma.

**Q: "Was passiert mit Template-Driven Forms?"**
A: Template-Driven Forms bleiben verfuegbar. Signal Forms sind ein neues drittes Modell, kein Ersatz. Fuer einfache Formulare sind Template-Driven Forms weiterhin OK.

**Q: "Lohnt sich die Migration fuer ein Projekt, das in 6 Monaten abgeloest wird?"**
A: Nein. Migration lohnt sich fuer Projekte mit > 12 Monaten Lebenserwartung. Fuer kurzlebige Projekte: nur kritische Sicherheitsupdates.

### 3.3 Schwierigkeitsgrade pro Thema

| Thema                    | Schwierigkeit | Typische Stolpersteine                        |
| ------------------------ | ------------- | --------------------------------------------- |
| Standalone Migration     | Mittel        | Circular Dependencies bei Modul-Aufloesung    |
| Signals Grundlagen       | Leicht        | `computed()` vs `effect()` Abgrenzung         |
| Signal Input/Output      | Leicht        | Umgewoenung von Decorators                    |
| Zoneless                 | Schwer        | Third-Party Libraries, setTimeout-Pattern      |
| NgRx SignalStore         | Mittel-Schwer | `withEntities()`, Custom Features             |
| Mock API                 | Leicht        | CORS-Probleme bei externen APIs               |
| Vitest Migration         | Leicht        | Wenige Anpassungen noetig                     |
| Signal Forms             | Mittel        | Neue API, mentale Umstellung                  |
| Accessibility            | Mittel        | Oft unterschaetzt, braucht Geduld             |
| CI/CD                    | Mittel        | Umgebungsspezifisch, schwer zu verallgemeinern |

### 3.4 Umgang mit gemischten Skill-Levels

**Strategie: "Dreischichten-Modell"**

1. **Basis-Aufgabe:** Muss jeder schaffen. Klar strukturiert, Schritt-fuer-Schritt Anleitung.
2. **Erweiterung:** Fuer schnellere Teilnehmer. Offener formuliert, erfordert eigenes Nachdenken.
3. **Challenge:** Fuer Fortgeschrittene. Nur Problemstellung, keine Hinweise.

**Konkrete Massnahmen:**
- Pair Programming bei Uebungen: Staerkere mit Schwaecheren zusammensetzen
- "Parking Lot" auf dem Whiteboard fuer fortgeschrittene Fragen, die spaeter beantwortet werden
- Bonus-Material in jedem Step-Branch fuer schnelle Teilnehmer
- Niemals jemanden blossstellen -- Fragen sind immer willkommen
- Bei grossem Gefaelle: Fortgeschrittene als "Mentoren" einsetzen

---

## 4. Uebungsaufgaben pro Tag

### Tag 1: Fundamentals & Migration

**Uebung 1.1 -- Standalone Migration (Basis)**
> Migriere die drei vorgegebenen Komponenten (`HeaderComponent`, `FooterComponent`, `SidebarComponent`) von NgModule-basiert auf Standalone. Stelle sicher, dass die App weiterhin korrekt baut und alle Tests gruen sind.

**Uebung 1.2 -- Routing Migration (Erweiterung)**
> Ersetze `RouterModule.forRoot()` durch `provideRouter()` mit Lazy Loading. Erstelle mindestens zwei Lazy-Loaded Routes.

**Uebung 1.3 -- Volle Migration (Challenge)**
> Entferne alle verbleibenden NgModules aus dem Projekt. Die App darf keine Module mehr enthalten. Bonus: Implementiere Route Guards als funktionale Guards.

---

### Tag 2: Reactivity Revolution

**Uebung 2.1 -- Signals Basics (Basis)**
> Ersetze in der `ProductListComponent` alle `@Input()` Decorators durch `input()` und alle `@Output()` durch `output()`. Verwende `signal()` fuer den lokalen State und `computed()` fuer die gefilterte Produktliste.

**Uebung 2.2 -- Effect & Computed (Erweiterung)**
> Implementiere einen Warenkorb, der seinen Inhalt per `effect()` in `localStorage` persistiert. Berechne Zwischensumme, Steuern und Gesamtpreis als `computed()` Signals.

**Uebung 2.3 -- Zoneless Migration (Challenge)**
> Entferne Zone.js komplett aus der Applikation. Identifiziere und ersetze alle Zone.js-abhaengigen Patterns (`setTimeout`, `setInterval`, Event Listener). Die App muss ohne Zone.js korrekt rendern und auf Benutzerinteraktionen reagieren.

---

### Tag 3: State Management & Testing

**Uebung 3.1 -- SignalStore Basics (Basis)**
> Erstelle einen `TodoStore` mit folgenden Features: Todo-Liste laden, Todo hinzufuegen, Todo als erledigt markieren, erledigte Todos zaehlen (computed).

**Uebung 3.2 -- Store mit HTTP (Erweiterung)**
> Erweitere den `TodoStore` um HTTP-Kommunikation mit der Mock API. Implementiere Loading-State und Error-Handling. Verwende `rxMethod` fuer die HTTP-Aufrufe.

**Uebung 3.3 -- Store Testing (Challenge)**
> Schreibe umfassende Vitest-Tests fuer deinen Store: Unit-Tests fuer jede Methode, Tests fuer Computed Values, Tests mit gemocktem HTTP-Client. Erreichtes Ziel: 90%+ Code Coverage fuer den Store.

---

### Tag 4: Forms & Accessibility

**Uebung 4.1 -- Signal Form (Basis)**
> Erstelle ein Kontaktformular mit Signal Forms: Name (required, min 2 Zeichen), E-Mail (required, Email-Validator), Nachricht (required, min 10 Zeichen). Zeige Validierungsfehler an.

**Uebung 4.2 -- Dynamisches Formular (Erweiterung)**
> Erweitere das Formular um ein dynamisches `FormArray` fuer Telefonnummern. Der Benutzer soll beliebig viele Telefonnummern hinzufuegen und entfernen koennen. Jede Nummer hat einen Typ (Mobil, Festnetz, Arbeit).

**Uebung 4.3 -- Accessibility Audit (Challenge)**
> Fuehre einen vollstaendigen Accessibility-Audit der bestehenden App durch. Verwende axe DevTools und Lighthouse. Behebe alle gefundenen Violations. Implementiere Tastaturnavigation fuer die Produktliste und den Warenkorb. Teste mit einem Screen Reader.

---

### Tag 5: Production & Wrap-Up

**Uebung 5.1 -- Build Optimierung (Basis)**
> Konfiguriere Budget-Limits in `angular.json`. Analysiere das Bundle mit `source-map-explorer`. Identifiziere die groessten Abhaengigkeiten.

**Uebung 5.2 -- CI Pipeline (Erweiterung)**
> Erstelle eine GitHub Actions Pipeline, die bei jedem Push Lint, Test und Build ausfuehrt. Konfiguriere Caching fuer `node_modules`.

**Uebung 5.3 -- Abschlussprojekt (Challenge)**
> Implementiere ein vollstaendiges Feature mit allen Workshop-Patterns: Standalone Components, Signals, SignalStore, Signal Forms, Tests, Accessibility. Praesentiere das Ergebnis der Gruppe.

---

## 5. Notfall-Plan

### 5.1 Build schlaegt fehl

**Problem:** `ng build` oder `ng serve` schlaegt bei einem Teilnehmer fehl.

**Sofort-Massnahme:**
```bash
# Pre-built Branch auschecken
git stash
git checkout step-XX-solution
npm install
ng serve
```

**Alle Solution-Branches sind getestet und funktionsfaehig.**

Liegt das Problem am eigenen Code des Teilnehmers:
1. Fehler gemeinsam analysieren (Lerneffekt!)
2. Falls zu komplex: Solution-Branch verwenden und im Nachgang debuggen
3. Diff zwischen eigenem Branch und Solution zeigen: `git diff step-XX..step-XX-solution`

### 5.2 npm install schlaegt fehl

**Problem:** Netzwerkprobleme, Proxy, Firewall blockieren npm.

**Sofort-Massnahme:**
```bash
# Option 1: Offline-Backup von USB/Netzlaufwerk
cp -r /backup/node_modules ./node_modules

# Option 2: npm-Cache vom Trainer-Rechner
npm cache ls  # Pruefen ob Cache vorhanden
npm install --prefer-offline

# Option 3: Verdaccio lokaler Registry Mirror
# (vorab auf Trainer-Laptop einrichten)
npm set registry http://trainer-laptop:4873
npm install
```

**Vorbereitung:**
- USB-Stick mit `node_modules` (gezippt, ca. 500 MB) fuer jede Step-Branch
- Verdaccio auf Trainer-Laptop vorinstalliert als lokaler npm Mirror
- Alternativ: `npm pack` fuer alle benoetigten Pakete

### 5.3 IDE-Probleme

**Problem:** VS Code startet nicht, Extensions fehlen, Performance-Probleme.

**Sofort-Massnahme:**
- **StackBlitz:** https://stackblitz.com -- Angular-Projekte direkt im Browser
- **CodeSandbox:** https://codesandbox.io -- Alternative
- **GitHub Codespaces:** Falls Firmen-Account vorhanden
- **Trainer-Rechner:** Im Notfall kann der Teilnehmer am Trainer-Laptop mitarbeiten

**Vorbereitung:**
- StackBlitz-Links fuer jede Step-Branch vorbereiten
- Getestete Codespace-Konfiguration im Repository (`.devcontainer/devcontainer.json`)

### 5.4 Git-Probleme

**Problem:** Merge-Konflikte, falsche Branch, verlorene Aenderungen.

**Sofort-Massnahme:**
```bash
# Aktuellen Stand sichern
git stash

# Sauberen Branch auschecken
git checkout -b teilnehmer-backup
git stash pop
git add -A && git commit -m "Backup"

# Gewuenschten Step-Branch auschecken
git checkout step-XX
```

### 5.5 Timing-Probleme

**Problem:** Ein Thema dauert laenger als geplant.

**Strategie:**
- **Kuerzbar:** Accessibility-Theorie (Tag 4) kann gekuerzt werden, wenn Grundlagen bekannt
- **Kuerzbar:** CI/CD Details (Tag 5) -- Checkliste statt Live-Demo
- **Verschiebbar:** Mock API (Tag 3) kann als Selbststudium-Material gegeben werden
- **Nicht kuerzbar:** Signals Deep Dive (Tag 2) -- Kernthema des Workshops
- **Nicht kuerzbar:** Abschlussprojekt (Tag 5) -- Wichtig fuer Praxis-Transfer

**Puffer-Zeiten:** Jeder Tag hat 30 Minuten Puffer im Q&A-Block, die fuer Ueberziehungen genutzt werden koennen.

### 5.6 Teilnehmer mit Schwierigkeiten

**Problem:** Ein Teilnehmer kommt nicht mit, blockiert den Fortschritt.

**Massnahmen:**
1. Pair Programming mit fortgeschrittenem Teilnehmer
2. Solution-Branch bereitstellen, damit der Teilnehmer aufschliessen kann
3. Separate Erklaerung in der Pause anbieten
4. Bei grundlegenden Wissensluecken: Angular-Grundlagen-Ressourcen zur Verfuegung stellen

---

## 6. Nachbereitung

### 6.1 Nachbereitungsdokument

Das Nachbereitungsdokument wird innerhalb von **3 Werktagen** nach dem Workshop verschickt und enthaelt:

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
4. **FAQ** -- Gesammelte Fragen aus dem Workshop mit ausfuehrlichen Antworten
5. **Weitergehende Ressourcen**
   - Offizielle Angular Dokumentation
   - Angular Blog
   - NgRx Dokumentation
   - WAI-ARIA Authoring Practices
   - Empfohlene Konferenz-Talks
6. **Kontaktinformationen** fuer Rueckfragen
7. **Feedback-Link** (falls nicht vor Ort ausgefuellt)

**Format:** PDF und Markdown (im Repository)

### 6.2 Repository-Zugang

**Waehrend des Workshops:**
- Alle Teilnehmer haben Lese- und Schreibzugang zu ihrem Fork
- Solution-Branches sind nur fuer den Trainer sichtbar

**Nach dem Workshop:**
- Solution-Branches werden fuer alle Teilnehmer freigeschaltet
- Repository bleibt mindestens **6 Monate** erreichbar
- Teilnehmer erhalten eine E-Mail mit:
  - Repository-URL
  - Branch-Uebersicht
  - Installationsanleitung fuer spaetere Nutzung
  - Hinweis auf moegliche API-Aenderungen bei zukuenftigen Angular-Updates

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
7. Was wuerde ich aendern?
8. Wuerde ich den Workshop weiterempfehlen? (NPS)
9. Welche Themen wuenscht sich der Teilnehmer fuer einen Aufbau-Workshop?
10. Freie Kommentare

**Nach dem Workshop (1 Woche spaeter):**
- Kurze Follow-up E-Mail mit:
  - Nachbereitungsdokument
  - Bitte um Feedback auf LinkedIn/Xing (optional)
  - Angebot fuer 30-minuetiges Follow-up-Gespraech bei Fragen
  - Hinweis auf weitere Workshop-Angebote

### 6.4 Eigene Nachbereitung (Trainer)

**Innerhalb von 1 Woche nach dem Workshop:**
- [ ] Feedback-Ergebnisse auswerten
- [ ] Nachbereitungsdokument erstellen und versenden
- [ ] Solution-Branches freischalten
- [ ] Notizen zu Verbesserungen fuer naechsten Workshop
- [ ] Probleme/Bugs im Workshop-Repository dokumentieren und fixen
- [ ] Timing-Anpassungen notieren (was hat laenger/kuerzer gedauert?)
- [ ] Neue FAQ-Eintraege aus Teilnehmer-Fragen ergaenzen
- [ ] Workshop-Material bei Angular-Updates aktualisieren

---

> **Hinweis:** Dieses Dokument ist ein lebendes Dokument. Nach jedem Workshop-Durchlauf sollte es basierend auf den Erfahrungen aktualisiert werden.
