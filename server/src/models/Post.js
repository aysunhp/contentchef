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

const createPost = (data) => {
  const posts = getCollection('posts');

  const post = {
    id: uuidv4(),
    date: data.date,
    topic: data.topic,
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

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  VALID_STATUSES,
  VALID_FORMATS,
};
