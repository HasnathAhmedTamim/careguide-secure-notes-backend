import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { notFound } from './middleware/not-found';
import authRoutes from './modules/auth/auth.routes';
import noteRoutes from './modules/notes/note.routes';
import userRoutes from './modules/users/user.routes';
import postRoutes from './modules/posts/post.routes';
import adminRoutes from './modules/admin/admin.routes';
import { sendSuccess } from './utils/ApiResponse';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    sendSuccess(res, { status: 'ok' }, 'Healthy');
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/notes', noteRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
