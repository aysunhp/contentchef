const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, config);
  } catch {
    throw new Error('Unable to reach the server. Is the backend running?');
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
  }

  if (!response.ok) {
    throw new Error(data.error?.message || 'Something went wrong');
  }

  return data;
}

export const postService = {
  getAll: () => request('/posts'),
  getById: (id) => request(`/posts/${id}`),
  create: (body) => request('/posts', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
};

export const aiService = {
  generatePlan: (prompt) =>
    request('/generate-plan', { method: 'POST', body: JSON.stringify({ prompt }) }),
  generateMoodboard: (topic) =>
    request('/generate-moodboard', { method: 'POST', body: JSON.stringify({ topic }) }),
  generateViralityScore: (payload) =>
    request('/generate-virality', { method: 'POST', body: JSON.stringify(payload) }),
};

export const mediaService = {
  getAll: () => request('/media'),
  create: (body) =>
    request('/media', { method: 'POST', body: JSON.stringify(body) }),
};

export const trendsService = {
  find: (payload) =>
    request('/trends/find', { method: 'POST', body: JSON.stringify(payload) }),
  generate: (payload) =>
    request('/trends/generate', { method: 'POST', body: JSON.stringify(payload) }),
};
