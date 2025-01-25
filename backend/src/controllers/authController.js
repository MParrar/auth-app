const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {
  userLoginProcess,
  sendPasswordResetEmail,
  removeSessionToken,
  resetUserPassword,
} = require('../services/authServices');

dotenv.config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await userLoginProcess(email, password);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    const errorMapping = {
      'Email or password wrong': 400,
    };

    const statusCode = errorMapping[error.message] || 500;
    const message = statusCode === 500 ? 'Server error' : error.message;

    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await sendPasswordResetEmail(email);

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent',
    });
  } catch (error) {
    const errorMapping = {
      'You need to provide an email': 400,
    };
    const statusCode = errorMapping[error.message] || 500;
    const message = statusCode === 500 ? 'Server error' : error.message;
    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    await resetUserPassword(email, token, password);

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  } catch (error) {
    const errorMapping = {
      'You need to provide token and password': 400,
      'The password must contain at least 8 characters': 400,
      'User not found': 400
    };

    const statusCode = errorMapping[error.message] || 500;
    const message = statusCode === 500 ? 'Server error' : error.message;

    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
};

const logout = async (req, res) => {
  try {
    await removeSessionToken(req.user.userId);
    res.status(200).json({
      status: 'success',
      message: 'User logout',
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: 'An unexpected error occurred' });
  }
};

module.exports = {
  loginUser,
  resetPassword,
  forgotPassword,
  logout,
};
