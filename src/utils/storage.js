/**
 * Safe localStorage wrapper. All reads default to `null` on JSON parse errors
 * or when localStorage is unavailable (SSR / locked-down browsers).
 */

/**
 * @param {string} key
 * @param {T} [fallback]
 * @returns {T|null}
 * @template T
 */
export function readJSON(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** @param {string} key @param {unknown} value */
export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* intentionally ignored */
  }
}

/** @param {string} key @returns {string|null} */
export function readString(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** @param {string} key @param {string} value */
export function writeString(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* intentionally ignored */
  }
}

/** @param {string} key */
export function remove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* intentionally ignored */
  }
}

export const STORAGE_KEYS = Object.freeze({
  THEME: 'aperant.theme',
  LOCALE: 'aperant.locale',
  ACCESS_TOKEN: 'aperant.auth.accessToken',
  REFRESH_TOKEN: 'aperant.auth.refreshToken',
  USER: 'aperant.auth.user',
});
