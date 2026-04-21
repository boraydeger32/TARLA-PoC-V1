import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { packagesService } from '@/services/PackagesService.js';

export function packagesListObserver(params) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.packages.list(params),
    queryFn: () => packagesService.list(params),
  });
}

export function packageDetailObserver(id) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.packages.detail(id),
    queryFn: () => packagesService.getById(id),
    enabled: !!id,
  });
}

function invalidate() {
  queryClient.invalidateQueries({ queryKey: queryKeys.packages.all });
}

export async function createPackage(dto) {
  const out = await packagesService.create(dto);
  invalidate();
  return out;
}

export async function updatePackage(id, dto) {
  const out = await packagesService.update(id, dto);
  invalidate();
  return out;
}

export async function deletePackage(id) {
  const out = await packagesService.delete(id);
  invalidate();
  return out;
}

export async function activatePackage(id) {
  const out = await packagesService.activate(id);
  invalidate();
  return out;
}

export async function deactivatePackage(id) {
  const out = await packagesService.deactivate(id);
  invalidate();
  return out;
}
