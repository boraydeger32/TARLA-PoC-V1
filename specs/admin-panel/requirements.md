# Aperant Arsa Platformu — Admin Panel Requirements

> **Format:** EARS (Easy Approach to Requirements Syntax)
> **Dil:** Mixed (Turkish domain terms + English technical terms)
> **Durum:** Frontend-only MVP (Phase 1), backend FastAPI ile sonradan entegre edilecek

---

## 1. Genel Bakış (Overview)

Aperant, Sahibinden.com'un arsa/emlak bölümüne benzer bir Türkiye pazar yeridir. Bu doküman, platformun **admin panel frontend'inin** gereksinimlerini tanımlar. Panel ilk etapta yalnızca frontend olarak geliştirilecek; tüm API çağrıları **MSW (Mock Service Worker)** üzerinden mock'lanacaktır. Backend FastAPI servisi hazır olduğunda, bir environment variable değişikliği ile canlı API'ye bağlanabilir olmalıdır — **sıfır kod refactoring**.

### 1.1 Hedef Kullanıcı
Platform yöneticileri (super admin, moderator, content manager rolleri).

### 1.2 Temel Prensipler
- **Frontend-only (Phase 1):** Hiçbir backend servisi, Docker, Node server veya gerçek database bu projede bulunmayacak
- **Backend-agnostic architecture:** `services/` katmanı, MSW ile canlı FastAPI arasında fark gözetmeden çalışmalı
- **Responsive-first:** Tek kod tabanı, Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`)
- **i18n-first:** Hiçbir string doğrudan HTML'de olmamalı; hepsi `i18n.t('namespace.key')` veya `x-t` direktifi ile

---

## 2. Teknik Stack (Non-Negotiable)

| Katman | Teknoloji | Versiyon |
|---|---|---|
| Build | Vite | ^7.0.0 |
| Runtime | Alpine.js | ^3.14.0 |
| Dil | JavaScript (ES2022+) | — |
| UI Components | Flowbite | ^2.5.0 |
| CSS | Tailwind CSS | ^3.4.0 |
| Routing | Navigo | ^8.11.0 |
| Server State | @tanstack/query-core | ^5.60.0 |
| Client State | Alpine.store (built-in) | — |
| HTTP | axios | ^1.7.0 |
| Mock API | msw | ^2.6.0 |
| Forms | Alpine `x-model` + zod | — / ^3.23.0 |
| Tables | Grid.js | ^6.11.0 |
| Charts | ApexCharts | ^3.54.0 |
| Icons | Flowbite Icons (SVG) | ^1.2.0 |
| i18n | i18next | ^23.16.0 |
| Date | dayjs | ^1.11.0 |
| Tests | vitest + @testing-library/dom + happy-dom + playwright | latest stable |
| Lint/Format | biome | ^1.9.0 |

**Type hints:** JSDoc typedefs + zod runtime schemas. No TypeScript compiler.

---

## 3. Domain Model (Pydantic-uyumlu DTO naming)

Tüm model isimleri (zod schema + JSDoc typedef), ileride FastAPI tarafında Pydantic model isimleri ile **birebir aynı** olmalıdır. Convention:
- `XxxBase` — ortak alanlar
- `XxxCreate` — POST body
- `XxxUpdate` — PATCH/PUT body
- `XxxResponse` — API response (id, timestamps dahil)

### 3.1 Entity Listesi
- **User** — Kullanıcı hesabı (admin + end-user)
- **Role** — Rol (super_admin, moderator, content_manager, end_user)
- **Listing** — İlan (arsa ilanı)
- **Category** — Kategori (konut arsası, ticari arsa, tarla, bağ/bahçe vb.)
- **Location** — İl / İlçe / Mahalle hiyerarşisi
- **ZoningStatus** — İmar durumu enum (imarlı, imarsız, köy yerleşik alanı vb.)
- **Media** — İlan görselleri, videolar
- **Favorite** — Kullanıcı favorileri
- **Message** — İlan mesajlaşmaları
- **Report** — Kullanıcı şikayetleri
- **Package** — Ödeme paketleri (doping, vitrin, premium)
- **Transaction** — Ödeme işlemleri
- **Banner** — Anasayfa banner'ları
- **FAQ** — Sıkça sorulan sorular
- **BlogPost** — Blog yazıları
- **AuditLog** — Admin aksiyonları denetim kaydı
- **ActivityLog** — Kullanıcı aktivite logları
- **Setting** — Sistem ayarları

### 3.2 Örnek DTO Yapısı (Listing)

```javascript
// src/models/Listing.js
import { z } from 'zod';

