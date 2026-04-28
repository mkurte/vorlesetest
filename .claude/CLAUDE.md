
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Architecture Patterns

- Page components should be as "dumb" as possible — logic lives in a dedicated page service
- Ideal dumb component: `protected readonly vm = inject(PageService).viewModel;` — nothing else
- Each page gets its own service (e.g. `SetupService`), provided in the component via `providers: []`, not `providedIn: 'root'`
- Services expose a `viewModel` signal (computed) containing all template state
- Form fields in the viewModel use a `FormField<T>` pattern with `value` and `onChange`
- Actions like `start()`, `next()` are also part of the viewModel — components don't hold logic
- Navigation (`router.navigate`) happens inside the page service, not in the component
- Shared state between pages goes through a global service (e.g. `ReadingTestService` with `providedIn: 'root'`)
- Use `DestroyRef.onDestroy()` for cleanup (e.g. `clearInterval`) in services
- Use `host: { '(document:click)': '...' }` for document-level event listeners (not `@HostListener`)

## Testing

- Test framework is Vitest (via `@angular/build:unit-test`), not Karma/Jasmine
- Use `vi.fn()` for mocks, not `jasmine.createSpy()`
- Use `describe(ClassName, ...)` instead of `describe('ClassName', ...)`
- Run tests with `npx ng test --watch=false`
- Use `vi.useFakeTimers()` / `vi.advanceTimersByTime()` for timer-based tests
- Use `TestBed.runInInjectionContext(() => new Service())` to create services with fresh state in tests
- `fakeAsync`/`tick` not available (no zone.js) — use `vi.useFakeTimers()` instead

## Project Structure

- Pages live in `src/app/pages/<page-name>/`
- Each page has: `<name>.ts`, `<name>.html`, `<name>.scss`, `<name>.service.ts`, `<name>.spec.ts`, `<name>.service.spec.ts`
- Global services live in `src/app/services/`
- Routes use lazy loading via `loadComponent`
- Font: Roboto via Google Fonts
- SCSS files include `:host { display: block; }`
- Route flow: `/setup` → `/test` → `/result`
- `ReadingTestService` (global) holds shared state: `words`, `totalSeconds`, `wordsRead`, `colorSyllables`
- localStorage key `vorlesetest-words` persists the word list as JSON array across sessions
- Words support syllable notation with hyphens (e.g. `Mie-te`, `A-mei-se`) — split into `string[]` on test page
- CSS class naming uses BEM-like modifiers (e.g. `syllable--even`, `syllable--odd`)
- When navigating to a page with `(document:click)`, use a `setTimeout` ready-flag to ignore the triggering click (event bubbling from previous page)
