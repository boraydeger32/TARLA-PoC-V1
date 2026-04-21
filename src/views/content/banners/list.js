import Alpine from 'alpinejs';
import { bannersListObserver, bannersMutations } from '@/queries/contentQueries.js';
import { BannerCreateSchema } from '@/models/Banner.js';
import { issuesToFieldMap } from '@/utils/validation.js';
import { formatDate } from '@/utils/format.js';
import { t } from '@/i18n/index.js';

const EMPTY_FORM = {
  title_tr: '',
  title_en: '',
  image_url: '',
  link_url: '',
  position: 'home_top',
  sort_order: 0,
  is_active: true,
  starts_at: null,
  ends_at: null,
};

export function bannersPage() {
  return {
    items: [],
    loading: true,
    error: null,
    showForm: false,
    editing: null,
    form: { ...EMPTY_FORM },
    fieldErrors: {},
    positionOptions: ['home_top', 'home_middle', 'sidebar'],

    init() {
      this.$store.ui.activeModule = 'content';
      this.observer = bannersListObserver({ size: 200 });
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading;
        this.items = r.data?.items ?? [];
        this.error = r.error?.message ?? null;
      });
    },
    destroy() { this.unsubscribe?.(); },

    formatDate,
    positionLabel(p) { return t(`content.banners.positions.${p}`, { defaultValue: p }); },

    openCreate() {
      this.editing = null;
      this.form = { ...EMPTY_FORM };
      this.fieldErrors = {};
      this.showForm = true;
    },
    openEdit(item) {
      this.editing = item.id;
      this.form = { ...EMPTY_FORM, ...item, link_url: item.link_url ?? '' };
      this.fieldErrors = {};
      this.showForm = true;
    },
    closeForm() { this.showForm = false; this.editing = null; },

    async submit() {
      const payload = { ...this.form, link_url: this.form.link_url || null };
      const parsed = BannerCreateSchema.safeParse(payload);
      if (!parsed.success) {
        this.fieldErrors = issuesToFieldMap(parsed.error.issues);
        return;
      }
      try {
        if (this.editing) await bannersMutations.update(this.editing, parsed.data);
        else await bannersMutations.create(parsed.data);
        Alpine.store('ui').pushToast({ message: t('common.save'), type: 'success' });
        this.closeForm();
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    async confirmDelete(item) {
      if (!window.confirm(`${t('common.delete')}: ${item.title_tr}?`)) return;
      try {
        await bannersMutations.delete(item.id);
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
