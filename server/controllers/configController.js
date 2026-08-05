const { pool } = require('../config/db');

async function getConfigurations(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM configurations ORDER BY updated_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function updateConfiguration(req, res, next) {
  try {
    const { key, value, description } = req.body;
    const result = await pool.query(
      'INSERT INTO configurations (key, value, description, updated_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description, updated_at = NOW() RETURNING *',
      [key, value, description || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getConfigurations,
  updateConfiguration,
};
