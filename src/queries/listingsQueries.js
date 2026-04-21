import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { listingsService } from '@/services/ListingsService.js';

export function listingsListObserver(params) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.listings.list(params),
    queryFn: () => listingsService.list(params),
  });
}

export function listingDetailObserver(id) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.listings.detail(id),
    queryFn: () => listingsService.getById(id),
    enabled: !!id,
  });
}

export async function approveListing(id) {
  const out = await listingsService.approve(id);
  queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  return out;
}

export async function rejectListing(id, reason) {
  const out = await listingsService.reject(id, reason);
  queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  return out;
}

export async function featureListing(id, durationDays) {
  const out = await listingsService.feature(id, durationDays);
  queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  return out;
}

export async function archiveListing(id) {
  const out = await listingsService.archive(id);
  queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  return out;
}

export async function createListing(dto) {
  const out = await listingsService.create(dto);
  queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  return out;
}

export async function updateListing(id, dto) {
  const out = await listingsService.update(id, dto);
  queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  return out;
}

export async function deleteListing(id) {
  const out = await listingsService.delete(id);
  queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  return out;
}
