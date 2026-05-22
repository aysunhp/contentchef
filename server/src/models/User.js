const { v4: uuidv4 } = require('uuid');
const { getCollection, saveStore } = require('../config/database');

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
  saveStore();
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

const updateUser = (id, data) => {
  const users = getCollection('users');
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  if (data.name !== undefined) users[index].name = data.name;
  if (data.bio !== undefined) users[index].bio = data.bio;

  saveStore();
  return users[index];
};

const updatePassword = (id, hashedPassword) => {
  const users = getCollection('users');
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  users[index].password = hashedPassword;
  saveStore();
  return true;
};

const deleteUser = (id) => {
  const users = getCollection('users');
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  saveStore();
  return true;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
};
