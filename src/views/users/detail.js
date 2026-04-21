import {
  userDetailObserver,
  suspendUser,
  unsuspendUser,
  banUser,
  changeUserRole,
  resetUserPassword,
  updateUser,
} from '@/queries/usersQueries.js';
import Alpine from 'alpinejs';
import { t } from '@/i18n/index.js';
import { formatDate } from '@/utils/format.js';
import { canPerform } from '@/constants/roles.js';

function getRouteId() {
  const m = window.location.pathname.match(/\/admin\/users\/([^/]+)$/);
  return m ? m[1] : null;
}

export function userDetailPage() {
  return {
    user: null,
    loading: true,
    error: null,
    editForm: { full_name: '', phone: '' },
    isEditing: false,
    dialog: { type: null, payload: { reason: '', role: 'end_user' } },

    init() {
      this.$store.ui.activeModule = 'users';
      const id = getRouteId();
      if (!id) { this.error = 'invalid_id'; this.loading = false; return; }
      this.observer = userDetailObserver(id);
      this.unsubscribe = this.observer.subscribe((res) => {
        this.user = res.data ?? null;
        this.loading = res.isLoading;
        this.error = res.error?.message ?? null;
        if (this.user && !this.isEditing) {
          this.editForm = {
            full_name: this.user.full_name ?? '',
            phone: this.user.phone ?? '',
          };
        }
      });
    },
    destroy() { this.unsubscribe?.(); },

    formatDate,

    canSuspend() { return canPerform(this.$store.auth.user?.role, 'USER_SUSPEND'); },
    canBan() { return canPerform(this.$store.auth.user?.role, 'USER_DELETE'); },
    canChangeRole() { return canPerform(this.$store.auth.user?.role, 'USER_ROLE_CHANGE'); },

    statusBadge(s) {
      return {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        pending_verification: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        banned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      }[s] ?? 'bg-gray-100 text-gray-800';
    },
    roleLabel(r) { return t(`users.roles.${r}`, { defaultValue: r }); },
    statusLabel(s) { return t(`users.status.${s}`, { defaultValue: s }); },

    startEdit() { this.isEditing = true; },
    cancelEdit() {
      this.isEditing = false;
      if (this.user) {
        this.editForm = { full_name: this.user.full_name, phone: this.user.phone ?? '' };
      }
    },
    async saveEdit() {
      if (!this.user) return;
      try {
        await updateUser(this.user.id, this.editForm);
        Alpine.store('ui').pushToast({ message: t('users.toasts.updated'), type: 'success' });
        this.isEditing = false;
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      }
    },

    openDialog(type) {
      this.dialog.type = type;
      this.dialog.payload = { reason: '', role: this.user?.role ?? 'end_user' };
    },
    closeDialog() { this.dialog.type = null; },

    async confirm() {
      if (!this.user) return;
      try {
        switch (this.dialog.type) {
          case 'suspend': await suspendUser(this.user.id, this.dialog.payload.reason); break;
          case 'unsuspend': await unsuspendUser(this.user.id); break;
          case 'ban': await banUser(this.user.id, this.dialog.payload.reason); break;
          case 'role': await changeUserRole(this.user.id, this.dialog.payload.role); break;
          case 'reset': {
            const r = await resetUserPassword(this.user.id);
            Alpine.store('ui').pushToast({
              message: `${t('users.toasts.password_reset')}: ${r.temporary_password ?? '***'}`,
              type: 'success',
            });
            this.closeDialog();
            return;
          }
        }
        Alpine.store('ui').pushToast({ message: t('users.toasts.updated'), type: 'success' });
      } catch (err) {
        Alpine.store('ui').pushToast({ message: err?.message ?? t('common.error'), type: 'danger' });
      } finally {
        this.closeDialog();
      }
    },
  };
}
