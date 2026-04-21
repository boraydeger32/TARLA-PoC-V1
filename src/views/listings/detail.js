import { listingDetailObserver } from '@/queries/listingsQueries.js';
import {
  approveListingAction,
  rejectListingAction,
  featureListingAction,
  deleteListingAction,
} from '@/controllers/listingApprovalController.js';
import { formatPrice, formatDate, formatArea } from '@/utils/format.js';
import { canPerform } from '@/constants/roles.js';
import { router } from '@/router/index.js';

function getRouteId() {
  const m = window.location.pathname.match(/\/admin\/listings\/([^/]+)$/);
  return m ? m[1] : null;
}

export function listingDetailPage() {
  return {
    item: null,
    loading: true,
    error: null,
    dialog: { type: null, payload: { reason: '', durationDays: 7 } },

    init() {
      this.$store.ui.activeModule = 'listings';
      const id = getRouteId();
      if (!id) {
        this.error = 'invalid_id';
        this.loading = false;
        return;
      }
      this.observer = listingDetailObserver(id);
      this.unsubscribe = this.observer.subscribe((res) => {
        this.item = res.data ?? null;
        this.loading = res.isLoading;
        this.error = res.error?.message ?? null;
      });
    },
    destroy() {
      this.unsubscribe?.();
    },

    formatPrice() {
      return this.item ? formatPrice(this.item.price, this.item.currency) : '';
    },
    formatArea() {
      return this.item ? formatArea(this.item.area_m2) : '';
    },
    formatDate(v) {
      return formatDate(v);
    },

    canApprove() { return canPerform(this.$store.auth.user?.role, 'LISTING_APPROVE'); },
    canFeature() { return canPerform(this.$store.auth.user?.role, 'LISTING_FEATURE'); },
    canDelete() { return canPerform(this.$store.auth.user?.role, 'LISTING_DELETE'); },

    openDialog(type) {
      this.dialog.type = type;
      this.dialog.payload = { reason: '', durationDays: 7 };
    },
    closeDialog() { this.dialog.type = null; },

    async confirm() {
      if (!this.item) return;
      try {
        switch (this.dialog.type) {
          case 'approve':
            await approveListingAction(this.item.id); break;
          case 'reject': {
            const r = this.dialog.payload.reason?.trim();
            if (!r || r.length < 10) return;
            await rejectListingAction(this.item.id, r); break;
          }
          case 'feature':
            await featureListingAction(this.item.id, Number(this.dialog.payload.durationDays) || 7);
            break;
          case 'delete':
            await deleteListingAction(this.item.id);
            router.navigate('/admin/listings');
            return;
        }
      } finally {
        this.closeDialog();
      }
    },

    goEdit() {
      if (this.item) router.navigate(`/admin/listings/${this.item.id}/edit`);
    },
  };
}
