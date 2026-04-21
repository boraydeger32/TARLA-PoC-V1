/**
 * Central registration of every Alpine component factory. Called once at boot
 * from `app.js`. Each task adds its own registrations by importing its
 * factories here — keeps `x-data="..."` attributes short and enforces a
 * single source of truth for component names.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
import { placeholderPage } from '@/views/placeholder.js';

// Layout components (Task 6)
import { adminLayout } from '@/layouts/adminLayout.js';
import { webHeader } from '@/layouts/web/webHeader.js';
import { sidebarRail } from '@/layouts/web/sidebarRail.js';
import { sidebarPanel } from '@/layouts/web/sidebarPanel.js';
import { mobileHeader } from '@/layouts/mobile/mobileHeader.js';
import { mobileDrawer } from '@/layouts/mobile/mobileDrawer.js';
import { bottomTabBar } from '@/layouts/mobile/bottomTabBar.js';

// Auth (Task 5/6)
import { loginPage } from '@/views/auth/login.js';

// Dashboard (Task 10)
import { dashboardPage } from '@/views/dashboard/dashboard.js';

// Dev (Task 5)
import { devQueriesPage } from '@/views/dev/queries.js';

// Listings (Task 7)
import { listingsListPage } from '@/views/listings/list.js';
import { listingDetailPage } from '@/views/listings/detail.js';
import { listingEditPage } from '@/views/listings/edit.js';

// Users (Task 8)
import { usersListPage } from '@/views/users/list.js';
import { userDetailPage } from '@/views/users/detail.js';

// Categories + Locations (Task 9)
import { categoriesPage } from '@/views/categories/list.js';
import { locationsPage } from '@/views/locations/list.js';

// Moderation (Task 11)
import { moderationPage } from '@/views/moderation/list.js';

// Packages / Transactions (Task 12)
import { packagesPage } from '@/views/packages/list.js';
import { transactionsPage } from '@/views/transactions/list.js';

// Content (Task 13)
import { bannersPage } from '@/views/content/banners/list.js';
import { faqsPage } from '@/views/content/faqs/list.js';
import { blogPage } from '@/views/content/blog/list.js';

// Reports (Task 14)
import { reportsPage } from '@/views/reports/list.js';

// Settings + Logs (Task 15)
import { settingsPage } from '@/views/settings/list.js';
import { auditLogPage } from '@/views/logs/audit.js';
import { activityLogPage } from '@/views/logs/activity.js';

export function registerAlpineComponents(Alpine) {
  Alpine.data('placeholderPage', placeholderPage);

  Alpine.data('adminLayout', adminLayout);
  Alpine.data('webHeader', webHeader);
  Alpine.data('sidebarRail', sidebarRail);
  Alpine.data('sidebarPanel', sidebarPanel);
  Alpine.data('mobileHeader', mobileHeader);
  Alpine.data('mobileDrawer', mobileDrawer);
  Alpine.data('bottomTabBar', bottomTabBar);

  Alpine.data('loginPage', loginPage);
  Alpine.data('dashboardPage', dashboardPage);
  Alpine.data('devQueriesPage', devQueriesPage);

  Alpine.data('listingsListPage', listingsListPage);
  Alpine.data('listingDetailPage', listingDetailPage);
  Alpine.data('listingEditPage', listingEditPage);

  Alpine.data('usersListPage', usersListPage);
  Alpine.data('userDetailPage', userDetailPage);

  Alpine.data('categoriesPage', categoriesPage);
  Alpine.data('locationsPage', locationsPage);
  Alpine.data('moderationPage', moderationPage);
  Alpine.data('packagesPage', packagesPage);
  Alpine.data('transactionsPage', transactionsPage);

  Alpine.data('bannersPage', bannersPage);
  Alpine.data('faqsPage', faqsPage);
  Alpine.data('blogPage', blogPage);

  Alpine.data('reportsPage', reportsPage);
  Alpine.data('settingsPage', settingsPage);
  Alpine.data('auditLogPage', auditLogPage);
  Alpine.data('activityLogPage', activityLogPage);
}
