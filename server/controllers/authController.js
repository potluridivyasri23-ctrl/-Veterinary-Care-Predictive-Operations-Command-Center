const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/authValidators');
const crypto = require('crypto');

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const cleanEmail = data.email.trim().toLowerCase();
    const userQuery = await pool.query('SELECT id, email, password, role, name, status FROM users WHERE LOWER(email) = $1', [cleanEmail]);
    if (!userQuery.rows.length) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const user = userQuery.rows[0];
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account inactive' });
    }
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [data.email]);
    if (existing.rows.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, status',
      [data.name, data.email, hashed, data.role, 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const data = forgotPasswordSchema.parse(req.body);
    const userQuery = await pool.query('SELECT id, email FROM users WHERE email = $1', [data.email]);
    if (!userQuery.rows.length) {
      return res.status(200).json({ message: 'If the account exists, reset instructions have been sent' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    await pool.query("UPDATE users SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '1 hour' WHERE email = $2", [token, data.email]);
    res.json({ message: 'Password reset token generated', resetToken: token });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const data = resetPasswordSchema.parse(req.body);
    const query = await pool.query(
      'SELECT id, reset_token_expires FROM users WHERE reset_token = $1',
      [data.token]
    );
    if (!query.rows.length || query.rows[0].reset_token_expires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const hashed = await bcrypt.hash(data.password, 10);
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [hashed, query.rows[0].id]
    );
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};
