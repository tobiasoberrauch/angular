# Tag 2: Signals & Zoneless -- Übungen

> Angular 21 Advanced Workshop
> Thema: Signals, Computed Signals, Effects, Zoneless Change Detection

---

## Übung 2.1: Signal-basierte Counter-Komponente

### Ziel

Die Grundlagen von Angular Signals verstehen und eine interaktive Komponente erstellen, die Signals anstelle von klassischen Klassen-Properties für die Zustandsverwaltung verwendet.

### Voraussetzungen

- Branch: `step/05-signals-start`
- Tag 1 abgeschlossen (Standalone-Komponenten)
- Grundverständnis von reaktiver Programmierung

### Aufgaben

1. **Signal erstellen**
   - Erstelle eine neue Standalone-Komponente `CounterComponent`
   - Definiere einen `count`-Signal mit Startwert `0`:
     ```typescript
     count = signal(0);
     ```

2. **Signal im Template verwenden**
   - Zeige den aktuellen Wert im Template an:
     ```html
     <p>Aktueller Wert: {{ count() }}</p>
     ```
   - Beachte: Signals werden im Template als Funktionsaufrufe verwendet

3. **Signal-Werte ändern**
   - Implementiere Buttons für verschiedene Operationen:
     ```typescript
     increment() {
       this.count.update(value => value + 1);
     }

     decrement() {
       this.count.update(value => value - 1);
     }

     reset() {
       this.count.set(0);
     }
     ```

4. **Input Signals verwenden**
   - Ersetze den klassischen `@Input()` durch einen Input-Signal:
     ```typescript
     initialValue = input(0);
     step = input(1);
     ```
   - Passe die Increment/Decrement-Logik an, um den `step`-Wert zu verwenden

5. **Output mit OutputEmitter**
   - Ersetze den klassischen `@Output()` durch die neue `output()`-Funktion:
     ```typescript
     countChanged = output<number>();
     ```
   - Emittiere bei jeder Änderung den neuen Wert

6. **Model Signal für Two-Way-Binding**
   - Implementiere ein `model()`-Signal für bidirektionales Binding:
     ```typescript
     value = model(0);
     ```
   - Verwende in der Eltern-Komponente: `<app-counter [(value)]="parentSignal" />`

### Hinweise

- `signal()` erstellt ein beschreibbares Signal (WritableSignal).
- `set()` setzt einen neuen Wert direkt, `update()` berechnet den neuen Wert aus dem alten.
- `input()` und `input.required()` ersetzen den `@Input()`-Decorator.
- `output()` ersetzt den `@Output()`-Decorator und gibt einen `OutputEmitterRef` zurück.
- `model()` kombiniert Input und Output für Two-Way-Binding.

### Musterlösung

Siehe Branch `step/05-signals-complete` im Repository.

---

## Übung 2.2: Computed Signals für Filterung/Sortierung

### Ziel

Abgeleitete Werte mit `computed()` erstellen, um eine Produktliste mit Echtzeit-Filterung und -Sortierung zu implementieren. Die Abhängigkeitsverfolgung und Memoization von Computed Signals werden erlernt.

### Voraussetzungen

- Branch: `step/06-computed-start`
- Übung 2.1 abgeschlossen

### Aufgaben

1. **Datenquelle als Signal definieren**
   - Erstelle eine `ProductListComponent` mit einem Signal für die Produktliste:
     ```typescript
     products = signal<Product[]>([]);
     ```
   - Lade die Produkte beim Initialisieren (z.B. aus einem Service oder Testdaten)

2. **Filter-Signals erstellen**
   - Definiere Signals für die Filterkriterien:
     ```typescript
     searchTerm = signal('');
     selectedCategory = signal<string | null>(null);
     sortField = signal<'name' | 'price'>('name');
     sortDirection = signal<'asc' | 'desc'>('asc');
     ```

