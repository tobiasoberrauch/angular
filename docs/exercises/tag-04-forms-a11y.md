# Tag 4: Forms & Accessibility -- Übungen

> Angular 21 Advanced Workshop
> Thema: Reactive Forms mit Signals, Cross-Field-Validation, Barrierefreiheit, ARIA

---

## Übung 4.1: Formular mit Reactive Forms + Signals erstellen

### Ziel

Ein Registrierungsformular mit Angular Reactive Forms erstellen und die Formular-Werte mit Signals synchronisieren. Die Integration von `FormGroup`, `FormControl` und Signal-basierter Zustandsverwaltung wird erlernt.

### Voraussetzungen

- Branch: `step/13-forms-start`
- Tag 3 abgeschlossen (SignalStore verstanden)
- Grundkenntnisse in Angular Reactive Forms

### Aufgaben

1. **FormGroup definieren**
   - Erstelle eine `RegistrationFormComponent` als Standalone-Komponente
   - Definiere ein typisiertes FormGroup:
     ```typescript
     private fb = inject(NonNullableFormBuilder);

     form = this.fb.group({
       personalInfo: this.fb.group({
         firstName: ['', [Validators.required, Validators.minLength(2)]],
         lastName: ['', [Validators.required]],
         email: ['', [Validators.required, Validators.email]]
       }),
       credentials: this.fb.group({
         password: ['', [
           Validators.required,
           Validators.minLength(8),
           Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])/)
         ]],
         confirmPassword: ['', [Validators.required]]
       }),
       preferences: this.fb.group({
         newsletter: [false],
         theme: ['light' as 'light' | 'dark']
       })
     });
     ```

2. **Formular-Werte als Signal bereitstellen**
   - Verwende `toSignal()` um den Formular-Zustand reaktiv verfügbar zu machen:
     ```typescript
     formValue = toSignal(this.form.valueChanges, {
       initialValue: this.form.getRawValue()
     });

     formValid = toSignal(
       this.form.statusChanges.pipe(map(status => status === 'VALID')),
       { initialValue: false }
     );
     ```

3. **Template erstellen**
   - Baue ein mehrstufiges Formular mit visueller Validierung:
     ```html
     <form [formGroup]="form" (ngSubmit)="onSubmit()">
       <fieldset formGroupName="personalInfo">
         <legend>Persönliche Daten</legend>

         <div class="form-field">
           <label for="firstName">Vorname</label>
           <input id="firstName" formControlName="firstName"
                  [attr.aria-invalid]="form.get('personalInfo.firstName')?.invalid && form.get('personalInfo.firstName')?.touched"
                  [attr.aria-describedby]="'firstName-error'" />

           @if (form.get('personalInfo.firstName')?.errors?.['required'] &&
                form.get('personalInfo.firstName')?.touched) {
             <span id="firstName-error" class="error" role="alert">
               Vorname ist ein Pflichtfeld
             </span>
           }
         </div>

         <!-- Weitere Felder... -->
       </fieldset>
     </form>
     ```

4. **Fehleranzeige mit Computed Signal**
   - Erstelle eine zentrale Fehlerübersicht:
     ```typescript
     formErrors = computed(() => {
       const errors: string[] = [];
       const value = this.formValue();

       if (!value.personalInfo?.firstName) {
         errors.push('Vorname fehlt');
       }
       if (!value.personalInfo?.email) {
         errors.push('E-Mail fehlt');
       }
       // Weitere Prüfungen...

       return errors;
     });
     ```

5. **Submit-Handler implementieren**
   - Implementiere den Submit-Handler mit Validierung und Feedback:
     ```typescript
     submitting = signal(false);
     submitSuccess = signal(false);

     async onSubmit() {
       if (this.form.invalid) {
         this.form.markAllAsTouched();
         return;
       }

       this.submitting.set(true);
       try {
         await this.registrationService.register(this.form.getRawValue());
         this.submitSuccess.set(true);
       } catch {
         this.submitSuccess.set(false);
       } finally {
         this.submitting.set(false);
       }
     }
     ```

