const express = require('express');
const { loginUser, resetPassword, forgotPassword, logout } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', verifyToken, logout);


module.exports = router;
