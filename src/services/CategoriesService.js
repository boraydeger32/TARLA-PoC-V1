import { BaseService } from './BaseService.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class CategoriesService extends BaseService {
  constructor() {
    super(ENDPOINTS.CATEGORIES);
  }

  tree() {
    return this.client.get(`${this.endpoint}/tree`);
  }

  reorder(orderedIds) {
    return this.client.post(`${this.endpoint}/reorder`, { ids: orderedIds });
  }
}

export const categoriesService = new CategoriesService();
