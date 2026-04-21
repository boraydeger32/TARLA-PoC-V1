import { z } from 'zod';

/** Shared zod primitives. */
export const idSchema = z.string().min(1);
export const emailSchema = z.string().email();
export const phoneSchema = z
  .string()
  .regex(/^\+?\d{10,15}$/, { message: 'phone_invalid' });
export const isoDateSchema = z.string().datetime({ offset: true });

/**
 * Convert zod issues into an `{ [path]: i18nKey }` map suitable for
 * direct binding in Alpine templates.
 *
 * @param {import('zod').ZodError} err
 * @returns {Record<string, string>}
 */
export function issuesToFieldMap(err) {
  const map = {};
  for (const issue of err.issues) {
    const path = issue.path.join('.') || '_root';
    if (!map[path]) {
      map[path] = `forms.validation.${issue.code}`;
    }
  }
  return map;
}
