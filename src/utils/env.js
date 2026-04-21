/**
 * Strongly-typed accessor for VITE_* environment variables.
 * Keeps `import.meta.env` usage in one place so swapping hosts is simple.
 *
 * @template {string} K
 * @param {K} key
 * @param {string} [fallback]
 * @returns {string}
 */
export function getEnv(key, fallback = '') {
  const value = import.meta.env?.[key];
  if (value === undefined || value === null || value === '') return fallback;
  return String(value);
}

/** @returns {boolean} */
export function useMocks() {
  return getEnv('VITE_USE_MOCKS', 'false') === 'true';
}

/** @returns {string} */
export function apiBaseUrl() {
  return getEnv('VITE_API_BASE_URL', '/api/v1');
}

/** @returns {boolean} */
export function isDev() {
  return !!import.meta.env?.DEV;
}

/** @returns {string} */
export function appVersion() {
  return getEnv('VITE_APP_VERSION', '0.1.0');
}
