import { Request, Response } from 'express';
import { sendError } from '../utils/ApiResponse';

export function notFound(_req: Request, res: Response) {
  return sendError(res, 404, 'Route not found');
}
