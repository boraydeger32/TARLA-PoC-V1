import { BaseService } from './BaseService.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class ReportsService extends BaseService {
  constructor() {
    super(ENDPOINTS.REPORTS);
  }

  resolve(id, resolutionNote) {
    return this.client.post(`${this.endpoint}/${id}/resolve`, {
      resolution_note: resolutionNote,
    });
  }

  dismiss(id, resolutionNote) {
    return this.client.post(`${this.endpoint}/${id}/dismiss`, {
      resolution_note: resolutionNote,
    });
  }
}

export const reportsService = new ReportsService();
