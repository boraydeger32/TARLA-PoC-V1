import { apiClient } from '@/api/client.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class LogsService {
  client = apiClient;

  audit(params) {
    return this.client.get(ENDPOINTS.LOGS.AUDIT, { params });
  }

  activity(params) {
    return this.client.get(ENDPOINTS.LOGS.ACTIVITY, { params });
  }
}

export const logsService = new LogsService();
