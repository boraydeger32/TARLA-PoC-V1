import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { usersService } from '@/services/UsersService.js';

export function usersListObserver(params) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersService.list(params),
  });
}

export function userDetailObserver(id) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
}

function invalidate() {
  queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
}

export async function suspendUser(id, reason) {
  const out = await usersService.suspend(id, reason);
  invalidate();
  return out;
}

export async function unsuspendUser(id) {
  const out = await usersService.unsuspend(id);
  invalidate();
  return out;
}

export async function banUser(id, reason) {
  const out = await usersService.ban(id, reason);
  invalidate();
  return out;
}

export async function changeUserRole(id, role) {
  const out = await usersService.changeRole(id, role);
  invalidate();
  return out;
}

export async function resetUserPassword(id) {
  return usersService.resetPassword(id);
}

export async function updateUser(id, dto) {
  const out = await usersService.update(id, dto);
  invalidate();
  return out;
}
