import { BaseService } from './BaseService.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class TransactionsService extends BaseService {
  constructor() {
    super(ENDPOINTS.TRANSACTIONS);
  }

  refund(id, reason) {
    return this.client.post(`${this.endpoint}/${id}/refund`, { reason });
  }

  export(params) {
    return this.client.get(`${this.endpoint}/export`, { params, responseType: 'blob' });
  }
}

export const transactionsService = new TransactionsService();
