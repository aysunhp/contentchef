const { v4: uuidv4 } = require('uuid');
const { getCollection } = require('../config/database');

const createUser = (data) => {
  const users = getCollection('users');

  // Check if email already exists
  const existingUser = users.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const user = {
    id: uuidv4(),
    email: data.email,
    password: data.password, // Will be hashed in controller
    name: data.name || '',
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return user;
};

const getUserByEmail = (email) => {
  const users = getCollection('users');
  return users.find(u => u.email === email) || null;
};

const getUserById = (id) => {
  const users = getCollection('users');
  return users.find(u => u.id === id) || null;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
