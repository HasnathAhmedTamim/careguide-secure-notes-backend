import { buildPagination, getPagination } from '../../utils/pagination';
import { Post } from './post.model';
import { createPostSchema } from './post.validation';

export async function createPost(userId: string, input: unknown) {
  const data = createPostSchema.parse(input);
  return Post.create({ ...data, userId });
}

export async function listPosts(query: Record<string, unknown>) {
  const { page, limit, skip } = getPagination(query);
  const [posts, total] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name email'),
    Post.countDocuments(),
  ]);

  return { posts, pagination: buildPagination(total, page, limit) };
}
