import { z } from 'zod';

export const FAQBaseSchema = z.object({
  question_tr: z.string().min(5),
  question_en: z.string().min(5),
  answer_tr: z.string().min(5),
  answer_en: z.string().min(5),
  category: z.string(),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
});

export const FAQCreateSchema = FAQBaseSchema;
export const FAQUpdateSchema = FAQBaseSchema.partial();

export const FAQResponseSchema = FAQBaseSchema.extend({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof FAQBaseSchema>} FAQBase
 * @typedef {z.infer<typeof FAQResponseSchema>} FAQResponse
 */
