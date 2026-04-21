import { apiClient } from '@/api/client.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class SettingsService {
  client = apiClient;

  list() {
    return this.client.get(ENDPOINTS.SETTINGS);
  }

  getByKey(key) {
    return this.client.get(`${ENDPOINTS.SETTINGS}/${key}`);
  }

  update(key, value) {
    return this.client.patch(`${ENDPOINTS.SETTINGS}/${key}`, { value });
  }
}

export const settingsService = new SettingsService();
