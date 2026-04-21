import { z } from 'zod';

export const ActivityLogResponseSchema = z.object({
  id: z.string(),
  user_id: z.string().nullable().optional(),
  event: z.string(),
  payload: z.record(z.any()).nullable().optional(),
  ip_address: z.string().nullable().optional(),
  user_agent: z.string().nullable().optional(),
  created_at: z.string(),
});

/**
 * @typedef {z.infer<typeof ActivityLogResponseSchema>} ActivityLogResponse
 */
