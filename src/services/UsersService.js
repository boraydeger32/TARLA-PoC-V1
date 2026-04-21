import { BaseService } from './BaseService.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class UsersService extends BaseService {
  constructor() {
    super(ENDPOINTS.USERS);
  }

  suspend(id, reason) {
    return this.client.post(`${this.endpoint}/${id}/suspend`, { reason });
  }

  unsuspend(id) {
    return this.client.post(`${this.endpoint}/${id}/unsuspend`);
  }

  ban(id, reason) {
    return this.client.post(`${this.endpoint}/${id}/ban`, { reason });
  }

  changeRole(id, role) {
    return this.client.post(`${this.endpoint}/${id}/role`, { role });
  }

  resetPassword(id) {
    return this.client.post(`${this.endpoint}/${id}/reset-password`);
  }
}

export const usersService = new UsersService();
