const { pool } = require('../config/db');

async function getAnimals(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM animals ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getAnimalById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM animals WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Animal not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createAnimal(req, res, next) {
  try {
    const { name, species, breed, age, sex, owner_id, medical_history, status } = req.body;
    const result = await pool.query(
      'INSERT INTO animals (name, species, breed, age, sex, owner_id, medical_history, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, species, breed, age, sex, owner_id, medical_history, status || 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateAnimal(req, res, next) {
  try {
    const { name, species, breed, age, sex, owner_id, medical_history, status } = req.body;
    const result = await pool.query(
      'UPDATE animals SET name = $1, species = $2, breed = $3, age = $4, sex = $5, owner_id = $6, medical_history = $7, status = $8, updated_at = NOW() WHERE id = $9 RETURNING *',
      [name, species, breed, age, sex, owner_id, medical_history, status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Animal not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteAnimal(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM animals WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Animal not found' });
    res.json({ message: 'Animal deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
};
