import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app';

const app = createApp();

describe('Authentication', () => {
  it('registers a user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Tamim',
      email: 'tamim@test.com',
      password: 'secret12',
      interests: ['coding'],
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.email).toBe('tamim@test.com');
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('rejects duplicate registration', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Tamim',
      email: 'dup@test.com',
      password: 'secret12',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Other',
      email: 'dup@test.com',
      password: 'secret12',
    });

    expect(res.status).toBe(409);
  });

  it('logs in with valid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Tamim',
      email: 'login@test.com',
      password: 'secret12',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'secret12',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
  });

  it('rejects invalid password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Tamim',
      email: 'badpass@test.com',
      password: 'secret12',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'badpass@test.com',
      password: 'wrongpass',
    });

    expect(res.status).toBe(401);
  });

  it('ignores role in public registration body', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Hacker',
        email: 'hacker@test.com',
        password: 'secret12',
        role: 'admin',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('user');
  });
});
