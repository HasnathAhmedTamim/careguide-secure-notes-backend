import { ApiError } from '../../utils/ApiError';
import { buildPagination, getPagination } from '../../utils/pagination';
import { Note } from './note.model';
import { createNoteSchema, objectIdSchema, updateNoteSchema } from './note.validation';

export async function createNote(userId: string, input: unknown) {
  const data = createNoteSchema.parse(input);
  const note = await Note.create({ ...data, userId });
  return note;
}

export async function listOwnNotes(userId: string, query: Record<string, unknown>) {
  const { page, limit, skip } = getPagination(query);
  const filter = { userId };

  const [notes, total] = await Promise.all([
    Note.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Note.countDocuments(filter),
  ]);

  return { notes, pagination: buildPagination(total, page, limit) };
}

export async function listAllNotes(query: Record<string, unknown>) {
  const { page, limit, skip } = getPagination(query);

  const [notes, total] = await Promise.all([
    Note.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name email role'),
    Note.countDocuments(),
  ]);

  return { notes, pagination: buildPagination(total, page, limit) };
}

export async function getNoteById(
  noteId: string,
  requester: { id: string; role: 'user' | 'admin' }
) {
  const id = objectIdSchema.parse(noteId);
  const note = await Note.findById(id);
  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  const isOwner = note.userId.toString() === requester.id;
  if (!isOwner && requester.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to access this resource');
  }

  return note;
}

export async function updateNote(
  noteId: string,
  requester: { id: string; role: 'user' | 'admin' },
  input: unknown
) {
  const data = updateNoteSchema.parse(input);
  const note = await getNoteById(noteId, requester);

  if (note.userId.toString() !== requester.id && requester.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to access this resource');
  }

  // Only owner can update their notes; admin inherits user capabilities for own notes
  // Spec: users update own notes; admin inherits user capabilities
  if (note.userId.toString() !== requester.id) {
    throw new ApiError(403, 'You can only update your own notes');
  }

  if (data.title !== undefined) note.title = data.title;
  if (data.content !== undefined) note.content = data.content;
  await note.save();
  return note;
}

export async function deleteNote(
  noteId: string,
  requester: { id: string; role: 'user' | 'admin' }
) {
  const note = await getNoteById(noteId, requester);

  if (note.userId.toString() !== requester.id) {
    throw new ApiError(403, 'You can only delete your own notes');
  }

  await note.deleteOne();
  return { id: note.id };
}
