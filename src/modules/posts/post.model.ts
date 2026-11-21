import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

/**
 * INDEX STRATEGY (Posts)
 * { userId: 1 }
 * - Supports $lookup where localField=_id (users) joins foreignField=userId (posts)
 * - Also supports filtering posts by user when needed
 */
postSchema.index({ userId: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
