import Alpine from 'alpinejs';
import {
  listingsListObserver,
  approveListing,
  rejectListing,
  featureListing,
  deleteListing,
} from '@/queries/listingsQueries.js';
import { t } from '@/i18n/index.js';
import { formatPrice, formatDate } from '@/utils/format.js';
import { canPerform } from '@/constants/roles.js';
import { withBase } from '@/router/paths.js';

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected', 'expired', 'draft'];

/**
 * Listings list page (Task 7 — reference module).
 * Server-paged table backed by `listingsListObserver` + Alpine reactivity.
 *
 * @returns {object} Alpine component
 */
export function listingsListPage() {
  return {
    items: [],
    total: 0,
    pages: 1,
    loading: true,
    error: null,
    params: { page: 1, size: 25, status: 'all', q: '' },
    statusOptions: STATUS_OPTIONS,
    selectedId: null,
    dialog: { type: null, payload: { reason: '', durationDays: 7 } },

    init() {
      this.$store.ui.activeModule = 'listings';
      this.observer = listingsListObserver(this.normalizedParams());
      this.unsubscribe = this.observer.subscribe((res) => {
        this.items = res.data?.items ?? [];
        this.total = res.data?.total ?? 0;
        this.pages = res.data?.pages ?? 1;
        this.loading = res.isLoading || res.isFetching;
        this.error = res.error?.message ?? null;
      });
    },

    destroy() {
      this.unsubscribe?.();
    },

    normalizedParams() {
      const p = { page: this.params.page, size: this.params.size };
      if (this.params.status && this.params.status !== 'all') p.status = this.params.status;
      if (this.params.q?.trim()) p.q = this.params.q.trim();
      return p;
    },

    refetch() {
      const next = this.normalizedParams();
      this.observer.setOptions({
        ...this.observer.options,
        queryKey: ['listings', 'list', next],
        queryFn: () => this.observer.options.queryFn ? this.observer.options.queryFn() : null,
      });
      this.observer.refetch();
    },

    setStatus(status) {
      this.params.status = status;
      this.params.page = 1;
      this.applyFilters();
    },

    onSearch() {
      this.params.page = 1;
      this.applyFilters();
    },

    applyFilters() {
      const next = this.normalizedParams();
      this.observer.setOptions({
        queryKey: ['listings', 'list', next],
        queryFn: () => import('@/services/ListingsService.js').then((m) => m.listingsService.list(next)),
      });
    },

    goPage(page) {
      if (page < 1 || page > this.pages) return;
      this.params.page = page;
      this.applyFilters();
    },

    canApprove() {
      const role = this.$store.auth.user?.role;
      return canPerform(role, 'LISTING_APPROVE');
    },
    canDelete() {
      const role = this.$store.auth.user?.role;
      return canPerform(role, 'LISTING_DELETE');
    },
    canFeature() {
      const role = this.$store.auth.user?.role;
      return canPerform(role, 'LISTING_FEATURE');
    },

    formatPrice(item) {
      return formatPrice(item.price, item.currency);
    },
    formatDate(value) {
      return formatDate(value);
    },
    statusLabel(status) {
      return t(`listings.status.${status}`, { defaultValue: status });
    },
    statusBadgeClass(status) {
      return {
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        expired: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        draft: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        archived: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      }[status] ?? 'bg-gray-100 text-gray-800';
    },

    openDialog(type, id) {
      this.selectedId = id;
      this.dialog.type = type;
      this.dialog.payload = { reason: '', durationDays: 7 };
    },
    closeDialog() {
      this.dialog.type = null;
      this.selectedId = null;
    },

    async confirmDialog() {
      if (!this.selectedId) return;
      try {
        switch (this.dialog.type) {
          case 'approve':
            await approveListing(this.selectedId);
            this.toast(t('listings.toasts.approved'));
            break;
          case 'reject': {
            const reason = this.dialog.payload.reason?.trim();
            if (!reason || reason.length < 10) return;
            await rejectListing(this.selectedId, reason);
            this.toast(t('listings.toasts.rejected'));
            break;
          }
          case 'feature':
            await featureListing(this.selectedId, Number(this.dialog.payload.durationDays) || 7);
            this.toast(t('listings.toasts.featured'));
            break;
          case 'delete':
            await deleteListing(this.selectedId);
            this.toast(t('listings.toasts.deleted'));
            break;
          default:
            break;
        }
      } catch (err) {
        this.toast(err?.message ?? t('common.error'), 'danger');
      } finally {
        this.closeDialog();
      }
    },

    toast(message, type = 'success') {
      Alpine.store('ui').pushToast({ message, type });
    },

    goDetail(id) {
      window.location.assign(withBase(`/admin/listings/${id}`));
    },
  };
}
