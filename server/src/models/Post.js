const { v4: uuidv4 } = require('uuid');
const { getCollection } = require('../config/database');

const VALID_STATUSES = ['draft', 'review', 'published'];
const VALID_FORMATS = ['video', 'image'];
const ALLOWED_UPDATE_FIELDS = [
  'date',
  'topic',
  'category',
  'formatType',
  'status',
  'visualInstructions',
  'mediaUrl',
  'scriptOrCaption',
];

const sanitizeScript = (script) => ({
  hook: script?.hook || '',
  body: script?.body || '',
  hashtags: Array.isArray(script?.hashtags) ? script.hashtags : [],
});

const validateDate = (dateStr) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr + 'T00:00:00Z');
  return date instanceof Date && !isNaN(date);
};

const createPost = (data) => {
  const posts = getCollection('posts');

  // Validate required fields
  if (!data.date || !validateDate(data.date)) {
    throw new Error('Invalid or missing date. Must be YYYY-MM-DD format.');
  }
  if (!data.topic || typeof data.topic !== 'string' || !data.topic.trim()) {
    throw new Error('Topic is required and must be a non-empty string.');
  }

  const post = {
    id: uuidv4(),
    date: data.date,
    topic: data.topic.trim(),
    category: data.category || 'general',
    formatType: VALID_FORMATS.includes(data.formatType) ? data.formatType : 'image',
    status: VALID_STATUSES.includes(data.status) ? data.status : 'draft',
    visualInstructions: data.visualInstructions || '',
    mediaUrl: data.mediaUrl || null,
    scriptOrCaption: sanitizeScript(data.scriptOrCaption),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  posts.push(post);
  return post;
};

const getAllPosts = () => getCollection('posts');

const getPostById = (id) => {
  const posts = getCollection('posts');
  return posts.find((p) => p.id === id) || null;
};

const updatePost = (id, updates) => {
  const posts = getCollection('posts');
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = posts[index];
  const sanitized = {};

  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (updates[key] === undefined) continue;
    if (key === 'status' && !VALID_STATUSES.includes(updates.status)) continue;
    if (key === 'formatType' && !VALID_FORMATS.includes(updates.formatType)) continue;
    if (key === 'date' && !validateDate(updates.date)) continue;
    if (key === 'scriptOrCaption') {
      sanitized.scriptOrCaption = sanitizeScript(updates.scriptOrCaption);
      continue;
    }
    sanitized[key] = updates[key];
  }

  const updated = {
    ...current,
    ...sanitized,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updated;
  return updated;
};

const deletePost = (id) => {
  const posts = getCollection('posts');
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
};

const getPostsByDateRange = (startDate, endDate) => {
  const posts = getCollection('posts');
  return posts.filter((p) => p.date >= startDate && p.date <= endDate);
};

const getPostsByStatus = (status) => {
  if (!VALID_STATUSES.includes(status)) return [];
  const posts = getCollection('posts');
  return posts.filter((p) => p.status === status);
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByDateRange,
  getPostsByStatus,
  VALID_STATUSES,
  VALID_FORMATS,
};
