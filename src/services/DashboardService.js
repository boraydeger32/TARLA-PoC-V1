import { apiClient } from '@/api/client.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class DashboardService {
  client = apiClient;

  stats() {
    return this.client.get(ENDPOINTS.DASHBOARD);
  }

  trend(metric, rangeDays = 30) {
    return this.client.get(`${ENDPOINTS.DASHBOARD}/trend`, {
      params: { metric, range_days: rangeDays },
    });
  }
}

export const dashboardService = new DashboardService();
