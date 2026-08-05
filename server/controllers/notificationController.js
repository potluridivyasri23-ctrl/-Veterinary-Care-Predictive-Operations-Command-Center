const { pool } = require('../config/db');

async function getNotifications(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const result = await pool.query('UPDATE notifications SET read = true WHERE id = $1 AND recipient_id = $2 RETURNING *', [req.params.id, req.user.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Notification not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function clearNotifications(req, res, next) {
  try {
    await pool.query('DELETE FROM notifications WHERE recipient_id = $1', [req.user.id]);
    res.json({ message: 'Notifications cleared' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  clearNotifications,
};
