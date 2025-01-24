const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Access Denied' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      try {
        const userQuery = await pool.query(
          'SELECT session_token FROM public.user WHERE id = $1',
          [decoded.userId]
        );
  
        const user = userQuery.rows[0];

        if (!user || user.session_token !== decoded.sessionToken) {
          return res.status(403).json({ status: 'error', message: 'Invalid or expired session' });
        }
  
        req.user = decoded;
        next();
      } catch (dbError) {
        return res.status(500).json({ status: 'error', message: 'Database error' });
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ status: 'error', message: 'Token has expired' });
      }
      return res.status(403).json({ status: 'error', message: 'Invalid token' });
    }
  };

  
  
module.exports = { verifyToken };
