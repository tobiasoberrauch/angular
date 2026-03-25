# Migration Checklist: NgModules → Standalone Components

## Prerequisites
- [ ] Angular 15+ (standalone components available since v15)
- [ ] Understand the project's NgModule dependency graph
- [ ] Identify shared modules that many components depend on

## Step-by-Step Migration

### 1. Migrate Leaf Components First
- [ ] Identify components with no child components (leaf nodes)
- [ ] Add `standalone: true` to `@Component` decorator (default in Angular 21)
- [ ] Move `CommonModule` directives to per-component `imports`:
  - `*ngIf` → import `NgIf` or use `@if` control flow (preferred in v17+)
  - `*ngFor` → import `NgFor` or use `@for` control flow (preferred in v17+)
  - `| date` → import `DatePipe`
  - `| currency` → import `CurrencyPipe`
- [ ] Remove component from NgModule `declarations` array
- [ ] Add component to `imports` of any module still using it

### 2. Convert Control Flow (Angular 17+)
- [ ] Replace `*ngIf="condition"` with `@if (condition) { ... }`
- [ ] Replace `*ngFor="let item of items"` with `@for (item of items; track item.id) { ... }`
- [ ] Replace `[ngSwitch]` / `*ngSwitchCase` with `@switch (value) { @case (...) { ... } }`
- [ ] Remove `CommonModule` import if only used for structural directives

### 3. Update Routing
- [ ] Replace `loadChildren` (NgModule) with `loadComponent` (standalone):
  ```typescript
  // Before (NgModule):
  { path: 'feature', loadChildren: () => import('./feature.module').then(m => m.FeatureModule) }

  // After (Standalone):
  { path: 'feature', loadComponent: () => import('./feature.component').then(m => m.FeatureComponent) }

  // Or with child routes:
  { path: 'feature', loadChildren: () => import('./feature.routes').then(m => m.featureRoutes) }
  ```

### 4. Migrate Services
- [ ] Ensure services use `providedIn: 'root'` (no module dependency)
- [ ] Move `providers` from NgModule to component-level or `app.config.ts`

### 5. Remove NgModule
- [ ] Delete the `*.module.ts` file
- [ ] Remove from `app.module.ts` imports (if root module still exists)
- [ ] Update any barrel exports (`index.ts`)

### 6. Final Verification
- [ ] Run `ng build` — no compilation errors
- [ ] Run `ng test` — all tests pass
- [ ] Check lazy loading works (`Network` tab shows chunk loading)
- [ ] Verify no circular dependencies introduced

## Project Files Reference
| Before | After |
|--------|-------|
| `src/app/legacy/legacy.module.ts` | Delete this file |
| `src/app/legacy/legacy-dashboard/legacy-dashboard.component.ts` | Remove `standalone: false` |
| `src/app/app.routes.ts` (loadChildren) | Change to `loadComponent` |

## Common Pitfalls
- Forgetting to import pipes/directives per-component
- Missing `track` expression in `@for` control flow
- Not updating barrel exports after module deletion
