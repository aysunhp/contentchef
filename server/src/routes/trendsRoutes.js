const express = require('express');
const trendsController = require('../controllers/trendsController');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.post('/find', validateBody(['niche', 'platform']), trendsController.findTrends);
router.post(
  '/generate',
  validateBody(['trends', 'niche', 'platform']),
  trendsController.generateIdeas,
);

module.exports = router;
