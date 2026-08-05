const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getTreatments, getTreatmentById, createTreatment, updateTreatment, deleteTreatment } = require('../controllers/treatmentController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getTreatments);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getTreatmentById);
router.post('/', authorize(['Veterinarian', 'Technician']), createTreatment);
router.put('/:id', authorize(['Veterinarian', 'Technician']), updateTreatment);
router.delete('/:id', authorize(['Operations Admin', 'Hospital Manager']), deleteTreatment);

module.exports = router;
