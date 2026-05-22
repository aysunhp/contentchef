const trendsService = require('../services/trendsService');

const findTrends = async (req, res, next) => {
  try {
    const { niche, platform } = req.body;
    const result = await trendsService.findTrends({ niche, platform });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const generateIdeas = async (req, res, next) => {
  try {
    const { trends, niche, platform } = req.body;
    const result = await trendsService.generateIdeas({ trends, niche, platform });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { findTrends, generateIdeas };
