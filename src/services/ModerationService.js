import { apiClient } from '@/api/client.js';
import { ENDPOINTS } from '@/api/endpoints.js';

/**
 * Moderation queue actions. Unlike other services this one does not follow
 * strict REST CRUD — endpoints are action-oriented.
 */
export class ModerationService {
  client = apiClient;

  queue(params) {
    return this.client.get(`${ENDPOINTS.MODERATION}/queue`, { params });
  }

  warnUser(userId, message) {
    return this.client.post(`${ENDPOINTS.MODERATION}/warn`, {
      user_id: userId,
      message,
    });
  }

  removeContent(targetType, targetId, reason) {
    return this.client.post(`${ENDPOINTS.MODERATION}/remove`, {
      target_type: targetType,
      target_id: targetId,
      reason,
    });
  }
}

export const moderationService = new ModerationService();
