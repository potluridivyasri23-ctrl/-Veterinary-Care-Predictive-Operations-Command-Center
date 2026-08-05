const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getReports, generateReport, exportReport } = require('../controllers/reportController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getReports);
router.post('/generate', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), generateReport);
router.get('/:id/export', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), exportReport);

module.exports = router;
