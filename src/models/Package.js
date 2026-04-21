import { z } from 'zod';
import { CurrencyEnum, PackageTypeEnum } from './enums.js';

export const PackageBaseSchema = z.object({
  name_tr: z.string().min(2),
  name_en: z.string().min(2),
  description_tr: z.string().nullable().optional(),
  description_en: z.string().nullable().optional(),
  type: PackageTypeEnum,
  price: z.number().nonnegative(),
  currency: CurrencyEnum.default('TRY'),
  duration_days: z.number().int().positive(),
  is_active: z.boolean().default(true),
});

export const PackageCreateSchema = PackageBaseSchema;
export const PackageUpdateSchema = PackageBaseSchema.partial();

export const PackageResponseSchema = PackageBaseSchema.extend({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof PackageBaseSchema>} PackageBase
 * @typedef {z.infer<typeof PackageCreateSchema>} PackageCreate
 * @typedef {z.infer<typeof PackageUpdateSchema>} PackageUpdate
 * @typedef {z.infer<typeof PackageResponseSchema>} PackageResponse
 */
