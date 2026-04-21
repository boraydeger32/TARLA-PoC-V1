# Aperant Admin Panel — Task Breakdown

> **Execution:** Each task is a separate Aperant Kanban task. Complete them **in order**. Do not start a task until the previous one's QA gate passes.
>
> **Canonical References:** Every task SHALL read `specs/admin-panel/requirements.md`, `specs/admin-panel/design.md`, and `CLAUDE.md` before implementation.

---

## Task 1 — Project Scaffolding & Infrastructure

**Slug:** `01-scaffold`
**Complexity:** STANDARD
**Estimated phases:** 6

### Goal
Initialize the Vite + Alpine.js + Flowbite + Tailwind project (JavaScript, no TypeScript compiler) with the complete folder structure per `design.md` §2, install and configure all required dependencies, set up Biome, and verify the dev server runs with a placeholder home page.

### Acceptance Criteria (EARS)

- [ ] WHEN `pnpm install` is run THEN all dependencies from `requirements.md` §2 SHALL be installed at the specified major versions
- [ ] WHEN `pnpm dev` is run THEN the dev server SHALL start on port 5173 AND a placeholder page SHALL render without errors
- [ ] WHEN `pnpm lint` is run THEN Biome SHALL pass with zero errors
- [ ] WHEN inspecting the repo THEN the folder structure SHALL match `design.md` §2 exactly (empty files/dirs are acceptable as scaffolding)
- [ ] WHEN inspecting `jsconfig.json` THEN it SHALL have path alias `@/*` → `src/*`
- [ ] WHEN inspecting `vite.config.js` THEN it SHALL have the `@/` alias AND `?raw` import support for `.html` files AND proper env var handling
- [ ] WHEN inspecting `tailwind.config.js` THEN it SHALL have `darkMode: 'class'` AND `flowbite/plugin` registered AND a `content` glob covering `./index.html` and `./src/**/*.{html,js}`
- [ ] WHEN inspecting `postcss.config.js` THEN it SHALL include `tailwindcss` and `autoprefixer`
- [ ] WHEN inspecting `.env.example` THEN it SHALL document `VITE_API_BASE_URL` and `VITE_USE_MOCKS`
- [ ] WHEN inspecting `package.json` scripts THEN it SHALL have: `dev`, `build`, `preview`, `lint`, `format`, `test`, `test:e2e`

