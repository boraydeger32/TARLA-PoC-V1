import { z } from 'zod';

export const SettingBaseSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
  description: z.string().nullable().optional(),
  is_public: z.boolean().default(false),
});

export const SettingUpdateSchema = z.object({
  value: z.any(),
});

export const SettingResponseSchema = SettingBaseSchema.extend({
  id: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof SettingBaseSchema>} SettingBase
 * @typedef {z.infer<typeof SettingResponseSchema>} SettingResponse
 */
