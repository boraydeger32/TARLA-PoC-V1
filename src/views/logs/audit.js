import { auditLogsObserver } from '@/queries/logsQueries.js';
import { formatDateTime } from '@/utils/format.js';

export function auditLogPage() {
  return {
    items: [],
    total: 0,
    loading: true,
    error: null,
    params: { page: 1, size: 50 },

    init() {
      this.$store.ui.activeModule = 'settings';
      this.subscribe();
    },
    destroy() { this.unsubscribe?.(); },

    subscribe() {
      this.unsubscribe?.();
      this.observer = auditLogsObserver(this.params);
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading;
        this.items = r.data?.items ?? [];
        this.total = r.data?.total ?? 0;
        this.error = r.error?.message ?? null;
      });
    },
    pages() { return Math.max(1, Math.ceil(this.total / this.params.size)); },
    goPage(p) {
      const max = this.pages();
      if (p < 1 || p > max) return;
      this.params = { ...this.params, page: p };
      this.subscribe();
    },

    formatDateTime,
  };
}
