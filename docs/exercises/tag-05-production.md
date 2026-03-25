# Tag 5: CI/CD & Abschlussprojekt -- Übungen

> Angular 21 Advanced Workshop
> Thema: GitHub Actions, Migration Checkliste, Abschlussprojekt

---

## Übung 5.1: GitHub Actions Pipeline erweitern

### Ziel

Eine bestehende GitHub Actions CI/CD-Pipeline um automatisierte Qualitätsprüfungen erweitern: Lint, Tests, Build, Bundle-Analyse und Lighthouse-Audit.

### Voraussetzungen

- Branch: `step/17-cicd-start`
- Tag 4 abgeschlossen
- GitHub-Repository mit bestehendem `.github/workflows/ci.yml`
- Grundkenntnisse in GitHub Actions

### Aufgaben

1. **Bestehende Pipeline analysieren**
   - Öffne `.github/workflows/ci.yml` und identifiziere die vorhandenen Steps
   - Notiere, welche Prüfungen fehlen

2. **Lint-Step hinzufügen**
   ```yaml
   - name: Lint
     run: npx ng lint --max-warnings=0
   ```

3. **Test-Step mit Coverage erweitern**
   ```yaml
   - name: Tests mit Coverage
     run: npx vitest run --coverage

   - name: Coverage Report hochladen
     uses: actions/upload-artifact@v4
     with:
       name: coverage-report
       path: coverage/
       retention-days: 14
   ```

4. **Build mit Bundle-Analyse**
   ```yaml
   - name: Production Build
     run: npx ng build --configuration=production

   - name: Bundle-Größe prüfen
     uses: andresz1/size-limit-action@v1
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       build_script: build
       skip_step: build
     env:
       CI: true
   ```

5. **Lighthouse-Audit hinzufügen**
   ```yaml
   - name: Lighthouse CI
     uses: treosh/lighthouse-ci-action@v12
     with:
       configPath: '.lighthouserc.json'
       uploadArtifacts: true
   ```
   - Erstelle `.lighthouserc.json`:
     ```json
     {
       "ci": {
         "collect": {
           "startServerCommand": "npx ng serve --configuration=production",
           "url": ["http://localhost:4200"],
           "startServerReadyPattern": "Compiled successfully"
         },
         "assert": {
           "assertions": {
             "categories:performance": ["error", { "minScore": 0.9 }],
             "categories:accessibility": ["error", { "minScore": 0.95 }],
             "categories:best-practices": ["warn", { "minScore": 0.9 }]
           }
         }
       }
     }
     ```

6. **Caching für schnellere Builds**
   ```yaml
   - name: Node Modules Cache
     uses: actions/cache@v4
     with:
       path: node_modules
       key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
       restore-keys: |
         ${{ runner.os }}-node-
   ```

7. **Vollständige Workflow-Datei zusammensetzen**
   - Erstelle die finale `.github/workflows/ci.yml`:
     ```yaml
     name: CI Pipeline

     on:
       push:
         branches: [main]
       pull_request:
         branches: [main]

     jobs:
       quality:
         name: Qualitätsprüfung
         runs-on: ubuntu-latest

         steps:
           - uses: actions/checkout@v4

           - name: Node.js einrichten
             uses: actions/setup-node@v4
             with:
               node-version: '22'
               cache: 'npm'

           - name: Abhängigkeiten installieren
             run: npm ci

           - name: Lint
             run: npx ng lint --max-warnings=0

           - name: Tests mit Coverage
             run: npx vitest run --coverage

           - name: Production Build
             run: npx ng build --configuration=production

           - name: Coverage Report
             uses: actions/upload-artifact@v4
             if: always()
             with:
               name: coverage-report
               path: coverage/

           - name: Build Artifacts
             uses: actions/upload-artifact@v4
             with:
               name: build-output
               path: dist/

       lighthouse:
         name: Lighthouse Audit
         runs-on: ubuntu-latest
         needs: quality

         steps:
           - uses: actions/checkout@v4

           - name: Node.js einrichten
             uses: actions/setup-node@v4
             with:
               node-version: '22'
               cache: 'npm'

           - name: Abhängigkeiten installieren
             run: npm ci

           - name: Lighthouse CI
             uses: treosh/lighthouse-ci-action@v12
             with:
               configPath: '.lighthouserc.json'
               uploadArtifacts: true
     ```

