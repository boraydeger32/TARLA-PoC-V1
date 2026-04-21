/**
 * Canonical route paths. Every navigation SHALL resolve a value from this
 * frozen object — never hardcode a path string elsewhere.
 */
const BASE = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');

/** Prepend the app base URL so full-page redirects honor GitHub Pages subpaths. */
export function withBase(path) {
  if (!path || path === '*') return path;
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const PATHS = Object.freeze({
  ROOT: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  ADMIN: Object.freeze({
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    LISTINGS: Object.freeze({
      ROOT: '/admin/listings',
      NEW: '/admin/listings/new',
      DETAIL: '/admin/listings/:id',
      EDIT: '/admin/listings/:id/edit',
    }),
    USERS: Object.freeze({
      ROOT: '/admin/users',
      DETAIL: '/admin/users/:id',
    }),
    CATEGORIES: '/admin/categories',
    LOCATIONS: '/admin/locations',
    REPORTS: '/admin/reports',
    MODERATION: '/admin/moderation',
    PACKAGES: '/admin/packages',
    TRANSACTIONS: '/admin/transactions',
    CONTENT: Object.freeze({
      BANNERS: '/admin/content/banners',
      FAQS: '/admin/content/faqs',
      BLOG: '/admin/content/blog',
    }),
    SETTINGS: '/admin/settings',
    LOGS: Object.freeze({
      AUDIT: '/admin/logs/audit',
      ACTIVITY: '/admin/logs/activity',
    }),
    PROFILE: '/admin/profile',
  }),
  DEV: Object.freeze({
    QUERIES: '/_dev/queries',
    THEME_I18N: '/_dev/theme-i18n',
  }),
  FORBIDDEN: '/403',
  NOT_FOUND: '*',
});
