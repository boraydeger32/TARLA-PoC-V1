import Alpine from 'alpinejs';
import {
  categoriesListObserver,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/queries/categoriesQueries.js';
import { CategoryCreateSchema } from '@/models/Category.js';
import { issuesToFieldMap } from '@/utils/validation.js';
import { t } from '@/i18n/index.js';

export function categoriesPage() {
  return {
    items: [],
    loading: true,
    error: null,
    editing: null,
    form: { slug: '', name_tr: '', name_en: '', sort_order: 0, is_active: true, parent_id: null },
    fieldErrors: {},
    showForm: false,

    init() {
      this.$store.ui.activeModule = 'categories';
      this.observer = categoriesListObserver({ size: 200 });
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading;
        this.items = r.data?.items ?? [];
        this.error = r.error?.message ?? null;
      });
    },
    destroy() { this.unsubscribe?.(); },

    openCreate() {
      this.editing = null;
      this.form = { slug: '', name_tr: '', name_en: '', sort_order: 0, is_active: true, parent_id: null };
      this.fieldErrors = {};
      this.showForm = true;
    },
    openEdit(item) {
      this.editing = item.id;
      this.form = {
        slug: item.slug,
        name_tr: item.name_tr,
        name_en: item.name_en,
        sort_order: item.sort_order,
        is_active: item.is_active,
        parent_id: item.parent_id,
      };
      this.fieldErrors = {};
      this.showForm = true;
    },
    closeForm() { this.showForm = false; this.editing = null; },

    async submit() {
      const parsed = CategoryCreateSchema.safeParse(this.form);
      if (!parsed.success) {
        this.fieldErrors = issuesToFieldMap(parsed.error.issues);
        return;
      }
      try {
        if (this.editing) {
          await updateCategory(this.editing, parsed.data);
        } else {
          await createCategory(parsed.data);
        }
        Alpine.store('ui').pushToast({ message: t('common.save'), type: 'success' });
        this.closeForm();
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    async confirmDelete(item) {
      if (!window.confirm(`${t('common.delete')}: ${item.name_tr}?`)) return;
      try {
        await deleteCategory(item.id);
        Alpine.store('ui').pushToast({ message: t('common.delete'), type: 'success' });
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    error(field) {
      const errs = this.fieldErrors[field];
      return errs?.[0] ? t(errs[0], { defaultValue: errs[0] }) : null;
    },

    parentName(parentId) {
      if (!parentId) return '—';
      return this.items.find((c) => c.id === parentId)?.name_tr ?? parentId;
    },
  };
}
