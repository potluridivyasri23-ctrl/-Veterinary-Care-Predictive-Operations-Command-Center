const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getNotifications, markAsRead, clearNotifications } = require('../controllers/notificationController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst', 'Field Staff']), getNotifications);
router.put('/:id/read', authorize(['Operations Admin', 'Hospital Manager', 'Receptionist', 'Veterinarian', 'Technician', 'Analyst', 'Field Staff']), markAsRead);
router.delete('/clear', authorize(['Operations Admin', 'Hospital Manager']), clearNotifications);

module.exports = router;
