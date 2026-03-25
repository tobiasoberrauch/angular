# Tag 1: Standalone & Control Flow -- Übungen

> Angular 21 Advanced Workshop
> Thema: Standalone-Komponenten, Standalone-Migration, neuer Control Flow

---

## Übung 1.1: Eine neue Standalone-Komponente erstellen

### Ziel

Eine vollständig eigenständige Standalone-Komponente erstellen, die ohne ein umschließendes NgModule funktioniert. Dabei werden die Grundlagen von `standalone: true`, dem direkten Import von Abhängigkeiten und der Verwendung in anderen Standalone-Komponenten erlernt.

### Voraussetzungen

- Branch: `step/01-standalone-start`
- Grundkenntnisse in Angular-Komponenten und -Templates
- Angular CLI installiert

### Aufgaben

1. **Komponente generieren**
   ```bash
   ng generate component features/product-card --standalone
   ```

2. **Komponente konfigurieren**
   - Öffne `product-card.component.ts`
   - Stelle sicher, dass `standalone: true` im `@Component`-Decorator gesetzt ist
   - Importiere `CommonModule` direkt im `imports`-Array der Komponente

3. **Template erstellen**
   - Definiere ein `Product`-Interface mit den Feldern `id`, `name`, `price` und `imageUrl`
   - Verwende `@Input()` um ein `Product`-Objekt entgegenzunehmen
   - Zeige die Produktdaten im Template an (Name, Preis formatiert mit `CurrencyPipe`, Bild)

4. **Komponente einbinden**
   - Importiere `ProductCardComponent` direkt in einer übergeordneten Standalone-Komponente
   - Übergib Testdaten über Property Binding

5. **Routing konfigurieren**
   - Füge eine Route in `app.routes.ts` hinzu, die zur neuen Komponente navigiert
   - Verwende `loadComponent` für Lazy Loading:
     ```typescript
     {
       path: 'products',
       loadComponent: () => import('./features/product-card/product-card.component')
         .then(m => m.ProductCardComponent)
     }
     ```

### Hinweise

- Standalone-Komponenten benötigen kein `NgModule` -- alle Abhängigkeiten werden direkt im `imports`-Array der Komponente deklariert.
- Pipes wie `CurrencyPipe` müssen ebenfalls importiert werden, entweder einzeln oder über `CommonModule`.
- Achte darauf, dass das `Product`-Interface in einer separaten Datei (`models/product.model.ts`) definiert wird.

### Musterlösung

Siehe Branch `step/01-standalone-complete` im Repository.

---

## Übung 1.2: Legacy-Komponente zu Standalone migrieren

### Ziel

Eine bestehende Komponente, die in einem NgModule deklariert ist, zu einer eigenständigen Standalone-Komponente migrieren. Der Migrationsprozess und die dabei auftretenden Herausforderungen werden erlernt.

### Voraussetzungen

- Branch: `step/02-migration-start`
- Übung 1.1 abgeschlossen oder Verständnis von Standalone-Komponenten

### Aufgaben

1. **Bestehende Komponente identifizieren**
   - Öffne eine Komponente, die aktuell in einem `NgModule` deklariert ist (z.B. `DashboardComponent`)
   - Notiere alle Abhängigkeiten: verwendete Pipes, Direktiven, andere Komponenten

2. **Automatische Migration ausführen**
   ```bash
   ng generate @angular/core:standalone
   ```
   - Wähle die Option "Convert all components, directives and pipes to standalone"
   - Prüfe die vorgenommenen Änderungen mit `git diff`

3. **Manuelle Nacharbeiten**
   - Überprüfe, ob alle Imports korrekt aufgelöst wurden
   - Entferne das nun leere NgModule, falls keine weiteren Deklarationen vorhanden sind
   - Aktualisiere die Routing-Konfiguration: ersetze `loadChildren` durch `loadComponent` wo sinnvoll

4. **Abhängigkeiten bereinigen**
   - Stelle sicher, dass Services weiterhin über `providedIn: 'root'` oder `providers` im Route-Objekt bereitgestellt werden
   - Entferne überflüssige NgModule-Dateien

5. **Testen**
   - Führe die bestehenden Tests aus und behebe Fehler
   - Passe TestBed-Konfigurationen an: ersetze `declarations` durch direkten Import der Standalone-Komponente

### Hinweise

- Die Angular CLI bietet einen Schematic für die automatische Migration: `ng generate @angular/core:standalone`.
- Manche Abhängigkeiten (z.B. aus Drittanbieter-Bibliotheken) sind möglicherweise noch nicht standalone-fähig. Hier kann `importProvidersFrom()` helfen.
- Services mit `providedIn: 'root'` benötigen keine Änderung.
- In Tests wird die Standalone-Komponente direkt importiert statt über ein TestModule deklariert.

### Musterlösung

Siehe Branch `step/02-migration-complete` im Repository.

