import { BaseService } from './BaseService.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class ListingsService extends BaseService {
  constructor() {
    super(ENDPOINTS.LISTINGS);
  }

  approve(id) {
    return this.client.post(`${this.endpoint}/${id}/approve`);
  }

  /** @param {string} id @param {string} reason */
  reject(id, reason) {
    return this.client.post(`${this.endpoint}/${id}/reject`, { reason });
  }

  /** @param {string} id @param {number} durationDays */
  feature(id, durationDays) {
    return this.client.post(`${this.endpoint}/${id}/feature`, {
      duration_days: durationDays,
    });
  }

  archive(id) {
    return this.client.post(`${this.endpoint}/${id}/archive`);
  }
}

export const listingsService = new ListingsService();
