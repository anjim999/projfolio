// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || 'user',
    };
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
