import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { User } from '../src/modules/users/user.model';

const app = createApp();

async function register(name: string, email: string) {
  const res = await request(app).post('/api/auth/register').send({
    name,
    email,
    password: 'secret12',
  });
  return res.body.data as { token: string; user: { id: string } };
}

async function makeAdmin(email: string) {
  await User.updateOne({ email }, { $set: { role: 'admin' } });
  const res = await request(app).post('/api/auth/login').send({
    email,
    password: 'secret12',
  });
  return res.body.data.token as string;
}

describe('Notes ownership and authorization', () => {
  it('user cannot access admin routes', async () => {
    const user = await register('User', 'user1@test.com');
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${user.token}`);
    expect(res.status).toBe(403);
  });

  it('admin can access admin routes', async () => {
    await register('Admin', 'admin1@test.com');
    const token = await makeAdmin('admin1@test.com');
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('user cannot read/update/delete another user note', async () => {
    const a = await register('A', 'a@test.com');
    const b = await register('B', 'b@test.com');

    const created = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ title: 'Private', content: 'secret' });

    const noteId = created.body.data.note._id;

    const read = await request(app)
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${b.token}`);
    expect(read.status).toBe(403);

    const update = await request(app)
      .patch(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${b.token}`)
      .send({ title: 'Hacked' });
    expect(update.status).toBe(403);

    const del = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${b.token}`);
    expect(del.status).toBe(403);
  });

  it('supports create/list/update/delete own notes and pagination', async () => {
    const user = await register('Owner', 'owner@test.com');

    await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ title: 'N1', content: 'C1' });
    await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ title: 'N2', content: 'C2' });

    const list = await request(app)
      .get('/api/notes?page=1&limit=1')
      .set('Authorization', `Bearer ${user.token}`);

    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.pagination.total).toBe(2);
    expect(list.body.pagination.totalPages).toBe(2);

    const noteId = list.body.data[0]._id;

    const updated = await request(app)
      .patch(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ title: 'Updated' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.note.title).toBe('Updated');

    const deleted = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${user.token}`);
    expect(deleted.status).toBe(200);
  });

  it('admin can view all notes via /api/admin/notes', async () => {
    const a = await register('A2', 'a2@test.com');
    await register('Admin2', 'admin2@test.com');
    const adminToken = await makeAdmin('admin2@test.com');

    await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ title: 'Visible to admin', content: 'x' });

    const res = await request(app)
      .get('/api/admin/notes')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
  });
});
