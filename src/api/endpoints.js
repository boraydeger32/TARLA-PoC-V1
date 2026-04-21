/**
 * Endpoint URL constants. Paths are relative — `ApiClient` prepends
 * `VITE_API_BASE_URL`. Swapping MSW → FastAPI requires NO changes here.
 */
export const ENDPOINTS = Object.freeze({
  AUTH: Object.freeze({
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  }),
  LISTINGS: '/listings',
  USERS: '/users',
  CATEGORIES: '/categories',
  LOCATIONS: '/locations',
  ZONING: '/zoning-statuses',
  REPORTS: '/reports',
  MODERATION: '/moderation',
  PACKAGES: '/packages',
  TRANSACTIONS: '/transactions',
  BANNERS: '/content/banners',
  FAQS: '/content/faqs',
  BLOG: '/content/blog',
  SETTINGS: '/settings',
  LOGS: Object.freeze({
    AUDIT: '/logs/audit',
    ACTIVITY: '/logs/activity',
  }),
  DASHBOARD: '/dashboard/stats',
});
