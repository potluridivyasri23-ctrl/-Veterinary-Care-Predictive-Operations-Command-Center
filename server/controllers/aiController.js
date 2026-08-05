const axios = require('axios');
const { pool } = require('../config/db');

async function callGemini(prompt) {
  const response = await axios.post(
    'https://gemini.googleapis.com/v1/complete',
    { prompt, maxOutputTokens: 600 },
    { headers: { Authorization: `Bearer ${process.env.GOOGLE_GEMINI_API_KEY}` } }
  );
  return response.data;
}

async function generateAiInsights(req, res, next) {
  try {
    const { subject, context } = req.body;
    const prompt = `Provide concise operation risk analysis, demand forecast, and preventive actions for a veterinary hospital based on the following context:\n${context}`;
    const aiResponse = await callGemini(prompt);
    const result = await pool.query(
      'INSERT INTO ai_recommendations (type, subject, prompt, response, confidence, model_version, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      ['insight', subject, prompt, JSON.stringify(aiResponse), 0.88, aiResponse.model || 'gemini', req.user.id]
    );
    res.status(201).json({ ...result.rows[0], aiResponse });
  } catch (err) {
    next(err);
  }
}

async function getAiRecommendations(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM ai_recommendations ORDER BY created_at DESC LIMIT 20');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function updateAiRecommendationStatus(req, res, next) {
  try {
    const { status, review_comment } = req.body;
    const allowed = ['approved', 'rejected', 'pending'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE ai_recommendations SET status = $1, review_comment = $2, reviewed_by = $3, reviewed_at = NOW() WHERE id = $4 RETURNING *',
      [status, review_comment || null, req.user.id, req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generateAiInsights,
  getAiRecommendations,
  updateAiRecommendationStatus,
};
