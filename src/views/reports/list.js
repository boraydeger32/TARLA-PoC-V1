import Alpine from 'alpinejs';
import { reportsListObserver, resolveReport, dismissReport } from '@/queries/reportsQueries.js';
import { formatDateTime } from '@/utils/format.js';
import { t } from '@/i18n/index.js';

export function reportsPage() {
  return {
    items: [],
    total: 0,
    loading: true,
    error: null,
    params: { page: 1, size: 25, status: 'all' },
    statusOptions: ['all', 'open', 'in_review', 'resolved', 'dismissed'],
    dialog: { type: null, target: null, note: '' },

    init() {
      this.$store.ui.activeModule = 'reports';
      this.subscribe();
    },
    destroy() { this.unsubscribe?.(); },

    normalize() {
      return {
        page: this.params.page,
        size: this.params.size,
        ...(this.params.status !== 'all' ? { status: this.params.status } : {}),
      };
    },

    subscribe() {
      this.unsubscribe?.();
      this.observer = reportsListObserver(this.normalize());
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading;
        this.items = r.data?.items ?? [];
        this.total = r.data?.total ?? 0;
        this.error = r.error?.message ?? null;
      });
    },
    setStatus(s) { this.params = { ...this.params, status: s, page: 1 }; this.subscribe(); },
    pages() { return Math.max(1, Math.ceil(this.total / this.params.size)); },
    goPage(p) {
      const max = this.pages();
      if (p < 1 || p > max) return;
      this.params = { ...this.params, page: p };
      this.subscribe();
    },

    formatDateTime,

    statusBadge(s) {
      return {
        open: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        in_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        dismissed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      }[s] ?? 'bg-gray-100 text-gray-800';
    },
    statusLabel(s) { return t(`reports.status.${s}`, { defaultValue: s }); },

    openDialog(type, target) {
      this.dialog = { type, target, note: '' };
    },
    closeDialog() { this.dialog = { type: null, target: null, note: '' }; },

    async confirm() {
      const it = this.dialog.target;
      if (!it) return;
      try {
        if (this.dialog.type === 'resolve') await resolveReport(it.id, this.dialog.note);
        else if (this.dialog.type === 'dismiss') await dismissReport(it.id, this.dialog.note);
        Alpine.store('ui').pushToast({ message: t('reports.toasts.updated'), type: 'success' });
        this.closeDialog();
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },
  };
}
