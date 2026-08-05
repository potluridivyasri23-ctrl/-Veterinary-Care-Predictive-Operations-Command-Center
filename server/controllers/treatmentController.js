const { pool } = require('../config/db');

async function getTreatments(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM treatments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getTreatmentById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM treatments WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Treatment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createTreatment(req, res, next) {
  try {
    const { appointment_id, description, medications, status } = req.body;
    const result = await pool.query(
      'INSERT INTO treatments (appointment_id, description, medications, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [appointment_id, description, medications, status || 'planned']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateTreatment(req, res, next) {
  try {
    const { description, medications, status } = req.body;
    const result = await pool.query(
      'UPDATE treatments SET description = $1, medications = $2, status = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [description, medications, status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Treatment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteTreatment(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM treatments WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Treatment not found' });
    res.json({ message: 'Treatment deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTreatments,
  getTreatmentById,
  createTreatment,
  updateTreatment,
  deleteTreatment,
};
