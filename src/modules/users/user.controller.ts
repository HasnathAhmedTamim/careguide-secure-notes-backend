import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/ApiResponse';
import * as userService from './user.service';

export async function groupedByInterests(_req: Request, res: Response) {
  const groups = await userService.groupUsersByInterests();
  return sendSuccess(res, groups, 'Users grouped by interests');
}

export async function userPosts(req: Request, res: Response) {
  const result = await userService.getUserPostsViaLookup(req.params.id);
  return sendSuccess(res, result, 'User posts fetched via $lookup');
}
