# Aperant Admin Panel

Türkiye arsa/emlak pazaryeri için admin paneli. **Phase 1: Frontend-only** — tüm API çağrıları MSW ile mock'lanır.

## Hızlı başlangıç

```bash
pnpm install
pnpm msw:init      # public/mockServiceWorker.js üretir (ilk seferlik)
pnpm dev           # http://localhost:5173
```

## Scripts

| Komut | Açıklama |
|---|---|
| `pnpm dev` | Vite dev server (port 5173) |
| `pnpm build` | Prod bundle `dist/` |
| `pnpm preview` | Prod bundle lokal önizleme |
| `pnpm lint` | Biome check |
| `pnpm format` | Biome format |
| `pnpm test` | Vitest (unit) |
| `pnpm test:e2e` | Playwright |

## Stack

Vite • Alpine.js 3 • Flowbite 2 • Tailwind 3 • plain JS (ES2022+) • zod • i18next • Navigo • @tanstack/query-core • axios • MSW • Grid.js • ApexCharts • Biome • pnpm.

## Architecture

Bkz. `specs/admin-panel/design.md`. Katman sırası:

```
views ──► controllers ──► queries ──► services ──► api
```

`axios` yalnızca `src/api/` altında. MSW ↔ FastAPI swap kontratı için `design.md §9`.

## Mock credentials

```
admin@aperant.test / admin123
```

## Lisans

Proprietary.
# TARLA-PoC-V1
