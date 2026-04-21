import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { moderationService } from '@/services/ModerationService.js';

export function moderationQueueObserver(params) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.moderation.queue(params),
    queryFn: () => moderationService.queue(params),
  });
}

export async function warnUser(userId, message) {
  return moderationService.warnUser(userId, message);
}

export async function removeContent(targetType, targetId, reason) {
  const out = await moderationService.removeContent(targetType, targetId, reason);
  queryClient.invalidateQueries({ queryKey: queryKeys.moderation.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  return out;
}
