import { PATHS } from '@/router/paths.js';

/**
 * Alpine factory for the breadcrumb component. Reads the current pathname
 * and maps each segment to a translation key in the `navigation` namespace.
 *
 * Used as `<nav x-data="breadcrumbs" x-init="compute()">` in the admin shell.
 */
export function breadcrumbs() {
  return {
    items: /** @type {Array<{ label: string, href: string|null }>} */ ([]),

    init() {
      this.compute();
      window.addEventListener('popstate', () => this.compute());
    },

    compute() {
      const pathname = window.location.pathname;
      if (!pathname.startsWith(PATHS.ADMIN.ROOT)) {
        this.items = [];
        return;
      }
      const parts = pathname.slice(PATHS.ADMIN.ROOT.length).split('/').filter(Boolean);
      const items = [{ label: 'navigation.home', href: PATHS.ADMIN.DASHBOARD }];
      let accumulator = PATHS.ADMIN.ROOT;
      for (const part of parts) {
        accumulator += `/${part}`;
        const key = mapSegment(part);
        items.push({ label: key, href: accumulator });
      }
      if (items.length) items[items.length - 1].href = null;
      this.items = items;
    },
  };
}

/** @param {string} segment */
function mapSegment(segment) {
  const map = {
    dashboard: 'navigation.dashboard',
    listings: 'navigation.listings',
    users: 'navigation.users',
    categories: 'navigation.categories',
    locations: 'navigation.locations',
    reports: 'navigation.reports',
    moderation: 'navigation.moderation',
    packages: 'navigation.packages',
    transactions: 'navigation.transactions',
    content: 'navigation.content',
    banners: 'navigation.banners',
    faqs: 'navigation.faqs',
    blog: 'navigation.blog',
    settings: 'navigation.settings',
    logs: 'navigation.logs',
    audit: 'navigation.logs_audit',
    activity: 'navigation.logs_activity',
    profile: 'navigation.profile',
    new: 'listings.actions.new',
    edit: 'common.edit',
  };
  return map[segment] ?? segment;
}
