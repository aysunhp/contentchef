const { v4: uuidv4 } = require('uuid');
const { getCollection } = require('../config/database');

const createMedia = (data) => {
  const media = getCollection('media');

  if (data.postId) {
    const index = media.findIndex((m) => m.postId === data.postId);
    if (index !== -1) {
      media[index] = {
        ...media[index],
        url: data.url,
        topic: data.topic || media[index].topic,
        updatedAt: new Date().toISOString(),
      };
      return media[index];
    }
  }

  const item = {
    id: uuidv4(),
    url: data.url,
    topic: data.topic || 'Untitled',
    postId: data.postId || null,
    createdAt: new Date().toISOString(),
  };
  media.unshift(item);
  return item;
};

const getAllMedia = () => getCollection('media');

const getMediaByPostId = (postId) => {
  const media = getCollection('media');
  return media.find((m) => m.postId === postId) || null;
};

const deleteMediaByPostId = (postId) => {
  const media = getCollection('media');
  const index = media.findIndex((m) => m.postId === postId);
  if (index === -1) return false;
  media.splice(index, 1);
  return true;
};

module.exports = { createMedia, getAllMedia, getMediaByPostId, deleteMediaByPostId };
