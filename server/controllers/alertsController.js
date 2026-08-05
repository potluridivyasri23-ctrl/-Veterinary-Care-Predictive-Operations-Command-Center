const { pool } = require('../config/db');

async function getAlerts(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createAlert(req, res, next) {
  try {
    const { target_type, target_id, severity, message, status } = req.body;
    const result = await pool.query(
      'INSERT INTO alerts (target_type, target_id, severity, message, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [target_type, target_id, severity || 'warning', message, status || 'open']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateAlertStatus(req, res, next) {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE alerts SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Alert not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAlerts,
  createAlert,
  updateAlertStatus,
};
