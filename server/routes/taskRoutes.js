const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getTasks, createTask, updateTask, assignTask } = require('../controllers/taskController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst', 'Field Staff']), getTasks);
router.post('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist']), createTask);
router.put('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Veterinarian', 'Technician']), updateTask);
router.put('/:id/assign', authorize(['Operations Admin', 'Hospital Manager']), assignTask);

module.exports = router;
