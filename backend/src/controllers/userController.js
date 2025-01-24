
const dotenv = require('dotenv');

const {
  getUserProfileById,
  updateUserProfile,
  createUser,
  changeUserPassword,
  removeUser,
} = require('../services/userServices');

dotenv.config();

const registerUser = async (req, res) => {
  const { name, email, password, role='user' } = req.body;
  try {
    const newUser = await createUser(req, name, email, password, role);

    res.status(201).json({
      status: 'success',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    const errorMapping = {
      'You need to provide name, email and password': 400,
      'The password must contain at least 8 characters': 400,
      'User already exists': 400,
    };

    const statusCode = errorMapping[error.message] || 500;
    const message = statusCode === 500 ? 'Server error' : error.message;

    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await getUserProfileById(req.user.userId);
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const updatedUser = await updateUserProfile(req, id, name, email, req.user);

    res.status(200).json({
      status: 'success',
      message: 'User Updated Successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    const errorMapping = {
      'User not found': 400,
      'You need to provide id, email and name': 400,
      'User already exists': 400
    };

    const statusCode = errorMapping[error.message] || 500;
    const message = statusCode === 500 ? 'Server error' : error.message;
    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
  
    await changeUserPassword(req, id, password, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Password has been changed successfully',
    });
  } catch (error) {
    const errorMapping = {
      'User not found': 400,
    };

    const statusCode = errorMapping[error.message] || 500;
    const message = statusCode === 500 ? 'Server error' : error.message;

    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
};

const archiveProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await removeUser(req, id);

    res.status(200).json({
      status: 'success',
      message: 'User removed',
    });
  } catch (error) {
    const errorMapping = {
      'User not found': 400,
    };

    const statusCode = errorMapping[error.message] || 500;
    const message = statusCode === 500 ? 'Server error' : error.message;

    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
};

module.exports = {
  registerUser,
  getProfile,
  updateProfile,
  archiveProfile,
  changePassword,
};
