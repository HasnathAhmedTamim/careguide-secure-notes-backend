import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/ApiResponse';
import * as authService from './auth.service';

export async function register(req: Request, res: Response) {
  const result = await authService.register(req.body);
  return sendSuccess(res, result, 'Registered successfully', 201);
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);
  return sendSuccess(res, result, 'Logged in successfully');
}

export async function me(req: Request, res: Response) {
  const user = await authService.getMe(req.auth!.id);
  return sendSuccess(res, { user }, 'Profile fetched');
}
