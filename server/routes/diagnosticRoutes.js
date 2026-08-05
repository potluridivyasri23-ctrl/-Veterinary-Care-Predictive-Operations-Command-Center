const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getDiagnostics, getDiagnosticById, createDiagnostic, updateDiagnostic, deleteDiagnostic } = require('../controllers/diagnosticsController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getDiagnostics);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getDiagnosticById);
router.post('/', authorize(['Veterinarian', 'Technician']), createDiagnostic);
router.put('/:id', authorize(['Veterinarian', 'Technician']), updateDiagnostic);
router.delete('/:id', authorize(['Operations Admin', 'Hospital Manager']), deleteDiagnostic);

module.exports = router;
