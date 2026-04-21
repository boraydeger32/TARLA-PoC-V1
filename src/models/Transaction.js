import { z } from 'zod';
import { CurrencyEnum, TransactionStatusEnum } from './enums.js';

export const TransactionBaseSchema = z.object({
  user_id: z.string(),
  package_id: z.string(),
  amount: z.number().nonnegative(),
  currency: CurrencyEnum.default('TRY'),
  status: TransactionStatusEnum,
  provider: z.string().nullable().optional(),
  provider_ref: z.string().nullable().optional(),
});

export const TransactionCreateSchema = TransactionBaseSchema.partial({
  status: true,
});

export const TransactionResponseSchema = TransactionBaseSchema.extend({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof TransactionBaseSchema>} TransactionBase
 * @typedef {z.infer<typeof TransactionCreateSchema>} TransactionCreate
 * @typedef {z.infer<typeof TransactionResponseSchema>} TransactionResponse
 */
