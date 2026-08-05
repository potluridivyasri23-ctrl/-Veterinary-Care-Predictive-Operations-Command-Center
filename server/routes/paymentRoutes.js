const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getPayments, getPaymentById, createPayment } = require('../controllers/paymentController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getPayments);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getPaymentById);
router.post('/', authorize(['Receptionist', 'Hospital Manager', 'Operations Admin']), createPayment);

module.exports = router;
