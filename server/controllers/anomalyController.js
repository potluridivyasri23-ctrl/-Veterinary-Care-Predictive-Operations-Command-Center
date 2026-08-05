const { pool } = require('../config/db');

async function getAnomalies(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM anomalies ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createAnomaly(req, res, next) {
  try {
    const { description, severity, evidence } = req.body;
    const result = await pool.query(
      'INSERT INTO anomalies (description, severity, evidence, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [description, severity, evidence || {}, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateAnomalyStatus(req, res, next) {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE anomalies SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Anomaly not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnomalies,
  createAnomaly,
  updateAnomalyStatus,
};
