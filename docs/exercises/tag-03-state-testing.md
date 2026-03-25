# Tag 3: SignalStore & Vitest -- Übungen

> Angular 21 Advanced Workshop
> Thema: NgRx SignalStore, Custom Store Features, Vitest-Integration

---

## Übung 3.1: Eigenen SignalStore für ein neues Feature erstellen

### Ziel

Einen vollständigen NgRx SignalStore für ein Feature erstellen, der den Zustand, berechnete Werte und Methoden zur Zustandsänderung kapselt.

### Voraussetzungen

- Branch: `step/09-signalstore-start`
- Tag 2 abgeschlossen (Signals verstanden)
- NgRx SignalStore installiert (`@ngrx/signals`)

### Aufgaben

1. **Feature-State definieren**
   - Erstelle eine Datei `todo.store.ts` für eine Todo-Verwaltung
   - Definiere den Zustand als TypeScript-Interface:
     ```typescript
     type Todo = {
       id: string;
       title: string;
       completed: boolean;
       createdAt: Date;
     };

     type TodoState = {
       todos: Todo[];
       loading: boolean;
       filter: 'all' | 'active' | 'completed';
     };
     ```

2. **SignalStore erstellen**
   - Verwende `signalStore()` mit `withState()` für den Initialzustand:
     ```typescript
     export const TodoStore = signalStore(
       { providedIn: 'root' },
       withState<TodoState>({
         todos: [],
         loading: false,
         filter: 'all'
       })
     );
     ```

3. **Computed Properties hinzufügen**
   - Erweitere den Store mit `withComputed()`:
     ```typescript
     withComputed(({ todos, filter }) => ({
       filteredTodos: computed(() => {
         const currentFilter = filter();
         const allTodos = todos();

         switch (currentFilter) {
           case 'active':
             return allTodos.filter(t => !t.completed);
           case 'completed':
             return allTodos.filter(t => t.completed);
           default:
             return allTodos;
         }
       }),
       completedCount: computed(() =>
         todos().filter(t => t.completed).length
       ),
       activeCount: computed(() =>
         todos().filter(t => !t.completed).length
       )
     }))
     ```

4. **Methoden hinzufügen**
   - Erweitere den Store mit `withMethods()`:
     ```typescript
     withMethods((store) => ({
       addTodo(title: string) {
         const newTodo: Todo = {
           id: crypto.randomUUID(),
           title,
           completed: false,
           createdAt: new Date()
         };
         patchState(store, { todos: [...store.todos(), newTodo] });
       },
       toggleTodo(id: string) {
         patchState(store, {
           todos: store.todos().map(t =>
             t.id === id ? { ...t, completed: !t.completed } : t
           )
         });
       },
       removeTodo(id: string) {
         patchState(store, {
           todos: store.todos().filter(t => t.id !== id)
         });
       },
       setFilter(filter: TodoState['filter']) {
         patchState(store, { filter });
       }
     }))
     ```

5. **Store in Komponente verwenden**
   - Injiziere den Store in einer Komponente:
     ```typescript
     readonly store = inject(TodoStore);
     ```
   - Verwende die Store-Properties im Template:
     ```html
     @for (todo of store.filteredTodos(); track todo.id) {
       <div [class.completed]="todo.completed">
         <input type="checkbox" [checked]="todo.completed"
                (change)="store.toggleTodo(todo.id)" />
         {{ todo.title }}
         <button (click)="store.removeTodo(todo.id)">Löschen</button>
       </div>
     }
     ```

### Hinweise

- `signalStore()` erstellt eine Injectable-Klasse, die wie ein Service verwendet wird.
- `withState()` definiert den Initialzustand als Signals.
- `withComputed()` erstellt abgeleitete Werte, die automatisch aktualisiert werden.
- `withMethods()` kapselt die Geschäftslogik zur Zustandsänderung.
- `patchState()` ist die empfohlene Art, den Zustand zu ändern (immutable).

### Musterlösung

Siehe Branch `step/09-signalstore-complete` im Repository.

---