### Hinweise

- `npm ci` ist schneller als `npm install` in CI-Umgebungen und installiert exakt die Versionen aus `package-lock.json`.
- `actions/cache@v4` beschleunigt nachfolgende Builds erheblich.
- Lighthouse-Audits sollten in einem separaten Job laufen, der vom Build abhängt (`needs: quality`).
- Verwende `if: always()` für Steps, die auch bei Testfehlern ausgeführt werden sollen (z.B. Coverage-Upload).
- `--max-warnings=0` sorgt dafür, dass der Lint-Step auch bei Warnungen fehlschlägt.

### Musterlösung

Siehe Branch `step/17-cicd-complete` im Repository.

---

## Übung 5.2: Migration Checklist für eigenes Projekt erstellen

### Ziel

Eine strukturierte Checkliste erstellen, die als Leitfaden für die Migration eines bestehenden Angular-Projekts auf die neuesten Patterns (Standalone, Signals, SignalStore, Vitest, Zoneless) dient.

### Voraussetzungen

- Branch: `step/17-cicd-complete`
- Alle vorherigen Tage abgeschlossen
- Zugang zum eigenen Projekt oder einem Referenzprojekt

### Aufgaben

1. **Projekt-Analyse durchführen**
   - Erstelle eine Bestandsaufnahme deines Projekts:
     ```markdown
     ## Projekt-Analyse

     - Angular Version: ___
     - Anzahl NgModules: ___
     - Anzahl Komponenten: ___
     - Test-Framework: Karma/Jasmine [ ] oder Vitest [ ]
     - State Management: NgRx Store [ ] / Services [ ] / Keines [ ]
     - Zone.js: Ja [ ] / Nein [ ]
     ```

2. **Phase 1: Standalone-Migration**
   - Erstelle Checkliste-Einträge:
     ```markdown
     ### Phase 1: Standalone (Geschätzt: ___ Tage)

     - [ ] Angular CLI auf Version 21 aktualisieren
     - [ ] `ng update` ausführen und Breaking Changes prüfen
     - [ ] Automatische Standalone-Migration ausführen
           `ng generate @angular/core:standalone`
     - [ ] Verbleibende NgModules manuell migrieren
     - [ ] Leere NgModule-Dateien entfernen
     - [ ] Routing auf `loadComponent` / `loadChildren` umstellen
     - [ ] Tests an Standalone-Imports anpassen
     - [ ] Alle Tests ausführen und bestätigen
     ```

3. **Phase 2: Control Flow Migration**
   ```markdown
   ### Phase 2: Control Flow (Geschätzt: ___ Tage)

   - [ ] Automatische Control-Flow-Migration ausführen
         `ng generate @angular/core:control-flow`
   - [ ] Ergebnisse manuell prüfen und formatieren
   - [ ] `CommonModule` / `NgIf` / `NgFor` Imports entfernen
   - [ ] Template-Syntax in Code-Reviews prüfen
   - [ ] Alle Tests ausführen und bestätigen
   ```

4. **Phase 3: Signals-Migration**
   ```markdown
   ### Phase 3: Signals (Geschätzt: ___ Tage)

   - [ ] Einfache Properties durch `signal()` ersetzen
   - [ ] `@Input()` durch `input()` / `input.required()` ersetzen
   - [ ] `@Output()` durch `output()` ersetzen
   - [ ] Berechnete Werte mit `computed()` umsetzen
   - [ ] Seiteneffekte mit `effect()` implementieren
   - [ ] `toSignal()` für Observable-Integration verwenden
   - [ ] Lifecycle Hooks prüfen und anpassen
   - [ ] Component-Tests an Signal-API anpassen
   ```

5. **Phase 4: State Management Migration**
   ```markdown
   ### Phase 4: SignalStore (Geschätzt: ___ Tage)

   - [ ] NgRx Store auf SignalStore migrieren (falls vorhanden)
   - [ ] Service-basierte State-Verwaltung in SignalStore überführen
   - [ ] `withState()`, `withComputed()`, `withMethods()` einsetzen
   - [ ] HTTP-Integration mit `rxMethod()` implementieren
   - [ ] Wiederverwendbare `signalStoreFeatures` extrahieren
   - [ ] Store-Tests anpassen
   ```

