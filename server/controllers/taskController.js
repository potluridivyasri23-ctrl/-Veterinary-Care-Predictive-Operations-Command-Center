const { pool } = require('../config/db');

async function getTasks(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY due_date ASC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, assigned_to, status, priority, due_date, category } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, assigned_to, status, priority, due_date, category, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, assigned_to, status || 'open', priority || 'normal', due_date, category, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { title, description, status, priority, due_date, category, notes } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, category = $6, notes = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [title, description, status, priority, due_date, category, notes, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function assignTask(req, res, next) {
  try {
    const { assigned_to, status } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET assigned_to = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [assigned_to, status || 'assigned', req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  assignTask,
};
