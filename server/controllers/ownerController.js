const { pool } = require('../config/db');

async function getOwners(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM owners ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getOwnerById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM owners WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Owner not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createOwner(req, res, next) {
  try {
    const { name, phone, email, address, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO owners (name, phone, email, address, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, phone, email, address, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateOwner(req, res, next) {
  try {
    const { name, phone, email, address, notes } = req.body;
    const result = await pool.query(
      'UPDATE owners SET name = $1, phone = $2, email = $3, address = $4, notes = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [name, phone, email, address, notes, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Owner not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteOwner(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM owners WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Owner not found' });
    res.json({ message: 'Owner deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOwners,
  getOwnerById,
  createOwner,
  updateOwner,
  deleteOwner,
};
