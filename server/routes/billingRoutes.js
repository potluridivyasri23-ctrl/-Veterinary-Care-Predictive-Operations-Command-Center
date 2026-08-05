const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getBills, getBillById, createBill, updateBill, deleteBill } = require('../controllers/billingController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getBills);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getBillById);
router.post('/', authorize(['Receptionist', 'Hospital Manager', 'Operations Admin']), createBill);
router.put('/:id', authorize(['Receptionist', 'Hospital Manager', 'Operations Admin']), updateBill);
router.delete('/:id', authorize(['Operations Admin', 'Hospital Manager']), deleteBill);

module.exports = router;
