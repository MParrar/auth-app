const express = require('express');
const { registerUser, getProfile, updateProfile, archiveProfile, changePassword } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.get('/profile', verifyToken, getProfile);
router.delete('/:id', verifyToken, archiveProfile);
router.put('/:id', verifyToken, updateProfile);
router.put('/change-password/:id', verifyToken, changePassword);

module.exports = router;
