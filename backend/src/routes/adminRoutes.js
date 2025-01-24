const express = require('express');
const { getAdminLogs, getAllUsers } = require('../controllers/adminControllers');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/verifyRoleMiddleware');
const router = express.Router();

router.get('/logs',[verifyToken, verifyRole(['admin'])], getAdminLogs);
router.get('/list', [verifyToken, verifyRole(['admin'])], getAllUsers);
module.exports = router;