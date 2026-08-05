const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal } = require('../controllers/animalController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst', 'Field Staff']), getAnimals);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst', 'Field Staff']), getAnimalById);
router.post('/', authorize(['Receptionist', 'Veterinarian', 'Technician']), createAnimal);
router.put('/:id', authorize(['Receptionist', 'Veterinarian', 'Technician']), updateAnimal);
router.delete('/:id', authorize(['Operations Admin']), deleteAnimal);

module.exports = router;
