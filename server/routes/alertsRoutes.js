const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getAlerts, createAlert, updateAlertStatus } = require('../controllers/alertsController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getAlerts);
router.post('/', authorize(['Operations Admin', 'Hospital Manager']), createAlert);
router.put('/:id/status', authorize(['Operations Admin', 'Hospital Manager']), updateAlertStatus);

module.exports = router;