6. **Phase 5: Testing-Migration**
   ```markdown
   ### Phase 5: Vitest (Geschätzt: ___ Tage)

   - [ ] Vitest und Abhängigkeiten installieren
   - [ ] `vitest.config.ts` konfigurieren
   - [ ] Karma-Konfiguration entfernen
   - [ ] `jasmine.createSpy` durch `vi.fn()` ersetzen
   - [ ] `jasmine.createSpyObj` durch manuelle Mocks ersetzen
   - [ ] Async-Test-Patterns an Vitest anpassen
   - [ ] Coverage-Konfiguration migrieren
   - [ ] CI-Pipeline aktualisieren
   ```

7. **Phase 6: Zoneless (Optional)**
   ```markdown
   ### Phase 6: Zoneless (Geschätzt: ___ Tage)

   - [ ] Alle Komponenten auf Signals umgestellt (Voraussetzung!)
   - [ ] `provideExperimentalZonelessChangeDetection()` aktivieren
   - [ ] `zone.js` aus polyfills entfernen
   - [ ] Implizite Zone.js-Abhängigkeiten identifizieren und beheben
   - [ ] Drittanbieter-Bibliotheken auf Kompatibilität prüfen
   - [ ] Performance-Vergleich durchführen
   - [ ] Alle Tests bestätigen
   ```

8. **Risiken und Rollback dokumentieren**
   ```markdown
   ### Risiken

   - [ ] Drittanbieter-Bibliotheken identifiziert, die nicht kompatibel sind
   - [ ] Rollback-Strategie für jede Phase definiert
   - [ ] Feature-Flags für schrittweise Aktivierung eingerichtet
   - [ ] Team über neue Patterns geschult
   ```

### Hinweise

- Migriere phasenweise, nicht alles auf einmal. Jede Phase sollte für sich abgeschlossen und testbar sein.
- Nutze die Angular-Schematics (`ng generate @angular/core:standalone`, `ng generate @angular/core:control-flow`) für automatische Migrationen.
- Erstelle für jede Phase einen eigenen Branch und Merge-Request.
- Plane Puffer-Zeit ein -- erfahrungsgemäß dauert die Migration 20-30% länger als geschätzt.
- Dokumentiere Entscheidungen und Workarounds für das gesamte Team.

### Musterlösung

Siehe Datei `docs/migration-checklist-template.md` im Repository.

---

## Abschlussprojekt: Neues Feature-Modul mit allen gelernten Patterns

### Ziel

Ein vollständiges Feature von Grund auf implementieren, das alle im Workshop gelernten Patterns und Technologien vereint. Das Feature soll produktionsreif sein und als Referenzimplementierung für zukünftige Entwicklungen dienen.

### Voraussetzungen

- Branch: `step/18-final-project-start`
- Alle vorherigen Übungen abgeschlossen oder verstanden
- Gesamtes Workshop-Wissen

### Aufgaben

#### Teil A: Feature-Planung (30 Min.)

1. **Feature auswählen**
   - Wähle eines der folgenden Features oder definiere ein eigenes:
     - **Kontaktverwaltung**: CRUD für Kontakte mit Suche, Filterung und Kategorien
     - **Aufgabenboard**: Kanban-ähnliches Board mit Drag & Drop und Status-Tracking
     - **Produktkatalog**: Katalog mit Filterung, Sortierung und Warenkorbfunktion

2. **Datenschema definieren**
   - Erstelle die TypeScript-Interfaces für dein Feature
   - Definiere den Store-State
   - Plane die API-Endpunkte (können gemockt werden)

#### Teil B: Implementierung (2-3 Std.)

3. **Standalone-Komponenten erstellen**
   - Erstelle alle Komponenten als Standalone
   - Verwende den neuen Control Flow (`@if`, `@for`, `@switch`)
   - Verwende Signal-basierte Inputs und Outputs:
     ```typescript
     // Beispiel: Kontaktliste
     @Component({
       selector: 'app-contact-list',
       standalone: true,
       imports: [AccessibleDropdownComponent, ContactCardComponent],
       template: `...`
     })
     export class ContactListComponent {
       private store = inject(ContactStore);

       contacts = this.store.filteredContacts;
       loading = this.store.loading;
       categories = this.store.categories;
     }
     ```

