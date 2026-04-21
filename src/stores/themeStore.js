import { STORAGE_KEYS, readString, writeString } from '@/utils/storage.js';

/** @typedef {'light' | 'dark' | 'system'} ThemeMode */

/**
 * themeStore — toggles the `dark` class on <html>, persists in localStorage.
 * See design.md §6.2.
 */
export const themeStore = {
  /** @type {ThemeMode} */
  mode: 'system',
  _mql: null,

  init() {
    const saved = /** @type {ThemeMode|null} */ (readString(STORAGE_KEYS.THEME));
    this.mode = saved === 'dark' || saved === 'light' || saved === 'system' ? saved : 'system';
    this.apply();

    this._mql = window.matchMedia('(prefers-color-scheme: dark)');
    this._mql.addEventListener?.('change', () => {
      if (this.mode === 'system') this.apply();
    });
  },

  toggle() {
    const currentlyDark = document.documentElement.classList.contains('dark');
    this.setMode(currentlyDark ? 'light' : 'dark');
  },

  /** @param {ThemeMode} mode */
  setMode(mode) {
    this.mode = mode;
    writeString(STORAGE_KEYS.THEME, mode);
    this.apply();
  },

  apply() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = this.mode === 'dark' || (this.mode === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  },

  isDark() {
    return document.documentElement.classList.contains('dark');
  },
};