### Hinweise

- `NonNullableFormBuilder` sorgt dafür, dass `reset()` den Initialwert wiederherstellt statt `null`.
- `toSignal()` konvertiert Observables (wie `valueChanges`) in Signals.
- Formulare sollten immer `formGroupName` oder `formGroup` verwenden, nie beides mischen.
- Validierungsfehler im Template immer mit `?.` (Optional Chaining) prüfen.
- `markAllAsTouched()` zeigt alle Fehler gleichzeitig an, wenn der Benutzer das Formular absendet.

### Musterlösung

Siehe Branch `step/13-forms-complete` im Repository.

---

## Übung 4.2: Cross-Field-Validation implementieren

### Ziel

Validierungen implementieren, die mehrere Formularfelder gleichzeitig prüfen (z.B. Passwort-Bestätigung, Datumsbereich). Eigene Validator-Funktionen und asynchrone Validierung werden erlernt.

### Voraussetzungen

- Branch: `step/14-validation-start`
- Übung 4.1 abgeschlossen

### Aufgaben

1. **Passwort-Bestätigung Validator**
   - Erstelle einen Cross-Field-Validator für die Passwort-Übereinstimmung:
     ```typescript
     // validators/password-match.validator.ts
     export function passwordMatchValidator(): ValidatorFn {
       return (control: AbstractControl): ValidationErrors | null => {
         const group = control as FormGroup;
         const password = group.get('password')?.value;
         const confirmPassword = group.get('confirmPassword')?.value;

         if (password !== confirmPassword) {
           return { passwordMismatch: true };
         }
         return null;
       };
     }
     ```
   - Wende den Validator auf die `credentials`-FormGroup an:
     ```typescript
     credentials: this.fb.group({
       password: ['', [Validators.required, Validators.minLength(8)]],
       confirmPassword: ['', [Validators.required]]
     }, { validators: [passwordMatchValidator()] })
     ```

2. **Datumsbereich-Validator**
   - Erstelle einen Validator, der prüft, ob das Enddatum nach dem Startdatum liegt:
     ```typescript
     export function dateRangeValidator(
       startField: string,
       endField: string
     ): ValidatorFn {
       return (control: AbstractControl): ValidationErrors | null => {
         const group = control as FormGroup;
         const start = group.get(startField)?.value;
         const end = group.get(endField)?.value;

         if (start && end && new Date(start) >= new Date(end)) {
           return { dateRange: { start, end } };
         }
         return null;
       };
     }
     ```

3. **Asynchroner Validator für E-Mail-Prüfung**
   - Erstelle einen asynchronen Validator, der prüft, ob die E-Mail bereits registriert ist:
     ```typescript
     export function uniqueEmailValidator(
       userService: UserService
     ): AsyncValidatorFn {
       return (control: AbstractControl): Observable<ValidationErrors | null> => {
         return userService.checkEmail(control.value).pipe(
           debounceTime(300),
           map(exists => exists ? { emailTaken: true } : null),
           catchError(() => of(null))
         );
       };
     }
     ```
   - Wende den Validator auf das E-Mail-Feld an:
     ```typescript
     email: ['', {
       validators: [Validators.required, Validators.email],
       asyncValidators: [uniqueEmailValidator(this.userService)],
       updateOn: 'blur'
     }]
     ```

4. **Bedingte Validierung**
   - Implementiere Validierung, die von einem anderen Feld abhängt:
     ```typescript
     // Wenn Newsletter gewählt, ist die E-Mail Pflicht
     ngOnInit() {
       this.form.get('preferences.newsletter')?.valueChanges
         .pipe(takeUntilDestroyed(this.destroyRef))
         .subscribe(newsletter => {
           const emailControl = this.form.get('personalInfo.email');
           if (newsletter) {
             emailControl?.addValidators(Validators.required);
           } else {
             emailControl?.removeValidators(Validators.required);
           }
           emailControl?.updateValueAndValidity();
         });
     }
     ```

