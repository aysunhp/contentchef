const { v4: uuidv4 } = require('uuid');
const { getCollection } = require('../config/database');

/**
 * Post model — operates on in-memory store.
 * Swap getCollection('posts') with a real DB query layer
 * when migrating to production.
 */

const VALID_STATUSES = ['draft', 'review', 'published'];
const VALID_FORMATS = ['video', 'image'];

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
    scriptOrCaption: {
      hook: data.scriptOrCaption?.hook || '',
      body: data.scriptOrCaption?.body || '',
      hashtags: Array.isArray(data.scriptOrCaption?.hashtags)
        ? data.scriptOrCaption.hashtags
        : [],
    },
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
  const updated = {
    ...current,
    ...updates,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  if (updates.status && !VALID_STATUSES.includes(updates.status)) {
    updated.status = current.status;
  }

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
