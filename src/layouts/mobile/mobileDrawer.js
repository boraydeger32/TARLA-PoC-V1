import { PATHS } from '@/router/paths.js';
import { navigate } from '@/router/index.js';

const DRAWER_ITEMS = Object.freeze([
  { key: 'navigation.dashboard', path: PATHS.ADMIN.DASHBOARD },
  { key: 'navigation.listings', path: PATHS.ADMIN.LISTINGS.ROOT },
  { key: 'navigation.users', path: PATHS.ADMIN.USERS.ROOT },
  { key: 'navigation.categories', path: PATHS.ADMIN.CATEGORIES },
  { key: 'navigation.locations', path: PATHS.ADMIN.LOCATIONS },
  { key: 'navigation.moderation', path: PATHS.ADMIN.MODERATION },
  { key: 'navigation.packages', path: PATHS.ADMIN.PACKAGES },
  { key: 'navigation.transactions', path: PATHS.ADMIN.TRANSACTIONS },
  { key: 'navigation.reports', path: PATHS.ADMIN.REPORTS },
  { key: 'navigation.banners', path: PATHS.ADMIN.CONTENT.BANNERS },
  { key: 'navigation.settings', path: PATHS.ADMIN.SETTINGS },
  { key: 'navigation.logs_audit', path: PATHS.ADMIN.LOGS.AUDIT },
]);

export function mobileDrawer() {
  return {
    items: DRAWER_ITEMS,

    logout() {
      this.$store.auth.logout();
      this.$store.ui.closeDrawer();
      navigate(PATHS.LOGIN);
    },
  };
}
