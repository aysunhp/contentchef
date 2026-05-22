const { v4: uuidv4 } = require('uuid');
const config = require('../config');

/**
 * AI Service — mock plan adapts to the user prompt.
 * Set a real OPENAI_API_KEY in .env to enable live generation (fetch block below).
 */

const SYSTEM_PROMPT = `You are an expert social media strategist and content producer. Generate a structured JSON response array for a content calendar plan. Each item inside the array must contain: { id, date, topic, category, formatType ('video' or 'image'), visualInstructions, scriptOrCaption: { hook, body, hashtags: [] } }. Keep the tone customized to the target audience defined by the user.`;

const NICHE_PRESETS = {
  english: {
    label: 'English & language learning',
    categories: ['Grammar Tips', 'Vocabulary', 'Speaking Practice', 'Education', 'Motivation'],
    topicTemplates: [
      'Common mistakes learners make',
      'Vocabulary boost for everyday conversations',
      'Speaking drill you can practice today',
      'Quick grammar rule explained simply',
      'Motivation for your learning journey',
      'Pronunciation tip that changes everything',
      'Study habit that actually works',
    ],
    hashtagBase: ['LearnEnglish', 'LanguageLearning', 'StudyTips'],
  },
  fitness: {
    label: 'Fitness & wellness',
    categories: ['Workouts', 'Nutrition', 'Mindset', 'Recovery', 'Tips'],
    topicTemplates: [
      'Full-body workout for busy schedules',
      'Meal prep ideas for the week',
      'Why rest days matter',
      'Form check on a common exercise',
      'Small habit that compounds results',
      'Stretch routine after training',
      'Myth vs fact in fitness',
    ],
    hashtagBase: ['Fitness', 'Workout', 'HealthyLifestyle'],
  },
  food: {
    label: 'Food & cooking',
    categories: ['Recipes', 'Quick Meals', 'Baking', 'Tips', 'Behind the Scenes'],
    topicTemplates: [
      '15-minute dinner anyone can make',
      'Ingredient swap that upgrades flavor',
      'Kitchen mistake to avoid',
      'Seasonal recipe worth trying',
      'Plating trick for better photos',
      'Budget-friendly meal prep',
      'Fan-favorite recipe remake',
    ],
    hashtagBase: ['Foodie', 'Recipe', 'HomeCooking'],
  },
  tech: {
    label: 'Tech & productivity',
    categories: ['Tutorials', 'Tools', 'Productivity', 'News', 'Tips'],
    topicTemplates: [
      'Tool that saves hours every week',
      'Beginner-friendly explainer',
      'Workflow I use daily',
      'Common setup mistake',
      'Feature most people overlook',
      'Quick comparison you asked for',
      'Trend worth paying attention to',
    ],
    hashtagBase: ['Tech', 'Productivity', 'CreatorTools'],
  },
  business: {
    label: 'Business & marketing',
    categories: ['Strategy', 'Growth', 'Content', 'Sales', 'Mindset'],
    topicTemplates: [
      'Content idea that drives engagement',
      'Mistake new founders make',
      'Simple funnel that converts',
      'How to repurpose one post into five',
      'Metric you should track this week',
      'Storytelling hook that works',
      'Offer framing that feels authentic',
    ],
    hashtagBase: ['Entrepreneur', 'Marketing', 'SmallBusiness'],
  },
};

const DEFAULT_PRESET = {
  label: 'Content creation',
  categories: ['Tips', 'Ideas', 'Behind the Scenes', 'Education', 'Engagement', 'Story', 'Trending'],
  topicTemplates: [
    'Tip your audience will save',
    'Story that builds trust',
    'Myth worth debunking',
    'Quick win for this week',
    'Question to spark comments',
    'Process you do not show enough',
    'Trend adapted to your niche',
  ],
  hashtagBase: ['ContentCreator', 'SocialMediaTips', 'ContentChef'],
};