export const ListingBaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  category_id: z.string(),
  location_id: z.string(),
  area_m2: z.number(),
  zoning_status: z.string(),
});

export const ListingCreateSchema = ListingBaseSchema.extend({
  media_ids: z.array(z.string()),
});

export const ListingUpdateSchema = ListingBaseSchema.partial().extend({
  status: z.string().optional(),
});

export const ListingResponseSchema = ListingBaseSchema.extend({
  id: z.string(),
  status: z.string(),
  owner_id: z.string(),
  view_count: z.number(),
  favorite_count: z.number(),
  media: z.array(z.any()), // MediaResponseSchema
  created_at: z.string(),
  updated_at: z.string(),
  approved_at: z.string().nullable(),
  approved_by: z.string().nullable(),
});

/**
 * @typedef {z.infer<typeof ListingBaseSchema>} ListingBase
 * @typedef {z.infer<typeof ListingCreateSchema>} ListingCreate
 * @typedef {z.infer<typeof ListingUpdateSchema>} ListingUpdate
 * @typedef {z.infer<typeof ListingResponseSchema>} ListingResponse
 */
```

---

## 4. Functional Requirements (EARS)

### 4.1 Authentication & Authorization

**REQ-AUTH-01** — WHEN unauthenticated user tries to access any `/admin/*` route THEN the system SHALL redirect to `/login`.

**REQ-AUTH-02** — WHEN user submits valid credentials on `/login` THEN the system SHALL store the JWT access token AND refresh token in the `authStore` (Alpine.store) AND persist refresh token in secure cookie (httpOnly flag simulated in mock).

**REQ-AUTH-03** — WHEN a 401 response is received on any API call THEN the axios response interceptor SHALL attempt token refresh via `/api/v1/auth/refresh` AND retry the original request once.

**REQ-AUTH-04** — IF token refresh fails THEN the system SHALL clear auth state AND redirect to `/login` with a Flowbite toast notification.

**REQ-AUTH-05** — WHEN user clicks "logout" THEN the system SHALL clear the `authStore`, clear refresh cookie, clear the query cache, AND redirect to `/login`.

**REQ-AUTH-06** — WHEN authenticated user's role is not in the allowed list for a given route THEN the system SHALL show a 403 Forbidden view.

### 4.2 Layout — Web (≥ md breakpoint)

**REQ-LAYOUT-W-01** — The system SHALL render a **full-width sticky header** at the top containing:
  - Left: Account/Profile selector dropdown (shows current admin user + role, clickable) — Flowbite dropdown
  - Center: Logo (clickable → `/admin/dashboard`)
  - Right: Search icon (disabled placeholder, Phase 2) + Notification bell with unread count badge (Flowbite badge)

**REQ-LAYOUT-W-02** — The system SHALL render a **fixed narrow icon rail (Sidebar 1)** on the left, approximately 64px wide, always visible, containing:
  - Module icons (Dashboard, Listings, Users, Categories, Reports, Moderation, Payments, Content, Settings) — Flowbite icons
  - Each icon SHALL show a Flowbite tooltip on hover
  - User avatar at the bottom (opens Flowbite popover with profile, theme toggle, logout)

**REQ-LAYOUT-W-03** — WHEN user clicks a Sidebar 1 icon THEN a **collapsible labeled panel (Sidebar 2)** SHALL open to the right of Sidebar 1, approximately 240px wide, containing:
  - Module title
  - Sub-navigation items with labels and optional icons
  - Toggle button to collapse/expand

**REQ-LAYOUT-W-04** — WHEN Sidebar 2 is collapsed THEN the main content area SHALL expand to fill the reclaimed space with a smooth Tailwind `transition-[width] duration-[250ms]`.

**REQ-LAYOUT-W-05** — The system SHALL render a **full-width footer** at the bottom with copyright text and app version (from `package.json`).

**REQ-LAYOUT-W-06** — The main content area SHALL support:
  - Breadcrumb navigation at the top (Flowbite breadcrumb)
  - Stat cards (for dashboard/list pages) — Flowbite card patterns
  - Grid.js tables with filters, pagination, column sort
  - Detail forms (Alpine `x-model` + zod validation)
  - ApexCharts visualizations (line, bar, pie, area)

### 4.3 Layout — Mobile (< md breakpoint)

**REQ-LAYOUT-M-01** — The system SHALL render a **compact header** containing:
  - Left: Hamburger icon (≡)
  - Center: Logo
  - Right: Notification bell with unread count badge

**REQ-LAYOUT-M-02** — WHEN user taps the hamburger icon THEN a **slide-in Flowbite drawer** from the left SHALL open with the full navigation menu (equivalent to Sidebar 1 + Sidebar 2 combined).

**REQ-LAYOUT-M-03** — The system SHALL render a **bottom tab bar** fixed at the bottom with 5 items:
  1. Dashboard (home icon)
  2. İlanlar / Listings (list icon)
  3. **[+] Yeni İlan / New Listing** — Visually elevated FAB in the center (primary color, larger touch target)
  4. Bildirimler / Notifications (bell icon)
  5. Profil / Profile (user icon)

**REQ-LAYOUT-M-04** — The bottom tab bar SHALL be hidden when a virtual keyboard is active (form input focus).

**REQ-LAYOUT-M-05** — All pages SHALL be scrollable without horizontal overflow.

### 4.4 Dashboard Module

**REQ-DASH-01** — The dashboard SHALL display the following stat cards at the top:
  - Total active listings (with % change vs last week)
  - Pending approval count (clickable → filtered listings view)
  - Total registered users (with % growth)
  - Total revenue (this month)

**REQ-DASH-02** — The dashboard SHALL display the following ApexCharts visualizations:
  - Line chart: Listings trend (last 30 days)
  - Bar chart: New users per day (last 30 days)
  - Pie/donut chart: Listing distribution by category
  - Area chart: Revenue trend (last 12 months)

**REQ-DASH-03** — The dashboard SHALL display a "Recent Activity" feed (last 10 audit log entries).

### 4.5 Listing Management Module

**REQ-LST-01** — The `/admin/listings` page SHALL display a Grid.js table with columns: thumbnail, title, category, location, price, owner, status, created_at, actions.

**REQ-LST-02** — The system SHALL support server-side (mock-side) filtering by: status (pending/approved/rejected/expired), category, location, price range, date range.

**REQ-LST-03** — The system SHALL support pagination (default 25/page, options 10/25/50/100) and column sorting.

**REQ-LST-04** — WHEN admin clicks a listing row THEN the system SHALL navigate to `/admin/listings/:id` showing full details + media gallery + action buttons (Approve, Reject, Feature, Delete).

**REQ-LST-05** — WHEN admin clicks "Approve" on a pending listing THEN the system SHALL call `ListingsService.approve(id)` (via the query wrapper) AND show a Flowbite success toast AND optimistically update the UI.

**REQ-LST-06** — WHEN admin clicks "Reject" THEN a Flowbite modal SHALL prompt for rejection reason (required text, min 10 chars, validated by zod) before submitting.

**REQ-LST-07** — The system SHALL support "Feature/Vitrin" and "Doping/Boost" actions via a Flowbite dropdown menu per listing.

### 4.6 User Management Module

**REQ-USR-01** — The `/admin/users` page SHALL display a Grid.js table with columns: avatar, full_name, email, phone, role, status (active/banned/pending_verification), registration_date, actions.

**REQ-USR-02** — The system SHALL support filtering by role, status, and date range; search by name/email/phone.

**REQ-USR-03** — WHEN admin clicks a user row THEN the system SHALL navigate to `/admin/users/:id` showing profile, listings, messages, activity log, and action buttons (Ban, Change Role, Verify, Delete).

**REQ-USR-04** — WHEN admin clicks "Ban" THEN a Flowbite modal SHALL prompt for reason and duration (permanent / 7 days / 30 days / custom).

**REQ-USR-05** — The role change dropdown SHALL only show roles the current admin has permission to assign (super_admin can assign any; moderator cannot create super_admins).

### 4.7 Category & Location Module

**REQ-CAT-01** — The `/admin/categories` page SHALL display categories as a flat list (arsa types only; no tree hierarchy for MVP).

**REQ-CAT-02** — The system SHALL support CRUD operations for categories (name_tr, name_en, slug, icon, is_active, sort_order).

**REQ-CAT-03** — The `/admin/locations` page SHALL display a **3-tier tree view** (Province → District → Neighborhood) with lazy loading for districts/neighborhoods.

**REQ-CAT-04** — The system SHALL support CRUD for each location level (code, name, parent_id).

**REQ-CAT-05** — The system SHALL support a separate "Zoning Status" CRUD list (imarlı, imarsız, köy yerleşik alanı, ihtilaflı, tarım vb.).

### 4.8 Reports & Analytics Module

**REQ-RPT-01** — The `/admin/reports` page SHALL offer report types: Listings Report, Users Report, Revenue Report, Activity Report.

**REQ-RPT-02** — Each report SHALL support date range selection, filter parameters, and ApexCharts visualization.

**REQ-RPT-03** — Each report SHALL support export to CSV (client-side generation from JSON response).

### 4.9 Moderation Module

**REQ-MOD-01** — The `/admin/moderation` page SHALL display pending reports (user-submitted complaints) in a queue.

**REQ-MOD-02** — Each report row SHALL show: reporter, target (listing/user/message), reason, created_at, status.

**REQ-MOD-03** — WHEN admin clicks a report THEN a Flowbite drawer SHALL open with full context and action buttons (Dismiss, Warn User, Remove Content, Ban User).

**REQ-MOD-04** — All moderation actions SHALL create an AuditLog entry.

### 4.10 Payment & Package Management

**REQ-PAY-01** — The `/admin/packages` page SHALL display package types (Featured Listing, Doping/Boost, Premium Member) with CRUD.

**REQ-PAY-02** — Each package SHALL have: name_tr, name_en, price, duration_days, benefits (array of localized strings), is_active.

**REQ-PAY-03** — The `/admin/transactions` page SHALL display a Grid.js table of transactions with: user, package, amount, payment_method, status, timestamp.

**REQ-PAY-04** — The system SHALL support transaction filtering by status (pending/completed/refunded/failed) and date range.

### 4.11 Content Management

**REQ-CNT-01** — The `/admin/content/banners` page SHALL support CRUD for homepage banners (image, link, title_tr, title_en, start_date, end_date, is_active, sort_order).

**REQ-CNT-02** — The `/admin/content/faqs` page SHALL support CRUD for FAQ entries (question_tr/en, answer_tr/en, category, sort_order).

**REQ-CNT-03** — The `/admin/content/blog` page SHALL support CRUD for blog posts (title_tr/en, slug, excerpt, body, cover_image, author, published_at, tags).

### 4.12 System Settings & Logs

**REQ-SYS-01** — The `/admin/settings` page SHALL expose system config as key-value pairs, grouped by category (general, email, storage, sms, payment_gateway).

**REQ-SYS-02** — The `/admin/logs/audit` page SHALL display admin actions with columns: admin, action, target, details, ip_address, timestamp.

**REQ-SYS-03** — The `/admin/logs/activity` page SHALL display user activity logs with similar columns.

**REQ-SYS-04** — Both log pages SHALL support date range + user filter + full-text search.

### 4.13 Theme & Localization

**REQ-THM-01** — The system SHALL support Light and Dark modes via Tailwind's `darkMode: 'class'` strategy; default SHALL be system preference.

**REQ-THM-02** — WHEN user toggles the theme (via profile popover on web, or drawer setting on mobile) THEN the `themeStore` SHALL toggle the `dark` class on `<html>` AND the choice SHALL persist in localStorage under key `aperant.theme`.

**REQ-I18N-01** — The system SHALL support Turkish (default) and English.

**REQ-I18N-02** — The language selector SHALL be accessible from the profile popover (web) and drawer (mobile).

**REQ-I18N-03** — The selected language SHALL persist in localStorage under key `aperant.locale`.

**REQ-I18N-04** — All user-facing strings SHALL be wrapped in `i18n.t('namespace.key')` or rendered via the `x-t` Alpine directive. No hardcoded strings in HTML or Alpine templates.

### 4.14 Mock API Contract

**REQ-MOCK-01** — The system SHALL use MSW to intercept all HTTP requests to `${VITE_API_BASE_URL}/api/v1/*`.

**REQ-MOCK-02** — MSW handlers SHALL be enabled ONLY when `import.meta.env.VITE_USE_MOCKS === 'true'`.

**REQ-MOCK-03** — Mock responses SHALL simulate realistic latency (200-600ms).

**REQ-MOCK-04** — Mock handlers SHALL cover every endpoint defined in `src/services/*Service.js`.

**REQ-MOCK-05** — Fixture data SHALL be seeded with realistic Turkish data (Turkish names, addresses, İstanbul/Ankara/İzmir locations, TRY currency).

**REQ-MOCK-06** — WHEN `VITE_USE_MOCKS=false` AND `VITE_API_BASE_URL` points to a live FastAPI instance THEN the app SHALL function identically without any code changes.

---

## 5. Non-Functional Requirements

**NFR-01 — Performance:** Initial bundle (after code-splitting) SHALL be under 400KB gzipped (lower budget than a React stack since Alpine + Flowbite is lighter). Routes SHALL be lazy-loaded via dynamic `import()`.

**NFR-02 — Accessibility:** All interactive elements SHALL have appropriate ARIA labels. Color contrast SHALL meet WCAG AA. Flowbite components already ship with reasonable ARIA defaults — verify per instance.

**NFR-03 — Browser Support:** Latest 2 versions of Chrome, Firefox, Safari, Edge.

**NFR-04 — Mobile Support:** iOS Safari 15+, Chrome Android 100+.

**NFR-05 — Type Safety:** Use JSDoc `@typedef` + zod runtime validation for every DTO. Public service methods and store methods SHALL have JSDoc signatures.

**NFR-06 — Code Organization:** No single file SHALL exceed 300 lines (excluding generated fixtures and i18n JSON).

**NFR-07 — Testing:** Every service class SHALL have unit tests. Every Alpine store SHALL have unit tests. Every page SHALL have at least one Playwright smoke test.

---

## 6. Out of Scope (Phase 1)

- Backend FastAPI implementation
- Real database (PostgreSQL, etc.)
- Real authentication (OAuth, LDAP)
- Real payment gateway integration
- Real-time notifications (WebSocket, SSE)
- File upload to real storage (S3, etc.) — mocked only
- Email/SMS sending
- Docker/Kubernetes deployment config
- CI/CD pipelines
- End-user facing public website
