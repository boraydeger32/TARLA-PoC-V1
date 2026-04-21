import Alpine from 'alpinejs';

/**
 * Attach `Authorization: Bearer <accessToken>` when the auth store has one.
 * @param {import('axios').InternalAxiosRequestConfig} config
 */
export function authInterceptor(config) {
  try {
    const auth = Alpine.store?.('auth');
    const token = auth?.accessToken;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* Alpine may not be booted yet — skip silently */
  }
  return config;
}