const NICHE_KEYWORDS = [
  { key: 'english', words: ['english', 'esl', 'grammar', 'vocabulary', 'language teacher', 'learn english'] },
  { key: 'fitness', words: ['fitness', 'gym', 'workout', 'yoga', 'wellness', 'trainer'] },
  { key: 'food', words: ['food', 'recipe', 'cooking', 'chef', 'baking', 'restaurant', 'meal'] },
  { key: 'tech', words: ['tech', 'software', 'developer', 'coding', 'app', 'saas', 'ai tool'] },
  { key: 'business', words: ['business', 'marketing', 'entrepreneur', 'startup', 'brand', 'sales'] },
];

const detectNiche = (prompt) => {
  const lower = prompt.toLowerCase();
  for (const { key, words } of NICHE_KEYWORDS) {
    if (words.some((w) => lower.includes(w))) return NICHE_PRESETS[key];
  }
  return DEFAULT_PRESET;
};

/** Pull short subject phrases from the prompt for personalized copy */
const extractSubjects = (prompt) => {
  const cleaned = prompt
    .replace(/generate|create|plan|week|content|posts|for|my|a|an|the|i am|i'm/gi, ' ')
    .replace(/[^\w\s]/g, ' ')
    .trim();

  const words = cleaned.split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return ['your audience'];

  const phrase = words.slice(0, 4).join(' ');
  return [phrase, ...words.slice(0, 3)];
};

const buildHashtags = (preset, subjects) => {
  const tags = new Set(['#ContentChef']);
  preset.hashtagBase.forEach((t) => tags.add(`#${t.replace(/\s/g, '')}`));
  subjects.slice(0, 2).forEach((s) => {
    const tag = s.replace(/\s+/g, '');
    if (tag.length > 2) tags.add(`#${tag.charAt(0).toUpperCase()}${tag.slice(1)}`);
  });
  return [...tags].slice(0, 5);
};

const generatePlan = async (userPrompt) => {
  if (config.openai.apiKey && config.openai.apiKey !== 'sk-your-openai-api-key-here') {
    // Real OpenAI — wire when ready:
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${config.openai.apiKey}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     model: 'gpt-4o-mini',
    //     messages: [
    //       { role: 'system', content: SYSTEM_PROMPT },
    //       { role: 'user', content: userPrompt },
    //     ],
    //     response_format: { type: 'json_object' },
    //   }),
    // });
    // const json = await response.json();
    // return JSON.parse(json.choices[0].message.content).posts;
  }

  return generateMockPlan(userPrompt);
};

const generateMoodboard = async (topic) => {
  if (config.openai.apiKey && config.openai.apiKey !== 'sk-your-openai-api-key-here') {
    // Real DALL-E 3 — wire when ready
  }

  return generateMockMoodboard(topic);
};

const generateMockPlan = (userPrompt) => {
  const preset = detectNiche(userPrompt);
  const subjects = extractSubjects(userPrompt);
  const audience = subjects[0];
  const today = new Date();
  const formats = ['video', 'image'];

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i + 1);

    const category = preset.categories[i % preset.categories.length];
    const template = preset.topicTemplates[i % preset.topicTemplates.length];
    const formatType = formats[i % 2];
    const topic = `${template} — ${audience}`;

    return {
      id: uuidv4(),
      date: date.toISOString().split('T')[0],
      topic,
      category,
      formatType,
      status: 'draft',
      visualInstructions: `Clean ${formatType} for ${preset.label.toLowerCase()}: ${category.toLowerCase()}, soft pastel aesthetic.`,
      scriptOrCaption: {
        hook: `Here's something useful for ${audience} — Day ${i + 1}.`,
        body: `${template}. Tailored from your brief: "${userPrompt.slice(0, 120)}${userPrompt.length > 120 ? '…' : ''}"`,
        hashtags: buildHashtags(preset, subjects),
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
