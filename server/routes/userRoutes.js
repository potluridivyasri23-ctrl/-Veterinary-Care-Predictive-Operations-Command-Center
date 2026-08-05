const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getUsers, getUserById, updateUser, createUser, deactivateUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getUsers);
router.get('/:id', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getUserById);
router.post('/', authorize(['Operations Admin']), createUser);
router.put('/:id', authorize(['Operations Admin']), updateUser);
router.put('/:id/deactivate', authorize(['Operations Admin']), deactivateUser);

module.exports = router;
