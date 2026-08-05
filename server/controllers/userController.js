const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

async function getUsers(req, res, next) {
  try {
    const result = await pool.query('SELECT id, name, email, role, status, last_login FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const result = await pool.query('SELECT id, name, email, role, status, last_login FROM users WHERE id = $1', [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, status',
      [name, email, hashed, role, 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { name, email, role, status } = req.body;
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING id, name, email, role, status',
      [name, email, role, status, req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deactivateUser(req, res, next) {
  try {
    const result = await pool.query(
      'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role, status',
      ['inactive', req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
};
