import { BaseService } from './BaseService.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class PackagesService extends BaseService {
  constructor() {
    super(ENDPOINTS.PACKAGES);
  }

  activate(id) {
    return this.client.post(`${this.endpoint}/${id}/activate`);
  }

  deactivate(id) {
    return this.client.post(`${this.endpoint}/${id}/deactivate`);
  }
}

export const packagesService = new PackagesService();
