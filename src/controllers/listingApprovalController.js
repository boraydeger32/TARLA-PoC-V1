import Alpine from 'alpinejs';
import {
  approveListing,
  rejectListing,
  featureListing,
  archiveListing,
  deleteListing,
} from '@/queries/listingsQueries.js';
import { t } from '@/i18n/index.js';

/**
 * Thin controller wrapping the approval/feature/delete mutations and pushing
 * a toast on success or error. Views call these and stay free of try/catch
 * boilerplate.
 */
function withToast(fn, successKey) {
  return async (...args) => {
    try {
      const out = await fn(...args);
      Alpine.store('ui').pushToast({ message: t(successKey), type: 'success' });
      return out;
    } catch (err) {
      Alpine.store('ui').pushToast({
        message: err?.message ?? t('common.error'),
        type: 'danger',
      });
      throw err;
    }
  };
}

export const approveListingAction = withToast(approveListing, 'listings.toasts.approved');
export const rejectListingAction = withToast(rejectListing, 'listings.toasts.rejected');
export const featureListingAction = withToast(featureListing, 'listings.toasts.featured');
export const archiveListingAction = withToast(archiveListing, 'listings.toasts.deleted');
export const deleteListingAction = withToast(deleteListing, 'listings.toasts.deleted');
