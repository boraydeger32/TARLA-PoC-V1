import Alpine from 'alpinejs';
import { blogListObserver, blogMutations } from '@/queries/contentQueries.js';
import { BlogPostCreateSchema } from '@/models/BlogPost.js';
import { issuesToFieldMap } from '@/utils/validation.js';
import { formatDate } from '@/utils/format.js';
import { t } from '@/i18n/index.js';

const EMPTY_FORM = {
  slug: '',
  title_tr: '',
  title_en: '',
  excerpt_tr: '',
  excerpt_en: '',
  body_tr: '',
  body_en: '',
  cover_image_url: '',
  tags: [],
  is_published: false,
  published_at: null,
};

export function blogPage() {
  return {
    items: [],
    loading: true,
    error: null,
    showForm: false,
    editing: null,
    form: { ...EMPTY_FORM },
    fieldErrors: {},
    tagsInput: '',

    init() {
      this.$store.ui.activeModule = 'content';
      this.observer = blogListObserver({ size: 200 });
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading;
        this.items = r.data?.items ?? [];
        this.error = r.error?.message ?? null;
      });
    },
    destroy() { this.unsubscribe?.(); },

    formatDate,

    openCreate() {
      this.editing = null;
      this.form = { ...EMPTY_FORM };
      this.tagsInput = '';
      this.fieldErrors = {};
      this.showForm = true;
    },
    openEdit(item) {
      this.editing = item.id;
      this.form = { ...EMPTY_FORM, ...item, cover_image_url: item.cover_image_url ?? '' };
      this.tagsInput = (item.tags ?? []).join(', ');
      this.fieldErrors = {};
      this.showForm = true;
    },
    closeForm() { this.showForm = false; this.editing = null; },

    async submit() {
      const tags = this.tagsInput.split(',').map((x) => x.trim()).filter(Boolean);
      const payload = {
        ...this.form,
        tags,
        cover_image_url: this.form.cover_image_url || null,
      };
      const parsed = BlogPostCreateSchema.safeParse(payload);
      if (!parsed.success) {
        this.fieldErrors = issuesToFieldMap(parsed.error.issues);
        return;
      }
      try {
        if (this.editing) await blogMutations.update(this.editing, parsed.data);
        else await blogMutations.create(parsed.data);
        Alpine.store('ui').pushToast({ message: t('common.save'), type: 'success' });
        this.closeForm();
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    async togglePublish(item) {
      try {
        if (item.is_published) await blogMutations.unpublish(item.id);
        else await blogMutations.publish(item.id);
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    async confirmDelete(item) {
      if (!window.confirm(`${t('common.delete')}: ${item.title_tr}?`)) return;
      try {
        await blogMutations.delete(item.id);
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
