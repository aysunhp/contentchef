/**
 * In-memory data store.
 * Replace this module with a real database adapter (MongoDB, PostgreSQL, etc.)
 * when transitioning from mock data to production.
 */

const store = {
  posts: [],
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
