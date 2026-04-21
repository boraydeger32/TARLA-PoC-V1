# CLAUDE.md — Aperant Admin Panel Project Constitution

> **Scope:** This document is read by Claude Code / Aperant agents at the start of every session. It defines **non-negotiable invariants**. Any deviation requires explicit human approval.
>
> **Canonical spec sources (in priority order):**
> 1. `specs/admin-panel/requirements.md` — WHAT to build (EARS requirements)
> 2. `specs/admin-panel/design.md` — HOW to build it (architecture)
> 3. `specs/admin-panel/tasks.md` — WHEN to build what (ordered phases)
> 4. This file (`CLAUDE.md`) — global invariants + coding rules

---

## 🚨 Inviolable Rules

### Rule 1: Frontend-Only (Phase 1)
- **DO NOT** create any backend code. No FastAPI, no Express, no Node server, no Docker Compose for a backend.
- **DO NOT** introduce real databases, real authentication, real storage, or real payment gateways.
- All API behavior is simulated via **MSW (Mock Service Worker)**.
- The only runtime is the **Vite dev server** and Vitest/Playwright test runners.

### Rule 2: Backend-Agnostic Services
- The `services/` layer is the **ONLY** layer allowed to import `axios` or call HTTP.
- **Views / pages / Alpine components SHALL NOT import axios or call fetch directly.**
- **Query wrappers SHALL NOT import axios directly** — they call service methods via singletons.
- This invariant exists so that swapping MSW → live FastAPI requires **zero code changes**.

