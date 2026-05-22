const express = require('express');
const mediaController = require('../controllers/mediaController');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.get('/', mediaController.getAll);
router.post('/', validateBody(['url']), mediaController.create);

module.exports = router;
