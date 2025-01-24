const supertest = require('supertest');
const { app } = require('../../src/app');
const pool = require('../../src/config/db');

jest.mock('../../src/services/emailServices', () => ({
  sendEmail: jest.fn(),
}));

const { sendEmail } = require('../../src/services/emailServices');

const userData = {
  email: 'register@example.com',
  name: 'John Doe',
  password: 'SecurePass123',
  role: 'user',
  sessionToken: 'mock-register-token',
};

describe('POST /api/register', () => {
  beforeAll(async () => {
    await pool.query(
      `
      DELETE FROM public.user WHERE email = $1;
    `,
      [userData.email]
    );
  });

  afterAll(async () => {
    await pool.query(
      `
      DELETE FROM public.user WHERE email = $1;
    `,
      [userData.email]
    );
    await pool.end();
  });

  describe('Successful registration', () => {
    it('should register a user and call sendEmail', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/users/register')
        .send({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        });

      expect(statusCode).toBe(201);
      expect(body.status).toEqual('success');
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
  });
  describe('given an empty payload', () => {
    it('should return a 400', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/users/register')
        .send({});
        expect(statusCode).toBe(400);
        expect(body.status).toEqual('error');
        expect(body.message).toEqual('You need to provide name, email and password');
    });
  });
  describe('given an short password', () => {
    it('should return a 400', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/users/register')
        .send({
            ...userData,
            password: '1234567'
        });
        expect(statusCode).toBe(400);
        expect(body.status).toEqual('error');
        expect(body.message).toEqual('The password must contain at least 8 characters');
    });
  });
});