## Übung 3.2: Store mit HTTP Service verbinden

### Ziel

Den SignalStore mit einem HTTP-Service verbinden, um Daten vom Backend zu laden und zu speichern. Async-Operationen mit `rxMethod` und Loading-States werden behandelt.

### Voraussetzungen

- Branch: `step/10-store-http-start`
- Übung 3.1 abgeschlossen

### Aufgaben

1. **HTTP Service erstellen**
   - Erstelle einen `TodoApiService`:
     ```typescript
     @Injectable({ providedIn: 'root' })
     export class TodoApiService {
       private http = inject(HttpClient);
       private baseUrl = '/api/todos';

       getAll(): Observable<Todo[]> {
         return this.http.get<Todo[]>(this.baseUrl);
       }

       create(todo: Omit<Todo, 'id'>): Observable<Todo> {
         return this.http.post<Todo>(this.baseUrl, todo);
       }

       update(id: string, changes: Partial<Todo>): Observable<Todo> {
         return this.http.put<Todo>(`${this.baseUrl}/${id}`, changes);
       }

       delete(id: string): Observable<void> {
         return this.http.delete<void>(`${this.baseUrl}/${id}`);
       }
     }
     ```

2. **Store mit rxMethod erweitern**
   - Verwende `rxMethod` für reaktive HTTP-Aufrufe:
     ```typescript
     withMethods((store, apiService = inject(TodoApiService)) => ({
       loadTodos: rxMethod<void>(
         pipe(
           tap(() => patchState(store, { loading: true })),
           switchMap(() => apiService.getAll()),
           tap(todos => patchState(store, { todos, loading: false }))
         )
       )
     }))
     ```

3. **Error-Handling hinzufügen**
   - Erweitere den State um ein `error`-Feld:
     ```typescript
     type TodoState = {
       todos: Todo[];
       loading: boolean;
       filter: 'all' | 'active' | 'completed';
       error: string | null;
     };
     ```
   - Fange Fehler in den rxMethod-Pipelines ab:
     ```typescript
     loadTodos: rxMethod<void>(
       pipe(
         tap(() => patchState(store, { loading: true, error: null })),
         switchMap(() => apiService.getAll().pipe(
           tapResponse({
             next: (todos) => patchState(store, { todos, loading: false }),
             error: (error: HttpErrorResponse) =>
               patchState(store, {
                 loading: false,
                 error: error.message
               })
           })
         ))
       )
     )
     ```

4. **Lifecycle Hooks verwenden**
   - Verwende `withHooks()`, um Daten beim Initialisieren zu laden:
     ```typescript
     withHooks({
       onInit(store) {
         store.loadTodos();
       }
     })
     ```

5. **Optimistisches Update implementieren**
   - Implementiere ein optimistisches Update für `toggleTodo`:
     - Aktualisiere den lokalen State sofort
     - Sende die Änderung an das Backend
     - Bei Fehler: Setze den vorherigen Zustand wieder her

### Hinweise

- `rxMethod` verbindet die reaktive Welt von RxJS mit SignalStore.
- `tapResponse` (aus `@ngrx/operators`) vereinfacht Error-Handling in Pipes.
- `withHooks()` bietet `onInit` und `onDestroy` Lifecycle-Hooks für den Store.
- Optimistische Updates verbessern die wahrgenommene Performance erheblich.
- Für Tests kann der HTTP-Service einfach gemockt werden (siehe Übung 3.3).

### Musterlösung

Siehe Branch `step/10-store-http-complete` im Repository.

---

## Übung 3.3: Vitest-Tests für den eigenen Store schreiben

### Ziel

Umfassende Tests für den SignalStore mit Vitest schreiben. Unit-Tests für State, Computed Properties und Methoden sowie Integrationstests mit gemockten HTTP-Services werden erstellt.

### Voraussetzungen

- Branch: `step/11-vitest-start`
- Übung 3.2 abgeschlossen
- Vitest konfiguriert (`@analogjs/vitest-angular` oder `@angular-builders/vitest`)

### Aufgaben

