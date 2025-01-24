const supertest = require('supertest');
const { app } = require('../../src/app');
const pool = require('../../src/config/db');
const bcrypt = require('bcryptjs');

const userData = {
  email: 'login@example.com',
  name: 'Jane Doe',
  password: 'Password123',
  role: 'user',
  sessionToken: 'mock-log-token',
};

describe('POST /api/login', () => {
  beforeAll(async () => {
    await pool.query(
      `
        INSERT INTO public.user (name, email, password, role, session_token)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `,
      [
        userData.name,
        userData.email,
        await bcrypt.hash(userData.password, 10),
        userData.role,
        userData.sessionToken,
      ]
    );
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.user WHERE email = $1;', [userData.email]
    );

    await pool.end();
  });

  describe('Successfully login', () => {
    it('should return the token', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/login')
        .send({
          email: userData.email,
          password: userData.password,
        });
      expect(statusCode).toBe(200);
      expect(body.status).toEqual('success');
    });
  });
  describe('Wrong credentials', () => {
    it('should return an error', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/login')
        .send({
          email: userData.email,
          password: 'BadPassword',
        });

      expect(statusCode).toBe(400);
      expect(body.message).toEqual('Email or password wrong');
    });
  });
});
