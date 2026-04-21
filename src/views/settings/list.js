import Alpine from 'alpinejs';
import { settingsListObserver, updateSetting } from '@/queries/settingsQueries.js';
import { formatDateTime } from '@/utils/format.js';
import { t } from '@/i18n/index.js';

export function settingsPage() {
  return {
    items: [],
    loading: true,
    error: null,
    editingKey: null,
    draft: '',

    init() {
      this.$store.ui.activeModule = 'settings';
      this.observer = settingsListObserver();
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading;
        this.items = r.data?.items ?? r.data ?? [];
        this.error = r.error?.message ?? null;
      });
    },
    destroy() { this.unsubscribe?.(); },

    formatDateTime,

    startEdit(item) {
      this.editingKey = item.key;
      this.draft = typeof item.value === 'object' ? JSON.stringify(item.value) : String(item.value);
    },
    cancelEdit() { this.editingKey = null; this.draft = ''; },

    async save(item) {
      let value = this.draft;
      if (typeof item.value === 'boolean') value = this.draft === 'true';
      else if (typeof item.value === 'number') value = Number(this.draft);
      try {
        await updateSetting(item.key, value);
        Alpine.store('ui').pushToast({ message: t('settings.toasts.updated'), type: 'success' });
        this.editingKey = null;
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    displayValue(v) {
      if (typeof v === 'boolean') return v ? '✓' : '✗';
      if (v === null || v === undefined) return '—';
      return String(v);
    },
  };
}
