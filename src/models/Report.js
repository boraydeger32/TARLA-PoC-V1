import { z } from 'zod';
import { ReportStatusEnum } from './enums.js';

export const ReportBaseSchema = z.object({
  target_type: z.enum(['listing', 'user', 'comment']),
  target_id: z.string(),
  reason: z.string().min(5),
  description: z.string().nullable().optional(),
});

export const ReportCreateSchema = ReportBaseSchema;

export const ReportUpdateSchema = z.object({
  status: ReportStatusEnum,
  resolution_note: z.string().nullable().optional(),
});

export const ReportResponseSchema = ReportBaseSchema.extend({
  id: z.string(),
  reporter_id: z.string(),
  status: ReportStatusEnum,
  resolution_note: z.string().nullable().optional(),
  resolved_by: z.string().nullable().optional(),
  resolved_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof ReportBaseSchema>} ReportBase
 * @typedef {z.infer<typeof ReportCreateSchema>} ReportCreate
 * @typedef {z.infer<typeof ReportUpdateSchema>} ReportUpdate
 * @typedef {z.infer<typeof ReportResponseSchema>} ReportResponse
 */