### Rule 3: DTO Naming = Pydantic Naming
- Every domain entity SHALL be defined with a **zod schema** AND a matching **JSDoc `@typedef`** whose name matches the eventual Pydantic model name exactly.
- Convention: `XxxBase`, `XxxCreate`, `XxxUpdate`, `XxxResponse`.
- Use `snake_case` for backend fields (to match Pydantic's default). Do NOT camelCase field names in DTOs.
- Example: `created_at`, not `createdAt`. `user_id`, not `userId`.

### Rule 4: No Hardcoded User-Facing Strings
- Every string visible to the user SHALL be wrapped in `i18n.t('namespace.key')` or rendered via the `x-t` Alpine directive.
- Hardcoded Turkish or English strings in HTML templates / Alpine components are **always a bug**.
- Exception: test fixtures, console.error messages, HTML meta tags.

### Rule 5: JavaScript Discipline
- The project is **plain JavaScript (ES2022+)** — no TypeScript compiler.
- Use **JSDoc** (`@typedef`, `@param`, `@returns`) for type hints on public service methods, store definitions, and DTO shapes.
- Use **zod** for runtime validation of anything crossing the API boundary or form boundary.
- `jsconfig.json` SHALL define the `@/` alias for IDE tooling.
- Prefer explicit null checks over `??` chains longer than two steps.

### Rule 6: State Separation
- **Alpine stores** (`Alpine.store(...)`) = client-owned state only: `auth`, `theme`, `locale`, `ui`.
- **@tanstack/query-core** = server-owned state only: anything from `/api/v1/*`.
- **NEVER** store API response data in Alpine stores.
- **NEVER** store UI state (sidebar open, modal visible) in the query cache.

### Rule 7: File Size Discipline
- No single file SHALL exceed **300 lines** (excluding fixture arrays and i18n JSON files).
- When approaching the limit, extract sub-templates, Alpine component factories, or utility functions.

### Rule 8: Folder Structure Is Canonical
- The folder structure in `design.md` §2 is **immutable**.
- Do not introduce new top-level directories under `src/` without updating `design.md` first.
- Do not move files between layers to "fix an import issue" — fix the import pattern instead.

---

## 📐 Code Style & Conventions

### JavaScript
- Prefer `const` over `let`; never use `var`.
- Use ES modules exclusively (`import` / `export`). No CommonJS in source.
- Use `Object.freeze(...)` for constant config objects that must not mutate.
- Prefer named exports over default exports, **except** for page entry modules where a single default export is expected by the router.
- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of defensive `&&` chains.

### Alpine.js
- Alpine **data factories** (functions returned to `x-data="factoryName()"`) SHALL live in `src/controllers/` or `src/views/**/page.js` — never inline in HTML beyond trivial `{ open: false }` shapes.
- Always register Alpine components via `Alpine.data('name', factory)` at app boot, not by inline `x-data="{...}"` for anything non-trivial.
- Always register stores via `Alpine.store('name', {...})` — no ad-hoc globals.
- Use Alpine's built-in `x-show`, `x-if`, `x-for`, `x-bind`, `x-on`, `x-model`. Do not manipulate the DOM imperatively from Alpine methods unless the task requires a third-party widget (Grid.js, ApexCharts).
- `x-cloak` SHALL be present on every root element that would cause a flash of unstyled/expanded content.

### Flowbite + Tailwind
- **Components come from Flowbite** — prefer Flowbite's documented markup over custom components for modals, drawers, dropdowns, tabs, toasts, accordions, tooltips.
- **Styling uses Tailwind utility classes** — no `<style>` blocks in HTML templates except for truly dynamic values set via `x-bind:style`.
- Always use Tailwind **semantic tokens** defined in `tailwind.config.js` (`primary`, `secondary`, `surface`, etc.), never raw hex colors in class names beyond rare edge cases.
- Respond to dark mode via Tailwind's `dark:` prefix, never via a separate stylesheet or CSS media queries.
- Never use inline `style="..."` for static values.

### Forms
- Always use **Alpine `x-model`** bindings with **zod** schemas for validation.
- Validation messages SHALL be i18n keys, not hardcoded strings.
- Use the shared form components (Alpine factories) in `src/components/forms/` — do not wire raw `<input>` elements with ad-hoc validation in pages.
- Form submission SHALL be done via a controller function (in `src/controllers/`) that calls a service method through a query wrapper — never via `fetch` or `axios` directly.

### Naming
- Page HTML files: `kebab-case.html` — e.g. `listings-list.html`.
- Page JS modules: `kebab-case.js` matching the HTML — e.g. `listings-list.js`.
- Alpine component factories: `camelCase` functions — e.g. `listingsTableComponent()`.
- Services: `PascalCaseService.js` — e.g. `ListingsService.js`.
- Models: domain entity `PascalCase.js` — e.g. `Listing.js`.
- Alpine stores: `camelCaseStore.js` — e.g. `authStore.js`.
- i18n keys: `dot.case` — e.g. `listings.actions.approve`.
- Query keys: via `queryKeys` factory, never ad-hoc arrays.

### Imports
- Always use the `@/` path alias for `src/*` (configured in `vite.config.js` and `jsconfig.json`).
- Group imports: (1) external packages, (2) `@/` internal, (3) relative (`./`, `../`), (4) styles/assets.
- No circular imports between layers (Biome enforces).

---

## 🔒 Layer Dependency Rules

```
views/components ──► controllers ──► queries ──► services ──► api
       │                 │              │
       ▼                 ▼              ▼
     stores          stores         (read-only via Alpine.store)
```

- `views/` MAY import from: `controllers/`, `queries/`, `stores/`, `components/`, `layouts/`, `utils/`, `constants/`, `i18n/`, `models/`.
- `controllers/` MAY import from: `queries/`, `services/`, `stores/`, `models/`, `utils/`.
- `queries/` MAY import from: `services/`, `constants/queryKeys`, `models/`.
- `services/` MAY import from: `api/`, `models/`.
- `api/` MAY import from: `stores/` (for reading auth token), `utils/`.
- `stores/` MAY import from: `models/`, `utils/`.
- `models/` MAY import from: nothing project-specific. Pure domain schemas.

**Forbidden imports:**
- `services/` importing `controllers/`, `queries/`, or `views/`
- `stores/` importing `services/` directly (go through controllers)
- Any circular import

---

## 🧪 Testing Requirements

- Every `services/*Service.js` → unit test with mocked axios.
- Every Alpine store → unit test covering state transitions.
- Every `utils/*.js` pure function → unit test.
- Every **page** → at least one Playwright smoke test.
- Never skip tests to "fix later". If a feature lacks a test, the task is not DONE.
- DOM-level unit tests use `@testing-library/dom` with `happy-dom` or `jsdom`.

---

## 🌐 i18n Rules

- Always add keys to **both** `tr/*.json` and `en/*.json` in the same commit.
- TR is the default; EN is the fallback.
- Key structure: `<namespace>.<feature>.<sub>`. Examples:
  - `listings.list.title`
  - `listings.actions.approve`
  - `forms.validation.required`
  - `errors.http.401`
- Use i18next interpolation: `t('users.greeting', { name })`.
- For plurals, use i18next's plural suffixes (`_zero`, `_one`, `_other`).
- In HTML templates, translate via the `x-t` Alpine directive: `<span x-t="'listings.list.title'"></span>`.

---

## 🎨 Theme Rules

- Two modes: `light` and `dark`. System preference supported via `mode: 'system'`.
- Color tokens live in `tailwind.config.js` (`theme.extend.colors`). Never use hex colors directly in HTML class attributes.
- Dark mode strategy: Tailwind `darkMode: 'class'` — the `themeStore` toggles `<html>`'s `dark` class.
- Persistence key: `aperant.theme` in localStorage.

---

## 🌍 Environment Variables

All env vars SHALL be prefixed `VITE_` and documented in `.env.example`.

| Var | Purpose | Default (dev) |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for API calls | `http://localhost:5173/api/v1` |
| `VITE_USE_MOCKS` | Enable MSW interception | `true` |
| `VITE_APP_VERSION` | Version shown in footer | from `package.json` at build time |

---

## 📦 Package Management

- Use `pnpm` (not npm or yarn).
- Lock file is `pnpm-lock.yaml` — always commit it.
- No `package-lock.json` or `yarn.lock` SHALL exist in the repo.

---

## 🔄 Git & Commit Conventions

- **Conventional Commits** required:
  - `feat(listings): add approval dialog`
  - `fix(auth): handle 401 on token refresh`
  - `refactor(services): extract BaseService CRUD`
  - `chore(deps): bump flowbite to 2.5`
  - `test(services): add ListingsService unit tests`
  - `docs(readme): update dev setup`
- Branch naming: `feature/<task-slug>` (matches Aperant task slug).
- No direct commits to `main`. PRs only (even solo work — forces review discipline).

---

## ❌ Forbidden Patterns

1. ❌ `axios` imported outside `src/api/`
2. ❌ Hardcoded strings in HTML or Alpine templates (Turkish or English)
3. ❌ Using React, Vue, Svelte, or any other component framework — Alpine.js only
4. ❌ Introducing a second UI library (stick to Flowbite + Tailwind)
5. ❌ `document.getElementById` / direct DOM manipulation (use Alpine `$refs` or reactive bindings)
6. ❌ Inline `style="..."` for non-dynamic styles
7. ❌ Storing fetched API data in Alpine stores
8. ❌ Storing UI state in the query cache
9. ❌ Circular imports between layers
10. ❌ Committing `console.log` in production code (Biome warns)
11. ❌ Skipping tests to meet a deadline
12. ❌ Writing custom CSS for anything Flowbite already provides
13. ❌ Using CommonJS (`require`, `module.exports`) in source
14. ❌ Long inline `x-data="{...}"` expressions — extract to a named factory
15. ❌ Mutating Alpine store state from outside store methods — define mutator methods on the store

---

## ✅ When in Doubt

1. Re-read `specs/admin-panel/design.md` — it probably has the answer.
2. Check how the **Listings module** (reference implementation) solved it.
3. If truly ambiguous, pause the agent via `PAUSE` file or `HUMAN_INPUT.md` and ask.

---

## 📝 Project Context (for agent grounding)

- **Product:** Aperant — a Turkish real-estate marketplace focused on **land/plot (arsa) listings**, competing with Sahibinden.com's land section.
- **User of this panel:** Platform admins (super_admin, moderator, content_manager roles).
- **Primary language:** Turkish (users, UI, domain terms). English is a secondary translation.
- **Deployment target:** Static hosting (Vercel / Netlify / S3+CloudFront) for the frontend. Backend (FastAPI) will be separate.
- **Timeline:** Phase 1 is frontend MVP. Phase 2 (backend) begins after Phase 1 sign-off.

---

**Last updated:** Initial draft. Update this file whenever an invariant changes.