4. **SignalStore implementieren**
   - Erstelle den Store mit allen gelernten Features:
     ```typescript
     export const ContactStore = signalStore(
       { providedIn: 'root' },
       withState<ContactState>({...}),
       withComputed(({...}) => ({...})),
       withMethods((store) => ({...})),
       withPagination(),           // Custom Feature aus Tag 3
       withHooks({
         onInit(store) {
           store.loadContacts();
         }
       })
     );
     ```

5. **Reactive Forms erstellen**
   - Implementiere ein Erstellungs-/Bearbeitungsformular:
     - Typisierte FormGroup mit Validierung
     - Cross-Field-Validation wo sinnvoll
     - Formular-Werte als Signals
     - Barrierefreie Fehleranzeige

6. **Barrierefreiheit sicherstellen**
   - Verwende semantisches HTML
   - Implementiere Keyboard-Navigation für Listen und interaktive Elemente
   - Setze ARIA-Attribute korrekt ein
   - Teste mit VoiceOver / NVDA

7. **Lazy Loading und Routing**
   - Konfiguriere Lazy Loading für das Feature:
     ```typescript
     // app.routes.ts
     {
       path: 'contacts',
       loadComponent: () => import('./features/contacts/contact-shell.component')
         .then(m => m.ContactShellComponent),
       children: [
         {
           path: '',
           loadComponent: () => import('./features/contacts/contact-list.component')
             .then(m => m.ContactListComponent)
         },
         {
           path: ':id',
           loadComponent: () => import('./features/contacts/contact-detail.component')
             .then(m => m.ContactDetailComponent)
         },
         {
           path: 'new',
           loadComponent: () => import('./features/contacts/contact-form.component')
             .then(m => m.ContactFormComponent)
         }
       ]
     }
     ```

#### Teil C: Testing (1 Std.)

8. **Vitest-Tests schreiben**
   - Store-Tests: Initialzustand, Methoden, Computed Properties
   - Komponenten-Tests: Rendering, Benutzerinteraktion
   - Formular-Tests: Validierung, Submit-Verhalten
   - A11y-Tests: ARIA-Attribute, Keyboard-Navigation
   ```bash
   npx vitest run --coverage
   ```

#### Teil D: Qualität und Präsentation (30 Min.)

9. **Code-Qualität prüfen**
   ```bash
   npx ng lint
   npx vitest run --coverage
   npx ng build --configuration=production
   ```

10. **Feature präsentieren**
    - Zeige die wichtigsten Implementierungsentscheidungen
    - Demonstriere die Barrierefreiheit
    - Zeige die Testabdeckung
    - Diskutiere Verbesserungsmöglichkeiten

### Bewertungskriterien

| Kriterium | Punkte |
|-----------|--------|
| Standalone-Komponenten korrekt eingesetzt | 10 |
| Neuer Control Flow (@if, @for) verwendet | 10 |
| Signal-basierte Inputs/Outputs | 10 |
| SignalStore mit State, Computed, Methods | 15 |
| HTTP-Integration im Store | 10 |
| Reactive Forms mit Validierung | 10 |
| Cross-Field-Validation | 5 |
| Barrierefreiheit (ARIA, Keyboard) | 15 |
| Vitest-Tests mit guter Abdeckung | 10 |
| Code-Qualität und Struktur | 5 |
| **Gesamt** | **100** |

### Hinweise

- Fokussiere auf Qualität statt Quantität. Ein gut implementiertes Feature ist wertvoller als viele halbfertige.
- Nutze die Branches der vorherigen Übungen als Referenz.
- Bei Zeitmangel: Priorisiere Store, Signals und mindestens eine barrierefreie Komponente.
- Verwende `inject()` statt Constructor Injection für einen konsistenten Stil.
- Halte die Komponenten klein und fokussiert (Single Responsibility Principle).
- Dokumentiere deine Architekturentscheidungen in Kommentaren.

### Musterlösung

Siehe Branch `step/18-final-project-complete` im Repository.
