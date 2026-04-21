import { z } from 'zod';
import { UserRoleEnum, UserStatusEnum } from './enums.js';

export const UserBaseSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  phone: z.string().nullable().optional(),
  role: UserRoleEnum,
});

export const UserCreateSchema = UserBaseSchema.extend({
  password: z.string().min(8),
});

export const UserUpdateSchema = UserBaseSchema.partial().extend({
  status: UserStatusEnum.optional(),
});

export const UserResponseSchema = UserBaseSchema.extend({
  id: z.string(),
  status: UserStatusEnum,
  avatar_url: z.string().nullable().optional(),
  listings_count: z.number().int().nonnegative().default(0),
  last_login_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof UserBaseSchema>} UserBase
 * @typedef {z.infer<typeof UserCreateSchema>} UserCreate
 * @typedef {z.infer<typeof UserUpdateSchema>} UserUpdate
 * @typedef {z.infer<typeof UserResponseSchema>} UserResponse
 */
