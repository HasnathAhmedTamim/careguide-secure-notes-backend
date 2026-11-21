import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/ApiResponse';
import { env } from '../config/env';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message, err.details);
  }

  if (err instanceof ZodError) {
    return sendError(res, 400, 'Validation failed', err.flatten());
  }

  if (typeof err === 'object' && err !== null) {
    const anyErr = err as { name?: string; code?: number; message?: string; keyPattern?: unknown };

    if (anyErr.name === 'CastError') {
      return sendError(res, 400, 'Invalid id');
    }
    if (anyErr.name === 'ValidationError') {
      return sendError(res, 400, anyErr.message || 'Validation failed');
    }
    if (anyErr.code === 11000) {
      return sendError(res, 409, 'Email already registered');
    }
  }

  console.error(err);
  return sendError(
    res,
    500,
    'Internal server error',
    env.NODE_ENV === 'production' ? undefined : String(err)
  );
}
