const { pool } = require('../config/db');

async function getPayments(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM payments ORDER BY payment_date DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getPaymentById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM payments WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Payment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createPayment(req, res, next) {
  try {
    const { bill_id, amount, payment_method } = req.body;
    const result = await pool.query(
      'INSERT INTO payments (bill_id, amount, payment_method, recorded_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [bill_id, amount, payment_method, req.user.id]
    );
    await pool.query('UPDATE bills SET paid_amount = paid_amount + $1, status = CASE WHEN paid_amount + $1 >= total_amount THEN $2 ELSE $3 END WHERE id = $4', [amount, 'paid', 'partial', bill_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
};
