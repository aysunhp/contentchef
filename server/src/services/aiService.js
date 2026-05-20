const { v4: uuidv4 } = require('uuid');
const config = require('../config');

/**
 * AI Service — currently returns mock data.
 * Replace the mock implementations with real OpenAI API calls
 * by uncommenting the fetch logic and supplying a valid API key.
 */

const SYSTEM_PROMPT = `You are an expert social media strategist and content producer. Generate a structured JSON response array for a content calendar plan. Each item inside the array must contain: { id, date, topic, category, formatType ('video' or 'image'), visualInstructions, scriptOrCaption: { hook, body, hashtags: [] } }. Keep the tone customized to the target audience defined by the user.`;

const generatePlan = async (userPrompt) => {
  if (config.openai.apiKey && config.openai.apiKey !== 'sk-your-openai-api-key-here') {
    // Real OpenAI call — uncomment when ready
    // const response = await fetch('https://api.openai.com/v1/chat/completions', { ... });
    // return response;
  }

  return generateMockPlan(userPrompt);
};

const generateMoodboard = async (topic) => {
  if (config.openai.apiKey && config.openai.apiKey !== 'sk-your-openai-api-key-here') {
    // Real DALL-E 3 call — uncomment when ready
    // const response = await fetch('https://api.openai.com/v1/images/generations', { ... });
    // return response;
  }

  return generateMockMoodboard(topic);
};

/* ── Mock Generators ──────────────────────────────────── */

const generateMockPlan = (userPrompt) => {
  const today = new Date();
  const categories = ['Education', 'Motivation', 'Grammar Tips', 'Vocabulary', 'Speaking Practice'];
  const formats = ['video', 'image'];

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i + 1);

    return {
      id: uuidv4(),
      date: date.toISOString().split('T')[0],
      topic: `Day ${i + 1}: ${categories[i % categories.length]} Post`,
      category: categories[i % categories.length],
      formatType: formats[i % 2],
      status: 'draft',
      visualInstructions: `Clean, minimalist ${formats[i % 2]} with pastel tones related to ${categories[i % categories.length].toLowerCase()}.`,
      scriptOrCaption: {
        hook: `Did you know this about ${categories[i % categories.length].toLowerCase()}?`,
        body: `Here is a quick tip for your ${categories[i % categories.length].toLowerCase()} journey. Generated from prompt: "${userPrompt}"`,
        hashtags: ['#ContentChef', '#EnglishTeacher', `#${categories[i % categories.length].replace(/\s/g, '')}`],
      },
    };
  });
};

const generateMockMoodboard = (topic) => ({
  id: uuidv4(),
  topic,
  imageUrl: `https://placehold.co/600x400/A7C7E7/333333?text=${encodeURIComponent(topic)}`,
  style: 'minimalist pastel',
  generatedAt: new Date().toISOString(),
});

module.exports = { generatePlan, generateMoodboard, SYSTEM_PROMPT };
