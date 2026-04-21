import { z } from 'zod';

export const BannerBaseSchema = z.object({
  title_tr: z.string().min(2),
  title_en: z.string().min(2),
  image_url: z.string().url(),
  link_url: z.string().url().nullable().optional(),
  position: z.enum(['home_top', 'home_middle', 'sidebar']),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
});

export const BannerCreateSchema = BannerBaseSchema;
export const BannerUpdateSchema = BannerBaseSchema.partial();

export const BannerResponseSchema = BannerBaseSchema.extend({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof BannerBaseSchema>} BannerBase
 * @typedef {z.infer<typeof BannerResponseSchema>} BannerResponse
 */
