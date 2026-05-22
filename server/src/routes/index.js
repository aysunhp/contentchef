const express = require('express');
const postRoutes = require('./postRoutes');
const aiRoutes = require('./aiRoutes');
const mediaRoutes = require('./mediaRoutes');

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/media', mediaRoutes);
router.use('/', aiRoutes);

// Health check route
router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

module.exports = router;
