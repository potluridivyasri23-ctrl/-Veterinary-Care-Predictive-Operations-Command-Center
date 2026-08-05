const { pool } = require('../config/db');

async function getVaccinations(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM vaccinations ORDER BY scheduled_date DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getVaccinationById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM vaccinations WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Vaccination record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createVaccination(req, res, next) {
  try {
    const { animal_id, appointment_id, vaccine_name, dose, scheduled_date, status } = req.body;
    const result = await pool.query(
      'INSERT INTO vaccinations (animal_id, appointment_id, vaccine_name, dose, scheduled_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [animal_id, appointment_id, vaccine_name, dose, scheduled_date, status || 'scheduled']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateVaccination(req, res, next) {
  try {
    const { vaccine_name, dose, scheduled_date, status } = req.body;
    const result = await pool.query(
      'UPDATE vaccinations SET vaccine_name = $1, dose = $2, scheduled_date = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [vaccine_name, dose, scheduled_date, status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Vaccination record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteVaccination(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM vaccinations WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Vaccination record not found' });
    res.json({ message: 'Vaccination deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getVaccinations,
  getVaccinationById,
  createVaccination,
  updateVaccination,
  deleteVaccination,
};
