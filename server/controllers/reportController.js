const { pool } = require('../config/db');

async function getReports(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function generateReport(req, res, next) {
  try {
    const { type, filters, name } = req.body;
    const result = await pool.query(
      'INSERT INTO reports (type, name, filters, created_by, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [type, name, filters || {}, req.user.id, 'completed']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function exportReport(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = result.rows[0];
    const fields = ['id', 'name', 'type', 'status', 'created_at', 'filters'];
    const csvRows = [fields.join(',')];
    const values = fields.map((field) => {
      const value = report[field] ?? '';
      return `"${typeof value === 'object' ? JSON.stringify(value) : String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
    const csv = csvRows.join('\n');

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="${report.name.replace(/\s+/g, '_') || 'report'}.csv"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReports,
  generateReport,
  exportReport,
};
