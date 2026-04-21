import { apiClient } from '@/api/client.js';
import { ENDPOINTS } from '@/api/endpoints.js';

/**
 * Auth service — login / logout / refresh / me.
 * The refresh call itself is performed by the refreshInterceptor, but this
 * service exposes `refresh()` for explicit proactive refresh flows (e.g.
 * "remember me" on page load).
 */
export class AuthService {
  client = apiClient;

  /**
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ access_token: string, refresh_token: string, user: object }>}
   */
  login(credentials) {
    return this.client.post(ENDPOINTS.AUTH.LOGIN, credentials);
  }

  logout() {
    return this.client.post(ENDPOINTS.AUTH.LOGOUT);
  }

  /** @param {string} refreshToken */
  refresh(refreshToken) {
    return this.client.post(ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken });
  }

  me() {
    return this.client.get(ENDPOINTS.AUTH.ME);
  }
}

export const authService = new AuthService();
