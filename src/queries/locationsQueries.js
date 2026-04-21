import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { locationsService } from '@/services/LocationsService.js';

export function provincesObserver() {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.locations.provinces,
    queryFn: () => locationsService.provinces(),
    staleTime: 5 * 60_000,
  });
}

export function districtsObserver(provinceId) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.locations.districts(provinceId),
    queryFn: () => locationsService.districts(provinceId),
    enabled: !!provinceId,
    staleTime: 5 * 60_000,
  });
}

export function neighborhoodsObserver(districtId) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.locations.neighborhoods(districtId),
    queryFn: () => locationsService.neighborhoods(districtId),
    enabled: !!districtId,
    staleTime: 5 * 60_000,
  });
}
