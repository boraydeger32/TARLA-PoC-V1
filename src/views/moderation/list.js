import Alpine from 'alpinejs';
import { moderationQueueObserver, warnUser, removeContent } from '@/queries/moderationQueries.js';
import { approveListing, rejectListing } from '@/queries/listingsQueries.js';
import { resolveReport, dismissReport } from '@/queries/reportsQueries.js';
import { banUser } from '@/queries/usersQueries.js';
import { formatRelative } from '@/utils/format.js';
import { canPerform } from '@/constants/roles.js';
import { t } from '@/i18n/index.js';

export function moderationPage() {
  return {
    items: [],
    total: 0,
    loading: true,
    error: null,
    params: { page: 1, size: 25 },
    selected: null,
    dialog: { type: null, payload: { reason: '', message: '' } },

    init() {
      this.$store.ui.activeModule = 'moderation';
      this.subscribe();
    },
    destroy() { this.unsubscribe?.(); },

    subscribe() {
      this.unsubscribe?.();
      this.observer = moderationQueueObserver(this.params);
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

    formatRelative,

    priorityBadge(p) {
      return {
        high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      }[p] ?? 'bg-gray-100 text-gray-800';
    },

    typeLabel(type) { return t(`moderation.types.${type}`, { defaultValue: type }); },

    canApprove() { return canPerform(this.$store.auth.user?.role, 'LISTING_APPROVE'); },
    canBan() { return canPerform(this.$store.auth.user?.role, 'USER_DELETE'); },
    canWarn() { return canPerform(this.$store.auth.user?.role, 'USER_SUSPEND'); },
    canRemove() { return canPerform(this.$store.auth.user?.role, 'LISTING_DELETE'); },

    openItem(item) {
      this.selected = item;
    },
    closeDrawer() { this.selected = null; },

    openDialog(type) {
      this.dialog.type = type;
      this.dialog.payload = { reason: '', message: '' };
    },
    closeDialog() { this.dialog.type = null; },

    async confirm() {
      if (!this.selected) return;
      const it = this.selected;
      try {
        switch (this.dialog.type) {
          case 'approve':
            await approveListing(it.target_id);
            break;
          case 'reject':
            await rejectListing(it.target_id, this.dialog.payload.reason);
            break;
          case 'resolve':
            await resolveReport(it.target_id, this.dialog.payload.reason);
            break;
          case 'dismiss':
            await dismissReport(it.target_id, this.dialog.payload.reason);
            break;
          case 'warn':
            await warnUser(it.target_id, this.dialog.payload.message);
            break;
          case 'remove':
            await removeContent(it.target_type, it.target_id, this.dialog.payload.reason);
            break;
          case 'ban':
            await banUser(it.target_id, this.dialog.payload.reason);
            break;
        }
        Alpine.store('ui').pushToast({ message: t('moderation.toasts.done'), type: 'success' });
        this.closeDialog();
        this.closeDrawer();
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },
  };
}
