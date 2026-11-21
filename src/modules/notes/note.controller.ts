import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/ApiResponse';
import * as noteService from './note.service';

export async function create(req: Request, res: Response) {
  const note = await noteService.createNote(req.auth!.id, req.body);
  return sendSuccess(res, { note }, 'Note created', 201);
}

export async function list(req: Request, res: Response) {
  const result = await noteService.listOwnNotes(req.auth!.id, req.query as Record<string, unknown>);
  return sendSuccess(res, result.notes, 'Notes fetched', 200, result.pagination);
}

export async function getById(req: Request, res: Response) {
  const note = await noteService.getNoteById(req.params.id, req.auth!);
  return sendSuccess(res, { note }, 'Note fetched');
}

export async function update(req: Request, res: Response) {
  const note = await noteService.updateNote(req.params.id, req.auth!, req.body);
  return sendSuccess(res, { note }, 'Note updated');
}

export async function remove(req: Request, res: Response) {
  const result = await noteService.deleteNote(req.params.id, req.auth!);
  return sendSuccess(res, result, 'Note deleted');
}
