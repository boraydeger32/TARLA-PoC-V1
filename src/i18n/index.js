/**
 * i18next bootstrap. TR is default, EN is fallback.
 * Task 2 populates the locale files; this module wires them in.
 */
import i18next from 'i18next';

import trCommon from './locales/tr/common.json';
import trNavigation from './locales/tr/navigation.json';
import trListings from './locales/tr/listings.json';
import trUsers from './locales/tr/users.json';
import trForms from './locales/tr/forms.json';
import trErrors from './locales/tr/errors.json';
import trDashboard from './locales/tr/dashboard.json';
import trSettings from './locales/tr/settings.json';
import trModeration from './locales/tr/moderation.json';
import trPackages from './locales/tr/packages.json';
import trTransactions from './locales/tr/transactions.json';
import trContent from './locales/tr/content.json';
import trReports from './locales/tr/reports.json';

import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enListings from './locales/en/listings.json';
import enUsers from './locales/en/users.json';
import enForms from './locales/en/forms.json';
import enErrors from './locales/en/errors.json';
import enDashboard from './locales/en/dashboard.json';
import enSettings from './locales/en/settings.json';
import enModeration from './locales/en/moderation.json';
import enPackages from './locales/en/packages.json';
import enTransactions from './locales/en/transactions.json';
import enContent from './locales/en/content.json';
import enReports from './locales/en/reports.json';

import { STORAGE_KEYS, readString } from '@/utils/storage.js';

const NAMESPACES = [
  'common',
  'navigation',
  'listings',
  'users',
  'forms',
  'errors',
  'dashboard',
  'settings',
  'moderation',
  'packages',
  'transactions',
  'content',
  'reports',
];

export async function initI18n() {
  const saved = readString(STORAGE_KEYS.LOCALE);
  const lng = saved === 'en' ? 'en' : 'tr';

  await i18next.init({
    lng,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: NAMESPACES,
    nsSeparator: '.',
    keySeparator: '.',
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    resources: {
      tr: {
        common: trCommon,
        navigation: trNavigation,
        listings: trListings,
        users: trUsers,
        forms: trForms,
        errors: trErrors,
        dashboard: trDashboard,
        settings: trSettings,
        moderation: trModeration,
        packages: trPackages,
        transactions: trTransactions,
        content: trContent,
        reports: trReports,
      },
      en: {
        common: enCommon,
        navigation: enNavigation,
        listings: enListings,
        users: enUsers,
        forms: enForms,
        errors: enErrors,
        dashboard: enDashboard,
        settings: enSettings,
        moderation: enModeration,
        packages: enPackages,
        transactions: enTransactions,
        content: enContent,
        reports: enReports,
      },
    },
  });
}

/**
 * Translation shortcut. Prefer this over importing i18next directly.
 *
 * @param {string} key
 * @param {Record<string, unknown>} [opts]
 * @returns {string}
 */
export function t(key, opts) {
  return i18next.t(key, opts);
}

export { i18next };
