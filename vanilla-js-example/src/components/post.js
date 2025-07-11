import { formatDate } from '../utils/date.js';
import { isLiked } from '../utils/storage.js';

export function renderPost(post, currentUser) {
  // サーバーからisLikedが提供されている場合はそれを使用、なければlocalStorageを使用
  const liked = post.isLiked !== undefined ? Boolean(post.isLiked) : isLiked(post.id, currentUser);

  return `
    <div class="post" data-post-id="${post.id}">
      <div class="post-header">
        <span class="post-author">${post.author}</span>
        <span class="post-date">${formatDate(post.created_at)}</span>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="post-actions">
        <button class="like-btn ${liked ? 'liked' : ''}" data-post-id="${post.id}">
          <span class="like-icon">${liked ? '❤️' : '🤍'}</span>
          <span class="like-count">${post.like_count || 0}</span>
        </button>
        <button class="comment-btn" data-post-id="${post.id}">
          💬 ${post.comment_count || 0}
        </button>
        ${
          post.author === currentUser
            ? `<button class="delete-btn" data-post-id="${post.id}">🗑️ 削除</button>`
            : ''
        }
      </div>
    </div>
  `;
}
