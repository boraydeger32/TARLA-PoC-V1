import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { logsService } from '@/services/LogsService.js';

export function auditLogsObserver(params) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.logs.audit(params),
    queryFn: () => logsService.audit(params),
  });
}

export function activityLogsObserver(params) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.logs.activity(params),
    queryFn: () => logsService.activity(params),
  });
}
