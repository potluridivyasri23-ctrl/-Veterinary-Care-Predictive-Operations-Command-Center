const { pool } = require('../config/db');

async function getMedicalRecords(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM medical_records ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getMedicalRecordById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM medical_records WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Medical record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createMedicalRecord(req, res, next) {
  try {
    const { animal_id, record_type, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO medical_records (animal_id, record_type, notes, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [animal_id, record_type, notes, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateMedicalRecord(req, res, next) {
  try {
    const { record_type, notes } = req.body;
    const result = await pool.query(
      'UPDATE medical_records SET record_type = $1, notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [record_type, notes, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Medical record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteMedicalRecord(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM medical_records WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Medical record not found' });
    res.json({ message: 'Medical record deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
};
