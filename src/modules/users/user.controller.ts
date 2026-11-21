import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/ApiResponse';
import * as userService from './user.service';

export async function groupedByInterests(_req: Request, res: Response) {
  const groups = await userService.groupUsersByInterests();
  return sendSuccess(res, groups, 'Users grouped by interests');
}

export async function userPosts(req: Request, res: Response) {
  const result = await userService.getUserPostsViaLookup(
    req.params.id,
    req.query as Record<string, unknown>
  );
  return sendSuccess(
    res,
    { user: result.user, posts: result.posts },
    'User posts fetched via $lookup',
    200,
    result.pagination
  );
}
