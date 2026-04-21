import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { categoriesService } from '@/services/CategoriesService.js';

export function categoriesListObserver(params) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.categories.list(params),
    queryFn: () => categoriesService.list(params),
  });
}

export function categoriesTreeObserver() {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.categories.tree,
    queryFn: () => categoriesService.tree(),
  });
}

function invalidate() {
  queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
}

export async function createCategory(dto) {
  const out = await categoriesService.create(dto);
  invalidate();
  return out;
}

export async function updateCategory(id, dto) {
  const out = await categoriesService.update(id, dto);
  invalidate();
  return out;
}

export async function deleteCategory(id) {
  const out = await categoriesService.delete(id);
  invalidate();
  return out;
}

export async function reorderCategories(ids) {
  const out = await categoriesService.reorder(ids);
  invalidate();
  return out;
}
