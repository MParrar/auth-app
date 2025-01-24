const supertest = require('supertest');
const { app } = require('../../src/app');
const pool = require('../../src/config/db');
const { generateToken } = require('../../src/utils/token');

const userData = {
    email: 'session@example.com',
    name: 'Jane Doe',
    password: 'Password123',
    role: 'user',
    sessionToken: 'mock-session-token',
  };
  
  describe('User with session request resource, after user logout then try again request the resource', () => {
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
  
  
    describe('given a valid token request profile, logout and ask again for the profile', () => {
      it('should return the user profile first and then a invalid token message', async () => {
        const profileResponse = await supertest(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);
  
        expect(profileResponse.statusCode).toBe(200);
        expect(profileResponse.body.user).toEqual({
          id: userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
        const logoutResponse = await supertest(app)
        .post('/api/logout')
        .set('Authorization', `Bearer ${token}`);

        expect(logoutResponse.statusCode).toBe(200);
        expect(logoutResponse.body.status).toEqual('success');
        expect(logoutResponse.body.message).toEqual('User logout');

        const profileAfterLogoutResponse = await supertest(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);
        expect(profileAfterLogoutResponse.statusCode).toBe(403);
        expect(profileAfterLogoutResponse.body.message).toBe('Invalid or expired session');
      });
    });

  });
