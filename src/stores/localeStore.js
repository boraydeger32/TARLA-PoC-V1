import i18next from 'i18next';

import { STORAGE_KEYS, readString, writeString } from '@/utils/storage.js';

/** @typedef {'tr' | 'en'} Language */

export const localeStore = {
  /** @type {Language} */
  language: 'tr',

  init() {
    const saved = readString(STORAGE_KEYS.LOCALE);
    this.language = saved === 'en' ? 'en' : 'tr';
    document.documentElement.setAttribute('lang', this.language);
    if (i18next.language !== this.language) {
      i18next.changeLanguage(this.language);
    }
  },

  /** @param {Language} lang */
  setLanguage(lang) {
    this.language = lang === 'en' ? 'en' : 'tr';
    writeString(STORAGE_KEYS.LOCALE, this.language);
    document.documentElement.setAttribute('lang', this.language);
    i18next.changeLanguage(this.language);
  },

  toggle() {
    this.setLanguage(this.language === 'tr' ? 'en' : 'tr');
  },
};
