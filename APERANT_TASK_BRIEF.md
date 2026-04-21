# Aperant Task Briefs — Kanban Paste-in Descriptions

> **How to use:** For each task below, copy the block between the `BEGIN COPY` and `END COPY` markers into Aperant's "New Task" Kanban dialog as the task description. Create tasks **in order** — do not start Task 2 until Task 1 is QA-approved and merged.
>
> **Why this works:** Aperant's `spec_gatherer.md` agent extracts structured requirements from the prose you paste. By referencing the canonical `specs/admin-panel/*.md` files (which you commit to the repo BEFORE opening Aperant), you force the agent to read those files as canonical context instead of inventing its own interpretation.

---

## 🏁 Pre-Flight Checklist (one-time, before Task 1)

Before opening Aperant for the first time, do this in your empty Git repository:

1. Commit `CLAUDE.md` at the repo root.
2. Commit `specs/admin-panel/requirements.md`.
3. Commit `specs/admin-panel/design.md`.
4. Commit `specs/admin-panel/tasks.md`.
5. Initial commit message: `chore: add project specs and constitution`
6. Open the repo in Aperant. Verify the repo is detected and `.aperant/` directory appears (gitignored).
7. Now create Task 1.

---

## Task 1 — Project Scaffolding & Infrastructure

### Kanban Title
`[01-scaffold] Project Scaffolding & Infrastructure`

### Paste-in Description

```
BEGIN COPY ───────────────────────────────────────────────────────────

## Context

Read these files FIRST and treat them as the canonical specification:
- `CLAUDE.md` — project-wide invariants (MANDATORY to read before any file creation)
- `specs/admin-panel/requirements.md` — functional requirements (EARS format)
- `specs/admin-panel/design.md` — architectural contract (folder structure, class schemas, patterns)
- `specs/admin-panel/tasks.md` — full task breakdown (this task is Task 1 of 7+)

## Goal

Scaffold a new Vite + Alpine.js + Flowbite + Tailwind project using plain JavaScript (NO TypeScript compiler) in the repository root. Install and configure all dependencies listed in `requirements.md` §2. Create the complete folder structure per `design.md` §2. Configure Biome for lint/format. Verify the dev server runs with a placeholder page.

## Critical Constraints

- This is a **FRONTEND-ONLY** project. DO NOT create FastAPI, Express, Docker backend, or any Node server. MSW will simulate the API in Task 4.
- Use **pnpm** as the package manager (not npm, not yarn).
- Use the **exact** folder structure in `design.md` §2. Create empty files or files with `// TODO: implement in Task N` comments as placeholders where needed.
- **No React, no Vue, no Svelte.** Alpine.js is the runtime.
- **No TypeScript compiler.** JavaScript (ES2022+) only. Use `jsconfig.json` for IDE path alias `@/` → `src/`. Use JSDoc typedefs + zod for type hints.
- **Flowbite + Tailwind only** for UI — no other UI library.
- DO NOT implement any domain features, routing beyond a stub, Alpine stores beyond empty shells, or MSW in this task — those are separate tasks.

## Acceptance Criteria (EARS)

WHEN `pnpm install` is run THEN all dependencies from requirements.md §2 SHALL be installed at the specified major versions.

WHEN `pnpm dev` is run THEN the dev server SHALL start on port 5173 AND a placeholder page SHALL render without console errors.

WHEN `pnpm lint` is run THEN Biome SHALL pass with zero errors.

WHEN the repo structure is inspected THEN every directory and file specified in `design.md` §2 SHALL exist (placeholder content is acceptable).

WHEN `jsconfig.json` is inspected THEN it SHALL map `@/*` to `src/*` AND set `checkJs: true` for JSDoc-aware editors.

WHEN `vite.config.js` is inspected THEN it SHALL resolve the `@/` alias AND enable `?raw` imports for `.html` files.

