import { z } from 'zod';
import { CurrencyEnum, ListingStatusEnum, ZoningStatusEnum } from './enums.js';
import { MediaResponseSchema } from './Media.js';

export const ListingBaseSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  price: z.number().nonnegative(),
  currency: CurrencyEnum.default('TRY'),
  category_id: z.string(),
  location_id: z.string(),
  area_m2: z.number().positive(),
  zoning_status: ZoningStatusEnum,
});

export const ListingCreateSchema = ListingBaseSchema.extend({
  media_ids: z.array(z.string()).default([]),
});

export const ListingUpdateSchema = ListingBaseSchema.partial().extend({
  status: ListingStatusEnum.optional(),
});

export const ListingResponseSchema = ListingBaseSchema.extend({
  id: z.string(),
  status: ListingStatusEnum,
  owner_id: z.string(),
  view_count: z.number().int().nonnegative().default(0),
  favorite_count: z.number().int().nonnegative().default(0),
  featured_until: z.string().nullable().optional(),
  media: z.array(MediaResponseSchema).default([]),
  created_at: z.string(),
  updated_at: z.string(),
  approved_at: z.string().nullable(),
  approved_by: z.string().nullable(),
});

/**
 * @typedef {z.infer<typeof ListingBaseSchema>} ListingBase
 * @typedef {z.infer<typeof ListingCreateSchema>} ListingCreate
 * @typedef {z.infer<typeof ListingUpdateSchema>} ListingUpdate
 * @typedef {z.infer<typeof ListingResponseSchema>} ListingResponse
 */
