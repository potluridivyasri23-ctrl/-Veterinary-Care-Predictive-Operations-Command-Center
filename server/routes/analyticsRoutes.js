const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getDashboardAnalytics, getForecasts, getRiskScores, getTrendData, getCapacityPlans, runScheduledJobs, runScenario } = require('../controllers/analyticsController');
const router = express.Router();

router.get('/dashboard', getDashboardAnalytics);
router.get('/forecasts', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getForecasts);
router.get('/risks', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getRiskScores);
router.get('/trends', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getTrendData);
router.get('/capacity-plans', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getCapacityPlans);
router.post('/run-jobs', authorize(['Operations Admin', 'Hospital Manager']), runScheduledJobs);
router.post('/scenario', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), runScenario);

module.exports = router;
