import mongoose from 'mongoose';
import { ApiError } from '../../utils/ApiError';
import { buildPagination, getPagination } from '../../utils/pagination';
import { User } from './user.model';
import { createUserSchema, objectIdSchema, updateUserSchema } from './user.validation';

export async function listUsers(query: Record<string, unknown>) {
  const { page, limit, skip } = getPagination(query);
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  return {
    users: users.map((u) => u.toSafeObject()),
    pagination: buildPagination(total, page, limit),
  };
}

export async function getUserById(id: string) {
  const userId = objectIdSchema.parse(id);
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user.toSafeObject();
}

export async function createUser(input: unknown) {
  const data = createUserSchema.parse(input);
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const user = await User.create(data);
  return user.toSafeObject();
}

export async function updateUser(id: string, input: unknown) {
  const userId = objectIdSchema.parse(id);
  const data = updateUserSchema.parse(input);
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (data.name !== undefined) user.name = data.name;
  if (data.email !== undefined) user.email = data.email;
  if (data.role !== undefined) user.role = data.role;
  if (data.interests !== undefined) user.interests = data.interests;
  if (data.password !== undefined) user.password = data.password;

  await user.save();
  return user.toSafeObject();
}

export async function deleteUser(id: string, requesterId: string) {
  const userId = objectIdSchema.parse(id);
  if (userId === requesterId) {
    throw new ApiError(400, 'Cannot delete your own account');
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return { id: user.id };
}

/**
 * Scenario 1 — exactly ONE collection.aggregate() call.
 */
export async function groupUsersByInterests() {
  const groups = await User.collection.aggregate([
    { $unwind: '$interests' },
    {
      $group: {
        _id: '$interests',
        users: { $push: '$name' },
      },
    },
    { $sort: { _id: 1 } },
  ]).toArray();

  return groups;
}

/**
 * Scenario 2 — single aggregation with $lookup (no findById / find / populate).
 */
export async function getUserPostsViaLookup(id: string) {
  const userId = objectIdSchema.parse(id);

  const result = await User.collection.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'userId',
        as: 'posts',
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]).toArray();

  if (!result.length) {
    throw new ApiError(404, 'User not found');
  }

  const doc = result[0];
  return {
    user: {
      id: doc._id,
      name: doc.name,
      email: doc.email,
      role: doc.role,
      interests: doc.interests,
    },
    posts: doc.posts,
  };
}
