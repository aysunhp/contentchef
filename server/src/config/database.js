/**
 * In-memory data store.
 * Replace this module with a real database adapter (MongoDB, PostgreSQL, etc.)
 * when transitioning from mock data to production.
 */

const { v4: uuidv4 } = require('uuid');

const today = new Date();
const d = (offset) => {
  const dt = new Date(today);
  dt.setDate(today.getDate() + offset);
  return dt.toISOString().split('T')[0];
};

const SEED_POSTS = [
  {
    id: uuidv4(), date: d(0), topic: 'Common Grammar Mistakes', category: 'Grammar Tips',
    formatType: 'video', status: 'published',
    visualInstructions: 'Clean white background with red/green corrections shown side by side.',
    scriptOrCaption: {
      hook: 'Are you making these 3 common English mistakes? 🚨',
      body: 'Today we cover the most frequent errors English learners make and how to fix them instantly.',
      hashtags: ['#EnglishTeacher', '#GrammarTips', '#LearnEnglish'],
    },
  },
  {
    id: uuidv4(), date: d(1), topic: 'Vocabulary: Feelings & Emotions', category: 'Vocabulary',
    formatType: 'image', status: 'review',
    visualInstructions: 'Pastel emotion wheel with illustrated faces, soft pastel tones.',
    scriptOrCaption: {
      hook: 'Beyond "happy" and "sad" — expand your emotional vocabulary!',
      body: '10 advanced words to describe your feelings precisely. Save this for later!',
      hashtags: ['#Vocabulary', '#EnglishWords', '#ContentChef'],
    },
  },
  {
    id: uuidv4(), date: d(2), topic: 'Speaking Practice: Daily Routines', category: 'Speaking Practice',
    formatType: 'video', status: 'draft',
    visualInstructions: 'Cozy morning scene, warm lighting, minimal text overlay.',
    scriptOrCaption: {
      hook: 'Can you describe your morning in English? Let\'s practice together!',
      body: 'Repeat after me — 5 sentences about your daily routine using Present Simple.',
      hashtags: ['#SpeakingPractice', '#EnglishFluency', '#DailyEnglish'],
    },
  },
  {
    id: uuidv4(), date: d(4), topic: 'Motivation Monday: Your English Journey', category: 'Motivation',
    formatType: 'image', status: 'draft',
    visualInstructions: 'Minimal motivational quote card, lavender gradient background.',
    scriptOrCaption: {
      hook: 'Every expert was once a beginner. Keep going! 💜',
      body: 'Your English journey is unique. Celebrate small wins — they add up to big results.',
      hashtags: ['#MotivationMonday', '#EnglishLearning', '#YouGotThis'],
    },
  },
  {
    id: uuidv4(), date: d(6), topic: 'TikTok: Pronunciation Drill — TH Sound', category: 'Education',
    formatType: 'video', status: 'draft',
    visualInstructions: 'Close-up of mouth forming TH sound, with animated subtitle captions.',
    scriptOrCaption: {
      hook: 'The TH sound is the #1 hardest sound for non-native speakers. Here\'s how to nail it.',
      body: 'Repeat: "This", "That", "Think", "Three" — slow it down, feel the tongue placement.',
      hashtags: ['#Pronunciation', '#TikTokEnglish', '#LearnWithMe'],
    },
  },
];

const store = {
  posts: [...SEED_POSTS],
};

const getCollection = (name) => {
  if (!store[name]) {
    store[name] = [];
  }
  return store[name];
};

const resetCollection = (name) => {
  store[name] = [];
};

module.exports = { store, getCollection, resetCollection };
