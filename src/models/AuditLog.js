import { z } from 'zod';

export const AuditLogResponseSchema = z.object({
  id: z.string(),
  actor_id: z.string(),
  actor_email: z.string().email().nullable().optional(),
  action: z.string(),
  target_type: z.string(),
  target_id: z.string().nullable().optional(),
  diff: z.record(z.any()).nullable().optional(),
  ip_address: z.string().nullable().optional(),
  user_agent: z.string().nullable().optional(),
  created_at: z.string(),
});

/**
 * @typedef {z.infer<typeof AuditLogResponseSchema>} AuditLogResponse
 */
