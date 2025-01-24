const supertest = require('supertest');
const { app } = require('../../src/app');
const pool = require('../../src/config/db');
const { generateToken } = require('../../src/utils/token');

const userData = {
  email: 'reset@example.com',
  name: 'Jane Doe',
  password: 'Password123',
  role: 'user',
  sessionToken: 'mock-reset-token',
};

describe('POST /reset-password', () => {
  let userId;
  let token;
  beforeAll(async () => {
    const result = await pool.query(
      `
        INSERT INTO public.user (name, email, password, role, session_token)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `,
      [
        userData.name,
        userData.email,
        userData.password,
        userData.role,
        userData.sessionToken,
      ]
    );

    userId = result.rows[0].id;
    token = generateToken(userId, userData.role, userData.sessionToken);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.user WHERE id = $1;', [userId]);
    await pool.end();
  });

  it('should return 200 and success message', async () => {

    const response = await supertest(app)
      .post('/api/reset-password')
      .send({ password: userData.password, token });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      message: 'Password updated successfully',
    });
  });

  it('should return 400 with message about email is required', async () => {
    const response = await supertest(app).post('/api/reset-password')
    .send({token});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'You need to provide token and password',
    });
  });
});