### Deliverables
- Complete folder scaffolding (empty files or `// TODO` placeholders acceptable)
- `package.json`, `vite.config.js`, `jsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `biome.json`, `.env.example`, `README.md`
- `index.html` with a `<div id="app">` and Alpine boot
- `src/main.js`, `src/app.js` with minimal boot
- Git repository initialized with `.gitignore`

### Out of Scope
- MSW setup (Task 4)
- Real routing beyond a stub (Task 6)
- Any domain feature (Task 7+)

---

## Task 2 — Theme System & i18n Foundation

**Slug:** `02-theme-i18n`
**Complexity:** STANDARD
**Estimated phases:** 6

### Goal
Build the Tailwind theme system (Light + Dark via `darkMode: 'class'`), wire it through the `themeStore` Alpine store with localStorage persistence, and initialize i18next with TR (default) and EN namespaces populated with skeleton keys. Register the custom `x-t` Alpine directive.

### Acceptance Criteria (EARS)

- [ ] WHEN the app mounts THEN it SHALL apply the Light theme by default OR system preference if configured
- [ ] WHEN user calls `$store.theme.toggle()` THEN the `dark` class on `<html>` SHALL toggle AND the UI SHALL switch smoothly
- [ ] WHEN the theme changes THEN the choice SHALL persist to localStorage under key `aperant.theme`
- [ ] WHEN the app reloads THEN the previously chosen theme SHALL be restored
- [ ] WHEN `i18next.init()` is called THEN TR SHALL be the default language AND EN SHALL be the fallback
- [ ] WHEN `$store.locale.setLanguage('en')` is called THEN `i18next.changeLanguage('en')` SHALL run AND the choice SHALL persist to localStorage under key `aperant.locale`
- [ ] WHEN inspecting `src/i18n/locales/` THEN both `tr/` and `en/` SHALL exist AND SHALL contain the namespaces listed in `design.md` §7.3 AND each SHALL have at least 10 placeholder keys
- [ ] WHEN inspecting any HTML/JS in this task THEN no hardcoded user-facing strings SHALL exist (all via `i18n.t()` or `x-t` directive)
- [ ] WHEN Alpine boots THEN the stores `auth`, `theme`, `locale`, `ui` SHALL all be registered via `Alpine.store(...)`
- [ ] WHEN `x-t="'some.key'"` is placed on any element THEN its text content SHALL be set to the translation AND SHALL update on language change

### Deliverables
- `tailwind.config.js` with tokens + dark mode + Flowbite plugin
- `src/theme/colors.js`, `src/theme/themeController.js`
- `src/i18n/index.js`, `src/i18n/alpineDirective.js`, `src/i18n/locales/tr/*.json` + `src/i18n/locales/en/*.json`
- `src/stores/*.js` — all 4 stores (authStore can be stubbed, fully implemented in Task 5)
- `src/stores/index.js` that registers all stores on boot
- A tiny demo page showing theme toggle + language toggle working

### Out of Scope
- Auth implementation (Task 5)
- Real navigation menu translations (added incrementally per module)

---

## Task 3 — API Client, Axios Interceptors & DTO Models

**Slug:** `03-api-client`
**Complexity:** COMPLEX
**Estimated phases:** 8

### Goal
Build the `ApiClient` singleton class, implement all three axios interceptors (auth, refresh, error), define all DTO zod schemas + JSDoc typedefs with Pydantic-exact naming, and implement `BaseService` + stubs for every concrete service.

### Acceptance Criteria (EARS)

- [ ] WHEN `ApiClient.getInstance()` is called twice THEN the SAME instance SHALL be returned (singleton verified)
- [ ] WHEN a request is made with a valid access token in the `authStore` THEN the `authInterceptor` SHALL attach `Authorization: Bearer <token>`
- [ ] WHEN a 401 response is received THEN the `refreshInterceptor` SHALL call `/auth/refresh` using a dedicated axios instance (no interceptors, to avoid loops) AND retry the original request ONCE with the new token
- [ ] IF the refresh call returns 401 or 403 THEN the interceptor SHALL call `authStore.logout()` AND reject with a normalized error
- [ ] WHEN any response returns a non-2xx status THEN the `errorInterceptor` SHALL normalize it into `{ code: string, message: string, fields?: Record<string, string[]> }` shape
- [ ] WHEN inspecting `src/models/*.js` THEN every entity listed in `requirements.md` §3.1 SHALL have `XxxBaseSchema`, `XxxCreateSchema`, `XxxUpdateSchema`, `XxxResponseSchema` zod exports AND matching JSDoc typedefs
- [ ] WHEN inspecting service files THEN every service listed in `design.md` §2 SHALL exist AND extend `BaseService` AND export a singleton instance
- [ ] WHEN inspecting `src/queries/queryKeys.js` THEN a key factory SHALL be defined per domain
- [ ] WHEN `pnpm test` is run THEN unit tests SHALL exist for `ApiClient`, each interceptor, and `BaseService` CRUD methods (using axios mock adapter or similar)

### Deliverables
- `src/api/client.js`, `src/api/interceptors/*.js`, `src/api/endpoints.js`, `src/api/types.js`
- `src/models/*.js` — all DTO schemas + typedefs
- `src/services/*.js` — all services as stubs extending BaseService
- `src/queries/queryKeys.js`
- Unit tests in `tests/unit/services/`

### Out of Scope
- MSW handlers (Task 4)
- Query wrappers (Task 5)

---

## Task 4 — MSW Setup & Fixture Data

**Slug:** `04-msw-mocks`
**Complexity:** COMPLEX
**Estimated phases:** 8

### Goal
Install and configure MSW, write handlers for every endpoint in every service, seed realistic Turkish fixture data, and wire MSW to start conditionally based on `VITE_USE_MOCKS`.

### Acceptance Criteria (EARS)

- [ ] WHEN `npx msw init public/ --save` is run THEN `public/mockServiceWorker.js` SHALL be generated
- [ ] WHEN `VITE_USE_MOCKS=true` in dev THEN MSW SHALL start BEFORE the Alpine app boots AND log "[MSW] Mocking enabled"
- [ ] WHEN `VITE_USE_MOCKS=false` THEN MSW SHALL NOT start AND real HTTP calls SHALL pass through
- [ ] WHEN any service method is called in mock mode THEN MSW SHALL intercept AND return realistic data within 200-600ms latency
- [ ] WHEN inspecting `src/mocks/handlers/` THEN every service listed in `design.md` §2 SHALL have a corresponding handler file with at least the CRUD endpoints stubbed
- [ ] WHEN inspecting `src/mocks/fixtures/` THEN seed data SHALL use Turkish names, Turkish location data (İstanbul/Ankara/İzmir districts), TRY currency
- [ ] WHEN listings endpoint is called with pagination params THEN the response SHALL follow `PaginatedResponse<T>` shape from `design.md` §9.4
- [ ] WHEN `/auth/login` is called with mock credentials `admin@aperant.test / admin123` THEN a valid JWT-like payload SHALL be returned (the token can be a fake string but structure must match)
- [ ] WHEN `/auth/refresh` is called with a valid refresh token THEN new tokens SHALL be returned
- [ ] WHEN an unknown endpoint is hit THEN MSW SHALL log a warning (`onUnhandledRequest: 'warn'`)

### Deliverables
- `public/mockServiceWorker.js`
- `src/mocks/browser.js`, `src/mocks/handlers/*.js`, `src/mocks/fixtures/*.js`
- MSW boot wiring in `src/main.js`
- Turkish-realistic seed data for listings, users, categories, locations

### Out of Scope
- Query wrapper hookup (Task 5)

---

## Task 5 — Query Wrappers + Alpine Auth Flow

**Slug:** `05-queries-auth`
**Complexity:** COMPLEX
**Estimated phases:** 8

### Goal
Wire `@tanstack/query-core`, create the singleton `QueryClient`, implement query observer wrappers + mutation helpers for every service, complete the `authStore` with real login/logout flows calling `AuthService`, and demonstrate end-to-end data flow.

### Acceptance Criteria (EARS)

- [ ] WHEN `main.js` is inspected THEN a single `QueryClient` SHALL be created with defaults: `staleTime: 60000`, `retry: 1`, `refetchOnWindowFocus: false`
- [ ] WHEN `src/queries/*Queries.js` is inspected THEN every list and detail endpoint SHALL have a corresponding observer factory (`xxxListObserver`, `xxxDetailObserver`)
- [ ] WHEN `src/queries/*Queries.js` is inspected THEN every special-action service method (approve, reject, ban, feature, etc.) SHALL have a mutation helper that invalidates the correct keys on success
- [ ] WHEN an Alpine component creates an observer AND the mutation resolves THEN `queryClient.invalidateQueries({ queryKey })` SHALL fire AND the observer SHALL re-fetch
- [ ] WHEN `authStore.login(email, password)` is called with valid mock credentials THEN the store SHALL update to `status: 'authenticated'` AND hold tokens + user
- [ ] WHEN `authStore.logout()` is called THEN tokens SHALL be cleared AND `queryClient.clear()` SHALL be called
- [ ] WHEN the dev page `/_dev/queries` is opened THEN a listings list observer SHALL populate mock data via MSW
- [ ] WHEN the Playwright smoke test runs THEN it SHALL log in with mock credentials AND see data from MSW

### Deliverables
- QueryClient setup in `src/queries/queryClient.js`
- `src/queries/*Queries.js` — observer factories + mutation helpers for every domain
- Completed `authStore` with async `login`/`logout` methods delegating to `AuthService`
- Dev test page at `/_dev/queries` demonstrating end-to-end flow
- Playwright smoke test: login with mock credentials, see dashboard stub

### Out of Scope
- Real dashboard/listings UI (Task 7+)
- Layout shell (Task 6)

---

## Task 6 — Layouts, Routing & Protected Routes

**Slug:** `06-layouts-routing`
**Complexity:** COMPLEX
**Estimated phases:** 8

### Goal
Build the full admin layout shell using Flowbite components and Tailwind responsive utilities, configure Navigo with all routes from `design.md` §10, and implement `protectedRoute()` guard.

### Acceptance Criteria (EARS)

- [ ] WHEN viewport is ≥ `md` (768px+) THEN the Web Layout SHALL render (Header + Sidebar1 + Sidebar2 + Footer) via Tailwind `md:` utility classes
- [ ] WHEN viewport is < `md` THEN the Mobile Layout SHALL render (Header + BottomTabBar) — all toggling done by CSS, not JS media listeners
- [ ] WHEN viewport crosses the md breakpoint THEN the layout SHALL switch seamlessly without state loss in stores/query cache
- [ ] WHEN user clicks an icon in Sidebar 1 THEN Sidebar 2 SHALL open with that module's sub-navigation AND the icon SHALL appear active (via `:class="$store.ui.activeModule === 'listings' ? '...' : '...'"`)
- [ ] WHEN user clicks the Sidebar 2 toggle THEN Sidebar 2 SHALL collapse smoothly (Tailwind `transition-[width] duration-[250ms]`) AND main content SHALL expand
- [ ] WHEN user clicks the avatar in Sidebar 1's bottom THEN a Flowbite popover SHALL appear with: profile link, theme toggle, language switcher, logout button
- [ ] WHEN user taps the hamburger on mobile THEN the Flowbite drawer SHALL slide in from the left with the full navigation
- [ ] WHEN user taps the FAB in the bottom tab bar THEN Navigo SHALL navigate to `/admin/listings/new` (page can be placeholder)
- [ ] WHEN user is unauthenticated AND navigates to `/admin/*` THEN `protectedRoute()` SHALL redirect to `/login`
- [ ] WHEN user is authenticated but lacks role permission THEN the route SHALL redirect to `/403`
- [ ] WHEN inspecting `src/router/paths.js` THEN all PATHS from `design.md` §10 SHALL be defined as a `Object.freeze(...)`'d const object
- [ ] WHEN the Logo in the header is clicked THEN Navigo SHALL navigate to `/admin/dashboard`
- [ ] WHEN notification bell is clicked THEN a Flowbite dropdown SHALL open showing mock notifications
- [ ] WHEN profile selector in web header is clicked THEN a Flowbite dropdown SHALL show current user + role + quick links
- [ ] WHEN breadcrumbs are rendered on any admin page THEN they SHALL be derived from the route path AND be fully translated via `x-t`
- [ ] WHEN the app initially loads AND the user is authenticated THEN they SHALL land on `/admin/dashboard`
- [ ] WHEN the bottom tab bar is rendered AND a text input is focused (mobile virtual keyboard active) THEN the bar SHALL hide

### Deliverables
- `src/layouts/adminLayout.js` + layout HTML partials in `src/layouts/web/` and `src/layouts/mobile/`
- `src/router/index.js`, `src/router/paths.js`
- `src/components/navigation/protectedRoute.js`, `breadcrumbs.js`
- All module routes scaffolded as empty pages displaying their title via `x-t`
- Login page fully functional (form + submit via `authStore.login`)
- `403` and `404` error pages
- Playwright smoke tests: login → dashboard, protected redirect, mobile layout switch

### Out of Scope
- Actual module content (Task 7+)

---

## Task 7 — First Domain Module: Listings (Full CRUD + Actions)

**Slug:** `07-listings-module`
**Complexity:** COMPLEX
**Estimated phases:** 8

### Goal
Implement the complete Listings module end-to-end as the **reference implementation** that all subsequent modules (Users, Categories, etc.) will follow. This includes: list page with Grid.js + filters + pagination, detail page, create/edit pages with Alpine + zod, and all actions (approve/reject/feature).

### Acceptance Criteria (EARS)

- [ ] WHEN user navigates to `/admin/listings` THEN a Grid.js table SHALL display listings with columns: thumbnail, title, category, location, price, owner, status, created_at, actions
- [ ] WHEN user applies a status filter (pending/approved/rejected/expired) THEN the table SHALL update via a re-fetch AND the URL SHALL reflect the filter as a query param
- [ ] WHEN user changes pagination (25/50/100) THEN the URL AND the query SHALL update accordingly
- [ ] WHEN user clicks a row THEN Navigo SHALL navigate to `/admin/listings/:id`
- [ ] WHEN the detail page loads THEN it SHALL display full listing data + media gallery + owner info + action buttons
- [ ] WHEN user clicks "Approve" on a pending listing THEN a Flowbite confirmation modal SHALL open AND on confirm `approveListing(id)` SHALL be called AND a Flowbite success toast SHALL appear AND the data SHALL optimistically update
- [ ] WHEN user clicks "Reject" THEN a Flowbite modal SHALL open requiring a reason (min 10 chars, validated by zod) AND on submit `rejectListing(id, reason)` SHALL be called
- [ ] WHEN user clicks "Feature" THEN a Flowbite modal SHALL prompt for duration (7/14/30 days)
- [ ] WHEN user clicks "New Listing" (from FAB or button) THEN `/admin/listings/new` SHALL render a form with all required fields AND submit via a controller that calls `createListing`
- [ ] WHEN user clicks "Edit" on a listing THEN `/admin/listings/:id/edit` SHALL render the same form pre-filled
- [ ] WHEN any form is submitted with invalid data THEN zod errors SHALL be displayed inline under each field via `x-text` + `x-show`
- [ ] WHEN all listings pages are inspected THEN no hardcoded strings SHALL exist (everything via `x-t='listings.*'` or `i18n.t('listings.*')`)
- [ ] WHEN user has insufficient role THEN action buttons (approve/reject/delete) SHALL be hidden or disabled based on role matrix in `src/constants/roles.js`
- [ ] WHEN Playwright E2E test runs THEN it SHALL: login → navigate to listings → filter by pending → click first row → approve → verify toast → verify list updates

### Deliverables
- `src/views/listings/*` — all pages + partials
- `src/controllers/listingApprovalController.js`, `listingFormController.js`
- i18n keys populated in `listings.json` (both TR + EN)
- Playwright E2E test for the full listings flow

---

## Task 8+ — Remaining Modules (Parallel-izable)

Each remaining module follows the **Listings template** from Task 7. Create a separate Aperant task per module. Order of priority:

| Order | Slug | Module |
|---|---|---|
| 8 | `08-users-module` | User management (list, detail, ban, role change) |
| 9 | `09-categories-locations` | Categories + Location tree (3-tier) + Zoning statuses |
| 10 | `10-dashboard-charts` | Dashboard with stat cards + ApexCharts visualizations + activity feed |
| 11 | `11-moderation` | Moderation queue + report actions |
| 12 | `12-packages-transactions` | Packages CRUD + Transactions list |
| 13 | `13-content-management` | Banners + FAQs + Blog CRUD |
| 14 | `14-reports-analytics` | Report builder + CSV export |
| 15 | `15-settings-logs` | Settings + Audit log + Activity log |

### Per-module acceptance criteria template

Every Task 8+ SHALL satisfy:

- [ ] WHEN viewing the module THEN it SHALL follow the Listings module patterns (Grid.js list + filter + pagination + detail + create/edit)
- [ ] WHEN all strings are inspected THEN they SHALL be i18n-routed
- [ ] WHEN a Playwright smoke test runs THEN it SHALL cover the main list flow
- [ ] WHEN inspecting files THEN no file SHALL exceed 300 lines

---

## Global Gate Criteria (applies to every task)

Before a task is considered DONE, the Aperant QA loop SHALL verify:

1. ✅ `pnpm lint` passes with zero errors
2. ✅ `pnpm build` produces a valid production bundle
3. ✅ `pnpm test` — all unit tests pass
4. ✅ No file exceeds 300 lines (excluding fixtures and i18n JSON)
5. ✅ No hardcoded user-facing strings (grep check for Turkish/English literals in HTML/JS)
6. ✅ No direct `axios` import outside of `src/api/`
7. ✅ No API response data stored in Alpine stores
8. ✅ No UI state stored in the query cache
9. ✅ Every new interactive element has i18n-based accessible labels
10. ✅ Commit messages follow Conventional Commits format