WHEN `tailwind.config.js` is inspected THEN it SHALL have `darkMode: 'class'`, register the `flowbite/plugin`, AND its `content` glob SHALL cover `./index.html` plus `./src/**/*.{html,js}`.

WHEN `.env.example` is inspected THEN it SHALL document `VITE_API_BASE_URL` and `VITE_USE_MOCKS`.

WHEN `package.json` scripts section is inspected THEN it SHALL have: `dev`, `build`, `preview`, `lint`, `format`, `test`, `test:e2e`.

## Done Definition

- Placeholder landing page shows "Aperant Admin — Initializing" styled via Flowbite/Tailwind (proves the stack is wired)
- All scripts in package.json work
- Repo commits follow Conventional Commits
- No backend code exists anywhere in the repo

END COPY ─────────────────────────────────────────────────────────────
```

---

## Task 2 — Theme System & i18n Foundation

### Kanban Title
`[02-theme-i18n] Tailwind Dark Mode + i18next (TR/EN) + Alpine x-t`

### Paste-in Description

```
BEGIN COPY ───────────────────────────────────────────────────────────

## Context

Task 1 (project scaffolding) is complete. Now build the theme system and i18n infrastructure.

Read these files FIRST:
- `CLAUDE.md` — especially Rules 4, 7, and the i18n/Theme sections
- `specs/admin-panel/design.md` §6 (Tailwind theme) and §7 (i18n)
- `specs/admin-panel/requirements.md` §4.13 (theme & localization requirements)

## Goal

Build the Tailwind theme system supporting Light + Dark modes via `darkMode: 'class'`. Wire it through the `themeStore` Alpine store with localStorage persistence. Initialize i18next with TR default and EN fallback, all namespaces listed in `design.md` §7.3 populated with skeleton keys. Register the custom `x-t` Alpine directive.

## Critical Constraints

