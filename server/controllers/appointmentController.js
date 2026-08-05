const { pool } = require('../config/db');

async function getAppointments(req, res, next) {
  try {
    const { page = 1, limit = 20, status, owner, date } = req.query;
    const offset = (page - 1) * limit;
    const filters = [];
    const values = [];
    if (status) { values.push(status); filters.push(`status = $${values.length}`); }
    if (owner) { values.push(`%${owner}%`); filters.push(`owner_name ILIKE $${values.length}`); }
    if (date) { values.push(date); filters.push(`appointment_date = $${values.length}`); }
    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT * FROM appointments ${whereClause} ORDER BY appointment_date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    );
    const countResult = await pool.query(`SELECT COUNT(*) FROM appointments ${whereClause}`, values);
    res.json({ data: result.rows, total: Number(countResult.rows[0].count) });
  } catch (err) {
    next(err);
  }
}

async function getAppointmentById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Appointment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createAppointment(req, res, next) {
  try {
    const { animal_id, owner_id, appointment_date, service_type, assigned_to, status, priority, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO appointments (animal_id, owner_id, appointment_date, service_type, assigned_to, status, priority, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [animal_id, owner_id, appointment_date, service_type, assigned_to, status || 'scheduled', priority || 'normal', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateAppointment(req, res, next) {
  try {
    const { appointment_date, service_type, assigned_to, status, priority, notes } = req.body;
    const result = await pool.query(
      'UPDATE appointments SET appointment_date = $1, service_type = $2, assigned_to = $3, status = $4, priority = $5, notes = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [appointment_date, service_type, assigned_to, status, priority, notes, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Appointment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteAppointment(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    next(err);
  }
}

async function getTodayAppointments(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM appointments WHERE appointment_date = CURRENT_DATE ORDER BY appointment_time ASC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getTodayAppointments,
};
