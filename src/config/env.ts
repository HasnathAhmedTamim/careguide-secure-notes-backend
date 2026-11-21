import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  SEED_ADMIN_NAME: z.string().default('Admin'),
  SEED_ADMIN_EMAIL: z.string().email().default('admin@careguide.test'),
  SEED_ADMIN_PASSWORD: z.string().min(6).default('admin123'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
}

export const env = (parsed.success
  ? parsed.data
  : {
      PORT: 5000,
      NODE_ENV: 'test' as const,
      MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careguide_test',
      JWT_SECRET: process.env.JWT_SECRET || 'test_secret_key_min_8',
      JWT_EXPIRES_IN: '1d',
      FRONTEND_URL: 'http://localhost:5173',
      SEED_ADMIN_NAME: 'Admin',
      SEED_ADMIN_EMAIL: 'admin@careguide.test',
      SEED_ADMIN_PASSWORD: 'admin123',
    });
