import { listingsListObserver } from '@/queries/listingsQueries.js';
import { queryClient } from '@/queries/queryClient.js';
import { loginMutation } from '@/queries/authQueries.js';
import { t } from '@/i18n/index.js';

/**
 * End-to-end dev-only smoke page. Demonstrates:
 *   login (mock creds) → AuthService → authStore → query cache → observer → UI
 */
export function devQueriesPage() {
  return {
    items: [],
    total: 0,
    loading: false,
    error: null,
    params: { page: 1, size: 10 },
    observer: null,
    unsubscribe: null,
    authStatus: 'idle',

    async login() {
      this.authStatus = 'authenticating';
      try {
        await loginMutation('admin@aperant.test', 'admin123');
        this.authStatus = 'authenticated';
        this.subscribe();
      } catch (err) {
        this.authStatus = 'error';
        this.error = err?.message ?? t('errors.auth.login_failed');
      }
    },

    subscribe() {
      if (this.unsubscribe) this.unsubscribe();
      this.observer = listingsListObserver(this.params);
      this.unsubscribe = this.observer.subscribe((result) => {
        this.loading = result.isFetching || result.isLoading;
        this.items = result.data?.items ?? [];
        this.total = result.data?.total ?? 0;
        this.error = result.error ? String(result.error.message ?? result.error) : null;
      });
    },

    destroy() {
      this.unsubscribe?.();
      queryClient.removeQueries({ queryKey: ['listings'] });
    },
  };
}
