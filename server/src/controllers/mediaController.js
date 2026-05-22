const Media = require('../models/Media');

const getAll = (_req, res) => {
  const items = Media.getAllMedia();
  res.json({ success: true, data: items });
};

const create = (req, res) => {
  if (!req.body.url) {
    return res.status(400).json({
      success: false,
      error: { message: 'url is required' },
    });
  }
  const item = Media.createMedia(req.body);
  res.status(201).json({ success: true, data: item });
};

module.exports = { getAll, create };