1. **Vitest konfigurieren**
   - Stelle sicher, dass `vitest.config.ts` korrekt konfiguriert ist:
     ```typescript
     import { defineConfig } from 'vitest/config';
     import angular from '@analogjs/vitest-angular';

     export default defineConfig({
       plugins: [angular()],
       test: {
         globals: true,
         environment: 'jsdom',
         include: ['src/**/*.spec.ts'],
         setupFiles: ['src/test-setup.ts']
       }
     });
     ```

2. **Store-Initialisierung testen**
   ```typescript
   describe('TodoStore', () => {
     it('sollte mit dem korrekten Initialzustand starten', () => {
       TestBed.configureTestingModule({});
       const store = TestBed.inject(TodoStore);

       expect(store.todos()).toEqual([]);
       expect(store.loading()).toBe(false);
       expect(store.filter()).toBe('all');
       expect(store.error()).toBeNull();
     });
   });
   ```

3. **Methoden testen**
   ```typescript
   describe('addTodo', () => {
     it('sollte ein neues Todo zur Liste hinzufügen', () => {
       TestBed.configureTestingModule({});
       const store = TestBed.inject(TodoStore);

       store.addTodo('Angular lernen');

       expect(store.todos().length).toBe(1);
       expect(store.todos()[0].title).toBe('Angular lernen');
       expect(store.todos()[0].completed).toBe(false);
     });
   });

   describe('toggleTodo', () => {
     it('sollte den Completed-Status umschalten', () => {
       TestBed.configureTestingModule({});
       const store = TestBed.inject(TodoStore);

       store.addTodo('Test-Todo');
       const id = store.todos()[0].id;

       store.toggleTodo(id);
       expect(store.todos()[0].completed).toBe(true);

       store.toggleTodo(id);
       expect(store.todos()[0].completed).toBe(false);
     });
   });
   ```

4. **Computed Properties testen**
   ```typescript
   describe('filteredTodos', () => {
     it('sollte nur aktive Todos anzeigen', () => {
       TestBed.configureTestingModule({});
       const store = TestBed.inject(TodoStore);

       store.addTodo('Todo 1');
       store.addTodo('Todo 2');
       const id = store.todos()[0].id;
       store.toggleTodo(id);

       store.setFilter('active');
       expect(store.filteredTodos().length).toBe(1);
       expect(store.filteredTodos()[0].title).toBe('Todo 2');
     });
   });
   ```

5. **HTTP-Integration testen**
   ```typescript
   describe('loadTodos (mit HTTP)', () => {
     it('sollte Todos vom Backend laden', () => {
       const mockTodos: Todo[] = [
         { id: '1', title: 'Mock Todo', completed: false, createdAt: new Date() }
       ];

       TestBed.configureTestingModule({
         providers: [
           provideHttpClient(),
           provideHttpClientTesting()
         ]
       });

       const store = TestBed.inject(TodoStore);
       const httpTesting = TestBed.inject(HttpTestingController);

       store.loadTodos();

       const req = httpTesting.expectOne('/api/todos');
       expect(req.request.method).toBe('GET');
       req.flush(mockTodos);

       expect(store.todos().length).toBe(1);
       expect(store.loading()).toBe(false);
     });

     it('sollte Fehler korrekt behandeln', () => {
       TestBed.configureTestingModule({
         providers: [
           provideHttpClient(),
           provideHttpClientTesting()
         ]
       });

       const store = TestBed.inject(TodoStore);
       const httpTesting = TestBed.inject(HttpTestingController);

       store.loadTodos();

       const req = httpTesting.expectOne('/api/todos');
       req.flush('Server Error', {
         status: 500,
         statusText: 'Internal Server Error'
       });

       expect(store.error()).toBeTruthy();
       expect(store.loading()).toBe(false);
     });
   });
   ```

6. **Tests ausführen**
   ```bash
   npx vitest run
   npx vitest --coverage
   ```

### Hinweise

