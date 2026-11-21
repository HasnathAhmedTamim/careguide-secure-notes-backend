import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
});