- Color tokens MUST live in `tailwind.config.js` under `theme.extend.colors` (sourced from `src/theme/colors.js`). Never hardcode hex colors in class names beyond rare edge cases.
- The theme SHALL respect system preference when the user has not yet chosen (mode: 'system').
- Persistence keys: `aperant.theme` and `aperant.locale` in localStorage.
- All 4 Alpine stores (`auth`, `theme`, `locale`, `ui`) must be created and registered via `Alpine.store(...)`. `auth` can remain a stub — Task 5 completes it.
- i18n namespaces: `common`, `navigation`, `listings`, `users`, `forms`, `errors`, `dashboard`, `settings`. Each must have at least 10 placeholder keys in BOTH tr/*.json and en/*.json.
- The `x-t` directive SHALL update the element's text content when the key changes AND when `i18next.on('languageChanged')` fires.

## Acceptance Criteria (EARS)

WHEN the app mounts THEN it SHALL apply Light mode by default OR system preference if set.

WHEN `$store.theme.toggle()` is called THEN the `dark` class on `<html>` SHALL flip AND the UI SHALL update instantly.

WHEN the theme changes THEN the value SHALL persist to `localStorage['aperant.theme']`.

WHEN the app reloads THEN the previously chosen theme SHALL be restored.

WHEN `i18next.init()` runs THEN TR SHALL be the default AND EN SHALL be the fallback.

WHEN `$store.locale.setLanguage('en')` is called THEN `i18next.changeLanguage('en')` SHALL be called AND persist to `localStorage['aperant.locale']`.

WHEN `src/i18n/locales/` is inspected THEN both `tr/` and `en/` SHALL exist with all namespaces AND each SHALL have at least 10 skeleton keys.

WHEN any component from this task is inspected THEN no hardcoded user-facing strings SHALL exist — all must be via `i18n.t()` or `x-t`.

WHEN Alpine is inspected THEN `auth`, `theme`, `locale`, `ui` stores SHALL be registered.

WHEN an element with `x-t="'some.key'"` is in the DOM AND the language changes THEN its text content SHALL update to the new translation.

## Deliverable

A small demo page at `/demo/theme-i18n` with a theme toggle button and a TR↔EN language toggle button, both persisting across page reloads.

## Done Definition

- Tokens centralized in tailwind.config.js, no hex in templates
- Both localStorage keys verified on reload
- All i18n namespaces created for TR and EN
- Demo page demonstrates both toggles working
- The `x-t` directive works on static text

END COPY ─────────────────────────────────────────────────────────────
```

---

## Task 3 — API Client, Interceptors & Models

### Kanban Title
`[03-api-client] ApiClient + Interceptors + DTO zod Schemas + Service Stubs`

### Paste-in Description

```
BEGIN COPY ───────────────────────────────────────────────────────────

## Context

Tasks 1-2 are complete. Now build the HTTP layer, type system, and service scaffolding. This is a COMPLEX task — expect ~8 phases.

Read these files FIRST:
- `CLAUDE.md` — Rules 2, 3, 5, 6 are especially relevant
- `specs/admin-panel/design.md` §3 (class schemas), §8 (JWT flow), §9 (MSW-FastAPI contract)
- `specs/admin-panel/requirements.md` §3 (domain model + DTO naming), §4.1 (auth requirements)

## Goal

Implement:
1. `ApiClient` singleton class (src/api/client.js) — uses private static field + static getInstance()
2. Three axios interceptors: auth, refresh, error (src/api/interceptors/)
3. All DTO model schemas with Pydantic-exact naming using zod (src/models/)
4. `BaseService` class + all concrete service stubs (src/services/)
5. Query key factory (src/queries/queryKeys.js)
6. Unit tests for ApiClient, each interceptor, and BaseService CRUD methods

## Critical Constraints

- DTO naming is SACRED: `XxxBaseSchema`, `XxxCreateSchema`, `XxxUpdateSchema`, `XxxResponseSchema` for every entity listed in `requirements.md` §3.1. Field names in snake_case (matching Pydantic).
- Every model file SHALL also export JSDoc typedefs with names matching the schema names without the `Schema` suffix (e.g. `ListingResponse`).
- `ApiClient` must be a true singleton (private static field + static getInstance).
- `refreshInterceptor` MUST use a DEDICATED axios instance WITHOUT interceptors to avoid infinite refresh loops.
- Services must extend `BaseService` and export a singleton instance (e.g. `export const listingsService = new ListingsService()`).
- Views / controllers / queries will import `listingsService`, never `axios`. Enforce this.
- Every non-CRUD service method (approve, reject, ban, feature, etc.) goes on the specific service, not BaseService.

## Acceptance Criteria (EARS)

WHEN `ApiClient.getInstance()` is called twice THEN the same instance SHALL be returned.

WHEN a request is made AND the `authStore` has an accessToken THEN the `authInterceptor` SHALL attach `Authorization: Bearer <token>`.

WHEN a 401 response is received THEN the `refreshInterceptor` SHALL call `/auth/refresh` (via dedicated instance) AND retry the original request once with the new token.

IF the refresh call returns 401/403 THEN the interceptor SHALL call `authStore.logout()` AND reject with normalized error.

WHEN any non-2xx response is received THEN `errorInterceptor` SHALL normalize it into `{ code, message, fields? }`.

WHEN `src/models/` is inspected THEN every entity from `requirements.md` §3.1 SHALL have Base, Create, Update, Response zod schemas AND matching JSDoc typedefs.

WHEN `src/services/` is inspected THEN every service SHALL extend BaseService AND export a singleton.

WHEN `pnpm test` is run THEN unit tests for ApiClient and all three interceptors SHALL pass.

WHEN any view, controller, or query file is grep'd for `import.*axios` THEN zero matches SHALL be found (only `src/api/` may import axios).

## Done Definition

- All model schemas match Pydantic naming convention (zod + JSDoc)
- All services are stubs that extend BaseService correctly
- Interceptors are tested and handle edge cases (no infinite loops)
- Unit test coverage for api/ and services/ layers

END COPY ─────────────────────────────────────────────────────────────
```

---

## Task 4 — MSW Setup & Fixture Data

### Kanban Title
`[04-msw-mocks] Mock Service Worker + Turkish Fixture Data`

### Paste-in Description

```
BEGIN COPY ───────────────────────────────────────────────────────────

## Context

Tasks 1-3 are complete. The ApiClient is working but all calls currently fail (no server). Now set up MSW to intercept requests and serve realistic Turkish mock data.

Read these files FIRST:
- `CLAUDE.md` — Rule 1 (frontend-only, MSW is the ONLY data source in Phase 1)
- `specs/admin-panel/design.md` §9 (MSW→FastAPI swap contract — MANDATORY)
- `specs/admin-panel/requirements.md` §4.14 (MSW contract)

## Goal

1. Install MSW, run `npx msw init public/ --save`
2. Create `src/mocks/browser.js` with conditional worker start
3. Write handlers for every endpoint in every service in `src/mocks/handlers/`
4. Seed fixtures in `src/mocks/fixtures/` with realistic Turkish data
5. Wire MSW boot into `src/main.js` based on `VITE_USE_MOCKS` env var (async boot before Alpine starts)

## Critical Constraints

- MSW MUST start BEFORE Alpine boots (await `worker.start()` in an async IIFE at the top of `main.js`).
- `VITE_USE_MOCKS=true` → start MSW. `VITE_USE_MOCKS=false` → skip MSW entirely.
- Response shapes MUST match the agreed FastAPI shapes in `design.md` §9.4 (PaginatedResponse<T>, ISO 8601 timestamps, snake_case fields).
- Error responses MUST follow FastAPI's shape: `{ "detail": "..." }` or `{ "detail": [{ "loc": [...], "msg": "...", "type": "..." }] }`.
- Simulate 200-600ms latency on every handler.
- Fixtures MUST use Turkish data: İstanbul/Ankara/İzmir locations, Turkish names, TRY currency.
- Mock login credentials: `admin@aperant.test` / `admin123` → returns a valid JWT-shaped (but fake) token payload.

## Acceptance Criteria (EARS)

WHEN `VITE_USE_MOCKS=true` AND `pnpm dev` runs THEN the console SHALL log "[MSW] Mocking enabled" BEFORE Alpine initializes.

WHEN `VITE_USE_MOCKS=false` THEN MSW SHALL NOT start AND real HTTP requests SHALL pass through.

WHEN any service method is called AND MSW is enabled THEN a handler SHALL intercept AND respond within 200-600ms.

WHEN `/auth/login` is called with `admin@aperant.test` / `admin123` THEN a valid-shaped JWT response SHALL be returned with user + tokens.

WHEN `/auth/refresh` is called with the mock refresh token THEN new tokens SHALL be returned.

WHEN `/listings` is called with pagination params THEN the response SHALL follow `PaginatedResponse<T>` shape exactly.

WHEN inspecting `src/mocks/handlers/` THEN every service from `design.md` §2 SHALL have a corresponding handler file.

WHEN inspecting `src/mocks/fixtures/` THEN data SHALL use Turkish names (Ahmet, Ayşe, Mehmet...), Turkish cities, and TRY currency.

WHEN an unknown endpoint is hit THEN MSW SHALL warn (`onUnhandledRequest: 'warn'`).

## Done Definition

- Every endpoint from every service has at least one handler (can return stub data)
- Fixtures are realistic enough to demo the UI convincingly
- Dev test: browser network tab shows MSW-intercepted responses with proper shapes

END COPY ─────────────────────────────────────────────────────────────
```

---

## Task 5 — Query Wrappers + Alpine Auth Flow

### Kanban Title
`[05-queries-auth] @tanstack/query-core Wiring + Complete Auth Flow`

### Paste-in Description

```
BEGIN COPY ───────────────────────────────────────────────────────────

## Context

Tasks 1-4 are complete. Services work, MSW intercepts, but there's nothing consuming them reactively yet. Complete the data layer by wiring `@tanstack/query-core` observers + finalizing the authStore.

Read these files FIRST:
- `CLAUDE.md` — Rule 6 (state separation) is CRITICAL here
- `specs/admin-panel/design.md` §3.4-3.5 (query-core + Alpine wiring), §4 (Alpine stores)
- `specs/admin-panel/requirements.md` §4.1 (auth requirements)

## Goal

1. Configure a singleton `QueryClient` with project defaults (staleTime 60s, retry 1, no refetchOnWindowFocus)
2. Implement observer factories for every list + detail endpoint
3. Implement mutation helpers for every non-CRUD service method + generic CRUD per domain, each invalidating proper keys on success
4. Complete the `authStore` with `login(email, password)` and `logout()` methods that call `AuthService`
5. On logout, clear the query cache via `queryClient.clear()`
6. Build a dev test page at `/_dev/queries` demonstrating end-to-end flow
7. Write Playwright smoke test: login with mock credentials → see data

## Critical Constraints

- Observers are created in Alpine `init()`, subscribed to, and unsubscribed in `destroy()` — no leaks.
- Queries use the `queryKeys` factory from Task 3 — never inline array keys.
- Mutations invalidate queries via `queryClient.invalidateQueries({ queryKey })` on success.
- Devtools: since `@tanstack/query-core` has no built-in UI, expose `queryClient` on `window` in dev mode for manual inspection (e.g. `window.__queryClient = queryClient` guarded by `import.meta.env.DEV`).
- The auth flow: Login → call `AuthService.login` → dispatch `authStore.loginSuccess({ tokens, user })` → redirect via Navigo. Logout → `authStore.logout()` → `queryClient.clear()` → redirect to `/login`.

## Acceptance Criteria (EARS)

WHEN `src/queries/queryClient.js` is inspected THEN a single QueryClient SHALL be created with defaults: staleTime 60000, retry 1, refetchOnWindowFocus false.

WHEN `src/queries/*Queries.js` is inspected THEN every list and detail endpoint SHALL have a corresponding observer factory.

WHEN `src/queries/*Queries.js` is inspected THEN every special-action service method (approve, reject, ban, feature, etc.) SHALL have a mutation helper.

WHEN a mutation helper's promise resolves THEN related queries SHALL be invalidated via `queryClient.invalidateQueries({ queryKey })`.

WHEN `authStore.login(email, password)` succeeds THEN the store SHALL store tokens + user AND `status` SHALL be `'authenticated'`.

WHEN `authStore.logout()` is called THEN tokens SHALL be cleared AND `queryClient.clear()` SHALL be called.

WHEN the dev page `/_dev/queries` is opened THEN an observer SHALL display mock data fetched via MSW.

WHEN the Playwright smoke test runs THEN it SHALL successfully log in AND see data.

## Done Definition

- Full login/logout cycle works with MSW
- Data from MSW shows up in UI via the full chain: MSW → axios → service → query observer → Alpine component
- `window.__queryClient` available in dev for manual inspection
- First E2E test passes

END COPY ─────────────────────────────────────────────────────────────
```

---

## Task 6 — Layouts, Routing & Protected Routes

### Kanban Title
`[06-layouts-routing] Responsive Layout Shell + Navigo Routing`

### Paste-in Description

```
BEGIN COPY ───────────────────────────────────────────────────────────

## Context

Tasks 1-5 are complete. The data layer works. Now build the UI shell the user actually sees. This is COMPLEX — expect 8 phases.

Read these files FIRST:
- `CLAUDE.md` — especially layout discipline + Alpine/Flowbite rules
- `specs/admin-panel/design.md` §5 (layout hierarchy), §10 (routes)
- `specs/admin-panel/requirements.md` §4.2 (web layout), §4.3 (mobile layout)

## Goal

Build the complete responsive layout shell:
- Single HTML shell where responsive switching happens via Tailwind `md:` classes (NOT JS media listeners)
- Web layout (≥md): Full-width Header + Sidebar 1 (icon rail) + Sidebar 2 (collapsible labeled panel) + Footer
- Mobile layout (<md): Compact Header + Flowbite Drawer (slide-in from hamburger) + Bottom Tab Bar with 5 slots + center FAB
- Full routing via Navigo with `protectedRoute()` guard
- Login page fully functional (form → `authStore.login(...)` → redirect)
- 403 and 404 error pages
- All module routes scaffolded as placeholder pages (title-only, via `x-t`)

## Critical Constraints

- Web layout follows the VS Code "activity bar" pattern (Sidebar 1 = narrow icon rail always visible on ≥md; Sidebar 2 = collapsible labeled panel).
- Sidebar 2 collapse/expand SHALL use Tailwind `transition-[width] duration-[250ms]` — no JS animation.
- Mobile bottom tab: [Dashboard] [Listings] [+FAB elevated] [Notifications] [Profile]. The FAB is visually elevated (larger, primary color, rises above the bar).
- Mobile drawer is a Flowbite drawer that opens from the left when hamburger is tapped; contains full navigation.
- Profile popover (web, in Sidebar 1 bottom) uses Flowbite's popover component and shows: current user, role, profile link, theme toggle, language switcher, logout.
- Header Logo navigates to `/admin/dashboard` via Navigo.
- Notification bell opens a Flowbite dropdown with mock notifications.
- Profile selector dropdown in header (top-left on web) uses Flowbite dropdown and shows current user + role + quick links.
- Bottom tab bar SHALL hide when a text input is focused (use `focusin`/`focusout` listeners on the document).
- `protectedRoute()` wraps all `/admin/*` route handlers; redirects to `/login` if unauthenticated (`!$store.auth.isAuthenticated()`), to `/403` if role insufficient.
- Route content is swapped into `#route-outlet` by dynamically importing the page's `.html?raw` template and assigning to `innerHTML`. Alpine will attach to the new content automatically via mutation observer — verify this holds.

## Acceptance Criteria (EARS)

WHEN viewport is ≥ 768px THEN the Web Layout SHALL be visible AND the Mobile Layout SHALL be hidden (via Tailwind `md:` visibility classes).

WHEN viewport is < 768px THEN the Mobile Layout SHALL be visible AND the Web Layout SHALL be hidden.

WHEN viewport crosses the md breakpoint THEN the layout SHALL switch seamlessly without losing store/query state.

WHEN user clicks a Sidebar 1 icon THEN Sidebar 2 SHALL open showing that module's sub-nav AND the icon SHALL appear active.

WHEN user clicks the Sidebar 2 toggle THEN Sidebar 2 SHALL collapse with a 250ms transition AND main content SHALL expand.

WHEN user clicks the avatar in Sidebar 1 bottom THEN a Flowbite popover SHALL open with profile, theme toggle, language switcher, logout.

WHEN user taps hamburger on mobile THEN a Flowbite drawer SHALL slide in from the left with full navigation.

WHEN user taps the FAB on mobile THEN Navigo SHALL navigate to `/admin/listings/new`.

WHEN unauthenticated user visits `/admin/*` THEN `protectedRoute()` SHALL redirect to `/login`.

WHEN authenticated user with insufficient role visits a restricted route THEN the redirect SHALL go to `/403`.

WHEN `src/router/paths.js` is inspected THEN all paths from `design.md` §10 SHALL be defined in a `Object.freeze(...)`'d const object.

WHEN user taps the Logo THEN Navigo SHALL navigate to `/admin/dashboard`.

WHEN breadcrumbs render THEN they SHALL be fully translated via `x-t`.

WHEN a text input is focused on mobile THEN the bottom tab bar SHALL hide.

## Done Definition

- Full login → dashboard happy path works (with Task 5's mock credentials)
- All module routes accessible but show placeholder pages
- Mobile and web layouts both demoed
- Playwright tests: login, protected redirect, mobile layout switch at breakpoint

END COPY ─────────────────────────────────────────────────────────────
```

---

## Task 7 — Listings Module (Reference Implementation)

### Kanban Title
`[07-listings-module] Listings CRUD + Actions (Full Reference Impl)`

### Paste-in Description

```
BEGIN COPY ───────────────────────────────────────────────────────────

## Context

Tasks 1-6 are complete. The shell is ready. Now build the first full domain module — Listings — which will serve as the pattern template for all remaining modules.

Read these files FIRST:
- `CLAUDE.md` — all rules apply
- `specs/admin-panel/design.md` §3.4-3.5 (query observer + Alpine wiring), §11 (forms)
- `specs/admin-panel/requirements.md` §4.5 (listing management requirements)

## Goal

Implement the complete Listings module:
1. `/admin/listings` — Grid.js list page with filters, pagination, search
2. `/admin/listings/:id` — detail page with media gallery + actions
3. `/admin/listings/new` — create form
4. `/admin/listings/:id/edit` — edit form (reuses create form)
5. All actions: Approve, Reject (with reason modal), Feature, Delete
6. URL state sync for filters and pagination
7. Full i18n coverage (TR + EN)
8. Playwright E2E test covering the happy path

## Critical Constraints

- Table = Grid.js (vanilla). Columns: thumbnail, title, category, location, price, owner, status, created_at, actions. Wrap with project helpers in `src/components/tables/dataTable.js`.
- Filters: status dropdown (pending/approved/rejected/expired), category dropdown, location dropdown, price range, date range — all Flowbite form components.
- Pagination options: 25 (default), 50, 100.
- URL query params must reflect all active filters + pagination.
- Forms use Alpine `x-model` + zod (via shared form factories from `src/components/forms/`).
- Approve: Flowbite confirmation modal → `approveListing(id)` mutation helper → Flowbite success toast → optimistic update.
- Reject: Flowbite modal with reason textarea (min 10 chars, zod-validated) → `rejectListing(id, reason)` → toast.
- Feature: Flowbite modal with duration selector (7/14/30 days) → `featureListing(id, days)` → toast.
- Action buttons SHALL be hidden/disabled based on role matrix from `src/constants/roles.js`.
- No hardcoded strings. All via `x-t='listings.*'` or `i18n.t('listings.*')` — populate both TR + EN i18n JSON files.
- No file in this module SHALL exceed 300 lines.

## Acceptance Criteria (EARS)

WHEN user navigates to `/admin/listings` THEN a Grid.js table SHALL display listings with the specified columns.

WHEN user applies a status filter THEN the table SHALL re-fetch AND the URL SHALL reflect the filter.

WHEN user changes pagination size THEN the URL AND query SHALL update.

WHEN user clicks a row THEN Navigo SHALL navigate to `/admin/listings/:id`.

WHEN the detail page loads THEN it SHALL show full listing data + media gallery + action buttons.

WHEN user clicks "Approve" THEN a Flowbite confirmation modal SHALL open AND on confirm `approveListing(id)` SHALL be called AND a Flowbite success toast SHALL appear AND the data SHALL optimistically update.

WHEN user clicks "Reject" THEN a Flowbite modal SHALL prompt for reason (min 10 chars) validated by zod.

WHEN user clicks "Feature" THEN a Flowbite modal SHALL prompt for duration (7/14/30 days).

WHEN user clicks "New Listing" THEN `/admin/listings/new` SHALL render the form.

WHEN user clicks "Edit" THEN the form SHALL render pre-filled with current data.

WHEN the form is submitted with invalid data THEN zod errors SHALL display inline under each field via `x-text` + `x-show`.

WHEN a user with insufficient role is logged in THEN action buttons SHALL be hidden or disabled per role matrix.

WHEN the Playwright E2E runs THEN it SHALL: login → navigate to listings → filter by pending → click first row → approve → verify toast → verify list updates.

WHEN `listings.json` is inspected THEN it SHALL exist in both `tr/` and `en/` with comprehensive keys.

## Done Definition

- All 4 pages (list/detail/new/edit) fully functional with MSW
- All 3 special actions work with Flowbite modals + toast feedback
- URL state sync verified for filters and pagination
- Role-based visibility verified
- i18n coverage complete (grep test: no hardcoded strings)
- Playwright E2E test passes
- No file exceeds 300 lines

## Pattern Template

This module is the REFERENCE. Tasks 8-15 (other modules) will follow this exact pattern:
- Grid.js list page → detail page → create/edit forms (Alpine + zod)
- Flowbite modals + toasts for actions
- Role-based action visibility
- URL state sync for filters
- Full i18n coverage
- Playwright smoke test

END COPY ─────────────────────────────────────────────────────────────
```

---

## Tasks 8+ — Remaining Modules

Use Task 7 as your template. Create one Aperant task per module. Modify the Task 7 brief substituting:
- Module name and slug
- Service/query file names
- Domain-specific actions
- Domain-specific filter fields
- Section reference in requirements.md

### Order

1. `[08-users-module]` — User management (list, detail, ban, role change) — requirements.md §4.6
2. `[09-categories-locations]` — Categories CRUD + 3-tier Location tree + Zoning — §4.7
3. `[10-dashboard-charts]` — Dashboard with stat cards + ApexCharts + activity feed — §4.4
4. `[11-moderation]` — Moderation queue — §4.9
5. `[12-packages-transactions]` — Packages CRUD + Transactions list — §4.10
6. `[13-content-management]` — Banners + FAQs + Blog — §4.11
7. `[14-reports-analytics]` — Report builder + CSV export — §4.8
8. `[15-settings-logs]` — Settings + Audit log + Activity log — §4.12

---

## 💡 Tips for Running Aperant

1. **Always run tasks in order.** Don't parallelize tasks 1-7 — they have strict dependencies.
2. **Review each task's QA report before approving merge.** Aperant may have hallucinated a file path or skipped a requirement.
3. **Use the `HUMAN_INPUT.md` file** inside `.aperant/specs/NNN-*/` to inject clarifications mid-run without canceling the task.
4. **Use `PAUSE` file** to pause a running task if you notice drift.
5. **If the agent suggests introducing a backend, Node server, or React** → decline and reiterate Rules 1 and Forbidden Pattern 3 from `CLAUDE.md`.
6. **Tasks 8-15 can be parallelized** once Task 7 is merged (they depend only on the shared infrastructure, not on each other).
7. **Expect each COMPLEX task to take 30-90 minutes of agent time** depending on your Claude subscription. STANDARD tasks: 15-40 minutes.

---

## 🎯 Final Sanity Checks After All Tasks

After Task 15 is merged:

1. Run `pnpm build` — verify bundle size budgets from `design.md` §14.2 (main ≤ 400KB gzipped)
2. Run `pnpm test:e2e` — all Playwright tests pass
3. Run `pnpm lint` — zero errors
4. Grep for `axios` in `src/` outside `api/` — should be empty
5. Grep for `import React`, `import Vue`, `import Svelte` — should be empty
6. Grep for Turkish strings in HTML/JS files — should be empty
7. Toggle `VITE_USE_MOCKS=false` and point `VITE_API_BASE_URL` to a fake URL → verify app breaks cleanly (network errors, not render errors). This proves the MSW-FastAPI swap contract holds.

When all green → Phase 1 is DONE. Ready for backend integration.
