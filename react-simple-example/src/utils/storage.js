export function getFromStorage(key) {
  return localStorage.getItem(key);
}

export function setToStorage(key, value) {
  localStorage.setItem(key, value);
}

export function removeFromStorage(key) {
  localStorage.removeItem(key);
}

export function isLiked(postId, userId) {
  return getFromStorage(`liked_${postId}_${userId}`) === 'true';
}

export function setLiked(postId, userId) {
  setToStorage(`liked_${postId}_${userId}`, 'true');
}

export function removeLiked(postId, userId) {
  removeFromStorage(`liked_${postId}_${userId}`);
}
