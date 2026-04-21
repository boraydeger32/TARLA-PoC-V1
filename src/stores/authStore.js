import { STORAGE_KEYS, readJSON, readString, remove, writeJSON, writeString } from '@/utils/storage.js';

/** @typedef {'idle' | 'authenticating' | 'authenticated' | 'error'} AuthStatus */

/**
 * authStore — the ONLY client-state holder for tokens + current user.
 * API response data (listings, etc.) is NEVER stored here (see CLAUDE.md Rule 6).
 *
 * The full `login()` / `logout()` async methods are wired in Task 5, using the
 * `AuthService` + query cache. This module exposes synchronous mutators here.
 */
export const authStore = {
  /** @type {string|null} */
  accessToken: null,
  /** @type {string|null} */
  refreshToken: null,
  /** @type {object|null} */
  user: null,
  /** @type {AuthStatus} */
  status: 'idle',
  /** @type {string|null} */
  error: null,

  init() {
    this.accessToken = readString(STORAGE_KEYS.ACCESS_TOKEN);
    this.refreshToken = readString(STORAGE_KEYS.REFRESH_TOKEN);
    this.user = readJSON(STORAGE_KEYS.USER, null);
    this.status = this.accessToken && this.user ? 'authenticated' : 'idle';
  },

  /**
   * Persist a successful login.
   * @param {{ access_token: string, refresh_token: string, user: object }} payload
   */
  loginSuccess({ access_token, refresh_token, user }) {
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
    this.user = user;
    this.status = 'authenticated';
    this.error = null;
    writeString(STORAGE_KEYS.ACCESS_TOKEN, access_token);
    writeString(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
    writeJSON(STORAGE_KEYS.USER, user);
  },

  /**
   * Update tokens only (used by the refresh interceptor).
   * @param {{ access_token: string, refresh_token?: string }} payload
   */
  setTokens({ access_token, refresh_token }) {
    this.accessToken = access_token;
    writeString(STORAGE_KEYS.ACCESS_TOKEN, access_token);
    if (refresh_token) {
      this.refreshToken = refresh_token;
      writeString(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
    }
  },

  /** @param {string} [errorMsg] */
  loginFailed(errorMsg) {
    this.status = 'error';
    this.error = errorMsg ?? null;
  },

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    this.status = 'idle';
    this.error = null;
    remove(STORAGE_KEYS.ACCESS_TOKEN);
    remove(STORAGE_KEYS.REFRESH_TOKEN);
    remove(STORAGE_KEYS.USER);
  },

  isAuthenticated() {
    return this.status === 'authenticated' && !!this.accessToken;
  },

  /** @param {string|string[]} required */
  hasRole(required) {
    if (!this.user) return false;
    const role = this.user.role;
    if (Array.isArray(required)) return required.includes(role);
    return role === required;
  },
};
