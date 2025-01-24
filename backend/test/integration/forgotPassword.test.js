const supertest = require('supertest');
const { app } = require('../../src/app');
const pool = require('../../src/config/db');

jest.mock('../../src/services/emailServices', () => ({
  sendEmail: jest.fn(),
}));

const { sendEmail } = require('../../src/services/emailServices');

const userData = {
  email: 'forgotpassword@example.com',
  name: 'Jane Doe',
  password: 'Password123',
  role: 'user',
  sessionToken: 'mock-forgot-token',
};

describe('POST /forgot-password', () => {
  let userId;

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
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.user WHERE id = $1;', [userId]);
    await pool.end();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and success message when email is sent', async () => {
    const response = await supertest(app)
      .post('/api/forgot-password')
      .send({ email: userData.email });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      message: 'Password reset link sent',
    });
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it('should return 400 with message about email is required', async () => {
    const response = await supertest(app)
      .post('/api/forgot-password')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'You need to provide an email',
    });
    expect(sendEmail).toHaveBeenCalledTimes(0);
  });

});
