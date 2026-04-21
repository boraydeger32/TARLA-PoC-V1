import Alpine from 'alpinejs';
import { faqsListObserver, faqsMutations } from '@/queries/contentQueries.js';
import { FAQCreateSchema } from '@/models/FAQ.js';
import { issuesToFieldMap } from '@/utils/validation.js';
import { t } from '@/i18n/index.js';

const EMPTY_FORM = {
  question_tr: '',
  question_en: '',
  answer_tr: '',
  answer_en: '',
  category: 'general',
  sort_order: 0,
  is_active: true,
};

export function faqsPage() {
  return {
    items: [],
    loading: true,
    error: null,
    showForm: false,
    editing: null,
    form: { ...EMPTY_FORM },
    fieldErrors: {},
    expandedId: null,

    init() {
      this.$store.ui.activeModule = 'content';
      this.observer = faqsListObserver({ size: 200 });
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading;
        this.items = r.data?.items ?? [];
        this.error = r.error?.message ?? null;
      });
    },
    destroy() { this.unsubscribe?.(); },

    toggle(id) { this.expandedId = this.expandedId === id ? null : id; },

    openCreate() {
      this.editing = null;
      this.form = { ...EMPTY_FORM };
      this.fieldErrors = {};
      this.showForm = true;
    },
    openEdit(item) {
      this.editing = item.id;
      this.form = { ...EMPTY_FORM, ...item };
      this.fieldErrors = {};
      this.showForm = true;
    },
    closeForm() { this.showForm = false; this.editing = null; },

    async submit() {
      const parsed = FAQCreateSchema.safeParse(this.form);
      if (!parsed.success) {
        this.fieldErrors = issuesToFieldMap(parsed.error.issues);
        return;
      }
      try {
        if (this.editing) await faqsMutations.update(this.editing, parsed.data);
        else await faqsMutations.create(parsed.data);
        Alpine.store('ui').pushToast({ message: t('common.save'), type: 'success' });
        this.closeForm();
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    async confirmDelete(item) {
      if (!window.confirm(`${t('common.delete')}?`)) return;
      try {
        await faqsMutations.delete(item.id);
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
