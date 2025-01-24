const supertest = require('supertest');
const { app } = require('../../src/app');
const pool = require('../../src/config/db');
const { generateToken } = require('../../src/utils/token');

const userData = {
  email: 'roles@example.com',
  name: 'Jane Doe',
  password: 'Password123',
  role: 'user',
  sessionToken: 'mock-verify-token',
};

const adminUser = {
  email: 'admin@example.com',
  name: 'Admin',
  password: 'Password123',
  role: 'admin',
  sessionToken: 'mock-admin-token',
};

describe('User with "user" role try to get an admin endpoint', () => {
  let userId;
  let token;

  beforeAll(async () => {
    const result = await pool.query(
      `INSERT INTO public.user (name, email, password, role, session_token)
       VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      [userData.name, userData.email, userData.password, userData.role, userData.sessionToken]
    );

    userId = result.rows[0].id;
    token = generateToken(userId, userData.role, userData.sessionToken);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.user WHERE id = $1;', [userId]);
  });

  it('should return access denied for the user role', async () => {
    const { statusCode, body } = await supertest(app)
      .get('/api/admin/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(403);
    expect(body.message).toBe('Access Denied');
  });
});

describe('User with "admin" role gets logs', () => {
  let userId;
  let adminToken;

  beforeAll(async () => {
    const result = await pool.query(
      `INSERT INTO public.user (name, email, password, role, session_token)
       VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      [adminUser.name, adminUser.email, adminUser.password, adminUser.role, adminUser.sessionToken]
    );

    userId = result.rows[0].id;
    adminToken = generateToken(userId, adminUser.role, adminUser.sessionToken);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.user WHERE id = $1;', [userId]);
    await pool.end();
  });

  it('should return success status', async () => {
    const { statusCode, body } = await supertest(app)
      .get('/api/admin/logs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(statusCode).toBe(200);
    expect(body.status).toBe('success');
    expect(Array.isArray(body.logs)).toBe(true);
  });
});