- Vitest ist deutlich schneller als Karma/Jasmine und unterstützt ESM nativ.
- `TestBed.inject()` funktioniert mit SignalStore wie mit jedem anderen Service.
- Für HTTP-Tests verwende `provideHttpClientTesting()` und `HttpTestingController`.
- Snapshot-Tests eignen sich gut für Computed Properties mit stabilen Ausgaben.
- Verwende `vi.fn()` (Vitest) statt `jasmine.createSpy()` für Mocks.
- `vi.useFakeTimers()` kann für zeitabhängige Effects nützlich sein.

### Musterlösung

Siehe Branch `step/11-vitest-complete` im Repository.

---

## Bonus: Custom signalStoreFeature erstellen

### Ziel

Wiederverwendbare Store-Logik in ein eigenes `signalStoreFeature` extrahieren, das in verschiedenen Stores eingesetzt werden kann.

### Voraussetzungen

- Branch: `step/11-vitest-complete`
- Übungen 3.1 bis 3.3 abgeschlossen

### Aufgaben

1. **Pagination-Feature erstellen**
   - Erstelle eine Datei `store-features/with-pagination.ts`:
     ```typescript
     import { signalStoreFeature, withState, withComputed, withMethods } from '@ngrx/signals';

     export function withPagination<T>() {
       return signalStoreFeature(
         withState({
           currentPage: 1,
           pageSize: 10,
           totalItems: 0
         }),
         withComputed(({ currentPage, pageSize, totalItems }) => ({
           totalPages: computed(() => Math.ceil(totalItems() / pageSize())),
           hasNextPage: computed(() =>
             currentPage() < Math.ceil(totalItems() / pageSize())
           ),
           hasPreviousPage: computed(() => currentPage() > 1),
           pageRange: computed(() => {
             const start = (currentPage() - 1) * pageSize();
             const end = Math.min(start + pageSize(), totalItems());
             return { start, end };
           })
         })),
         withMethods((store) => ({
           nextPage() {
             if (store.hasNextPage()) {
               patchState(store, { currentPage: store.currentPage() + 1 });
             }
           },
           previousPage() {
             if (store.hasPreviousPage()) {
               patchState(store, { currentPage: store.currentPage() - 1 });
             }
           },
           goToPage(page: number) {
             patchState(store, { currentPage: Math.max(1, Math.min(page, store.totalPages())) });
           },
           setPageSize(size: number) {
             patchState(store, { pageSize: size, currentPage: 1 });
           }
         }))
       );
     }
     ```

2. **Feature im Store verwenden**
   ```typescript
   export const TodoStore = signalStore(
     { providedIn: 'root' },
     withState<TodoState>({ /* ... */ }),
     withPagination(),
     withComputed(({ filteredTodos, pageRange }) => ({
       paginatedTodos: computed(() => {
         const { start, end } = pageRange();
         return filteredTodos().slice(start, end);
       })
     })),
     withMethods(/* ... */)
   );
   ```

3. **Weiteres Feature: withEntityManagement**
   - Erstelle ein generisches Feature für CRUD-Operationen auf Entities
   - Das Feature soll `addEntity`, `updateEntity`, `removeEntity` und `selectEntity` bereitstellen
   - Verwende Generics, um das Feature typsicher für verschiedene Entity-Typen nutzbar zu machen

4. **Tests für das Feature schreiben**
   - Teste das Feature isoliert, indem du einen minimalen Test-Store erstellst:
     ```typescript
     const TestStore = signalStore(
       withState({ items: [] }),
       withPagination()
     );
     ```
   - Teste alle Pagination-Methoden und Computed Properties

### Hinweise

- `signalStoreFeature` ermöglicht die Komposition wiederverwendbarer Store-Logik.
- Features können eigenen State, Computed Properties und Methoden mitbringen.
- Die Reihenfolge der Features in `signalStore()` bestimmt die Verfügbarkeit von State und Computed Properties.
- Generics machen Features flexibel für verschiedene Datentypen einsetzbar.
- Teste Features isoliert mit minimalen Test-Stores.

### Musterlösung

Siehe Branch `step/12-store-features-complete` im Repository.
