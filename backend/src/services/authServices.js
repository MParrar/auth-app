const pool = require('../config/db');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./emailServices');
const { generateToken } = require('../utils/token');
const dotenv = require('dotenv');

dotenv.config();

const userLoginProcess = async (email, password) => {
  const userQuery = await pool.query(
    'SELECT * FROM public.user WHERE email = $1',
    [email]
  );
  const user = userQuery.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Email or password wrong');
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');

  await pool.query('UPDATE public.user SET session_token = $1 WHERE id = $2', [
    sessionToken,
    user.id,
  ]);

  const token = generateToken(user.id, user.role, sessionToken);

  return token;
};

const sendPasswordResetEmail = async (email) => {
  if (!email) {
    throw new Error('You need to provide an email');
  }

  const user = await pool.query('SELECT * FROM public.user WHERE email = $1', [
    email,
  ]);

  if (user.rows.length === 0) {
    return;
  }

  const resetToken = jwt.sign(
    { email: user.rows[0].email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail(
    email,
    'Password Reset Request',
    `Hello ${user.rows[0].name}, \n\nWe received a request to reset your password. Please click the link below to reset it:\n\n${resetLink}\n\nIf you didn't request this, please ignore this email.`
  );
};

const resetUserPassword = async (userId, token, password) => {
  if (!token || !password) {
    throw new Error('You need to provide token and password');
  }

  if (password.length < 8) {
    throw new Error('The password must contain at least 8 characters');
  }

  const user = await pool.query('SELECT * FROM public.user WHERE id = $1', [
    userId,
  ]);

  if (user.rows.length === 0) {
    throw new Error('User not found');

  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query('UPDATE public.user SET password = $1 WHERE id = $2', [
    hashedPassword,
    userId,
  ]);
};

const removeSessionToken = async (userId) => {
  try {
    await pool.query(
      'UPDATE public.user SET session_token = NULL WHERE id = $1',
      [userId]
    );
  } catch (error) {
    throw new Error(error.message || 'Server error');
  }
};
module.exports = {
  userLoginProcess,
  sendPasswordResetEmail,
  resetUserPassword,
  removeSessionToken,
};
