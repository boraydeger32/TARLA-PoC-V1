import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { reportsService } from '@/services/ReportsService.js';

export function reportsListObserver(params) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.reports.list(params),
    queryFn: () => reportsService.list(params),
  });
}

export function reportDetailObserver(id) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => reportsService.getById(id),
    enabled: !!id,
  });
}

function invalidate() {
  queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
}

export async function resolveReport(id, note) {
  const out = await reportsService.resolve(id, note);
  invalidate();
  return out;
}

export async function dismissReport(id, note) {
  const out = await reportsService.dismiss(id, note);
  invalidate();
  return out;
}
