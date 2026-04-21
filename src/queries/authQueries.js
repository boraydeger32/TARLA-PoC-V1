import Alpine from 'alpinejs';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { authService } from '@/services/AuthService.js';

/**
 * Login mutation — posts credentials, writes tokens + user into `authStore`.
 * Throws the normalized ApiError on failure so the view can show validation.
 *
 * @param {{ email: string, password: string }} credentials
 */
export async function loginMutation(credentials) {
  const result = await authService.login(credentials);
  const auth = Alpine.store('auth');
  auth.loginSuccess(result);
  return result;
}

export async function logoutMutation() {
  try {
    await authService.logout();
  } catch {
    /* server-side logout may fail (e.g. already expired) — proceed locally */
  }
  const auth = Alpine.store('auth');
  auth.logout();
  queryClient.clear();
}

export async function fetchCurrentUser() {
  return queryClient.fetchQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authService.me(),
  });
}
