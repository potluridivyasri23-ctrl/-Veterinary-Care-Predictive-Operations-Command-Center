const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getAnomalies, createAnomaly, updateAnomalyStatus } = require('../controllers/anomalyController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getAnomalies);
router.post('/', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), createAnomaly);
router.put('/:id/status', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), updateAnomalyStatus);

module.exports = router;
