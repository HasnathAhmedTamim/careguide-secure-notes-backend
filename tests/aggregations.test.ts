import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app';
import { User } from '../src/modules/users/user.model';
import { Post } from '../src/modules/posts/post.model';

const app = createApp();

async function auth(name: string, email: string, interests: string[]) {
  const res = await request(app).post('/api/auth/register').send({
    name,
    email,
    password: 'secret12',
    interests,
  });
  return res.body.data as { token: string; user: { id: string } };
}

describe('Aggregations', () => {
  it('groups users by interests with exactly one aggregate call', async () => {
    const tamim = await auth('Tamim', 'tamim@agg.com', ['football', 'coding']);
    await auth('Rahim', 'rahim@agg.com', ['football', 'reading']);
    await auth('Karim', 'karim@agg.com', ['coding', 'reading']);

    const spy = vi.spyOn(User.collection, 'aggregate');

    const res = await request(app)
      .get('/api/users/grouped-by-interests')
      .set('Authorization', `Bearer ${tamim.token}`);

    expect(res.status).toBe(200);
    expect(spy).toHaveBeenCalledTimes(1);

    const groups = res.body.data as Array<{ _id: string; users: Array<{ name: string }> }>;
    const football = groups.find((g) => g._id === 'football');
    const names = football?.users.map((u) => u.name) || [];
    expect(names).toEqual(expect.arrayContaining(['Tamim', 'Rahim']));
  });

  it('retrieves user posts via $lookup and excludes other users posts', async () => {
    const alice = await auth('Alice', 'alice@agg.com', ['chess']);
    const bob = await auth('Bob', 'bob@agg.com', ['music']);

    await Post.create([
      { title: 'A1', content: 'Alice 1', userId: alice.user.id },
      { title: 'A2', content: 'Alice 2', userId: alice.user.id },
      { title: 'B1', content: 'Bob 1', userId: bob.user.id },
    ]);

    const spy = vi.spyOn(User.collection, 'aggregate');

    const res = await request(app)
      .get(`/api/users/${alice.user.id}/posts`)
      .set('Authorization', `Bearer ${bob.token}`);

    expect(res.status).toBe(200);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res.body.data.posts).toHaveLength(2);
    expect(res.body.data.posts.every((p: { title: string }) => p.title.startsWith('A'))).toBe(
      true
    );
    expect(res.body.pagination).toMatchObject({ page: 1, total: 2 });
  });

  it('paginates user posts from the $lookup pipeline', async () => {
    const alice = await auth('AlicePage', 'alicepage@agg.com', ['chess']);

    await Post.create(
      Array.from({ length: 7 }, (_, i) => ({
        title: `P${i + 1}`,
        content: `Post ${i + 1}`,
        userId: alice.user.id,
      }))
    );

    const page1 = await request(app)
      .get(`/api/users/${alice.user.id}/posts?page=1&limit=3`)
      .set('Authorization', `Bearer ${alice.token}`);

    const page2 = await request(app)
      .get(`/api/users/${alice.user.id}/posts?page=2&limit=3`)
      .set('Authorization', `Bearer ${alice.token}`);

    expect(page1.status).toBe(200);
    expect(page1.body.data.posts).toHaveLength(3);
    expect(page1.body.pagination).toMatchObject({ page: 1, limit: 3, total: 7, totalPages: 3 });
    expect(page2.body.data.posts).toHaveLength(3);
    expect(page2.body.pagination.page).toBe(2);
  });
});
