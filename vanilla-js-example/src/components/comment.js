import { formatDate } from '../utils/date.js';

export function renderComment(comment) {
  return `
    <div class="comment">
      <div class="comment-header">
        <span class="comment-author">${comment.author}</span>
        <span class="comment-date">${formatDate(comment.created_at)}</span>
      </div>
      <div class="comment-content">${comment.content}</div>
    </div>
  `;
}
