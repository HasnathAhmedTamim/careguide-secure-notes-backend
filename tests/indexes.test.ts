import { describe, expect, it } from 'vitest';
import { User } from '../src/modules/users/user.model';
import { Note } from '../src/modules/notes/note.model';
import { Post } from '../src/modules/posts/post.model';

describe('Indexes declared via schema.index()', () => {
  it('declares only required user indexes', () => {
    const indexes = User.schema.indexes();
    expect(indexes).toEqual(
      expect.arrayContaining([
        [{ email: 1 }, expect.objectContaining({ unique: true })],
        [{ createdAt: -1 }, expect.any(Object)],
        [{ interests: 1 }, expect.any(Object)],
      ])
    );
    expect(indexes).toHaveLength(3);
  });

  it('declares only required note indexes', () => {
    const indexes = Note.schema.indexes();
    expect(indexes).toEqual(
      expect.arrayContaining([
        [{ userId: 1, createdAt: -1 }, expect.any(Object)],
        [{ createdAt: -1 }, expect.any(Object)],
      ])
    );
    expect(indexes).toHaveLength(2);
  });

  it('declares only required post index for $lookup', () => {
    const indexes = Post.schema.indexes();
    expect(indexes).toEqual(
      expect.arrayContaining([[{ userId: 1 }, expect.any(Object)]])
    );
    expect(indexes).toHaveLength(1);
  });
});