---

## Übung 1.3: Control Flow (@if, @for) anstelle von *ngIf, *ngFor

### Ziel

Den neuen Built-in Control Flow von Angular verwenden, um Template-Logik lesbarer und performanter zu gestalten. Die Syntax von `@if`, `@else`, `@for` und `@switch` wird erlernt.

### Voraussetzungen

- Branch: `step/03-control-flow-start`
- Übung 1.1 oder 1.2 abgeschlossen

### Aufgaben

1. **@if und @else verwenden**
   - Ersetze alle `*ngIf`-Direktiven im Template durch die neue `@if`-Syntax:
     ```html
     <!-- Alt -->
     <div *ngIf="products.length > 0; else emptyState">...</div>
     <ng-template #emptyState>Keine Produkte gefunden</ng-template>

     <!-- Neu -->
     @if (products.length > 0) {
       <div>...</div>
     } @else {
       <p>Keine Produkte gefunden</p>
     }
     ```

2. **@for mit track verwenden**
   - Ersetze alle `*ngFor`-Direktiven durch `@for` mit obligatorischem `track`:
     ```html
     <!-- Alt -->
     <app-product-card *ngFor="let product of products; trackBy: trackById" [product]="product" />

     <!-- Neu -->
     @for (product of products; track product.id) {
       <app-product-card [product]="product" />
     } @empty {
       <p>Die Liste ist leer.</p>
     }
     ```

3. **@switch einsetzen**
   - Implementiere eine Status-Anzeige mit `@switch`:
     ```html
     @switch (order.status) {
       @case ('pending') { <span class="badge warning">Ausstehend</span> }
       @case ('shipped') { <span class="badge info">Versendet</span> }
       @case ('delivered') { <span class="badge success">Zugestellt</span> }
       @default { <span class="badge">Unbekannt</span> }
     }
     ```

4. **Automatische Migration ausführen**
   - Nutze den offiziellen Schematic für die verbleibenden Templates:
     ```bash
     ng generate @angular/core:control-flow
     ```
   - Prüfe das Ergebnis und korrigiere eventuelle Formatierungsprobleme

5. **Imports bereinigen**
   - Entferne `CommonModule`, `NgIf`, `NgFor` und `NgSwitch` aus den Imports der Komponenten, da der neue Control Flow keine Imports benötigt

### Hinweise

- Der neue Control Flow ist built-in und benötigt keine Imports -- weder `CommonModule` noch einzelne Direktiven.
- `track` ist bei `@for` Pflicht. Verwende eine eindeutige Eigenschaft wie `id`.
- `@empty` ist optional bei `@for` und wird angezeigt, wenn die Liste leer ist.
- Die automatische Migration funktioniert zuverlässig, aber prüfe das Ergebnis immer manuell.

### Musterlösung

Siehe Branch `step/03-control-flow-complete` im Repository.

---

## Bonus: Lazy Loading mit loadComponent

### Ziel

Verschiedene Lazy-Loading-Strategien mit Standalone-Komponenten verstehen und anwenden.

### Voraussetzungen

- Branch: `step/03-control-flow-complete`
- Übungen 1.1 bis 1.3 abgeschlossen

### Aufgaben

1. **Einzelne Komponente lazy laden**
   ```typescript
   // app.routes.ts
   export const routes: Routes = [
     {
       path: 'settings',
       loadComponent: () => import('./features/settings/settings.component')
         .then(m => m.SettingsComponent)
     }
   ];
   ```

2. **Child-Routes lazy laden**
   ```typescript
   {
     path: 'admin',
     loadChildren: () => import('./features/admin/admin.routes')
       .then(m => m.ADMIN_ROUTES)
   }
   ```
   - Erstelle `admin.routes.ts` mit eigenen Kind-Routen
   - Verwende `providers` im Route-Objekt, um feature-spezifische Services bereitzustellen

3. **Preloading-Strategie konfigurieren**
   - Implementiere `PreloadAllModules` oder eine eigene Strategie in `app.config.ts`:
     ```typescript
     provideRouter(routes, withPreloading(PreloadAllModules))
     ```

4. **Bundle-Größe analysieren**
   ```bash
   ng build --stats-json
   npx webpack-bundle-analyzer dist/app/stats.json
   ```
   - Überprüfe, ob die Lazy-Loaded-Komponenten in separaten Chunks geladen werden

### Hinweise

- `loadComponent` ist der bevorzugte Weg für einzelne Standalone-Komponenten.
- `loadChildren` wird für Gruppen von Routes verwendet, die eigene Route-Dateien exportieren.
- Feature-spezifische Providers können direkt im Route-Objekt definiert werden, um den Scope einzuschränken.
- Die Bundle-Analyse zeigt, ob das Code-Splitting korrekt funktioniert.

### Musterlösung

Siehe Branch `step/04-lazy-loading-complete` im Repository.
