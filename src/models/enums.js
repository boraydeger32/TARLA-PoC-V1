import { z } from 'zod';

export const CurrencyEnum = z.enum(['TRY', 'USD', 'EUR']);
export const UserRoleEnum = z.enum(['super_admin', 'moderator', 'content_manager', 'end_user']);
export const UserStatusEnum = z.enum(['active', 'suspended', 'pending_verification', 'banned']);
export const ListingStatusEnum = z.enum([
  'draft',
  'pending',
  'approved',
  'rejected',
  'expired',
  'archived',
]);
export const ZoningStatusEnum = z.enum([
  'imarli',
  'imarsiz',
  'koy_yerlesik',
  'ihtilafli',
  'tarim',
]);
export const ReportStatusEnum = z.enum(['open', 'in_review', 'resolved', 'dismissed']);
export const TransactionStatusEnum = z.enum([
  'pending',
  'completed',
  'failed',
  'refunded',
  'cancelled',
]);
export const MediaTypeEnum = z.enum(['image', 'video']);
export const PackageTypeEnum = z.enum(['featured', 'doping', 'premium']);
