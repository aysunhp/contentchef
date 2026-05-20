const express = require('express');
const aiController = require('../controllers/aiController');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.post('/generate-plan', validateBody(['prompt']), aiController.generatePlan);
router.post('/generate-moodboard', validateBody(['topic']), aiController.generateMoodboard);

module.exports = router;