5. **Fehleranzeige für Cross-Field-Validierung**
   - Zeige gruppenspezifische Fehler im Template an:
     ```html
     @if (form.get('credentials')?.errors?.['passwordMismatch'] &&
          form.get('credentials')?.touched) {
       <div class="error" role="alert">
         Die Passwörter stimmen nicht überein.
       </div>
     }
     ```

### Hinweise

- Cross-Field-Validators werden auf der FormGroup angewendet, nicht auf einzelnen Controls.
- Asynchrone Validators werden erst ausgeführt, wenn alle synchronen Validators bestanden sind.
- `updateOn: 'blur'` reduziert die Anzahl der asynchronen Validierungsaufrufe.
- `takeUntilDestroyed()` sorgt automatisch für das Aufräumen von Subscriptions.
- Validierungsfehler auf Gruppen-Ebene werden über `group.errors` abgerufen, nicht über einzelne Controls.

### Musterlösung

Siehe Branch `step/14-validation-complete` im Repository.

---

## Übung 4.3: Barrierefreie Dropdown-Komponente mit ARIA

### Ziel

Eine vollständig barrierefreie Custom-Dropdown-Komponente erstellen, die ARIA-Attribute korrekt verwendet und per Tastatur bedienbar ist. Die WCAG 2.1 AA-Anforderungen werden umgesetzt.

### Voraussetzungen

- Branch: `step/15-a11y-start`
- Übung 4.2 abgeschlossen
- Grundkenntnisse in HTML-Semantik und ARIA

### Aufgaben

1. **Komponenten-Grundstruktur erstellen**
   - Erstelle eine `AccessibleDropdownComponent` als Standalone-Komponente:
     ```typescript
     @Component({
       selector: 'app-accessible-dropdown',
       standalone: true,
       imports: [],
       template: `...`,
       styles: `...`
     })
     export class AccessibleDropdownComponent {
       options = input.required<DropdownOption[]>();
       label = input.required<string>();
       placeholder = input('Bitte wählen...');

       selectedOption = model<DropdownOption | null>(null);
       isOpen = signal(false);
       activeIndex = signal(-1);
       dropdownId = signal(`dropdown-${crypto.randomUUID()}`);
     }
     ```

2. **ARIA-konforme Template-Struktur**
   - Implementiere das Template mit korrekten ARIA-Rollen und -Attributen:
     ```html
     <div class="dropdown-wrapper">
       <label [id]="dropdownId() + '-label'">{{ label() }}</label>

       <button
         type="button"
         role="combobox"
         [attr.aria-expanded]="isOpen()"
         [attr.aria-haspopup]="'listbox'"
         [attr.aria-labelledby]="dropdownId() + '-label'"
         [attr.aria-activedescendant]="activeIndex() >= 0
           ? dropdownId() + '-option-' + activeIndex()
           : null"
         (click)="toggle()"
         (keydown)="handleKeydown($event)">
         {{ selectedOption()?.label ?? placeholder() }}
       </button>

       @if (isOpen()) {
         <ul
           role="listbox"
           [attr.aria-labelledby]="dropdownId() + '-label'"
           [id]="dropdownId() + '-listbox'">
           @for (option of options(); track option.value; let i = $index) {
             <li
               role="option"
               [id]="dropdownId() + '-option-' + i"
               [attr.aria-selected]="selectedOption()?.value === option.value"
               [class.active]="activeIndex() === i"
               (click)="selectOption(option)"
               (mouseenter)="activeIndex.set(i)">
               {{ option.label }}
             </li>
           }
         </ul>
       }
     </div>
     ```

