const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getFollowUps, getFollowUpById, createFollowUp, updateFollowUp, deleteFollowUp } = require('../controllers/followupController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getFollowUps);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst']), getFollowUpById);
router.post('/', authorize(['Receptionist', 'Veterinarian', 'Technician']), createFollowUp);
router.put('/:id', authorize(['Receptionist', 'Veterinarian', 'Technician']), updateFollowUp);
router.delete('/:id', authorize(['Operations Admin', 'Hospital Manager']), deleteFollowUp);

module.exports = router;
