const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getOwners, getOwnerById, createOwner, updateOwner, deleteOwner } = require('../controllers/ownerController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst', 'Field Staff']), getOwners);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst', 'Field Staff']), getOwnerById);
router.post('/', authorize(['Receptionist', 'Hospital Manager', 'Operations Admin']), createOwner);
router.put('/:id', authorize(['Receptionist', 'Hospital Manager', 'Operations Admin']), updateOwner);
router.delete('/:id', authorize(['Operations Admin', 'Hospital Manager']), deleteOwner);

module.exports = router;