3. **Computed Signal für gefilterte Produkte**
   - Erstelle ein `computed()`-Signal, das alle Filter kombiniert:
     ```typescript
     filteredProducts = computed(() => {
       let result = this.products();

       const term = this.searchTerm().toLowerCase();
       if (term) {
         result = result.filter(p =>
           p.name.toLowerCase().includes(term)
         );
       }

       const category = this.selectedCategory();
       if (category) {
         result = result.filter(p => p.category === category);
       }

       return result;
     });
     ```

4. **Computed Signal für Sortierung**
   - Erstelle ein weiteres `computed()`-Signal, das die gefilterten Produkte sortiert:
     ```typescript
     sortedProducts = computed(() => {
       const products = [...this.filteredProducts()];
       const field = this.sortField();
       const direction = this.sortDirection();

       return products.sort((a, b) => {
         const comparison = a[field] > b[field] ? 1 : -1;
         return direction === 'asc' ? comparison : -comparison;
       });
     });
     ```

5. **Statistik-Computed-Signals**
   - Erstelle berechnete Werte für die Anzeige:
     ```typescript
     totalCount = computed(() => this.products().length);
     filteredCount = computed(() => this.filteredProducts().length);
     averagePrice = computed(() => {
       const items = this.filteredProducts();
       if (items.length === 0) return 0;
       return items.reduce((sum, p) => sum + p.price, 0) / items.length;
     });
     ```

6. **Template verbinden**
   - Baue ein UI mit Suchfeld, Kategorie-Dropdown und Sortier-Buttons
   - Zeige die `sortedProducts()`-Liste und die Statistiken an
   - Verwende den neuen Control Flow (`@for`, `@if`)

### Hinweise

- `computed()` wird automatisch neu berechnet, wenn sich eines der gelesenen Signals ändert.
- Computed Signals sind memoized: sie berechnen nur neu, wenn sich Abhängigkeiten tatsächlich ändern.
- Computed Signals sind readonly -- sie können nicht direkt gesetzt werden.
- Verschachtelung von Computed Signals ist erlaubt und empfohlen (z.B. `sortedProducts` basiert auf `filteredProducts`).
- Vermeide Seiteneffekte in `computed()` -- verwende dafür `effect()`.

### Musterlösung

Siehe Branch `step/06-computed-complete` im Repository.

---

## Übung 2.3: Effect für Logging und localStorage-Persistenz

### Ziel

Effects verwenden, um Seiteneffekte auf Basis von Signal-Änderungen auszuführen. Anwendungsbeispiele sind Logging, Persistenz im localStorage und Synchronisation mit externen Systemen.

### Voraussetzungen

- Branch: `step/07-effects-start`
- Übung 2.2 abgeschlossen

### Aufgaben

1. **Logging-Effect erstellen**
   - Implementiere einen Effect, der jede Änderung der Produktfilter protokolliert:
     ```typescript
     constructor() {
       effect(() => {
         console.log('Filter geändert:', {
           suchbegriff: this.searchTerm(),
           kategorie: this.selectedCategory(),
           sortierung: this.sortField(),
           richtung: this.sortDirection(),
           ergebnisse: this.filteredProducts().length
         });
       });
     }
     ```

2. **localStorage-Persistenz**
   - Speichere die Filtereinstellungen automatisch im localStorage:
     ```typescript
     private persistEffect = effect(() => {
       const settings = {
         searchTerm: this.searchTerm(),
         category: this.selectedCategory(),
         sortField: this.sortField(),
         sortDirection: this.sortDirection()
       };
       localStorage.setItem('product-filters', JSON.stringify(settings));
     });
     ```
   - Lade die gespeicherten Einstellungen beim Start der Komponente

3. **Debounced Search mit Effect**
   - Implementiere eine verzögerte Suche, die erst nach 300ms Inaktivität eine API-Anfrage sendet:
     ```typescript
     private searchEffect = effect((onCleanup) => {
       const term = this.searchTerm();

       const timeout = setTimeout(() => {
         this.productService.search(term).subscribe(results => {
           this.products.set(results);
         });
       }, 300);

       onCleanup(() => clearTimeout(timeout));
     });
     ```

