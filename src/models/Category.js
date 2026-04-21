import { z } from 'zod';

export const CategoryBaseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name_tr: z.string().min(2),
  name_en: z.string().min(2),
  parent_id: z.string().nullable().optional(),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
});

export const CategoryCreateSchema = CategoryBaseSchema;

export const CategoryUpdateSchema = CategoryBaseSchema.partial();

export const CategoryResponseSchema = CategoryBaseSchema.extend({
  id: z.string(),
  listings_count: z.number().int().nonnegative().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof CategoryBaseSchema>} CategoryBase
 * @typedef {z.infer<typeof CategoryCreateSchema>} CategoryCreate
 * @typedef {z.infer<typeof CategoryUpdateSchema>} CategoryUpdate
 * @typedef {z.infer<typeof CategoryResponseSchema>} CategoryResponse
 */