3. **Keyboard-Navigation implementieren**
   - Implementiere die vollständige Tastatursteuerung:
     ```typescript
     handleKeydown(event: KeyboardEvent) {
       const opts = this.options();

       switch (event.key) {
         case 'ArrowDown':
           event.preventDefault();
           if (!this.isOpen()) {
             this.isOpen.set(true);
             this.activeIndex.set(0);
           } else {
             this.activeIndex.update(i =>
               Math.min(i + 1, opts.length - 1)
             );
           }
           break;

         case 'ArrowUp':
           event.preventDefault();
           if (this.isOpen()) {
             this.activeIndex.update(i => Math.max(i - 1, 0));
           }
           break;

         case 'Enter':
         case ' ':
           event.preventDefault();
           if (this.isOpen() && this.activeIndex() >= 0) {
             this.selectOption(opts[this.activeIndex()]);
           } else {
             this.isOpen.set(true);
           }
           break;

         case 'Escape':
           this.isOpen.set(false);
           break;

         case 'Home':
           event.preventDefault();
           this.activeIndex.set(0);
           break;

         case 'End':
           event.preventDefault();
           this.activeIndex.set(opts.length - 1);
           break;

         default:
           // Typeahead: Springe zum ersten Element, das mit dem
           // gedrückten Buchstaben beginnt
           this.handleTypeahead(event.key);
           break;
       }
     }
     ```

4. **Focus-Management**
   - Stelle sicher, dass der Fokus korrekt verwaltet wird:
     ```typescript
     private buttonRef = viewChild<ElementRef>('triggerButton');

     selectOption(option: DropdownOption) {
       this.selectedOption.set(option);
       this.isOpen.set(false);
       this.buttonRef()?.nativeElement.focus();
     }

     // Klick außerhalb schließt das Dropdown
     @HostListener('document:click', ['$event'])
     onDocumentClick(event: Event) {
       if (!this.elementRef.nativeElement.contains(event.target)) {
         this.isOpen.set(false);
       }
     }
     ```

5. **Live-Region für Screenreader**
   - Füge eine Live-Region hinzu, die Änderungen ansagt:
     ```html
     <div aria-live="polite" class="sr-only">
       @if (selectedOption()) {
         {{ selectedOption()!.label }} ausgewählt
       }
     </div>
     ```
   - Definiere die `.sr-only`-CSS-Klasse:
     ```css
     .sr-only {
       position: absolute;
       width: 1px;
       height: 1px;
       padding: 0;
       margin: -1px;
       overflow: hidden;
       clip: rect(0, 0, 0, 0);
       border: 0;
     }
     ```

### Hinweise

- `role="combobox"` mit `aria-expanded` und `aria-haspopup="listbox"` ist das korrekte ARIA-Pattern für Dropdowns.
- `aria-activedescendant` zeigt dem Screenreader an, welches Element aktuell hervorgehoben ist.
- `aria-selected` markiert die aktuelle Auswahl in der Liste.
- Keyboard-Navigation muss den WAI-ARIA Combobox-Pattern folgen (Pfeiltasten, Enter, Escape, Home, End).
- Die Live-Region (`aria-live="polite"`) informiert Screenreader über Änderungen, ohne den aktuellen Lesefluss zu unterbrechen.
- Teste mit einem Screenreader (VoiceOver auf macOS, NVDA auf Windows).

### Musterlösung

Siehe Branch `step/15-a11y-complete` im Repository.

---

## Bonus: Keyboard-Navigation testen

### Ziel

Automatisierte Tests für die Tastaturnavigation und Barrierefreiheit der Dropdown-Komponente schreiben.

### Voraussetzungen

- Branch: `step/15-a11y-complete`
- Übungen 4.1 bis 4.3 abgeschlossen

### Aufgaben

