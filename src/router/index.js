import Navigo from 'navigo';

import { PATHS } from './paths.js';
import { protectedRoute } from '@/components/navigation/protectedRoute.js';

/**
 * Aperant client-side router. Navigo mounts HTML into `#route-outlet`
 * (inside the admin shell) for admin routes, or swaps `#app`'s contents
 * for full-page routes (login, 403, 404).
 *
 * Alpine re-attaches to new content automatically via its mutation observer.
 */
export const router = new Navigo('/', { hash: true, strategy: 'ONE' });

const appRoot = () => /** @type {HTMLElement} */ (document.getElementById('app'));
const outlet = () => document.getElementById('route-outlet');

/** @param {() => Promise<{ default: string }>} loader */
async function mountFullPage(loader) {
  const mod = await loader();
  const root = appRoot();
  if (root) root.innerHTML = mod.default;
}

/** @param {() => Promise<{ default: string }>} loader */
async function mountAdminRoute(loader) {
  await ensureAdminShell();
  const host = outlet();
  if (!host) return;
  const mod = await loader();
  host.innerHTML = mod.default;
}

/**
 * Admin shell is loaded once — subsequent admin-route changes only replace
 * the contents of `#route-outlet`, preserving Alpine store state.
 */
async function ensureAdminShell() {
  if (document.getElementById('route-outlet')) return;
  const { default: html } = await import('@/layouts/adminLayout.html?raw');
  const root = appRoot();
  if (root) root.innerHTML = html;
}

export function startRouter() {
  router
    .on(PATHS.ROOT, () => {
      router.navigate(PATHS.ADMIN.DASHBOARD);
    })
    .on(PATHS.LOGIN, () =>
      mountFullPage(() => import('@/views/auth/login.html?raw')),
    )
    .on(
      PATHS.ADMIN.DASHBOARD,
      protectedRoute(() => mountAdminRoute(() => import('@/views/dashboard/dashboard.html?raw'))),
    )
    .on(
      PATHS.ADMIN.LISTINGS.NEW,
      protectedRoute(() => mountAdminRoute(() => import('@/views/listings/edit.html?raw'))),
    )
    .on(
      PATHS.ADMIN.LISTINGS.EDIT,
      protectedRoute(({ data }) =>
        mountAdminRoute(() => import('@/views/listings/edit.html?raw').then((m) => ({ default: m.default.replace('__ID__', data?.id ?? '') }))),
      ),
    )
    .on(
      PATHS.ADMIN.LISTINGS.DETAIL,
      protectedRoute(() => mountAdminRoute(() => import('@/views/listings/detail.html?raw'))),
    )
    .on(
      PATHS.ADMIN.LISTINGS.ROOT,
      protectedRoute(() => mountAdminRoute(() => import('@/views/listings/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.USERS.DETAIL,
      protectedRoute(() => mountAdminRoute(() => import('@/views/users/detail.html?raw'))),
    )
    .on(
      PATHS.ADMIN.USERS.ROOT,
      protectedRoute(() => mountAdminRoute(() => import('@/views/users/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.CATEGORIES,
      protectedRoute(() => mountAdminRoute(() => import('@/views/categories/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.LOCATIONS,
      protectedRoute(() => mountAdminRoute(() => import('@/views/locations/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.REPORTS,
      protectedRoute(() => mountAdminRoute(() => import('@/views/reports/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.MODERATION,
      protectedRoute(() => mountAdminRoute(() => import('@/views/moderation/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.PACKAGES,
      protectedRoute(() => mountAdminRoute(() => import('@/views/packages/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.TRANSACTIONS,
      protectedRoute(() => mountAdminRoute(() => import('@/views/transactions/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.CONTENT.BANNERS,
      protectedRoute(() => mountAdminRoute(() => import('@/views/content/banners/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.CONTENT.FAQS,
      protectedRoute(() => mountAdminRoute(() => import('@/views/content/faqs/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.CONTENT.BLOG,
      protectedRoute(() => mountAdminRoute(() => import('@/views/content/blog/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.SETTINGS,
      protectedRoute(() => mountAdminRoute(() => import('@/views/settings/list.html?raw'))),
    )
    .on(
      PATHS.ADMIN.LOGS.AUDIT,
      protectedRoute(() => mountAdminRoute(() => import('@/views/logs/audit.html?raw'))),
    )
    .on(
      PATHS.ADMIN.LOGS.ACTIVITY,
      protectedRoute(() => mountAdminRoute(() => import('@/views/logs/activity.html?raw'))),
    )
    .on(PATHS.DEV.QUERIES, () =>
      mountFullPage(() => import('@/views/dev/queries.html?raw')),
    )
    .on(PATHS.FORBIDDEN, () =>
      mountFullPage(() => import('@/views/errors/forbidden.html?raw')),
    )
    .notFound(() => mountFullPage(() => import('@/views/errors/not-found.html?raw')));

  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = `#${PATHS.ROOT}`;
  }
  router.resolve();
}

/** @param {string} path */
export function navigate(path) {
  router.navigate(path);
}
