const express = require('express');
const router = express.Router();
const { analyzeUser } = require('../controllers/analyzerController');

// GET /api/analyze/:username
router.get('/analyze/:username', analyzeUser);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