4. **Effect mit Cleanup-Funktion**
   - Verwende `onCleanup`, um Ressourcen freizugeben:
     ```typescript
     effect((onCleanup) => {
       const subscription = this.someObservable$.subscribe();

       onCleanup(() => {
         subscription.unsubscribe();
       });
     });
     ```

5. **Bedingte Effects**
   - Implementiere einen Effect, der nur unter bestimmten Bedingungen ausgeführt wird:
     ```typescript
     effect(() => {
       const count = this.filteredCount();
       if (count === 0) {
         this.notificationService.warn('Keine Ergebnisse gefunden');
       }
     });
     ```

### Hinweise

- Effects werden im Injection Context erstellt (Constructor oder mit `inject()`).
- `onCleanup` wird vor jeder Neuausführung und beim Zerstören aufgerufen.
- Effects werden asynchron ausgeführt -- sie laufen nicht synchron bei Signal-Änderungen.
- Vermeide zirkuläre Abhängigkeiten: Ein Effect sollte nicht die Signals setzen, die er liest.
- Für das Schreiben von Signals innerhalb eines Effects ist `allowSignalWrites: true` nötig (aber generell zu vermeiden).
- `untracked()` kann verwendet werden, um Signals zu lesen, ohne eine Abhängigkeit zu erzeugen.

### Musterlösung

Siehe Branch `step/07-effects-complete` im Repository.

---

## Bonus: Zoneless-Migration einer bestehenden Komponente

### Ziel

Die Anwendung von Zone.js-basierter Change Detection auf Zoneless umstellen. Verstehen, welche Codeänderungen notwendig sind und wie die Performance davon profitiert.

### Voraussetzungen

- Branch: `step/07-effects-complete`
- Übungen 2.1 bis 2.3 abgeschlossen
- Verständnis von Change Detection in Angular

### Aufgaben

1. **Zoneless aktivieren**
   - Konfiguriere die Anwendung in `app.config.ts`:
     ```typescript
     export const appConfig: ApplicationConfig = {
       providers: [
         provideExperimentalZonelessChangeDetection(),
         provideRouter(routes),
         provideHttpClient()
       ]
     };
     ```

2. **Zone.js entfernen**
   - Entferne `zone.js` aus `angular.json` (polyfills-Array)
   - Entferne `zone.js` aus `package.json`:
     ```bash
     npm uninstall zone.js
     ```

3. **Problematische Patterns identifizieren und beheben**
   - Suche nach Stellen, die implizit auf Zone.js angewiesen sind:
     - `setTimeout`/`setInterval` ohne Signal-Update
     - Direkte Property-Mutation ohne `signal.set()` oder `signal.update()`
     - `Promise.then()` ohne explizites Signal-Update
   - Ersetze diese durch Signal-basierte Alternativen

4. **Manuelle Change Detection wo nötig**
   - Für Fälle, die nicht auf Signals umgestellt werden können:
     ```typescript
     private cdr = inject(ChangeDetectorRef);

     someAsyncOperation() {
       fetchData().then(data => {
         this.legacyProperty = data;
         this.cdr.markForCheck();
       });
     }
     ```

5. **Performance messen**
   - Verwende Angular DevTools, um Change-Detection-Zyklen zu vergleichen
   - Messe die Bundle-Größe vor und nach dem Entfernen von Zone.js
   ```bash
   # Vorher
   ng build && ls -la dist/app/browser/*.js

   # Nachher (ohne zone.js)
   ng build && ls -la dist/app/browser/*.js
   ```

### Hinweise

- Zoneless funktioniert am besten, wenn die gesamte Anwendung Signals verwendet.
- Ohne Zone.js muss die Change Detection explizit über Signals oder `markForCheck()` ausgelöst werden.
- Die Bundle-Größe verringert sich um ca. 30-40 KB (unkomprimiert) durch das Entfernen von Zone.js.
- `provideExperimentalZonelessChangeDetection()` ist ab Angular 19+ verfügbar; in Angular 21 ist es stabil.
- Teste die Anwendung gründlich, da manche Drittanbieter-Bibliotheken Zone.js voraussetzen.

### Musterlösung

Siehe Branch `step/08-zoneless-complete` im Repository.
