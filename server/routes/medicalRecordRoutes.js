const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getMedicalRecords, getMedicalRecordById, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord } = require('../controllers/medicalRecordController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getMedicalRecords);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getMedicalRecordById);
router.post('/', authorize(['Veterinarian', 'Technician', 'Hospital Manager']), createMedicalRecord);
router.put('/:id', authorize(['Veterinarian', 'Technician', 'Hospital Manager']), updateMedicalRecord);
router.delete('/:id', authorize(['Operations Admin', 'Hospital Manager']), deleteMedicalRecord);

module.exports = router;
