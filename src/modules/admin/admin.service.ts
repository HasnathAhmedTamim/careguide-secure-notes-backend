import * as noteService from '../notes/note.service';
import * as userService from '../users/user.service';

export const listAllNotes = noteService.listAllNotes;
export const listUsers = userService.listUsers;
export const getUserById = userService.getUserById;
export const createUser = userService.createUser;
export const updateUser = userService.updateUser;
export const deleteUser = userService.deleteUser;
