import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/ApiResponse';
import * as adminService from './admin.service';

export async function listNotes(req: Request, res: Response) {
  const result = await adminService.listAllNotes(req.query as Record<string, unknown>);
  return sendSuccess(res, result.notes, 'All notes fetched', 200, result.pagination);
}

export async function listUsers(req: Request, res: Response) {
  const result = await adminService.listUsers(req.query as Record<string, unknown>);
  return sendSuccess(res, result.users, 'Users fetched', 200, result.pagination);
}

export async function getUser(req: Request, res: Response) {
  const user = await adminService.getUserById(req.params.id);
  return sendSuccess(res, { user }, 'User fetched');
}

export async function createUser(req: Request, res: Response) {
  const user = await adminService.createUser(req.body);
  return sendSuccess(res, { user }, 'User created', 201);
}

export async function updateUser(req: Request, res: Response) {
  const user = await adminService.updateUser(req.params.id, req.body);
  return sendSuccess(res, { user }, 'User updated');
}

export async function deleteUser(req: Request, res: Response) {
  const result = await adminService.deleteUser(req.params.id, req.auth!.id);
  return sendSuccess(res, result, 'User deleted');
}
