const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { appointmentSchema } = require('../validators/appointmentValidators');
const { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getTodayAppointments } = require('../controllers/appointmentController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst', 'Field Staff']), getAppointments);
router.get('/today', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getTodayAppointments);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst', 'Field Staff']), getAppointmentById);
router.post('/', authorize(['Receptionist', 'Hospital Manager', 'Operations Admin']), validate(appointmentSchema), createAppointment);
router.put('/:id', authorize(['Receptionist', 'Veterinarian', 'Technician', 'Hospital Manager']), validate(appointmentSchema), updateAppointment);
router.delete('/:id', authorize(['Operations Admin', 'Hospital Manager']), deleteAppointment);

module.exports = router;