1. **Keyboard-Interaktionstests mit Vitest**
   ```typescript
   describe('AccessibleDropdownComponent - Keyboard', () => {
     let component: AccessibleDropdownComponent;
     let fixture: ComponentFixture<AccessibleDropdownComponent>;

     const testOptions: DropdownOption[] = [
       { value: 'de', label: 'Deutschland' },
       { value: 'at', label: 'Österreich' },
       { value: 'ch', label: 'Schweiz' }
     ];

     beforeEach(async () => {
       await TestBed.configureTestingModule({
         imports: [AccessibleDropdownComponent]
       }).compileComponents();

       fixture = TestBed.createComponent(AccessibleDropdownComponent);
       component = fixture.componentInstance;
       fixture.componentRef.setInput('options', testOptions);
       fixture.componentRef.setInput('label', 'Land auswählen');
       fixture.detectChanges();
     });

     it('sollte das Dropdown mit ArrowDown öffnen', () => {
       const button = fixture.nativeElement.querySelector('button');
       button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
       fixture.detectChanges();

       expect(component.isOpen()).toBe(true);
       expect(component.activeIndex()).toBe(0);
     });

     it('sollte mit Enter eine Option auswählen', () => {
       component.isOpen.set(true);
       component.activeIndex.set(1);
       fixture.detectChanges();

       const button = fixture.nativeElement.querySelector('button');
       button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
       fixture.detectChanges();

       expect(component.selectedOption()?.value).toBe('at');
       expect(component.isOpen()).toBe(false);
     });

     it('sollte mit Escape schließen ohne Auswahl', () => {
       component.isOpen.set(true);
       fixture.detectChanges();

       const button = fixture.nativeElement.querySelector('button');
       button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
       fixture.detectChanges();

       expect(component.isOpen()).toBe(false);
       expect(component.selectedOption()).toBeNull();
     });
   });
   ```

2. **ARIA-Attribute testen**
   ```typescript
   describe('ARIA-Attribute', () => {
     it('sollte aria-expanded korrekt setzen', () => {
       const button = fixture.nativeElement.querySelector('button');

       expect(button.getAttribute('aria-expanded')).toBe('false');

       component.isOpen.set(true);
       fixture.detectChanges();

       expect(button.getAttribute('aria-expanded')).toBe('true');
     });

     it('sollte aria-activedescendant korrekt aktualisieren', () => {
       component.isOpen.set(true);
       component.activeIndex.set(2);
       fixture.detectChanges();

       const button = fixture.nativeElement.querySelector('button');
       const expectedId = component.dropdownId() + '-option-2';
       expect(button.getAttribute('aria-activedescendant')).toBe(expectedId);
     });

     it('sollte aria-selected auf der gewählten Option setzen', () => {
       component.isOpen.set(true);
       component.selectedOption.set(testOptions[0]);
       fixture.detectChanges();

       const options = fixture.nativeElement.querySelectorAll('[role="option"]');
       expect(options[0].getAttribute('aria-selected')).toBe('true');
       expect(options[1].getAttribute('aria-selected')).toBe('false');
     });
   });
   ```

3. **Automatisierte A11y-Prüfung mit axe-core**
   ```typescript
   import axe from 'axe-core';

   it('sollte keine Barrierefreiheitsprobleme haben', async () => {
     component.isOpen.set(true);
     fixture.detectChanges();

     const results = await axe.run(fixture.nativeElement);
     expect(results.violations).toEqual([]);
   });
   ```

4. **Focus-Tests**
   ```typescript
   it('sollte den Fokus nach Auswahl zurück auf den Button setzen', () => {
     component.isOpen.set(true);
     fixture.detectChanges();

     component.selectOption(testOptions[0]);
     fixture.detectChanges();

     const button = fixture.nativeElement.querySelector('button');
     expect(document.activeElement).toBe(button);
   });
   ```

### Hinweise

- Verwende `dispatchEvent(new KeyboardEvent(...))` für Tastatur-Simulation in Tests.
- `axe-core` kann als npm-Paket installiert werden: `npm install -D axe-core`.
- Die `ComponentFixture.componentRef.setInput()` Methode setzt Input-Signals in Tests.
- Fokus-Tests können fragil sein -- stelle sicher, dass `fixture.detectChanges()` vor der Fokus-Prüfung aufgerufen wird.
- Teste sowohl den geöffneten als auch den geschlossenen Zustand des Dropdowns.

### Musterlösung

Siehe Branch `step/16-a11y-tests-complete` im Repository.
