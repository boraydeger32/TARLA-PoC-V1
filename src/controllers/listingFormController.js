import Alpine from 'alpinejs';
import { ListingCreateSchema, ListingUpdateSchema } from '@/models/Listing.js';
import { createListing, updateListing } from '@/queries/listingsQueries.js';
import { issuesToFieldMap } from '@/utils/validation.js';
import { t } from '@/i18n/index.js';

export function listingFormController({ mode = 'create', initial = null } = {}) {
  const baseEmpty = {
    title: '',
    description: '',
    price: 0,
    currency: 'TRY',
    category_id: '',
    location_id: '',
    area_m2: 0,
    zoning_status: 'imarli',
    media_ids: [],
  };

  return {
    mode,
    form: { ...baseEmpty, ...(initial ?? {}) },
    fieldErrors: /** @type {Record<string,string[]>} */ ({}),
    submitting: false,
    rootError: null,

    setInitial(item) {
      if (!item) return;
      this.form = {
        ...baseEmpty,
        title: item.title ?? '',
        description: item.description ?? '',
        price: item.price ?? 0,
        currency: item.currency ?? 'TRY',
        category_id: item.category_id ?? '',
        location_id: item.location_id ?? '',
        area_m2: item.area_m2 ?? 0,
        zoning_status: item.zoning_status ?? 'imarli',
        media_ids: (item.media ?? []).map((m) => m.id),
      };
    },

    error(field) {
      const errs = this.fieldErrors[field];
      return errs?.[0] ? t(errs[0], { defaultValue: errs[0] }) : null;
    },

    async submit(idForUpdate) {
      this.submitting = true;
      this.fieldErrors = {};
      this.rootError = null;
      const schema = this.mode === 'create' ? ListingCreateSchema : ListingUpdateSchema;
      const parsed = schema.safeParse(this.form);
      if (!parsed.success) {
        this.fieldErrors = issuesToFieldMap(parsed.error.issues);
        this.submitting = false;
        return null;
      }
      try {
        const out =
          this.mode === 'create'
            ? await createListing(parsed.data)
            : await updateListing(idForUpdate, parsed.data);
        Alpine.store('ui').pushToast({
          message: t(`listings.toasts.${this.mode === 'create' ? 'created' : 'updated'}`),
          type: 'success',
        });
        return out;
      } catch (err) {
        if (err?.fields) {
          this.fieldErrors = err.fields;
        } else {
          this.rootError = err?.message ?? t('common.error');
        }
        return null;
      } finally {
        this.submitting = false;
      }
    },
  };
}
