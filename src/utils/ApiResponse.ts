import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination ? { pagination } : {}),
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  details?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details !== undefined ? { details } : {}),
  });
}
