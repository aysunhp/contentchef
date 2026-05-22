const express = require('express');
const postController = require('../controllers/postController');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.get('/', postController.getAll);
router.get('/filter/by-status', postController.getByStatus);
router.get('/filter/by-date-range', postController.getByDateRange);
router.get('/:id', postController.getById);
router.post('/', validateBody(['topic', 'date']), postController.create);
router.put('/:id', postController.update);
router.delete('/:id', postController.remove);

module.exports = router;
