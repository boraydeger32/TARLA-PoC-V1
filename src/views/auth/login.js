import { z } from 'zod';

import { loginMutation } from '@/queries/authQueries.js';
import { PATHS } from '@/router/paths.js';
import { navigate } from '@/router/index.js';
import { issuesToFieldMap } from '@/utils/validation.js';
import { t } from '@/i18n/index.js';

const loginSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
});

export function loginPage() {
  return {
    form: { email: '', password: '' },
    errors: /** @type {Record<string, string>} */ ({}),
    submitting: false,
    serverError: /** @type {string|null} */ (null),

    init() {
      if (this.$store.auth.isAuthenticated()) {
        navigate(PATHS.ADMIN.DASHBOARD);
      }
    },

    validate() {
      const result = loginSchema.safeParse(this.form);
      this.errors = result.success ? {} : issuesToFieldMap(result.error);
      return result.success;
    },

    async submit() {
      this.serverError = null;
      if (!this.validate()) return;
      this.submitting = true;
      try {
        await loginMutation(this.form.email, this.form.password);
        navigate(PATHS.ADMIN.DASHBOARD);
      } catch (err) {
        this.serverError = err?.message ?? t('errors.auth.login_failed');
      } finally {
        this.submitting = false;
      }
    },

    fieldError(path) {
      const key = this.errors[path];
      return key ? t(key) : '';
    },
  };
}
