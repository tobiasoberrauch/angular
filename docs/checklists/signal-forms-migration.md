# Migration Checklist: Reactive Forms → Signal Forms

## Prerequisites
- [ ] Angular 21+ (Signal Forms is experimental)
- [ ] Components already use Signals for state management
- [ ] Understand the current Reactive Forms usage in the project

## API Comparison

### Form Creation
| Reactive Forms | Signal Forms |
|---------------|--------------|
| `new FormGroup({...})` | `form(signal(defaultValues), schemaFn)` |
| `new FormControl('', Validators.required)` | Schema-based validation |
| `FormBuilder.group({...})` | Not needed — `form()` handles creation |

### Form Binding
| Reactive Forms | Signal Forms |
|---------------|--------------|
| `[formGroup]="form"` | `[formGroup]="form"` |
| `[formControl]="control"` | `[formField]="form.fields.name"` |
| `formControlName="name"` | `formFieldName="name"` |

### Validation
| Reactive Forms | Signal Forms |
|---------------|--------------|
| `Validators.required` | `required()` in schema |
| `Validators.email` | `email()` in schema |
| `Validators.minLength(3)` | `minLength(3)` in schema |
| Custom validator function | Custom validation in schema function |
| `control.errors` | `field.errors()` (signal!) |
| `control.valid` | `field.valid()` (signal!) |

### State Access
| Reactive Forms | Signal Forms |
|---------------|--------------|
| `form.value` | `form.value()` (signal) |
| `control.value` | `field.value()` (signal) |
| `control.dirty` | `field.dirty()` (signal) |
| `control.touched` | `field.touched()` (signal) |
| `form.valueChanges` (Observable) | `form.value` (signal — use computed/effect) |
| `form.statusChanges` (Observable) | `form.valid` (signal — use computed/effect) |

## Migration Steps

### Step 1: Identify Forms
- [ ] List all FormGroup/FormControl usage in the project
- [ ] Categorize by complexity (simple inputs vs nested forms vs dynamic arrays)

### Step 2: Create Signal Form Equivalents
```typescript
// Before (Reactive Forms):
form = new FormGroup({
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  email: new FormControl('', [Validators.required, Validators.email]),
});

// After (Signal Forms — conceptual):
const defaults = signal({ name: '', email: '' });
const form = form(defaults, (value) => ({
  name: { required: !value.name, minLength: value.name.length < 3 },
  email: { required: !value.email, email: !isEmail(value.email) },
}));
```

### Step 3: Update Templates
```html
<!-- Before (Reactive Forms): -->
<input [formControl]="form.controls.name">
<div *ngIf="form.controls.name.errors?.['required']">Required</div>

<!-- After (Signal Forms — conceptual): -->
<input [formField]="form.fields.name">
@if (form.fields.name.errors().required) {
  <div>Required</div>
}
```

### Step 4: Replace subscriptions with effects
```typescript
// Before: Observable-based reaction
this.form.valueChanges.subscribe(value => this.updatePreview(value));

// After: Signal-based reaction
effect(() => this.updatePreview(this.form.value()));
```

## Key Benefits
- **No more `valueChanges` Observables** — form state is a signal
- **Simpler validation** — schema function replaces validator classes
- **Better TypeScript inference** — full type safety from default values
- **Zoneless-compatible** — signals trigger change detection automatically
- **Less boilerplate** — no FormBuilder, no separate validator imports

## Current Project Status
Signal Forms is experimental in Angular 21. The project uses Reactive Forms
with Signals integration to demonstrate the concepts. See:
- `src/app/features/tasks/ui/task-form/task-form.component.ts` — Side-by-side comparison
- `src/app/features/ecommerce/ui/checkout/checkout.component.ts` — Reactive Forms + Signals

## Verification
- [ ] All forms validate correctly
- [ ] Error messages display properly
- [ ] Form submission works
- [ ] Computed state derived from form values updates reactively
