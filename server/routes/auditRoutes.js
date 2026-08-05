const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getAuditLogs } = require('../controllers/auditController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getAuditLogs);

module.exports = router;
