import { z } from 'zod';
import { MediaTypeEnum } from './enums.js';

export const MediaBaseSchema = z.object({
  url: z.string().url(),
  type: MediaTypeEnum,
  alt: z.string().nullable().optional(),
  sort_order: z.number().int().nonnegative().default(0),
});

export const MediaCreateSchema = MediaBaseSchema;

export const MediaResponseSchema = MediaBaseSchema.extend({
  id: z.string(),
  listing_id: z.string(),
  created_at: z.string(),
});

/**
 * @typedef {z.infer<typeof MediaBaseSchema>} MediaBase
 * @typedef {z.infer<typeof MediaResponseSchema>} MediaResponse
 */
