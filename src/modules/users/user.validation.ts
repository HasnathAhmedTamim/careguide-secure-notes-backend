import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).optional().default('user'),
  interests: z.array(z.string().trim().min(1)).optional().default([]),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().email().toLowerCase().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['user', 'admin']).optional(),
    interests: z.array(z.string().trim().min(1)).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
