const { pool } = require('../config/db');

async function getFollowUps(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM follow_ups ORDER BY scheduled_date DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getFollowUpById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM follow_ups WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Follow-up not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createFollowUp(req, res, next) {
  try {
    const { appointment_id, animal_id, owner_id, scheduled_date, notes, status } = req.body;
    const result = await pool.query(
      'INSERT INTO follow_ups (appointment_id, animal_id, owner_id, scheduled_date, notes, status, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [appointment_id, animal_id, owner_id, scheduled_date, notes, status || 'pending', req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateFollowUp(req, res, next) {
  try {
    const { scheduled_date, notes, status } = req.body;
    const result = await pool.query(
      'UPDATE follow_ups SET scheduled_date = $1, notes = $2, status = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [scheduled_date, notes, status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Follow-up not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteFollowUp(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM follow_ups WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Follow-up not found' });
    res.json({ message: 'Follow-up removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFollowUps,
  getFollowUpById,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
};
