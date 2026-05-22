// controllers/ airController file
const aiService = require('../services/aiService');
const Post = require('../models/Post');

const generatePlan = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    console.log('[AI Controller] Received prompt:', prompt);
    const plan = await aiService.generatePlan(prompt);
    console.log('[AI Controller] Generated plan:', plan);

    // Persist generated items as draft posts
    const savedPosts = plan.map((item) => Post.createPost(item));
    console.log('[AI Controller] Saved posts:', savedPosts);

    res.json({ success: true, data: savedPosts });
  } catch (error) {
    console.error('[AI Controller] Error:', error);
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
