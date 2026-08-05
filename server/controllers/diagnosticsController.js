const { pool } = require('../config/db');

async function getDiagnostics(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM diagnostics ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getDiagnosticById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM diagnostics WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Diagnostic record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createDiagnostic(req, res, next) {
  try {
    const { appointment_id, findings, tests_ordered, result_summary, status } = req.body;
    const result = await pool.query(
      'INSERT INTO diagnostics (appointment_id, findings, tests_ordered, result_summary, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [appointment_id, findings, tests_ordered, result_summary, status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateDiagnostic(req, res, next) {
  try {
    const { findings, tests_ordered, result_summary, status } = req.body;
    const result = await pool.query(
      'UPDATE diagnostics SET findings = $1, tests_ordered = $2, result_summary = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [findings, tests_ordered, result_summary, status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Diagnostic record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteDiagnostic(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM diagnostics WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Diagnostic record not found' });
    res.json({ message: 'Diagnostic record deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDiagnostics,
  getDiagnosticById,
  createDiagnostic,
  updateDiagnostic,
  deleteDiagnostic,
};
