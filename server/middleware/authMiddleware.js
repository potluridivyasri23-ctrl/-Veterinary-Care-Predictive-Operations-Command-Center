const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userQuery = await pool.query('SELECT id, email, role, name, status FROM users WHERE id = $1', [decoded.id]);
    if (!userQuery.rows.length) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = userQuery.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
