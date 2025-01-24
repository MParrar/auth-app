const supertest = require('supertest');
const { app } = require('../../src/app');
const pool = require('../../src/config/db');
const { generateToken } = require('../../src/utils/token');

const userData = {
    email: 'get@example.com',
    name: 'Jane Doe',
    password: 'Password123',
    role: 'user',
    sessionToken: 'mock-get-token',
  };
  
  describe('GET /api/users/profile', () => {
    let userId;
    let token;
  
    beforeAll(async () => {
      const result = await pool.query(
        `
        INSERT INTO public.user (name, email, password, role, session_token)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `,
        [userData.name, userData.email, userData.password, userData.role, userData.sessionToken]
      );
  
      userId = result.rows[0].id;
      token = generateToken(userId, userData.role, userData.sessionToken);
    });
  
    afterAll(async () => {
      await pool.query('DELETE FROM public.user WHERE id = $1;', [userId]
      );
      await pool.end();
    });
  
    describe('given a valid token', () => {
      it('should return the user profile', async () => {
        const {statusCode, body} = await supertest(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);
  
        expect(statusCode).toBe(200);
        expect(body.user).toEqual({
          id: userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
      });
    });
  
    describe('given no token', () => {
      it('should return a 401 error', async () => {
        const { statusCode, body } = await supertest(app).get('/api/users/profile');
  
        expect(statusCode).toBe(401);
        expect(body.status).toEqual('error');
        expect(body.message).toEqual('Access Denied');
      });
    });
  
    describe('given an invalid token', () => {
      it('should return a 403 error', async () => {
        const invalidToken = generateToken(userId, userData.role, 'invalid-session-token');
  
        const { statusCode, body } = await supertest(app)
          .get('/api/users/profile')
          .set('Authorization', `Bearer ${invalidToken}`);
  
        expect(statusCode).toBe(403);
        expect(body.status).toEqual('error');
        expect(body.message).toEqual('Invalid or expired session');
      });
    });
  });
