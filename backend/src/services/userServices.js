const bcrypt = require('bcryptjs');
const { sendEmail } = require('./emailServices');
const pool = require('../config/db');
const { createAuditLog } = require('./adminServices');

const createUser = async (req, name, email, password, role = 'user') => {
  if (!name || !email || !password) {
    throw new Error('You need to provide name, email and password');
  }

  if (password.length < 8) {
    throw new Error('The password must contain at least 8 characters');
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser.length > 0) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    'INSERT INTO public.user (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, hashedPassword, role]
  );

  sendEmail(
    email,
    'Your account has been created successfully!',
    `
      Hello ${name}, \n\nWe're happy to inform you that your account has been created successfully.\n\nAccess your account: ${process.env.FRONTEND_URL} \n\nBest regards`
  );

  if (role === 'admin') {
    createAuditLog(
      req,
      {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
      }
    );
  }

  return newUser.rows[0];
};

const getUserProfileById = async (userId) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, role FROM public.user WHERE id = $1',
      [userId]
    );

    if (user.rows.length === 0) {
      throw new Error('User not found');
    }

    return user.rows[0];
  } catch (error) {
    throw new Error(error.message || 'Server error');
  }
};

const updateUserProfile = async (req, id, name, email, currentUser) => {

  if(!id || !name || !email){
    throw new Error('You need to provide id, email and name');
  }

  const user = await pool.query('SELECT * FROM public.user WHERE id = $1', [
    id,
  ]);

  if (
    user.rows.length === 0 ||
    (currentUser.role !== 'admin' && user.rows[0].id != id)
  ) {
    throw new Error('User not found');
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser.length > 0 && existingUser[0].id != id) {
    throw new Error('User already exists');
  }

  await pool.query(
    'UPDATE public.user SET name = $1, email = $2 WHERE id = $3',
    [name, email, id]
  );

  if (currentUser.role === 'admin') {
    createAuditLog(req, {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
    });
  }

  return user.rows[0];
};

const changeUserPassword = async (req, id, newPassword, currentUser) => {
  const user = await pool.query('SELECT * FROM public.user WHERE id = $1', [
    id,
  ]);

  if (
    (currentUser !== 'admin' && user.rows[0].id != id) ||
    user.rows.length === 0
  ) {
    throw new Error('User not found');
  }

  const updatedPassword = newPassword
    ? await bcrypt.hash(newPassword, 10)
    : user.rows[0].newPassword;

  await pool.query('UPDATE public.user SET password = $1 WHERE id = $2', [
    updatedPassword,
    id,
  ]);

  if (currentUser === 'admin') {
    createAuditLog(req, '');
  }
};

const removeUser = async (req, id) => {
  const user = await pool.query('SELECT * FROM public.user WHERE id = $1', [
    id,
  ]);

  if (user.rows.length === 0) {
    throw new Error('User not found');
  }

  await pool.query('DELETE FROM public.user WHERE id = $1', [id]);

  if (req.user.role === 'admin') {
    createAuditLog(req, {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
    });
  }
};

const findUserByEmail = async (email) => {
  const existingUser = await pool.query(
    'SELECT * FROM public.user WHERE email = $1',
    [email]
  );

  return existingUser.rows;
};

module.exports = {
  getUserProfileById,
  updateUserProfile,
  createUser,
  changeUserPassword,
  removeUser
};
