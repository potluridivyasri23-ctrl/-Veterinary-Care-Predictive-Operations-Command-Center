const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getAiRecommendations, generateAiInsights, updateAiRecommendationStatus } = require('../controllers/aiController');
const router = express.Router();

router.get('/recommendations', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), getAiRecommendations);
router.post('/insights', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), generateAiInsights);
router.patch('/recommendations/:id', authorize(['Operations Admin', 'Hospital Manager', 'Analyst']), updateAiRecommendationStatus);

module.exports = router;
