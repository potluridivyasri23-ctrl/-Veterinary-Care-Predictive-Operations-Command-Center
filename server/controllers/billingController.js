const { pool } = require('../config/db');

async function getBills(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM bills ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getBillById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM bills WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Bill not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createBill(req, res, next) {
  try {
    const { appointment_id, total_amount, paid_amount, due_date, status } = req.body;
    const result = await pool.query(
      'INSERT INTO bills (appointment_id, total_amount, paid_amount, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [appointment_id, total_amount || 0, paid_amount || 0, due_date, status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateBill(req, res, next) {
  try {
    const { total_amount, paid_amount, due_date, status } = req.body;
    const result = await pool.query(
      'UPDATE bills SET total_amount = $1, paid_amount = $2, due_date = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [total_amount, paid_amount, due_date, status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Bill not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteBill(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM bills WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Bill not found' });
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
};
