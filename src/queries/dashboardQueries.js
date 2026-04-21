import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { dashboardService } from '@/services/DashboardService.js';

export function dashboardStatsObserver() {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => dashboardService.stats(),
  });
}

export function dashboardTrendObserver(metric, rangeDays = 30) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.dashboard.trend(metric, rangeDays),
    queryFn: () => dashboardService.trend(metric, rangeDays),
  });
}
