import {
  usersListObserver,
  suspendUser,
  unsuspendUser,
  banUser,
  changeUserRole,
  resetUserPassword,
} from '@/queries/usersQueries.js';
import Alpine from 'alpinejs';
import { t } from '@/i18n/index.js';
import { formatDate } from '@/utils/format.js';
import { canPerform, ROLES } from '@/constants/roles.js';
import { router } from '@/router/index.js';

const ROLE_OPTIONS = ['all', 'super_admin', 'moderator', 'content_manager', 'end_user'];
const STATUS_OPTIONS = ['all', 'active', 'suspended', 'pending_verification', 'banned'];

export function usersListPage() {
  return {
    items: [],
    total: 0,
    pages: 1,
    loading: true,
    error: null,
    params: { page: 1, size: 25, role: 'all', status: 'all', q: '' },
    roleOptions: ROLE_OPTIONS,
    statusOptions: STATUS_OPTIONS,
    selectedId: null,
    dialog: { type: null, payload: { reason: '', role: ROLES.END_USER } },

    init() {
      this.$store.ui.activeModule = 'users';
      this.observer = usersListObserver(this.normalize());
      this.unsubscribe = this.observer.subscribe((r) => {
        this.loading = r.isLoading || r.isFetching;
        this.items = r.data?.items ?? [];
        this.total = r.data?.total ?? 0;
        this.pages = r.data?.pages ?? 1;
        this.error = r.error?.message ?? null;
      });
    },
    destroy() { this.unsubscribe?.(); },

    normalize() {
      const p = { page: this.params.page, size: this.params.size };
      if (this.params.role !== 'all') p.role = this.params.role;
      if (this.params.status !== 'all') p.status = this.params.status;
      if (this.params.q?.trim()) p.q = this.params.q.trim();
      return p;
    },
    apply() {
      const next = this.normalize();
      this.observer.setOptions({
        queryKey: ['users', 'list', next],
        queryFn: () => import('@/services/UsersService.js').then((m) => m.usersService.list(next)),
      });
    },
    onSearch() { this.params.page = 1; this.apply(); },
    setRole(v) { this.params.role = v; this.params.page = 1; this.apply(); },
    setStatus(v) { this.params.status = v; this.params.page = 1; this.apply(); },
    goPage(p) { if (p < 1 || p > this.pages) return; this.params.page = p; this.apply(); },

    canSuspend() { return canPerform(this.$store.auth.user?.role, 'USER_SUSPEND'); },
    canBan() { return canPerform(this.$store.auth.user?.role, 'USER_DELETE'); },
    canChangeRole() { return canPerform(this.$store.auth.user?.role, 'USER_ROLE_CHANGE'); },

    statusBadge(status) {
      return {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        pending_verification: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        banned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      }[status] ?? 'bg-gray-100 text-gray-800';
    },
    roleBadge(role) {
      return {
        super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        moderator: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        content_manager: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
        end_user: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      }[role] ?? 'bg-gray-100 text-gray-800';
    },

    formatDate,
    statusLabel(s) { return t(`users.status.${s}`, { defaultValue: s }); },
    roleLabel(r) { return t(`users.roles.${r}`, { defaultValue: r }); },

    openDialog(type, id) {
      this.selectedId = id;
      this.dialog.type = type;
      this.dialog.payload = { reason: '', role: ROLES.END_USER };
    },
    closeDialog() { this.dialog.type = null; this.selectedId = null; },

    async confirm() {
      if (!this.selectedId) return;
      try {
        switch (this.dialog.type) {
          case 'suspend':
            await suspendUser(this.selectedId, this.dialog.payload.reason); break;
          case 'unsuspend':
            await unsuspendUser(this.selectedId); break;
          case 'ban':
            await banUser(this.selectedId, this.dialog.payload.reason); break;
          case 'role':
            await changeUserRole(this.selectedId, this.dialog.payload.role); break;
          case 'reset': {
            const r = await resetUserPassword(this.selectedId);
            Alpine.store('ui').pushToast({
              message: t('users.toasts.password_reset', {
                defaultValue: 'Yeni şifre: ' + (r?.temporary_password ?? '***'),
              }),
              type: 'success',
            });
            break;
          }
        }
        if (this.dialog.type !== 'reset') {
          Alpine.store('ui').pushToast({
            message: t('users.toasts.updated', { defaultValue: 'Kullanıcı güncellendi' }),
            type: 'success',
          });
        }
      } catch (err) {
        Alpine.store('ui').pushToast({
          message: err?.message ?? t('common.error'),
          type: 'danger',
        });
      } finally {
        this.closeDialog();
      }
    },

    goDetail(id) { router.navigate(`/admin/users/${id}`); },
  };
}
