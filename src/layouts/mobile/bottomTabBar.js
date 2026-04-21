import { PATHS } from '@/router/paths.js';
import { t } from '@/i18n/index.js';

const HOME = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-7h4v7h4a1 1 0 001-1V10" /></svg>';
const LIST = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>';
const PLUS = '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" /></svg>';
const BELL = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .53-.21 1.04-.59 1.4L4 17h5m6 0a3 3 0 11-6 0" /></svg>';
const USER = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.5 21a7.5 7.5 0 1113 0M12 13a4 4 0 110-8 4 4 0 010 8z" /></svg>';

const TAB_ITEMS = Object.freeze([
  { key: 'navigation.dashboard', icon: HOME, path: PATHS.ADMIN.DASHBOARD },
  { key: 'navigation.listings', icon: LIST, path: PATHS.ADMIN.LISTINGS.ROOT },
  { key: 'navigation.listings_new', icon: PLUS, path: PATHS.ADMIN.LISTINGS.NEW, fab: true },
  { key: 'navigation.notifications', icon: BELL, path: PATHS.ADMIN.DASHBOARD },
  { key: 'navigation.profile', icon: USER, path: PATHS.ADMIN.PROFILE },
]);

export function bottomTabBar() {
  return {
    items: TAB_ITEMS,

    isActive(path) {
      const current = (window.location.hash || '').replace(/^#/, '') || window.location.pathname;
      return current === path || current.endsWith(path);
    },

    tLabel(key) {
      return t(key);
    },
  };
}
