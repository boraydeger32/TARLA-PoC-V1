import { apiClient } from '@/api/client.js';
import { ENDPOINTS } from '@/api/endpoints.js';
import { BaseService } from './BaseService.js';

export class BannersService extends BaseService {
  constructor() {
    super(ENDPOINTS.BANNERS);
  }
}

export class FAQsService extends BaseService {
  constructor() {
    super(ENDPOINTS.FAQS);
  }

  reorder(orderedIds) {
    return this.client.post(`${this.endpoint}/reorder`, { ids: orderedIds });
  }
}

export class BlogService extends BaseService {
  constructor() {
    super(ENDPOINTS.BLOG);
  }

  publish(id) {
    return this.client.post(`${this.endpoint}/${id}/publish`);
  }

  unpublish(id) {
    return this.client.post(`${this.endpoint}/${id}/unpublish`);
  }
}

export const bannersService = new BannersService();
export const faqsService = new FAQsService();
export const blogService = new BlogService();

/**
 * Aggregate namespace — convenience for callers that want a single import.
 */
export const contentService = {
  banners: bannersService,
  faqs: faqsService,
  blog: blogService,
  _raw: apiClient,
};
