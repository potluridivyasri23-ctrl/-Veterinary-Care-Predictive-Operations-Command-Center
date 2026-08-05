const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getVaccinations, getVaccinationById, createVaccination, updateVaccination, deleteVaccination } = require('../controllers/vaccinationController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getVaccinations);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getVaccinationById);
router.post('/', authorize(['Veterinarian', 'Technician']), createVaccination);
router.put('/:id', authorize(['Veterinarian', 'Technician']), updateVaccination);
router.delete('/:id', authorize(['Operations Admin', 'Hospital Manager']), deleteVaccination);

module.exports = router;
