const Post = require('../models/Post');

const getAll = (_req, res) => {
  const posts = Post.getAllPosts();
  res.json({ success: true, data: posts });
};

const getById = (req, res) => {
  const post = Post.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, error: { message: 'Post not found' } });
  }
  res.json({ success: true, data: post });
};

const create = (req, res) => {
  const post = Post.createPost(req.body);
  res.status(201).json({ success: true, data: post });
};

const update = (req, res) => {
  const updated = Post.updatePost(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: { message: 'Post not found' } });
  }
  res.json({ success: true, data: updated });
};

const remove = (req, res) => {
  const deleted = Post.deletePost(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: { message: 'Post not found' } });
  }
  res.json({ success: true, data: { message: 'Post deleted' } });
};

module.exports = { getAll, getById, create, update, remove };
