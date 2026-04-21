import axios from 'axios';
import Alpine from 'alpinejs';

import { ENDPOINTS } from '@/api/endpoints.js';
import { apiBaseUrl } from '@/utils/env.js';
import { PATHS, withBase } from '@/router/paths.js';

/**
 * Dedicated axios instance used ONLY for the refresh call. It has NO
 * interceptors, which is critical to prevent infinite refresh loops
 * (see design.md §8).
 */
const bare = axios.create({ baseURL: apiBaseUrl(), timeout: 10_000 });

/** @type {Promise<string>|null} */
let inflight = null;

/**
 * Response interceptor: on 401, call `/auth/refresh` exactly once with the
 * current refresh token, then retry the original request with the new token.
 * If the refresh fails, log the user out and reject with a normalized error.
 *
 * @param {import('axios').AxiosError} error
 */
export async function refreshInterceptor(error) {
  const { response, config } = error;
  if (!response || !config) return Promise.reject(error);
  if (response.status !== 401) return Promise.reject(error);
  if (config.__isRetry) return Promise.reject(error);
  if (config.url?.includes(ENDPOINTS.AUTH.REFRESH)) return Promise.reject(error);

  const auth = Alpine.store?.('auth');
  const refreshToken = auth?.refreshToken;
  if (!refreshToken) {
    auth?.logout?.();
    window.location.replace(withBase(PATHS.LOGIN));
    return Promise.reject(error);
  }

  try {
    if (!inflight) {
      inflight = bare
        .post(ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken })
        .then((res) => {
          const { access_token, refresh_token } = res.data ?? {};
          if (!access_token) throw new Error('refresh_missing_token');
          auth?.setTokens?.({ access_token, refresh_token });
          return access_token;
        })
        .finally(() => {
          inflight = null;
        });
    }
    const newToken = await inflight;
    config.__isRetry = true;
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${newToken}`;
    return axios(config);
  } catch (refreshErr) {
    auth?.logout?.();
    window.location.replace(withBase(PATHS.LOGIN));
    return Promise.reject(refreshErr);
  }
}
