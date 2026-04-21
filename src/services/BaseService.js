import { apiClient } from '@/api/client.js';

/**
 * Abstract-ish CRUD scaffolding. Every concrete service extends this and
 * only implements domain-specific methods (e.g. `approve`, `feature`).
 */
export class BaseService {
  /** @type {string} */
  endpoint;
  client = apiClient;

  constructor(endpoint) {
    if (!endpoint) throw new Error('BaseService: endpoint required');
    this.endpoint = endpoint;
  }

  /** @param {object} [params] */
  list(params) {
    return this.client.get(this.endpoint, { params });
  }

  getById(id) {
    return this.client.get(`${this.endpoint}/${id}`);
  }

  create(dto) {
    return this.client.post(this.endpoint, dto);
  }

  update(id, dto) {
    return this.client.patch(`${this.endpoint}/${id}`, dto);
  }

  delete(id) {
    return this.client.delete(`${this.endpoint}/${id}`);
  }
}
