import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

/**
 * INDEX STRATEGY (Notes)
 * 1. { userId: 1, createdAt: -1 }
 *    - User listing own notes: filter by userId + sort by createdAt desc + pagination
 *    - Also supports ownership-scoped queries
 * 2. { createdAt: -1 }
 *    - Admin listing ALL notes sorted by newest (no userId filter)
 *    - Compound index above cannot efficiently serve this query shape
 * _id default index covers GET /notes/:id
 */
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ createdAt: -1 });

export const Note = mongoose.model<INote>('Note', noteSchema);
