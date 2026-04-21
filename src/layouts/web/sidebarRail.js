import { PATHS } from '@/router/paths.js';
import { navigate } from '@/router/index.js';
import { t } from '@/i18n/index.js';

const HOME_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-7h4v7h4a1 1 0 001-1V10" /></svg>';
const LIST_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>';
const USER_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.5 21a7.5 7.5 0 1113 0M12 13a4 4 0 110-8 4 4 0 010 8z" /></svg>';
const TAG_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M5 3h6l9 9-6 6-9-9V3z" /></svg>';
const MAP_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 10s-7-7-7-11a7 7 0 1114 0c0 4-7 11-7 11z" /></svg>';
const CHART_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M7 14l3-3 4 4 5-7" /></svg>';
const SHIELD_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" /></svg>';
const MONEY_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8M12 3a9 9 0 100 18 9 9 0 000-18z" /></svg>';
const DOC_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm2 6h6M9 13h6M9 17h4" /></svg>';
const COG_ICON = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317a1.724 1.724 0 013.35 0 1.724 1.724 0 002.573 1.066 1.724 1.724 0 012.37 2.37 1.724 1.724 0 001.066 2.572 1.724 1.724 0 010 3.35 1.724 1.724 0 00-1.066 2.573 1.724 1.724 0 01-2.37 2.37 1.724 1.724 0 00-2.573 1.066 1.724 1.724 0 01-3.35 0 1.724 1.724 0 00-2.572-1.066 1.724 1.724 0 01-2.37-2.37 1.724 1.724 0 00-1.066-2.573 1.724 1.724 0 010-3.35 1.724 1.724 0 001.066-2.572 1.724 1.724 0 012.37-2.37 1.724 1.724 0 002.572-1.066zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>';

const RAIL_ITEMS = Object.freeze([
  { key: 'dashboard', icon: HOME_ICON, path: PATHS.ADMIN.DASHBOARD },
  { key: 'listings', icon: LIST_ICON, path: PATHS.ADMIN.LISTINGS.ROOT },
  { key: 'users', icon: USER_ICON, path: PATHS.ADMIN.USERS.ROOT },
  { key: 'categories', icon: TAG_ICON, path: PATHS.ADMIN.CATEGORIES },
  { key: 'locations', icon: MAP_ICON, path: PATHS.ADMIN.LOCATIONS },
  { key: 'reports', icon: CHART_ICON, path: PATHS.ADMIN.REPORTS },
  { key: 'moderation', icon: SHIELD_ICON, path: PATHS.ADMIN.MODERATION },
  { key: 'packages', icon: MONEY_ICON, path: PATHS.ADMIN.PACKAGES },
  { key: 'content', icon: DOC_ICON, path: PATHS.ADMIN.CONTENT.BANNERS },
  { key: 'settings', icon: COG_ICON, path: PATHS.ADMIN.SETTINGS },
]);

export function sidebarRail() {
  return {
    items: RAIL_ITEMS,

    isActive(key) {
      return this.$store.ui.activeModule === key;
    },

    /** @param {{ key: string, path: string }} item */
    onClick(item) {
      this.$store.ui.openModule(item.key);
      if (item.path) navigate(item.path);
    },

    tLabel(key) {
      return t(`navigation.${key}`);
    },

    initials() {
      const name = this.$store.auth.user?.full_name ?? 'A';
      return name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    },

    toggleProfilePopover() {
      this.$store.ui.openModule('profile');
    },
  };
}
