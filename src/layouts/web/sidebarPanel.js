import { PATHS } from '@/router/paths.js';

const SUB_NAV = {
  listings: [
    { key: 'navigation.listings_all', path: PATHS.ADMIN.LISTINGS.ROOT },
    { key: 'navigation.listings_pending', path: `${PATHS.ADMIN.LISTINGS.ROOT}?status=pending` },
    { key: 'navigation.listings_new', path: PATHS.ADMIN.LISTINGS.NEW },
  ],
  users: [
    { key: 'navigation.users_all', path: PATHS.ADMIN.USERS.ROOT },
  ],
  categories: [
    { key: 'navigation.categories', path: PATHS.ADMIN.CATEGORIES },
  ],
  locations: [
    { key: 'navigation.locations', path: PATHS.ADMIN.LOCATIONS },
  ],
  reports: [
    { key: 'navigation.reports', path: PATHS.ADMIN.REPORTS },
  ],
  moderation: [
    { key: 'navigation.moderation', path: PATHS.ADMIN.MODERATION },
  ],
  packages: [
    { key: 'navigation.packages', path: PATHS.ADMIN.PACKAGES },
    { key: 'navigation.transactions', path: PATHS.ADMIN.TRANSACTIONS },
  ],
  content: [
    { key: 'navigation.banners', path: PATHS.ADMIN.CONTENT.BANNERS },
    { key: 'navigation.faqs', path: PATHS.ADMIN.CONTENT.FAQS },
    { key: 'navigation.blog', path: PATHS.ADMIN.CONTENT.BLOG },
  ],
  settings: [
    { key: 'navigation.settings', path: PATHS.ADMIN.SETTINGS },
    { key: 'navigation.logs_audit', path: PATHS.ADMIN.LOGS.AUDIT },
    { key: 'navigation.logs_activity', path: PATHS.ADMIN.LOGS.ACTIVITY },
  ],
  dashboard: [
    { key: 'navigation.dashboard', path: PATHS.ADMIN.DASHBOARD },
  ],
};

export function sidebarPanel() {
  return {
    title() {
      const key = this.$store.ui.activeModule ?? 'dashboard';
      return `navigation.${key}`;
    },

    subNav() {
      const key = this.$store.ui.activeModule ?? 'dashboard';
      return SUB_NAV[key] ?? [];
    },
  };
}
