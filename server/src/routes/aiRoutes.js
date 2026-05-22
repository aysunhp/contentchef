const express = require('express');
const aiController = require('../controllers/aiController');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.post('/generate-plan', validateBody(['prompt']), aiController.generatePlan);
router.post('/generate-moodboard', validateBody(['topic']), aiController.generateMoodboard);
router.post(
  '/generate-virality',
  validateBody(['hook', 'body', 'hashtags', 'platform', 'category']),
  aiController.generateViralityScore,
);

module.exports = router;
