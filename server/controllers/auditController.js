const { pool } = require('../config/db');

async function getAuditLogs(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT al.*, u.name AS user_name FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAuditLogs,
};
