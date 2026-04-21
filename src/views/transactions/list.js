import Alpine from 'alpinejs';
import { transactionsListObserver, refundTransaction } from '@/queries/transactionsQueries.js';
import { transactionsService } from '@/services/TransactionsService.js';
import { formatPrice, formatDateTime } from '@/utils/format.js';
import { t } from '@/i18n/index.js';

export function transactionsPage() {
  return {
    items: [],
    total: 0,
    loading: true,
    error: null,
    params: { page: 1, size: 25, status: 'all', q: '' },
    statusOptions: ['all', 'pending', 'completed', 'failed', 'refunded', 'cancelled'],
    dialog: { type: null, target: null, reason: '' },

    init() {
      this.$store.ui.activeModule = 'transactions';
      this.subscribe();
    },
    destroy() { this.unsubscribe?.(); },

    normalize() {
      return {
        page: this.params.page,
        size: this.params.size,
        ...(this.params.status !== 'all' ? { status: this.params.status } : {}),
        ...(this.params.q ? { q: this.params.q } : {}),
      };
    },

    subscribe() {
      this.unsubscribe?.();
      this.observer = transactionsListObserver(this.normalize());
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading;
        this.items = r.data?.items ?? [];
        this.total = r.data?.total ?? 0;
        this.error = r.error?.message ?? null;
      });
    },

    apply() { this.params = { ...this.params, page: 1 }; this.subscribe(); },
    setStatus(s) { this.params = { ...this.params, status: s, page: 1 }; this.subscribe(); },

    pages() { return Math.max(1, Math.ceil(this.total / this.params.size)); },
    goPage(p) {
      const max = this.pages();
      if (p < 1 || p > max) return;
      this.params = { ...this.params, page: p };
      this.subscribe();
    },

    formatPrice, formatDateTime,

    statusBadge(s) {
      return {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      }[s] ?? 'bg-gray-100 text-gray-800';
    },
    statusLabel(s) { return t(`transactions.status.${s}`, { defaultValue: s }); },

    openRefund(tx) {
      this.dialog = { type: 'refund', target: tx, reason: '' };
    },
    closeDialog() { this.dialog = { type: null, target: null, reason: '' }; },

    async confirm() {
      const tx = this.dialog.target;
      if (!tx) return;
      try {
        await refundTransaction(tx.id, this.dialog.reason);
        Alpine.store('ui').pushToast({ message: t('transactions.toasts.refunded'), type: 'success' });
        this.closeDialog();
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    async exportCsv() {
      try {
        const rows = this.items.map((t) => ({
          id: t.id,
          user_id: t.user_id,
          package_id: t.package_id,
          amount: t.amount,
          currency: t.currency,
          status: t.status,
          provider: t.provider,
          created_at: t.created_at,
        }));
        const header = Object.keys(rows[0] ?? { id: '' }).join(',');
        const body = rows.map((r) => Object.values(r).map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const csv = `${header}\n${body}`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },
  };
}
