import { apiGet, apiPost, apiDelete } from '../utils/api.js';

export async function getPosts(page = 1, limit = 10, userId = null) {
  const userParam = userId ? `&userId=${encodeURIComponent(userId)}` : '';
  return apiGet(`/posts?page=${page}&limit=${limit}${userParam}`);
}

export async function getPost(postId) {
  return apiGet(`/posts/${postId}`);
}

export async function createPost(author, content) {
  return apiPost('/posts', { author, content });
}

export async function deletePost(postId) {
  return apiDelete(`/posts/${postId}`);
}

export async function addLike(postId, userId) {
  return apiPost(`/posts/${postId}/likes`, { userId });
}

export async function removeLike(postId, userId) {
  return apiDelete(`/posts/${postId}/likes`, { userId });
}

export async function getLikeStatus(postId, userId) {
  return apiGet(`/posts/${postId}/likes/${encodeURIComponent(userId)}`);
}

export async function addComment(postId, author, content) {
  return apiPost(`/posts/${postId}/comments`, { author, content });
}
