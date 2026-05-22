const aiService = require('../services/aiService');
const Post = require('../models/Post');

const generatePlan = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const plan = await aiService.generatePlan(prompt);
    const savedPosts = plan.map((item) => Post.createPost(item));
    res.json({ success: true, data: savedPosts });
  } catch (error) {
    next(error);
  }
};

const generateMoodboard = async (req, res, next) => {
  try {
    const { topic } = req.body;
    const moodboard = await aiService.generateMoodboard(topic);
    res.json({ success: true, data: moodboard });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePlan, generateMoodboard };
