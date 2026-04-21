import { authHandlers } from './auth.js';
import { listingsHandlers } from './listings.js';
import { usersHandlers } from './users.js';
import { categoriesHandlers } from './categories.js';
import { locationsHandlers } from './locations.js';
import { reportsHandlers } from './reports.js';
import { moderationHandlers } from './moderation.js';
import { packagesHandlers } from './packages.js';
import { transactionsHandlers } from './transactions.js';
import { contentHandlers } from './content.js';
import { settingsHandlers } from './settings.js';
import { logsHandlers } from './logs.js';
import { dashboardHandlers } from './dashboard.js';

export const handlers = [
  ...authHandlers,
  ...listingsHandlers,
  ...usersHandlers,
  ...categoriesHandlers,
  ...locationsHandlers,
  ...reportsHandlers,
  ...moderationHandlers,
  ...packagesHandlers,
  ...transactionsHandlers,
  ...contentHandlers,
  ...settingsHandlers,
  ...logsHandlers,
  ...dashboardHandlers,
];
