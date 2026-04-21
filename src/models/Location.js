import { z } from 'zod';

export const LocationBaseSchema = z.object({
  name_tr: z.string().min(1),
  name_en: z.string().min(1),
  level: z.enum(['province', 'district', 'neighborhood']),
  parent_id: z.string().nullable().optional(),
  slug: z.string(),
});

export const LocationCreateSchema = LocationBaseSchema;

export const LocationUpdateSchema = LocationBaseSchema.partial();

export const LocationResponseSchema = LocationBaseSchema.extend({
  id: z.string(),
  listings_count: z.number().int().nonnegative().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof LocationBaseSchema>} LocationBase
 * @typedef {z.infer<typeof LocationCreateSchema>} LocationCreate
 * @typedef {z.infer<typeof LocationUpdateSchema>} LocationUpdate
 * @typedef {z.infer<typeof LocationResponseSchema>} LocationResponse
 */
