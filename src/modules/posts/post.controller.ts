import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/ApiResponse';
import * as postService from './post.service';

export async function create(req: Request, res: Response) {
  const post = await postService.createPost(req.auth!.id, req.body);
  return sendSuccess(res, { post }, 'Post created', 201);
}

export async function list(req: Request, res: Response) {
  const result = await postService.listPosts(req.query as Record<string, unknown>);
  return sendSuccess(res, result.posts, 'Posts fetched', 200, result.pagination);
}
