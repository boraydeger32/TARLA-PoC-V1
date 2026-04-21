import { z } from 'zod';

export const BlogPostBaseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title_tr: z.string().min(5),
  title_en: z.string().min(5),
  excerpt_tr: z.string(),
  excerpt_en: z.string(),
  body_tr: z.string(),
  body_en: z.string(),
  cover_image_url: z.string().url().nullable().optional(),
  tags: z.array(z.string()).default([]),
  is_published: z.boolean().default(false),
  published_at: z.string().nullable().optional(),
});

export const BlogPostCreateSchema = BlogPostBaseSchema;
export const BlogPostUpdateSchema = BlogPostBaseSchema.partial();

export const BlogPostResponseSchema = BlogPostBaseSchema.extend({
  id: z.string(),
  author_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * @typedef {z.infer<typeof BlogPostBaseSchema>} BlogPostBase
 * @typedef {z.infer<typeof BlogPostResponseSchema>} BlogPostResponse
 */
