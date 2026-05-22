const Post = require('../models/Post');

const getAll = (_req, res, next) => {
  try {
    const posts = Post.getAllPosts();
    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

const getById = (req, res, next) => {
  try {
    const post = Post.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: { message: 'Post not found' } });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

const getByStatus = (req, res, next) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({ success: false, error: { message: 'Status query parameter required' } });
    }
    const posts = Post.getPostsByStatus(status);
    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

const getByDateRange = (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: { message: 'startDate and endDate query parameters required' } });
    }
    const posts = Post.getPostsByDateRange(startDate, endDate);
    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  try {
    const post = Post.createPost(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

const update = (req, res, next) => {
  try {
    const updated = Post.updatePost(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: { message: 'Post not found' } });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const remove = (req, res, next) => {
  try {
    const deleted = Post.deletePost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: { message: 'Post not found' } });
    }
    res.json({ success: true, data: { message: 'Post deleted' } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, getByStatus, getByDateRange, create, update, remove };
