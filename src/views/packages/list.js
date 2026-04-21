import Alpine from 'alpinejs';
import {
  packagesListObserver,
  createPackage,
  updatePackage,
  deletePackage,
  activatePackage,
  deactivatePackage,
} from '@/queries/packagesQueries.js';
import { PackageCreateSchema } from '@/models/Package.js';
import { issuesToFieldMap } from '@/utils/validation.js';
import { formatPrice } from '@/utils/format.js';
import { t } from '@/i18n/index.js';

const EMPTY_FORM = {
  name_tr: '',
  name_en: '',
  description_tr: '',
  description_en: '',
  type: 'featured',
  price: 0,
  currency: 'TRY',
  duration_days: 30,
  is_active: true,
};

export function packagesPage() {
  return {
    items: [],
    loading: true,
    error: null,
    showForm: false,
    editing: null,
    form: { ...EMPTY_FORM },
    fieldErrors: {},
    typeOptions: ['featured', 'doping', 'premium'],
    currencyOptions: ['TRY', 'USD', 'EUR'],

    init() {
      this.$store.ui.activeModule = 'packages';
      this.observer = packagesListObserver({ size: 200 });
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading;
        this.items = r.data?.items ?? [];
        this.error = r.error?.message ?? null;
      });
    },
    destroy() { this.unsubscribe?.(); },

    formatPrice,
    typeLabel(tp) { return t(`packages.types.${tp}`, { defaultValue: tp }); },

    openCreate() {
      this.editing = null;
      this.form = { ...EMPTY_FORM };
      this.fieldErrors = {};
      this.showForm = true;
    },
    openEdit(item) {
      this.editing = item.id;
      this.form = {
        name_tr: item.name_tr,
        name_en: item.name_en,
        description_tr: item.description_tr ?? '',
        description_en: item.description_en ?? '',
        type: item.type,
        price: item.price,
        currency: item.currency,
        duration_days: item.duration_days,
        is_active: item.is_active,
      };
      this.fieldErrors = {};
      this.showForm = true;
    },
    closeForm() { this.showForm = false; this.editing = null; },

    async submit() {
      const parsed = PackageCreateSchema.safeParse(this.form);
      if (!parsed.success) {
        this.fieldErrors = issuesToFieldMap(parsed.error.issues);
        return;
      }
      try {
        if (this.editing) await updatePackage(this.editing, parsed.data);
        else await createPackage(parsed.data);
        Alpine.store('ui').pushToast({ message: t('common.save'), type: 'success' });
        this.closeForm();
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    async toggleActive(item) {
      try {
        if (item.is_active) await deactivatePackage(item.id);
        else await activatePackage(item.id);
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    async confirmDelete(item) {
      if (!window.confirm(`${t('common.delete')}: ${item.name_tr}?`)) return;
      try {
        await deletePackage(item.id);
        Alpine.store('ui').pushToast({ message: t('common.delete'), type: 'success' });
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    error(field) {
      const errs = this.fieldErrors[field];
      return errs?.[0] ? t(errs[0], { defaultValue: errs[0] }) : null;
    },
  };
}
