import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { settingsService } from '@/services/SettingsService.js';

export function settingsListObserver() {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.settings.all,
    queryFn: () => settingsService.list(),
  });
}

export async function updateSetting(key, value) {
  const out = await settingsService.update(key, value);
  queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
  return out;
}
